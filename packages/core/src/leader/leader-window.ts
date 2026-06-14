import type { JitoValidatorRegistry } from "./jito-registry.js";
import { type LeaderScheduleCache, SLOTS_PER_LEADER_WINDOW } from "./schedule.js";

export interface JitoLeaderWindow {
  nextJitoLeaderSlot?: number;
  leaderIdentity?: string;
  slotsUntil?: number;
  jitoLeaderConfirmed: boolean;
  confirmationMethod: string;
}

/**
 * Find the next upcoming leader window whose leader runs the Jito client
 * (req 2.2 — real confirmation, never the ~95%-stake assumption). Scans
 * upcoming 4-slot windows, resolves each window's leader from the schedule
 * cache, and confirms it against the Jito validator set. Returns the first
 * confirmed Jito window, or an unconfirmed result if none is found in range
 * (e.g. registry unavailable or schedule uncovered).
 */
export async function findNextJitoLeaderWindow(
  currentSlot: number,
  schedule: LeaderScheduleCache,
  registry: JitoValidatorRegistry,
  lookaheadSlots = 64,
): Promise<JitoLeaderWindow> {
  await schedule.ensureCoverage(currentSlot);

  const firstWindow = currentSlot - (currentSlot % SLOTS_PER_LEADER_WINDOW);
  const checked = new Map<string, boolean>();

  for (
    let windowStart = firstWindow;
    windowStart < currentSlot + lookaheadSlots;
    windowStart += SLOTS_PER_LEADER_WINDOW
  ) {
    const window = schedule.getWindow(windowStart);
    const leader = window.leader;
    if (leader === undefined) continue;

    let confirmed = checked.get(leader);
    let method = "jito-validator-set";
    if (confirmed === undefined) {
      const check = await registry.check(leader);
      confirmed = check.confirmed;
      method = check.method;
      checked.set(leader, confirmed);
    }
    if (confirmed) {
      return {
        nextJitoLeaderSlot: windowStart,
        leaderIdentity: leader,
        slotsUntil: Math.max(0, windowStart - currentSlot),
        jitoLeaderConfirmed: true,
        confirmationMethod: method,
      };
    }
  }

  return {
    jitoLeaderConfirmed: false,
    confirmationMethod: registry.size === 0 ? "registry-unavailable" : "no-jito-leader-in-lookahead",
  };
}
