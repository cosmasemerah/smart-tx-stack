export type SlotCommitment = "processed" | "confirmed" | "finalized" | "dead";

export interface SlotEvent {
  type: "slot";
  slot: number;
  parent?: number;
  status: SlotCommitment;
  /** Local receive time (ms epoch) — basis for stage latency deltas. */
  receivedAt: number;
}

export interface BlockMetaEvent {
  type: "blockMeta";
  slot: number;
  blockhash: string;
  blockHeight?: number;
  blockTimeUnix?: number;
  receivedAt: number;
}

export interface TransactionEvent {
  type: "transaction";
  /** base58 signature */
  signature: string;
  slot: number;
  /**
   * Present when the transaction landed but failed execution. The geyser
   * proto carries the error as bincode bytes — presence is the signal here;
   * full classification context comes from the submission record.
   */
  hasExecutionError: boolean;
  receivedAt: number;
}

export type StreamEvent = SlotEvent | BlockMetaEvent | TransactionEvent;

export interface StreamHealth {
  connectedAt?: number;
  lastUpdateAt?: number;
  lastSlot?: number;
  pingsSent: number;
  pongsReceived: number;
  reconnects: number;
  /**
   * Count of non-contiguous processed-slot advances. On Solana a missing slot
   * number can be a legitimately skipped slot, not a missed message — this is
   * an observability signal, not an error count. Windows immediately after a
   * reconnect are the ones to scrutinize.
   */
  slotDiscontinuities: number;
  duplicatesDeduped: number;
  streamPaused: boolean;
}
