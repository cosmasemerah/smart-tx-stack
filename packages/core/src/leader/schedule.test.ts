import { describe, expect, it, vi } from "vitest";
import { LeaderScheduleCache, SLOTS_PER_LEADER_WINDOW } from "./schedule.js";

describe("LeaderScheduleCache", () => {
  it("computes 4-slot window boundaries and the window leader", async () => {
    // window starting at 1000 → leaders[1000]; index i maps to slot 1000+i
    const leaders = Array.from({ length: 8 }, (_, i) => `leader-${1000 + i}`);
    const fetcher = vi.fn(async () => leaders);
    const cache = new LeaderScheduleCache(fetcher, { fetchAhead: 8, refreshWhenRemaining: 100 });
    await cache.ensureCoverage(1000);

    const w = cache.getWindow(1002);
    expect(w.windowStart).toBe(1000);
    expect(w.slotsInto).toBe(2);
    expect(w.nextWindowStart).toBe(1000 + SLOTS_PER_LEADER_WINDOW);
    expect(w.leader).toBe("leader-1000"); // window leader = leader of windowStart

    const w2 = cache.getWindow(1005);
    expect(w2.windowStart).toBe(1004);
    expect(w2.leader).toBe("leader-1004");
  });

  it("only refetches when coverage ahead drops below the threshold", async () => {
    const fetcher = vi.fn(async (start: number, limit: number) =>
      Array.from({ length: limit }, (_, i) => `L${start + i}`),
    );
    const cache = new LeaderScheduleCache(fetcher, { fetchAhead: 2000, refreshWhenRemaining: 400 });
    await cache.ensureCoverage(1000); // covers 1000..2999
    await cache.ensureCoverage(1100); // remaining 1899 — no refetch
    expect(fetcher).toHaveBeenCalledTimes(1);
    await cache.ensureCoverage(2700); // remaining 299 < 400 — refetch
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("coalesces concurrent ensureCoverage calls into one fetch", async () => {
    const fetcher = vi.fn(async (start: number, limit: number) => {
      await new Promise((r) => setTimeout(r, 10));
      return Array.from({ length: limit }, (_, i) => `L${start + i}`);
    });
    const cache = new LeaderScheduleCache(fetcher, { fetchAhead: 100 });
    await Promise.all([cache.ensureCoverage(1), cache.ensureCoverage(1), cache.ensureCoverage(1)]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("returns undefined leader when the slot is uncovered", () => {
    const cache = new LeaderScheduleCache(vi.fn(), {});
    expect(cache.getWindow(500).leader).toBeUndefined();
  });
});
