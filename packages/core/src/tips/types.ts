/** Jito tip-floor percentiles, converted to integer lamports at the ingestion
 * boundary (the source SOL floats never enter money math). */
export interface TipFloor {
  time: string;
  p25: bigint;
  p50: bigint;
  p75: bigint;
  p95: bigint;
  p99: bigint;
  emaP50: bigint;
}
