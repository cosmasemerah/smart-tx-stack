import type {
  FailureClass,
  LifecycleRecord,
  SubmissionInput,
} from "./types.js";

interface PendingRecord {
  input: SubmissionInput;
  submittedAt: number;
  processedAt?: number;
  processedSlot?: number;
  confirmedAt?: number;
  confirmedSlot?: number;
  finalizedAt?: number;
  finalizedSlot?: number;
  hadExecutionError?: boolean;
  lastBundleStatus?: string;
}

interface SlotStatusCacheEntry {
  confirmedAt?: number;
  finalizedAt?: number;
}

const SLOT_CACHE_RETENTION = 5_000;

/**
 * Per-signature lifecycle state machine. Landing evidence comes from stream
 * subscriptions: the wallet transaction event marks `processed` (and the
 * landing slot), and slot-status events upgrade that slot to confirmed /
 * finalized — the client-side commitment handling Triton recommends. Block
 * height (from blockMeta) drives blockhash-expiry detection. Jito bundle
 * statuses are supplementary evidence only, never the confirmation source.
 */
export class LifecycleTracker {
  private pending = new Map<string, PendingRecord>();
  private signaturesBySlot = new Map<number, Set<string>>();
  /** Recent slot statuses, so a late-arriving tx event still upgrades. */
  private slotStatusCache = new Map<number, SlotStatusCacheEntry>();
  private highestCachedSlot = 0;

  constructor(
    private readonly sink: (record: LifecycleRecord) => void,
    private readonly now: () => number = () => Date.now(),
  ) {}

  trackSubmission(input: SubmissionInput, submittedAt?: number): void {
    if (this.pending.has(input.signature)) {
      throw new Error(`duplicate submission tracking: ${input.signature}`);
    }
    this.pending.set(input.signature, {
      input,
      submittedAt: submittedAt ?? this.now(),
    });
  }

  getPendingCount(): number {
    return this.pending.size;
  }

  /** Wallet transaction observed on the stream (processed commitment). */
  onTransactionSeen(
    signature: string,
    slot: number,
    receivedAt: number,
    hasExecutionError = false,
  ): void {
    const record = this.pending.get(signature);
    if (record === undefined || record.processedAt !== undefined) return;
    record.processedAt = receivedAt;
    record.processedSlot = slot;
    record.hadExecutionError = hasExecutionError;

    let sigs = this.signaturesBySlot.get(slot);
    if (sigs === undefined) {
      sigs = new Set();
      this.signaturesBySlot.set(slot, sigs);
    }
    sigs.add(signature);

    // The slot may already have advanced past processed before our tx event
    // arrived (replay, reordering) — apply cached statuses immediately.
    const cached = this.slotStatusCache.get(slot);
    if (cached?.confirmedAt !== undefined) {
      this.applySlotStatus(slot, "confirmed", cached.confirmedAt);
    }
    if (cached?.finalizedAt !== undefined) {
      this.applySlotStatus(slot, "finalized", cached.finalizedAt);
    }
  }

  /** Slot commitment transition from the slots subscription. */
  onSlotStatus(slot: number, status: "confirmed" | "finalized", receivedAt: number): void {
    let cached = this.slotStatusCache.get(slot);
    if (cached === undefined) {
      cached = {};
      this.slotStatusCache.set(slot, cached);
    }
    if (status === "confirmed") cached.confirmedAt = receivedAt;
    else cached.finalizedAt = receivedAt;

    if (slot > this.highestCachedSlot) {
      this.highestCachedSlot = slot;
      if (this.slotStatusCache.size > SLOT_CACHE_RETENTION * 1.2) {
        const cutoff = slot - SLOT_CACHE_RETENTION;
        for (const s of this.slotStatusCache.keys()) {
          if (s < cutoff) this.slotStatusCache.delete(s);
        }
      }
    }

    this.applySlotStatus(slot, status, receivedAt);
  }

  /** Current block height from blockMeta — drives expiry classification. */
  onBlockHeight(blockHeight: number): void {
    for (const [signature, record] of this.pending) {
      if (record.processedAt !== undefined) continue; // landed, awaiting commitment
      if (blockHeight > record.input.lastValidBlockHeight) {
        this.fail(signature, record, this.classify(record));
      }
    }
  }

  /**
   * Supplementary Jito inflight status — recorded for the log and for failure
   * classification, but NEVER terminal on its own. Jito can report "Invalid"
   * (bundle left the auction system) while the transaction still lands via the
   * next leader; we observed exactly that. The authoritative failure signal is
   * blockhash expiry from the stream (onBlockHeight); landing is the stream's
   * transaction event. Bundle status only informs the classification once one
   * of those fires.
   */
  onBundleStatus(bundleId: string, status: string): void {
    for (const record of this.pending.values()) {
      if (record.input.bundleId === bundleId) {
        record.lastBundleStatus = status;
        return;
      }
    }
  }

  /**
   * Failure decision tree (research §8), evaluated when the blockhash window
   * expires unlanded — the most specific known cause wins.
   * 1. A recorded simulation compute error → compute_exceeded
   * 2. Tip below the p25 floor captured at submission → fee_too_low
   * 3. A terminal Jito bundle status was seen (Failed/Invalid) → bundle_failure
   * 4. Otherwise the blockhash window itself ran out → expired_blockhash
   */
  private classify(record: PendingRecord): FailureClass {
    const { simulationError, tipFloorP25Lamports, tipLamports } = record.input;
    if (simulationError !== undefined && /compute|CUs|budget/i.test(simulationError)) {
      return "compute_exceeded";
    }
    if (tipFloorP25Lamports !== undefined && tipLamports < tipFloorP25Lamports) {
      return "fee_too_low";
    }
    if (record.lastBundleStatus === "Failed" || record.lastBundleStatus === "Invalid") {
      return "bundle_failure";
    }
    return "expired_blockhash";
  }

  private applySlotStatus(
    slot: number,
    status: "confirmed" | "finalized",
    receivedAt: number,
  ): void {
    const sigs = this.signaturesBySlot.get(slot);
    if (sigs === undefined) return;
    for (const signature of [...sigs]) {
      const record = this.pending.get(signature);
      if (record === undefined) continue;
      if (status === "confirmed" && record.confirmedAt === undefined) {
        record.confirmedAt = receivedAt;
        record.confirmedSlot = slot;
      }
      if (status === "finalized" && record.finalizedAt === undefined) {
        record.finalizedAt = receivedAt;
        record.finalizedSlot = slot;
        sigs.delete(signature);
        this.complete(signature, record);
      }
    }
    if (sigs.size === 0) this.signaturesBySlot.delete(slot);
  }

  private complete(signature: string, record: PendingRecord): void {
    this.pending.delete(signature);
    this.sink(this.toRecord(record, "landed"));
  }

  private fail(signature: string, record: PendingRecord, failureClass: FailureClass): void {
    this.pending.delete(signature);
    if (record.processedSlot !== undefined) {
      this.signaturesBySlot.get(record.processedSlot)?.delete(signature);
    }
    this.sink(this.toRecord(record, "failed", failureClass));
  }

  private toRecord(
    record: PendingRecord,
    status: "landed" | "failed",
    failureClass?: FailureClass,
  ): LifecycleRecord {
    const { input } = record;
    const iso = (ms: number | undefined): string | undefined =>
      ms === undefined ? undefined : new Date(ms).toISOString();
    // In hybrid mode the "processed" timestamp is getBundleStatuses detection
    // time, which can lag the slot stream's confirmed time — a negative delta
    // is meaningless, so report it as undefined rather than a bogus number.
    const delta = (from: number | undefined, to: number | undefined): number | undefined =>
      from !== undefined && to !== undefined && to - from >= 0 ? to - from : undefined;
    return {
      schemaVersion: 1,
      bundleId: input.bundleId,
      signature: input.signature,
      bundleShape: "single-tx",
      tipLamports: input.tipLamports.toString(),
      cuLimit: input.cuLimit,
      blockhash: input.blockhash,
      lastValidBlockHeight: input.lastValidBlockHeight,
      leaderWindow: input.leaderWindow,
      submittedAt: new Date(record.submittedAt).toISOString(),
      processedAt: iso(record.processedAt),
      processedSlot: record.processedSlot,
      confirmedAt: iso(record.confirmedAt),
      confirmedSlot: record.confirmedSlot,
      finalizedAt: iso(record.finalizedAt),
      finalizedSlot: record.finalizedSlot,
      deltasMs: {
        submitToProcessed: delta(record.submittedAt, record.processedAt),
        processedToConfirmed: delta(record.processedAt, record.confirmedAt),
        confirmedToFinalized: delta(record.confirmedAt, record.finalizedAt),
      },
      status,
      failureClass,
      confirmationMode: input.confirmationMode ?? "stream-transaction",
      hadExecutionError: record.hadExecutionError,
      lastBundleStatus: record.lastBundleStatus,
      simulationError: input.simulationError,
      injected: input.injected ?? false,
      injectionType: input.injectionType,
      retryOf: input.retryOf,
      agentDecisionId: input.agentDecisionId,
      explorer: {
        solscan: `https://solscan.io/tx/${input.signature}`,
        jitoBundle: `https://explorer.jito.wtf/bundle/${input.bundleId}`,
      },
    };
  }
}
