import { describe, expect, it } from "vitest";
import { computeTip } from "./tip-strategy.js";
import type { TipFloor } from "./types.js";

const floor: TipFloor = {
  time: "t",
  p25: 1_000n,
  p50: 5_000n,
  p75: 20_000n,
  p95: 100_000n,
  p99: 500_000n,
  emaP50: 4_000n,
};

const config = {
  protocolFloorLamports: 1_000n,
  ceilingLamports: 1_000_000n,
};

describe("computeTip", () => {
  it("interpolates across the percentile ladder by pressure", () => {
    // pressure 0.25 → exactly p50; market floor (max(ema,p50)=5000) doesn't raise it
    expect(computeTip(floor, 0.25, config).tipLamports).toBe(5_000n);
    // pressure 0.5 → exactly p75
    expect(computeTip(floor, 0.5, config).tipLamports).toBe(20_000n);
    // pressure 0.75 → exactly p95
    expect(computeTip(floor, 0.75, config).tipLamports).toBe(100_000n);
    // pressure 1.0 → p99
    expect(computeTip(floor, 1.0, config).tipLamports).toBe(500_000n);
  });

  it("interpolates linearly mid-segment (bigint)", () => {
    // pressure 0.375 is halfway between p50(5000) and p75(20000) → 12500
    expect(computeTip(floor, 0.375, config).tipLamports).toBe(12_500n);
  });

  it("applies the market floor at low pressure (never underpays by default)", () => {
    // pressure 0 → p25(1000), but market floor max(ema4000,p50 5000)=5000 lifts it
    const d = computeTip(floor, 0, config);
    expect(d.tipLamports).toBe(5_000n);
    expect(d.basis.interpolatedLamports).toBe("1000");
    expect(d.basis.marketFloorLamports).toBe("5000");
  });

  it("lets the fault injector underpay when market floor is disabled", () => {
    const d = computeTip(floor, 0, { ...config, useMarketFloor: false });
    expect(d.tipLamports).toBe(1_000n); // p25, clamped only by protocol floor
  });

  it("clamps to the protocol floor", () => {
    const lowFloor: TipFloor = { ...floor, p25: 10n, p50: 20n, p75: 30n, p95: 40n, p99: 50n, emaP50: 15n };
    const d = computeTip(lowFloor, 0, { ...config, useMarketFloor: false });
    expect(d.tipLamports).toBe(1_000n); // raised to protocol floor
  });

  it("clamps to the ceiling", () => {
    const d = computeTip(floor, 1.0, { ...config, ceilingLamports: 50_000n });
    expect(d.tipLamports).toBe(50_000n);
  });

  it("clamps out-of-range / non-finite pressure", () => {
    expect(computeTip(floor, 5, config).tipLamports).toBe(500_000n); // >1 → p99
    expect(computeTip(floor, -1, config).tipLamports).toBe(5_000n); // <0 → p25 then market floor
    expect(computeTip(floor, Number.NaN, config).tipLamports).toBe(5_000n);
  });

  it("keeps all returned money as bigint", () => {
    expect(typeof computeTip(floor, 0.5, config).tipLamports).toBe("bigint");
  });
});
