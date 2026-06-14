import { describe, expect, it, vi } from "vitest";
import { BundleConfirmer } from "./bundle-confirmer.js";
import type { JitoClient, LandedBundleStatus } from "./client.js";

function fakeJito(queue: LandedBundleStatus[][]): JitoClient {
  let call = 0;
  return {
    getBundleStatuses: vi.fn(async () => queue[Math.min(call++, queue.length - 1)] ?? []),
  } as unknown as JitoClient;
}

const landed = (bundleId: string, slot: number): LandedBundleStatus => ({
  bundleId,
  transactions: [`sig-${bundleId}`],
  slot,
  confirmationStatus: "finalized",
  err: { Ok: null },
});

describe("BundleConfirmer", () => {
  it("fires onLanded once the bundle appears in getBundleStatuses", async () => {
    // first poll: not landed yet; second poll: landed
    const jito = fakeJito([[], [landed("b1", 100)]]);
    const confirmer = new BundleConfirmer(jito, { pollIntervalMs: 5 });
    const seen: number[] = [];
    confirmer.watch("b1", (l) => seen.push(l.slot));

    await vi.waitFor(() => expect(seen).toEqual([100]), { timeout: 200 });
    confirmer.stop();
  });

  it("stops polling a bundle after it lands (no duplicate callbacks)", async () => {
    const jito = fakeJito([[landed("b1", 100)], [landed("b1", 100)]]);
    const confirmer = new BundleConfirmer(jito, { pollIntervalMs: 10 });
    let count = 0;
    confirmer.watch("b1", () => (count += 1));

    await vi.waitFor(() => expect(count).toBe(1), { timeout: 1_000 });
    await new Promise((r) => setTimeout(r, 50)); // ensure no second callback
    expect(count).toBe(1);
    confirmer.stop();
  });

  it("carries the landing slot and signature through", async () => {
    const jito = fakeJito([[landed("b9", 426_000_000)]]);
    const confirmer = new BundleConfirmer(jito, { pollIntervalMs: 5 });
    const out: unknown[] = [];
    confirmer.watch("b9", (l) => out.push(l));

    await vi.waitFor(() => expect(out).toHaveLength(1), { timeout: 200 });
    expect(out[0]).toMatchObject({
      bundleId: "b9",
      signature: "sig-b9",
      slot: 426_000_000,
      confirmationStatus: "finalized",
    });
    confirmer.stop();
  });
});
