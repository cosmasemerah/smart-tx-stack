import { describe, expect, it, vi } from "vitest";
import { JitoValidatorRegistry } from "./jito-registry.js";
import { findNextJitoLeaderWindow } from "./leader-window.js";
import { LeaderScheduleCache } from "./schedule.js";

function scheduleWith(leadersFromSlot: number, leaders: string[]): LeaderScheduleCache {
  const fetcher = vi.fn(async (start: number, limit: number) => {
    // map slot → leader based on the provided array indexed from leadersFromSlot
    return Array.from({ length: limit }, (_, i) => {
      const slot = start + i;
      const idx = slot - leadersFromSlot;
      return leaders[idx] ?? "unknown";
    });
  });
  return new LeaderScheduleCache(fetcher, { fetchAhead: 200, refreshWhenRemaining: 1000 });
}

function registryWith(jitoSet: string[]): JitoValidatorRegistry {
  const payload = { validators: jitoSet.map((id) => ({ identity_account: id, running_jito: true })) };
  return new JitoValidatorRegistry({
    fetchImpl: vi.fn(async () => ({ json: async () => payload }) as unknown as Response),
    url: "https://registry.test",
  });
}

describe("findNextJitoLeaderWindow", () => {
  it("returns the first upcoming window whose leader runs Jito", async () => {
    // windows start at 1000,1004,1008,...; leaders per window: nonjito, nonjito, JITO
    const leaders: string[] = [];
    for (let i = 0; i < 16; i++) leaders[i] = i < 8 ? "plain" : "jitoVal";
    const schedule = scheduleWith(1000, leaders);
    const registry = registryWith(["jitoVal"]);

    const w = await findNextJitoLeaderWindow(1000, schedule, registry, 32);
    expect(w.jitoLeaderConfirmed).toBe(true);
    expect(w.leaderIdentity).toBe("jitoVal");
    expect(w.nextJitoLeaderSlot).toBe(1008); // first window (≥1000) with jitoVal
    expect(w.slotsUntil).toBe(8);
    expect(w.confirmationMethod).toBe("jito-validator-set");
  });

  it("reports unconfirmed when no Jito leader is in range", async () => {
    const leaders = Array.from({ length: 16 }, () => "plain");
    const schedule = scheduleWith(2000, leaders);
    const registry = registryWith(["someOtherJito"]);

    const w = await findNextJitoLeaderWindow(2000, schedule, registry, 16);
    expect(w.jitoLeaderConfirmed).toBe(false);
    expect(w.confirmationMethod).toBe("no-jito-leader-in-lookahead");
  });

  it("surfaces registry-unavailable rather than fabricating confirmation", async () => {
    const leaders = Array.from({ length: 16 }, (_, i) => `L${i}`);
    const schedule = scheduleWith(3000, leaders);
    const registry = new JitoValidatorRegistry({
      fetchImpl: vi.fn(async () => {
        throw new Error("down");
      }) as unknown as typeof fetch,
      url: "https://registry.test",
    });

    const w = await findNextJitoLeaderWindow(3000, schedule, registry, 16);
    expect(w.jitoLeaderConfirmed).toBe(false);
    expect(w.confirmationMethod).toBe("registry-unavailable");
  });
});
