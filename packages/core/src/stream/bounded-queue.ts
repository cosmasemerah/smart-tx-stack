export interface QueueMetrics {
  enqueued: number;
  dequeued: number;
  collapsed: number;
  dropped: number;
  depth: number;
  maxDepth: number;
}

interface Entry<T> {
  item: T;
  collapseKey?: string;
}

/**
 * Bounded FIFO with collapse-key superseding — the backpressure boundary
 * between the gRPC stream and processors.
 *
 * Drop policy: a push with the same collapseKey replaces the queued entry
 * in place (a newer slot status supersedes the older one for the same slot).
 * At capacity, the oldest entry is dropped and counted. Phase 2's wallet
 * transaction events must be enqueued WITHOUT a collapse key and with the
 * queue sized so they are never dropped — slots/blockMeta are collapsible,
 * our own transaction evidence is not.
 */
export class BoundedQueue<T> {
  private entries: Entry<T>[] = [];
  private byKey = new Map<string, Entry<T>>();
  private waiter: (() => void) | undefined;
  private closed = false;
  private readonly metrics: QueueMetrics = {
    enqueued: 0,
    dequeued: 0,
    collapsed: 0,
    dropped: 0,
    depth: 0,
    maxDepth: 0,
  };

  constructor(private readonly capacity: number) {
    if (capacity < 1) throw new RangeError(`capacity must be >= 1: ${capacity}`);
  }

  push(item: T, collapseKey?: string): void {
    this.metrics.enqueued += 1;

    if (collapseKey !== undefined) {
      const existing = this.byKey.get(collapseKey);
      if (existing !== undefined) {
        existing.item = item;
        this.metrics.collapsed += 1;
        return;
      }
    }

    if (this.entries.length >= this.capacity) {
      const oldest = this.entries.shift();
      if (oldest?.collapseKey !== undefined) this.byKey.delete(oldest.collapseKey);
      this.metrics.dropped += 1;
    }

    const entry: Entry<T> = { item, collapseKey };
    this.entries.push(entry);
    if (collapseKey !== undefined) this.byKey.set(collapseKey, entry);

    this.metrics.depth = this.entries.length;
    if (this.entries.length > this.metrics.maxDepth) {
      this.metrics.maxDepth = this.entries.length;
    }

    this.waiter?.();
    this.waiter = undefined;
  }

  /** Resolves with the next item; waits while empty. Undefined once closed. */
  async pop(): Promise<T | undefined> {
    while (this.entries.length === 0) {
      if (this.closed) return undefined;
      await new Promise<void>((resolve) => {
        this.waiter = resolve;
      });
    }
    const entry = this.entries.shift() as Entry<T>;
    if (entry.collapseKey !== undefined) this.byKey.delete(entry.collapseKey);
    this.metrics.dequeued += 1;
    this.metrics.depth = this.entries.length;
    return entry.item;
  }

  get depth(): number {
    return this.entries.length;
  }

  getMetrics(): QueueMetrics {
    return { ...this.metrics, depth: this.entries.length };
  }

  /** Shutdown: pending and future pops on an empty queue resolve undefined. */
  close(): void {
    this.closed = true;
    this.waiter?.();
    this.waiter = undefined;
  }
}
