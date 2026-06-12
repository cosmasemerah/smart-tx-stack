import { describe, expect, it } from "vitest";
import { LifecycleTracker } from "./tracker.js";
import type { LifecycleRecord, SubmissionInput } from "./types.js";

function makeInput(overrides: Partial<SubmissionInput> = {}): SubmissionInput {
  return {
    bundleId: "bundle-1",
    signature: "sig-1",
    tipLamports: 25_000n,
    blockhash: "test-blockhash",
    lastValidBlockHeight: 1_000,
    tipFloorP25Lamports: 1_114n,
    ...overrides,
  };
}

function harness() {
  const records: LifecycleRecord[] = [];
  const tracker = new LifecycleTracker((r) => records.push(r));
  return { records, tracker };
}

describe("LifecycleTracker", () => {
  it("tracks the full landing lifecycle with stage deltas", () => {
    const { records, tracker } = harness();
    tracker.trackSubmission(makeInput(), 1_000);
    tracker.onTransactionSeen("sig-1", 500, 1_400);
    tracker.onSlotStatus(500, "confirmed", 2_000);
    tracker.onSlotStatus(500, "finalized", 8_000);

    expect(records).toHaveLength(1);
    const r = records[0]!;
    expect(r.status).toBe("landed");
    expect(r.processedSlot).toBe(500);
    expect(r.confirmedSlot).toBe(500);
    expect(r.finalizedSlot).toBe(500);
    expect(r.deltasMs).toEqual({
      submitToProcessed: 400,
      processedToConfirmed: 600,
      confirmedToFinalized: 6_000,
    });
    expect(r.tipLamports).toBe("25000");
    expect(r.explorer.solscan).toBe("https://solscan.io/tx/sig-1");
    expect(r.explorer.jitoBundle).toBe("https://explorer.jito.wtf/bundle/bundle-1");
    expect(tracker.getPendingCount()).toBe(0);
  });

  it("upgrades from the slot-status cache when the tx event arrives late", () => {
    const { records, tracker } = harness();
    tracker.trackSubmission(makeInput(), 1_000);
    tracker.onSlotStatus(500, "confirmed", 2_000);
    tracker.onSlotStatus(500, "finalized", 8_000);
    tracker.onTransactionSeen("sig-1", 500, 8_500); // replayed after the fact

    expect(records).toHaveLength(1);
    const r = records[0]!;
    expect(r.status).toBe("landed");
    expect(r.confirmedAt).toBe(new Date(2_000).toISOString());
    expect(r.finalizedAt).toBe(new Date(8_000).toISOString());
  });

  it("classifies blockhash expiry when the validity window passes unlanded", () => {
    const { records, tracker } = harness();
    tracker.trackSubmission(makeInput(), 1_000);
    tracker.onBlockHeight(1_000); // still valid — boundary is exclusive
    expect(records).toHaveLength(0);
    tracker.onBlockHeight(1_001);
    expect(records).toHaveLength(1);
    expect(records[0]!.status).toBe("failed");
    expect(records[0]!.failureClass).toBe("expired_blockhash");
  });

  it("classifies compute_exceeded from a recorded simulation error", () => {
    const { records, tracker } = harness();
    tracker.trackSubmission(
      makeInput({
        simulationError: "exceeded CUs meter at BPF instruction",
        injected: true,
        injectionType: "cu-starved",
      }),
      1_000,
    );
    tracker.onBlockHeight(1_001);
    expect(records[0]!.failureClass).toBe("compute_exceeded");
    expect(records[0]!.injected).toBe(true);
    expect(records[0]!.injectionType).toBe("cu-starved");
  });

  it("classifies fee_too_low ahead of bundle_failure when tip is below p25", () => {
    const { records, tracker } = harness();
    tracker.trackSubmission(makeInput({ tipLamports: 1_000n }), 1_000);
    tracker.onBundleStatus("bundle-1", "Invalid");
    expect(records[0]!.failureClass).toBe("fee_too_low");
    expect(records[0]!.lastBundleStatus).toBe("Invalid");
  });

  it("classifies bundle_failure on terminal Jito status with an adequate tip", () => {
    const { records, tracker } = harness();
    tracker.trackSubmission(makeInput(), 1_000);
    tracker.onBundleStatus("bundle-1", "Failed");
    expect(records[0]!.failureClass).toBe("bundle_failure");
  });

  it("does not expire records that already landed and await finalization", () => {
    const { records, tracker } = harness();
    tracker.trackSubmission(makeInput(), 1_000);
    tracker.onTransactionSeen("sig-1", 500, 1_400);
    tracker.onBlockHeight(5_000); // way past lastValidBlockHeight
    expect(records).toHaveLength(0);
    expect(tracker.getPendingCount()).toBe(1);
  });

  it("carries retry linkage for the agent-evidence cross-check", () => {
    const { records, tracker } = harness();
    tracker.trackSubmission(
      makeInput({ signature: "sig-2", retryOf: "bundle-0", agentDecisionId: "dec-7" }),
      1_000,
    );
    tracker.onBundleStatus("bundle-1", "Failed");
    expect(records[0]!.retryOf).toBe("bundle-0");
    expect(records[0]!.agentDecisionId).toBe("dec-7");
  });

  it("rejects duplicate submission tracking", () => {
    const { tracker } = harness();
    tracker.trackSubmission(makeInput(), 1_000);
    expect(() => tracker.trackSubmission(makeInput(), 2_000)).toThrow(/duplicate/);
  });
});
