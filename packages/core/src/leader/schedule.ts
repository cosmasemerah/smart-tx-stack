export const SLOTS_PER_LEADER_WINDOW = 4;

export interface LeaderWindow {
  windowStart: number;
  slotsInto: number;
  nextWindowStart: number;
  /** Validator identity (base58); undefined when the cache has no coverage. */
  leader?: string;
}

export type SlotLeadersFetcher = (startSlot: number, limit: number) => Promise<string[]>;

/** Raw JSON-RPC getSlotLeaders — limit 1..5000 per the RPC spec. */
export function rpcSlotLeadersFetcher(
  rpcUrl: string,
  fetchImpl: typeof fetch = fetch,
): SlotLeadersFetcher {
  return async (startSlot, limit) => {
    const response = await fetchImpl(rpcUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getSlotLeaders",
        params: [startSlot, limit],
      }),
    });
    const payload = (await response.json()) as {
      result?: string[];
      error?: { code: number; message: string };
    };
    if (payload.error !== undefined) {
      throw new Error(`getSlotLeaders: ${payload.error.code} ${payload.error.message}`);
    }
    return payload.result ?? [];
  };
}

export interface LeaderScheduleOptions {
  /** Slots fetched per refresh (RPC max 5000). */
  fetchAhead?: number;
  /** Refresh when remaining coverage ahead of the current slot drops below this. */
  refreshWhenRemaining?: number;
  log?: (line: string) => void;
}

/**
 * Rolling slot→leader cache fed by getSlotLeaders. Leaders rotate every 4
 * slots; the window leader is the leader of the 4-aligned window start.
 */
export class LeaderScheduleCache {
  private leaders = new Map<number, string>();
  private coveredThrough = -1;
  private inflight: Promise<void> | undefined;

  constructor(
    private readonly fetcher: SlotLeadersFetcher,
    private readonly options: LeaderScheduleOptions = {},
  ) {}

  /** Top up coverage ahead of the chain tip; coalesces concurrent callers. */
  async ensureCoverage(currentSlot: number): Promise<void> {
    const remaining = this.coveredThrough - currentSlot;
    if (remaining >= (this.options.refreshWhenRemaining ?? 400)) return;
    if (this.inflight !== undefined) return this.inflight;

    const fetchAhead = this.options.fetchAhead ?? 2_000;
    const startSlot = Math.max(currentSlot, this.coveredThrough + 1);
    this.inflight = (async () => {
      try {
        const leaders = await this.fetcher(startSlot, fetchAhead);
        leaders.forEach((leader, i) => this.leaders.set(startSlot + i, leader));
        if (leaders.length > 0) {
          this.coveredThrough = startSlot + leaders.length - 1;
        }
        this.prune(currentSlot);
        this.options.log?.(
          `[leader] schedule coverage ${startSlot}..${this.coveredThrough} (${leaders.length} slots)`,
        );
      } finally {
        this.inflight = undefined;
      }
    })();
    return this.inflight;
  }

  getWindow(slot: number): LeaderWindow {
    const windowStart = slot - (slot % SLOTS_PER_LEADER_WINDOW);
    return {
      windowStart,
      slotsInto: slot - windowStart,
      nextWindowStart: windowStart + SLOTS_PER_LEADER_WINDOW,
      leader: this.leaders.get(windowStart) ?? this.leaders.get(slot),
    };
  }

  get coverageThrough(): number {
    return this.coveredThrough;
  }

  private prune(currentSlot: number): void {
    const cutoff = currentSlot - 100;
    for (const slot of this.leaders.keys()) {
      if (slot < cutoff) this.leaders.delete(slot);
    }
  }
}
