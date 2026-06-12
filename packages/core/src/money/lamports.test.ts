import { describe, expect, it } from "vitest";
import {
  LAMPORTS_PER_SOL,
  lamportsToSolString,
  solToLamports,
} from "./lamports.js";

describe("solToLamports", () => {
  // Live Jito tip_floor snapshot values (2026-06-12), as JSON floats
  it("converts tip_floor percentiles (ceil default)", () => {
    expect(solToLamports(1.1135e-6)).toBe(1114n); // 1113.5 → ceil
    expect(solToLamports(5.28e-6)).toBe(5280n);
    expect(solToLamports(2.00835e-5)).toBe(20084n); // 20083.5 → ceil
    expect(solToLamports(1e-4)).toBe(100_000n);
    expect(solToLamports(3.767409162974145e-6)).toBe(3768n); // 3767.409… → ceil
  });

  it("respects floor and round modes", () => {
    expect(solToLamports(1.1135e-6, "floor")).toBe(1113n);
    expect(solToLamports(2.00835e-5, "round")).toBe(20084n); // half-up
    expect(solToLamports(3.767409162974145e-6, "floor")).toBe(3767n);
    expect(solToLamports(3.767409162974145e-6, "round")).toBe(3767n);
  });

  it("handles exact values without rounding bumps", () => {
    expect(solToLamports(0)).toBe(0n);
    expect(solToLamports(1)).toBe(LAMPORTS_PER_SOL);
    expect(solToLamports(0.05)).toBe(50_000_000n);
    expect(solToLamports(0.000000001)).toBe(1n);
  });

  it("parses decimal strings exactly", () => {
    expect(solToLamports("0.05")).toBe(50_000_000n);
    expect(solToLamports("1")).toBe(LAMPORTS_PER_SOL);
    expect(solToLamports("0.000001114")).toBe(1114n);
    expect(solToLamports("2.5")).toBe(2_500_000_000n);
  });

  it("parses scientific-notation strings via the float boundary", () => {
    expect(solToLamports("5.28e-6")).toBe(5280n);
  });

  it("applies rounding to sub-lamport string digits", () => {
    expect(solToLamports("0.0000000015", "ceil")).toBe(2n);
    expect(solToLamports("0.0000000015", "floor")).toBe(1n);
    expect(solToLamports("0.0000000015", "round")).toBe(2n);
    expect(solToLamports("0.0000000014", "round")).toBe(1n);
    // trailing zeros beyond 9 dp are not a remainder
    expect(solToLamports("0.000000001000", "ceil")).toBe(1n);
  });

  it("rejects invalid input", () => {
    expect(() => solToLamports(Number.NaN)).toThrow(RangeError);
    expect(() => solToLamports(Number.POSITIVE_INFINITY)).toThrow(RangeError);
    expect(() => solToLamports(-1e-9)).toThrow(RangeError);
    expect(() => solToLamports("-0.5")).toThrow(RangeError);
    expect(() => solToLamports("abc")).toThrow(RangeError);
    expect(() => solToLamports("1.2.3")).toThrow(RangeError);
  });
});

describe("lamportsToSolString", () => {
  it("formats lamports as SOL decimal strings", () => {
    expect(lamportsToSolString(0n)).toBe("0");
    expect(lamportsToSolString(1n)).toBe("0.000000001");
    expect(lamportsToSolString(1114n)).toBe("0.000001114");
    expect(lamportsToSolString(50_000_000n)).toBe("0.05");
    expect(lamportsToSolString(LAMPORTS_PER_SOL)).toBe("1");
    expect(lamportsToSolString(2_500_000_000n)).toBe("2.5");
  });

  it("round-trips with solToLamports for exact 9-dp values", () => {
    for (const v of [0n, 1n, 1114n, 5280n, 50_000_000n, 1_234_567_891n]) {
      expect(solToLamports(lamportsToSolString(v))).toBe(v);
    }
  });

  it("rejects negative lamports", () => {
    expect(() => lamportsToSolString(-1n)).toThrow(RangeError);
  });
});
