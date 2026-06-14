export type FailureClass =
  | "expired_blockhash"
  | "fee_too_low"
  | "compute_exceeded"
  | "bundle_failure";

export interface LeaderWindowInfo {
  startSlot?: number;
  leaderIdentity?: string;
  jitoLeaderConfirmed?: boolean;
  confirmationMethod?: string;
  submittedSlotsIntoWindow?: number;
}

export interface SubmissionInput {
  bundleId: string;
  signature: string;
  tipLamports: bigint;
  blockhash: string;
  lastValidBlockHeight: number;
  cuLimit?: number;
  /** Live tip-floor p25 at submission time — basis for fee_too_low classification. */
  tipFloorP25Lamports?: bigint;
  /** Preflight simulation error when submission proceeded anyway (fault injection). */
  simulationError?: string;
  leaderWindow?: LeaderWindowInfo;
  injected?: boolean;
  injectionType?: string;
  retryOf?: string;
  agentDecisionId?: string;
  /**
   * How landing is detected. "stream-transaction" = the wallet's tx event off
   * the Yellowstone stream (true processed timestamp). "hybrid-bundle-status" =
   * getBundleStatuses landing slot + slot-stream commitment (processed
   * timestamp is detection-time and may lag confirmed — see README). Defaults
   * to stream-transaction.
   */
  confirmationMode?: "stream-transaction" | "hybrid-bundle-status";
}

/** One JSONL line in lifecycle-log.jsonl — the bounty's judged artifact. */
export interface LifecycleRecord {
  schemaVersion: 1;
  bundleId: string;
  signature: string;
  bundleShape: "single-tx";
  /** integer lamports, serialized as string (no float SOL anywhere) */
  tipLamports: string;
  cuLimit?: number;
  blockhash: string;
  lastValidBlockHeight: number;
  leaderWindow?: LeaderWindowInfo;
  submittedAt: string;
  processedAt?: string;
  processedSlot?: number;
  confirmedAt?: string;
  confirmedSlot?: number;
  finalizedAt?: string;
  finalizedSlot?: number;
  deltasMs: {
    submitToProcessed?: number;
    processedToConfirmed?: number;
    confirmedToFinalized?: number;
  };
  status: "landed" | "failed";
  failureClass?: FailureClass;
  confirmationMode: "stream-transaction" | "hybrid-bundle-status";
  hadExecutionError?: boolean;
  lastBundleStatus?: string;
  /** Preflight simulation error recorded at submission — the evidence behind a
   * compute_exceeded classification (e.g. the CU-starved fault injection). */
  simulationError?: string;
  injected: boolean;
  injectionType?: string;
  retryOf?: string;
  agentDecisionId?: string;
  explorer: {
    solscan: string;
    jitoBundle: string;
  };
}
