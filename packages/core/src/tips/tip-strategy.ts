import type { TipFloor } from "./types.js";

export interface TipStrategyConfig {
  /** Protocol minimum (Jito requires ≥1000 lamports). Config, not a magic number. */
  protocolFloorLamports: bigint;
  /** Risk ceiling — never tip above this regardless of pressure. */
  ceilingLamports: bigint;
  /**
   * When true (default), the tip is floored at the median market trend
   * (max(emaP50, p50)) so we don't underpay in normal operation. The fault
   * injector sets this false to deliberately tip below market for the
   * fee_too_low case.
   */
  useMarketFloor?: boolean;
}

export interface TipDecision {
  tipLamports: bigint;
  /** Inputs that produced the tip — logged for auditability / agent reasoning. */
  basis: {
    pressure: number;
    interpolatedLamports: string;
    marketFloorLamports: string;
    p50: string;
    p75: string;
    emaP50: string;
  };
}

// Percentile ladder positions in per-mille (integer — keeps interpolation in bigint).
const LADDER_PERMILLE = [0, 250, 500, 750, 1000] as const;

function clampPressureToPerMille(pressure: number): number {
  if (!Number.isFinite(pressure)) return 0;
  const clamped = Math.max(0, Math.min(1, pressure));
  return Math.round(clamped * 1000);
}

/**
 * Dynamic tip from live tip-floor data — no hardcoded amounts. `pressure`
 * (0..1) selects across the percentile ladder p25→p50→p75→p95→p99 with bigint
 * interpolation; the agent (or congestion signals) drives pressure on retries.
 * Result is floored at the median market trend (unless disabled) and clamped
 * to [protocolFloor, ceiling].
 */
export function computeTip(
  floor: TipFloor,
  pressure: number,
  config: TipStrategyConfig,
): TipDecision {
  const ladder = [floor.p25, floor.p50, floor.p75, floor.p95, floor.p99];
  const x = clampPressureToPerMille(pressure);

  let interpolated: bigint;
  if (x >= 1000) {
    interpolated = ladder[4]!;
  } else {
    let seg = 0;
    while (seg < LADDER_PERMILLE.length - 1 && x >= LADDER_PERMILLE[seg + 1]!) seg += 1;
    const lo = ladder[seg]!;
    const hi = ladder[seg + 1]!;
    const segStart = LADDER_PERMILLE[seg]!;
    const segWidth = LADDER_PERMILLE[seg + 1]! - segStart; // 250
    interpolated = lo + ((hi - lo) * BigInt(x - segStart)) / BigInt(segWidth);
  }

  const marketFloor = floor.emaP50 > floor.p50 ? floor.emaP50 : floor.p50;
  let tip = interpolated;
  if (config.useMarketFloor !== false && marketFloor > tip) {
    tip = marketFloor;
  }
  if (tip < config.protocolFloorLamports) tip = config.protocolFloorLamports;
  if (tip > config.ceilingLamports) tip = config.ceilingLamports;

  return {
    tipLamports: tip,
    basis: {
      pressure: Math.max(0, Math.min(1, Number.isFinite(pressure) ? pressure : 0)),
      interpolatedLamports: interpolated.toString(),
      marketFloorLamports: marketFloor.toString(),
      p50: floor.p50.toString(),
      p75: floor.p75.toString(),
      emaP50: floor.emaP50.toString(),
    },
  };
}
