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
  hadExecutionError?: boolean;
  lastBundleStatus?: string;
  injected: boolean;
  injectionType?: string;
  retryOf?: string;
  agentDecisionId?: string;
  explorer: {
    solscan: string;
    jitoBundle: string;
  };
}
