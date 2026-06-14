import { describe, expect, it, vi } from "vitest";
import type { ResubmitInput, StackControlSurface } from "./control-surface.js";
import { RETRY_AGENT_TOOLS, dispatchTool } from "./tools.js";

function surfaceMock(overrides: Partial<StackControlSurface> = {}): StackControlSurface {
  return {
    getFailureContext: vi.fn(async () => ({
      bundleId: "b1",
      signature: "sig1",
      failureClass: "expired_blockhash" as const,
      tipLamports: "5000",
      blockhash: "bh",
      lastValidBlockHeight: 1000,
      attemptsSoFar: 1,
    })),
    getTipData: vi.fn(async () => ({
      p25: "1000", p50: "5000", p75: "20000", p95: "100000", p99: "500000", emaP50: "4000",
      observedAt: "t",
    })),
    getSlotState: vi.fn(async () => ({ currentSlot: 100, jitoLeaderConfirmed: true })),
    refreshBlockhash: vi.fn(async () => ({ blockhash: "bh2", lastValidBlockHeight: 1200 })),
    resubmitBundle: vi.fn(async (input: ResubmitInput) => ({
      bundleId: "b2",
      signature: "sig2",
      tipLamports: input.tipLamports.toString(),
      landed: true,
      landedSlot: 1150,
    })),
    abort: vi.fn(async () => {}),
    ...overrides,
  };
}

describe("RETRY_AGENT_TOOLS", () => {
  it("exposes the six operational tools", () => {
    expect(RETRY_AGENT_TOOLS.map((t) => t.name)).toEqual([
      "get_failure_context",
      "get_tip_data",
      "get_slot_state",
      "refresh_blockhash",
      "resubmit_bundle",
      "abort_with_reason",
    ]);
  });
});

describe("dispatchTool", () => {
  it("converts the agent's integer tip to bigint at the money boundary", async () => {
    const surface = surfaceMock();
    const res = await dispatchTool(surface, "resubmit_bundle", {
      tip_lamports: 25_000,
      timing: "now",
      reasoning: "p75 band",
    });
    expect(surface.resubmitBundle).toHaveBeenCalledWith({
      tipLamports: 25_000n,
      timing: "now",
    });
    expect(res.terminal).toMatchObject({ kind: "resubmitted", tipLamports: 25_000n, landed: true });
  });

  it("rejects a non-integer tip (no float money)", async () => {
    await expect(
      dispatchTool(surfaceMock(), "resubmit_bundle", { tip_lamports: 25_000.5, timing: "now" }),
    ).rejects.toThrow(/non-negative integer/);
  });

  it("routes abort_with_reason to the surface and marks it terminal", async () => {
    const surface = surfaceMock();
    const res = await dispatchTool(surface, "abort_with_reason", { reason: "compute exceeded" });
    expect(surface.abort).toHaveBeenCalledWith("compute exceeded");
    expect(res.terminal).toEqual({ kind: "aborted", reason: "compute exceeded" });
  });

  it("returns surface data as JSON for read tools", async () => {
    const surface = surfaceMock();
    const res = await dispatchTool(surface, "get_tip_data", {});
    expect(JSON.parse(res.content).p50).toBe("5000");
    expect(res.terminal).toBeUndefined();
  });

  it("defaults unknown timing to 'now'", async () => {
    const surface = surfaceMock();
    await dispatchTool(surface, "resubmit_bundle", { tip_lamports: 5_000, timing: "weird" });
    expect(surface.resubmitBundle).toHaveBeenCalledWith({ tipLamports: 5_000n, timing: "now" });
  });
});
