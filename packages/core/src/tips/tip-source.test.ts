import { describe, expect, it } from "vitest";
import { fetchTipFloor, parseTipFloor } from "./tip-source.js";

// Real tip_stream/REST payload captured 2026-06-14 (array-wrapped object).
const live = [
  {
    time: "2026-06-14T02:01:39+00:00",
    landed_tips_25th_percentile: 1.196e-6,
    landed_tips_50th_percentile: 1.919e-6,
    landed_tips_75th_percentile: 5.7385e-6,
    landed_tips_95th_percentile: 0.0001,
    landed_tips_99th_percentile: 0.0053800000000000245,
    ema_landed_tips_50th_percentile: 1.946628466469959e-6,
  },
];

describe("parseTipFloor", () => {
  it("parses the array-wrapped payload to integer lamports (ceil)", () => {
    const f = parseTipFloor(live);
    expect(f.time).toBe("2026-06-14T02:01:39+00:00");
    expect(f.p25).toBe(1_196n);
    expect(f.p50).toBe(1_919n);
    expect(f.p75).toBe(5_739n); // 5738.5 → ceil
    expect(f.p95).toBe(100_000n);
    // 5,380,000.0000000245 lamports — sub-milli-lamport tail is beyond the
    // converter's 12-dp window, so it truncates to 5,380,000 (no ceil bump).
    expect(f.p99).toBe(5_380_000n);
    expect(f.emaP50).toBe(1_947n); // 1946.6… → ceil
  });

  it("accepts a bare object as well as an array", () => {
    expect(parseTipFloor(live[0]).p50).toBe(1_919n);
  });

  it("rejects malformed payloads", () => {
    expect(() => parseTipFloor(null)).toThrow();
    expect(() => parseTipFloor([null])).toThrow();
  });

  it("returns only bigint percentile fields (no float leakage)", () => {
    const f = parseTipFloor(live);
    for (const v of [f.p25, f.p50, f.p75, f.p95, f.p99, f.emaP50]) {
      expect(typeof v).toBe("bigint");
    }
  });
});

describe("fetchTipFloor", () => {
  it("fetches and parses the REST endpoint", async () => {
    const fetchImpl = (async () => ({
      ok: true,
      json: async () => live,
    })) as unknown as typeof fetch;
    const f = await fetchTipFloor(fetchImpl);
    expect(f.p50).toBe(1_919n);
  });

  it("throws on non-OK HTTP", async () => {
    const fetchImpl = (async () => ({ ok: false, status: 503, json: async () => ({}) })) as unknown as typeof fetch;
    await expect(fetchTipFloor(fetchImpl)).rejects.toThrow(/503/);
  });
});
