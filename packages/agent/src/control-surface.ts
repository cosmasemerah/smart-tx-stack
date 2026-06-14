import type { FailureClass } from "@smart-tx-stack/core";

/**
 * The typed boundary between the AI agent and the core transaction stack
 * (the "clean separation between AI layer and core stack" the bounty judges).
 * The agent depends only on this interface; the orchestrator wires it to the
 * real stack (or a mock in tests). The agent never touches web3.js, the Jito
 * client, or the stream directly.
 *
 * Money crosses this boundary as integer lamports (bigint) — no floats.
 */

export interface FailureContext {
  bundleId: string;
  signature: string;
  failureClass: FailureClass;
  /** integer lamports, string-encoded for JSON safety */
  tipLamports: string;
  blockhash: string;
  lastValidBlockHeight: number;
  cuLimit?: number;
  simulationError?: string;
  lastBundleStatus?: string;
  /** how many times this logical bundle has been (re)submitted so far */
  attemptsSoFar: number;
}

export interface TipDataView {
  /** all integer lamports, string-encoded */
  p25: string;
  p50: string;
  p75: string;
  p95: string;
  p99: string;
  emaP50: string;
  observedAt: string;
}

export interface SlotStateView {
  currentSlot: number;
  nextJitoLeaderSlot?: number;
  slotsUntilJitoLeader?: number;
  jitoLeaderConfirmed: boolean;
  /** README Q1 health signal: median processed→confirmed delta (ms) recently */
  processedToConfirmedP50Ms?: number;
  /** fraction of recent slots seen skipped/dead (0..1), if known */
  recentSkipRate?: number;
}

export interface BlockhashInfo {
  blockhash: string;
  lastValidBlockHeight: number;
}

export interface ResubmitOutcome {
  bundleId: string;
  signature: string;
  /** integer lamports, string-encoded */
  tipLamports: string;
  landed: boolean;
  landedSlot?: number;
  /** terminal Jito/stream status observed, if any */
  status?: string;
}

export interface ResubmitInput {
  /** integer lamports — the agent's recalculated tip */
  tipLamports: bigint;
  cuLimit?: number;
  timing: "now" | "next-jito-window";
}

/** The capabilities the retry agent can invoke. Implemented by the stack. */
export interface StackControlSurface {
  getFailureContext(): Promise<FailureContext>;
  getTipData(): Promise<TipDataView>;
  getSlotState(): Promise<SlotStateView>;
  refreshBlockhash(): Promise<BlockhashInfo>;
  resubmitBundle(input: ResubmitInput): Promise<ResubmitOutcome>;
  abort(reason: string): Promise<void>;
}
