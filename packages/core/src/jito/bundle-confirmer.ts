import type { JitoClient } from "./client.js";

export interface BundleLanding {
  bundleId: string;
  signature: string;
  slot: number;
  confirmationStatus: "processed" | "confirmed" | "finalized";
  err: unknown;
}

export interface BundleConfirmerOptions {
  pollIntervalMs?: number;
  log?: (line: string) => void;
}

/**
 * Hybrid landing detector: polls Jito `getBundleStatuses` (the canonical
 * bundle-tracking API, 300-slot lookback) to learn a bundle's LANDING SLOT.
 * The slot itself then feeds the lifecycle tracker, whose commitment
 * progression (confirmed→finalized) is driven by the Yellowstone slot stream —
 * so landing detection uses Jito's purpose-built bundle API while commitment
 * tracking stays stream-based. Swap to the transaction stream (onTransactionSeen
 * straight from a tx event) once a provider streams our wallet's txs; the
 * tracker interface is identical, so nothing downstream changes.
 *
 * Non-landing bundles never appear here (getBundleStatuses returns only landed
 * bundles) — their failure is detected by blockhash expiry in the tracker.
 */
export class BundleConfirmer {
  private readonly watching = new Map<string, (landing: BundleLanding) => void>();
  private timer: NodeJS.Timeout | undefined;
  private polling = false;

  constructor(
    private readonly jito: JitoClient,
    private readonly options: BundleConfirmerOptions = {},
  ) {}

  watch(bundleId: string, onLanded: (landing: BundleLanding) => void): void {
    this.watching.set(bundleId, onLanded);
    this.ensurePolling();
  }

  unwatch(bundleId: string): void {
    this.watching.delete(bundleId);
  }

  stop(): void {
    if (this.timer !== undefined) clearInterval(this.timer);
    this.timer = undefined;
    this.watching.clear();
  }

  private ensurePolling(): void {
    if (this.timer !== undefined) return;
    const interval = this.options.pollIntervalMs ?? 2_000;
    this.timer = setInterval(() => void this.poll(), interval);
    this.timer.unref();
  }

  private async poll(): Promise<void> {
    if (this.polling || this.watching.size === 0) return;
    this.polling = true;
    try {
      const ids = [...this.watching.keys()].slice(0, 5); // getBundleStatuses caps at 5
      const statuses = await this.jito.getBundleStatuses(ids);
      for (const s of statuses) {
        const onLanded = this.watching.get(s.bundleId);
        if (onLanded === undefined) continue;
        this.watching.delete(s.bundleId);
        onLanded({
          bundleId: s.bundleId,
          signature: s.transactions[0] ?? "",
          slot: s.slot,
          confirmationStatus: s.confirmationStatus,
          err: s.err,
        });
      }
    } catch (error) {
      this.options.log?.(`[confirmer] poll error: ${String(error)}`);
    } finally {
      this.polling = false;
    }
  }
}
