export const LAMPORTS_PER_SOL = 1_000_000_000n;

const SOL_DECIMALS = 9;

export type RoundingMode = "ceil" | "floor" | "round";

/**
 * Boundary converter — the ONLY place float SOL amounts are accepted.
 * External APIs (Jito tip_floor/tip_stream) report SOL as JSON floats; this
 * converts them to integer lamports exactly once. Everything downstream must
 * stay in bigint lamports — no float arithmetic on money paths.
 *
 * Default rounding is "ceil": when converting a tip floor, rounding up is the
 * safe direction (never tip below the observed percentile).
 */
export function solToLamports(
  value: number | string,
  mode: RoundingMode = "ceil",
): bigint {
  let dec: string;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new RangeError(`solToLamports: non-finite amount: ${value}`);
    }
    if (value < 0) {
      throw new RangeError(`solToLamports: negative amount: ${value}`);
    }
    // 12 dp = 3 sub-lamport digits, enough to round correctly
    dec = value.toFixed(SOL_DECIMALS + 3);
  } else {
    dec = value.trim();
    if (/[eE]/.test(dec)) {
      const n = Number(dec);
      if (!Number.isFinite(n) || n < 0) {
        throw new RangeError(`solToLamports: invalid amount: ${value}`);
      }
      dec = n.toFixed(SOL_DECIMALS + 3);
    }
    if (!/^\d+(\.\d+)?$/.test(dec)) {
      throw new RangeError(`solToLamports: invalid decimal string: ${value}`);
    }
  }

  const [intPart = "0", fracPart = ""] = dec.split(".");
  const fracLamports = fracPart.slice(0, SOL_DECIMALS).padEnd(SOL_DECIMALS, "0");
  const remainder = fracPart.slice(SOL_DECIMALS).replace(/0+$/, "");

  let lamports = BigInt(intPart) * LAMPORTS_PER_SOL + BigInt(fracLamports);
  if (remainder.length > 0) {
    if (mode === "ceil") {
      lamports += 1n;
    } else if (mode === "round" && remainder.charCodeAt(0) >= 0x35 /* "5" */) {
      lamports += 1n;
    }
  }
  return lamports;
}

/** Display/logging only — money math never goes back through SOL. */
export function lamportsToSolString(lamports: bigint): string {
  if (lamports < 0n) {
    throw new RangeError(`lamportsToSolString: negative amount: ${lamports}`);
  }
  const whole = lamports / LAMPORTS_PER_SOL;
  const frac = (lamports % LAMPORTS_PER_SOL)
    .toString()
    .padStart(SOL_DECIMALS, "0")
    .replace(/0+$/, "");
  return frac.length > 0 ? `${whole}.${frac}` : whole.toString();
}
