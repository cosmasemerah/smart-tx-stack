import { createRequire } from "node:module";
import bs58 from "bs58";
import type {
  ClientDuplexStream,
  SubscribeRequest,
  SubscribeUpdate,
} from "@triton-one/yellowstone-grpc";
import { BoundedQueue, type QueueMetrics } from "./bounded-queue.js";

// yellowstone-grpc ships dual CJS/ESM with CJS-flavored declarations (no
// "type": "module"); under NodeNext the require build is the one whose
// runtime shape matches the types, so load it via createRequire.
const requireCjs = createRequire(import.meta.url);
const geyser = requireCjs(
  "@triton-one/yellowstone-grpc",
) as typeof import("@triton-one/yellowstone-grpc");
const Client = geyser.default;
const { CommitmentLevel } = geyser;
type GeyserClient = InstanceType<typeof Client>;

// SlotStatus values per geyser.proto — the enum is not re-exported from the
// package root. Shred/bank-level statuses (3–5) are unsubscribed and ignored.
const SLOT_STATUS = { processed: 0, confirmed: 1, finalized: 2, dead: 6 } as const;
import type {
  BlockMetaEvent,
  SlotCommitment,
  SlotEvent,
  StreamEvent,
  StreamHealth,
  TransactionEvent,
} from "./events.js";

export interface ConsumerOptions {
  endpoint: string;
  xToken?: string;
  /** Transactions mentioning any of these accounts (incl. failed, excl. votes). */
  watchAccounts?: string[];
  /**
   * When set, only transactions whose signature passes are enqueued. Lets us
   * subscribe to a busy account (e.g. a Jito tip account, which the provider
   * does deliver) and keep only our own bundle's tx — the firehose is filtered
   * at ingestion so the queue never fills with other people's transactions.
   */
  transactionFilter?: (signature: string) => boolean;
  queueCapacity?: number;
  pingIntervalMs?: number;
  /** Watchdog backoff cap for full resubscribes after client-level retries die. */
  maxReconnectDelayMs?: number;
  log?: (line: string) => void;
}

interface Handlers {
  onSlot?: (event: SlotEvent) => void | Promise<void>;
  onBlockMeta?: (event: BlockMetaEvent) => void | Promise<void>;
  onTransaction?: (event: TransactionEvent) => void | Promise<void>;
}

const QUEUE_CAPACITY = 10_000;
// Providers behind CDN proxies close idle streams; Triton docs say ping every 30s.
const PING_INTERVAL_MS = 30_000;
const PAUSE_HIGH_WATER = 0.8;
const RESUME_LOW_WATER = 0.5;
const DEDUPE_RETENTION_SLOTS = 10_000;

function emptySubscribeRequest(): SubscribeRequest {
  return {
    accounts: {},
    slots: {},
    transactions: {},
    transactionsStatus: {},
    blocks: {},
    blocksMeta: {},
    entry: {},
    accountsDataSlice: [],
  };
}

function mapSlotStatus(status: number): SlotCommitment | undefined {
  switch (status) {
    case SLOT_STATUS.processed:
      return "processed";
    case SLOT_STATUS.confirmed:
      return "confirmed";
    case SLOT_STATUS.finalized:
      return "finalized";
    case SLOT_STATUS.dead:
      return "dead";
    default:
      return undefined;
  }
}

/**
 * Yellowstone stream consumer: slots (all commitment transitions) + blockMeta.
 *
 * Reconnection is layered: the v5 client's built-in reconnect (backoff +
 * from_slot replay) handles transport drops; this class adds (a) dedupe of
 * replayed (slot,status) pairs, (b) discontinuity accounting, and (c) an
 * outer watchdog that rebuilds the whole subscription with fromSlot when the
 * stream dies outright. Backpressure: events land in a BoundedQueue; the
 * gRPC stream is paused above the high-water mark and resumed below the low
 * one, and queue metrics make the mechanism observable.
 */
export class YellowstoneConsumer {
  private readonly queue: BoundedQueue<StreamEvent>;
  private readonly capacity: number;
  private client: GeyserClient | undefined;
  private stream: ClientDuplexStream | undefined;
  private handlers: Handlers = {};
  private stopping = false;
  private dispatchDone: Promise<void> | undefined;
  private pingTimer: NodeJS.Timeout | undefined;
  private pingId = 0;
  private reconnectAttempt = 0;
  private lastHealthyAt = 0;
  private seenStatuses = new Map<number, Set<SlotCommitment>>();
  private lastProcessedSlot: number | undefined;
  private readonly health: StreamHealth = {
    pingsSent: 0,
    pongsReceived: 0,
    reconnects: 0,
    slotDiscontinuities: 0,
    duplicatesDeduped: 0,
    streamPaused: false,
  };

  constructor(private readonly options: ConsumerOptions) {
    this.capacity = options.queueCapacity ?? QUEUE_CAPACITY;
    this.queue = new BoundedQueue<StreamEvent>(this.capacity);
  }

  on(handlers: Handlers): void {
    this.handlers = { ...this.handlers, ...handlers };
  }

  async start(): Promise<void> {
    this.stopping = false;
    await this.connectAndSubscribe(undefined);
    this.dispatchDone = this.dispatchLoop();
  }

  async stop(): Promise<void> {
    this.stopping = true;
    if (this.pingTimer !== undefined) clearInterval(this.pingTimer);
    this.stream?.removeAllListeners();
    this.stream?.destroy();
    this.queue.close();
    await this.dispatchDone;
  }

  getHealth(): StreamHealth {
    return { ...this.health };
  }

  getQueueMetrics(): QueueMetrics {
    return this.queue.getMetrics();
  }

  /** Test hook: hard-kills the transport to exercise the reconnect path. */
  forceDisconnect(): void {
    this.log("chaos: forcing stream disconnect");
    this.stream?.destroy(new Error("chaos-induced disconnect"));
  }

  private log(line: string): void {
    this.options.log?.(`[stream] ${line}`);
  }

  private buildRequest(fromSlot: number | undefined): SubscribeRequest {
    const request = emptySubscribeRequest();
    request.slots = {
      lifecycle: { filterByCommitment: false, interslotUpdates: false },
    };
    request.blocksMeta = { lifecycle: {} };
    if (this.options.watchAccounts !== undefined && this.options.watchAccounts.length > 0) {
      request.transactions = {
        watched: {
          vote: false,
          failed: true, // failed executions are lifecycle evidence, not noise
          accountInclude: this.options.watchAccounts,
          accountExclude: [],
          accountRequired: [],
        },
      };
    }
    request.commitment = CommitmentLevel.PROCESSED;
    if (fromSlot !== undefined) request.fromSlot = String(fromSlot);
    return request;
  }

  private async connectAndSubscribe(fromSlot: number | undefined): Promise<void> {
    // Providers quote bare host:port (SolInfra quickstart does), but the v5
    // NAPI transport needs an explicit scheme to negotiate TLS — default to
    // https; plaintext is opt-in by writing http:// in the env.
    const endpoint = /^[a-z][a-z0-9+.-]*:\/\//i.test(this.options.endpoint)
      ? this.options.endpoint
      : `https://${this.options.endpoint}`;
    this.client = new Client(endpoint, this.options.xToken, undefined, {
      enabled: true,
      backoff: { initialIntervalMs: 500, multiplier: 2, maxRetries: 10 },
    });
    await this.client.connect();

    let stream: ClientDuplexStream;
    try {
      stream = await this.subscribeWith(this.buildRequest(fromSlot));
    } catch (error) {
      if (fromSlot === undefined) throw error;
      // fromSlot outside the provider's replay window (or replay unsupported):
      // fall back to a live subscription and account the gap.
      this.log(
        `fromSlot=${fromSlot} replay rejected (${String(error)}); resubscribing live — potential gap window`,
      );
      this.health.slotDiscontinuities += 1;
      stream = await this.subscribeWith(this.buildRequest(undefined));
    }

    this.stream = stream;
    this.health.connectedAt = Date.now();
    this.lastHealthyAt = Date.now();
    this.attachStreamHandlers(stream);
    this.startPinging(stream);
    this.log(`subscribed (endpoint=${this.options.endpoint}, fromSlot=${fromSlot ?? "live"})`);
  }

  private async subscribeWith(request: SubscribeRequest): Promise<ClientDuplexStream> {
    if (this.client === undefined) throw new Error("client not connected");
    // subscribe(request) encodes and sends the request itself (verified
    // against dist/esm/index.js in 5.0.9) — writing it again would double-send.
    return this.client.subscribe(request);
  }

  private attachStreamHandlers(stream: ClientDuplexStream): void {
    stream.on("data", (update: SubscribeUpdate) => this.handleUpdate(update));
    const onTerminated = (cause: string) => (error?: Error) => {
      stream.removeAllListeners();
      if (this.pingTimer !== undefined) clearInterval(this.pingTimer);
      if (this.stopping) return;
      this.log(`stream ${cause}${error ? `: ${error.message}` : ""}`);
      void this.reconnectWithBackoff();
    };
    stream.on("error", onTerminated("error"));
    stream.on("close", onTerminated("close"));
    stream.on("end", onTerminated("end"));
  }

  private async reconnectWithBackoff(): Promise<void> {
    // Reset the attempt counter after a sustained healthy period.
    if (Date.now() - this.lastHealthyAt > 60_000) this.reconnectAttempt = 0;
    const cap = this.options.maxReconnectDelayMs ?? 30_000;
    const base = Math.min(1000 * 2 ** this.reconnectAttempt, cap);
    const delay = base / 2 + Math.random() * (base / 2);
    this.reconnectAttempt += 1;
    this.health.reconnects += 1;
    this.log(
      `watchdog reconnect #${this.health.reconnects} in ${Math.round(delay)}ms (fromSlot=${this.lastProcessedSlot ?? "live"})`,
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
    if (this.stopping) return;
    try {
      await this.connectAndSubscribe(this.lastProcessedSlot);
    } catch (error) {
      this.log(`reconnect failed: ${String(error)}`);
      if (!this.stopping) void this.reconnectWithBackoff();
    }
  }

  private startPinging(stream: ClientDuplexStream): void {
    if (this.pingTimer !== undefined) clearInterval(this.pingTimer);
    const interval = this.options.pingIntervalMs ?? PING_INTERVAL_MS;
    this.pingTimer = setInterval(() => {
      const request = emptySubscribeRequest();
      this.pingId += 1;
      request.ping = { id: this.pingId };
      stream.write(request, (err: Error | null | undefined) => {
        if (!err) this.health.pingsSent += 1;
      });
    }, interval);
    this.pingTimer.unref();
  }

  private handleUpdate(update: SubscribeUpdate): void {
    this.health.lastUpdateAt = Date.now();
    this.lastHealthyAt = Date.now();

    if (update.pong !== undefined) {
      this.health.pongsReceived += 1;
      return;
    }
    if (update.ping !== undefined) return; // server-initiated keepalive

    if (update.slot !== undefined) {
      const status = mapSlotStatus(update.slot.status);
      if (status === undefined) return;
      const slot = Number(update.slot.slot);
      if (this.isDuplicate(slot, status)) return;

      if (status === "processed") {
        if (this.lastProcessedSlot !== undefined && slot > this.lastProcessedSlot + 1) {
          this.health.slotDiscontinuities += 1;
        }
        if (this.lastProcessedSlot === undefined || slot > this.lastProcessedSlot) {
          this.lastProcessedSlot = slot;
          this.health.lastSlot = slot;
        }
      }

      const event: SlotEvent = {
        type: "slot",
        slot,
        parent: update.slot.parent !== undefined ? Number(update.slot.parent) : undefined,
        status,
        receivedAt: Date.now(),
      };
      // (slot,status) is unique post-dedupe — safe to collapse on it.
      this.enqueue(event, `slot:${slot}:${status}`);
      return;
    }

    if (update.transaction !== undefined) {
      const info = update.transaction.transaction;
      if (info === undefined) return;
      const signature = bs58.encode(info.signature);
      // Filter the firehose at ingestion — when watching a busy account, keep
      // only the signatures we care about so the queue never fills with noise.
      if (this.options.transactionFilter !== undefined && !this.options.transactionFilter(signature)) {
        return;
      }
      const event: TransactionEvent = {
        type: "transaction",
        signature,
        slot: Number(update.transaction.slot),
        hasExecutionError: info.meta?.err !== undefined,
        receivedAt: Date.now(),
      };
      // No collapse key: our own evidence is never superseded/dropped.
      this.queue.push(event);
      return;
    }

    if (update.blockMeta !== undefined) {
      const meta = update.blockMeta;
      const event: BlockMetaEvent = {
        type: "blockMeta",
        slot: Number(meta.slot),
        blockhash: meta.blockhash,
        blockHeight:
          meta.blockHeight !== undefined ? Number(meta.blockHeight.blockHeight) : undefined,
        blockTimeUnix:
          meta.blockTime !== undefined ? Number(meta.blockTime.timestamp) : undefined,
        receivedAt: Date.now(),
      };
      this.enqueue(event, `meta:${event.slot}`);
    }
  }

  private isDuplicate(slot: number, status: SlotCommitment): boolean {
    let statuses = this.seenStatuses.get(slot);
    if (statuses?.has(status)) {
      this.health.duplicatesDeduped += 1;
      return true;
    }
    if (statuses === undefined) {
      statuses = new Set();
      this.seenStatuses.set(slot, statuses);
    }
    statuses.add(status);

    if (this.seenStatuses.size > DEDUPE_RETENTION_SLOTS * 1.2) {
      const cutoff = slot - DEDUPE_RETENTION_SLOTS;
      for (const s of this.seenStatuses.keys()) {
        if (s < cutoff) this.seenStatuses.delete(s);
      }
    }
    return false;
  }

  private enqueue(event: StreamEvent, collapseKey: string): void {
    this.queue.push(event, collapseKey);
    if (!this.health.streamPaused && this.queue.depth > this.capacity * PAUSE_HIGH_WATER) {
      this.health.streamPaused = true;
      this.stream?.pause();
      this.log(`backpressure: paused stream at depth ${this.queue.depth}/${this.capacity}`);
    }
  }

  private async dispatchLoop(): Promise<void> {
    while (!this.stopping) {
      const event = await this.queue.pop();
      if (event === undefined || this.stopping) return;
      if (this.health.streamPaused && this.queue.depth < this.capacity * RESUME_LOW_WATER) {
        this.health.streamPaused = false;
        this.stream?.resume();
        this.log(`backpressure: resumed stream at depth ${this.queue.depth}/${this.capacity}`);
      }
      try {
        if (event.type === "slot") await this.handlers.onSlot?.(event);
        else if (event.type === "transaction") await this.handlers.onTransaction?.(event);
        else await this.handlers.onBlockMeta?.(event);
      } catch (error) {
        this.log(`handler error (${event.type}): ${String(error)}`);
      }
    }
  }
}
