import {
  ComputeBudgetProgram,
  type Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";

export interface BuildBundleParams {
  payer: Keypair;
  blockhash: string;
  lastValidBlockHeight: number;
  /** One of the 8 Jito tip accounts (from getTipAccounts). */
  tipAccount: string;
  /** Integer lamports — Jito requires ≥1000 to be considered. */
  tipLamports: bigint;
  cuLimit: number;
  cuPriceMicroLamports: bigint;
  /** The demo "action": a self-transfer of this many lamports. */
  actionLamports?: bigint;
}

export interface BuiltBundle {
  transaction: VersionedTransaction;
  signature: string;
  /** base64 wire transaction for Jito sendBundle (single-tx bundle). */
  base64: string;
  blockhash: string;
  lastValidBlockHeight: number;
  tipLamports: bigint;
  tipAccount: string;
  cuLimit: number;
}

/**
 * Build a single-transaction Jito bundle: compute-budget ixs + the action +
 * the tip, all in ONE transaction (the uncle-bandit mitigation — a rebroadcast
 * carries tip and action atomically; see ADR-4). Returns the base64 wire form
 * for sendBundle.
 */
export function buildTipBundle(params: BuildBundleParams): BuiltBundle {
  if (params.tipLamports <= 0n) {
    throw new RangeError(`tipLamports must be positive: ${params.tipLamports}`);
  }
  const payerKey = params.payer.publicKey;
  const instructions = [
    ComputeBudgetProgram.setComputeUnitLimit({ units: params.cuLimit }),
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: params.cuPriceMicroLamports,
    }),
    SystemProgram.transfer({
      fromPubkey: payerKey,
      toPubkey: payerKey, // self-transfer action — minimal, reversible
      lamports: params.actionLamports ?? 1n,
    }),
    SystemProgram.transfer({
      fromPubkey: payerKey,
      toPubkey: new PublicKey(params.tipAccount),
      lamports: params.tipLamports, // bigint — integer lamports end to end
    }),
  ];

  const message = new TransactionMessage({
    payerKey,
    recentBlockhash: params.blockhash,
    instructions,
  }).compileToV0Message();
  const transaction = new VersionedTransaction(message);
  transaction.sign([params.payer]);

  const signature = bs58.encode(transaction.signatures[0]!);
  const base64 = Buffer.from(transaction.serialize()).toString("base64");

  return {
    transaction,
    signature,
    base64,
    blockhash: params.blockhash,
    lastValidBlockHeight: params.lastValidBlockHeight,
    tipLamports: params.tipLamports,
    tipAccount: params.tipAccount,
    cuLimit: params.cuLimit,
  };
}

/** Deterministic-enough tip-account pick (rotates by index, e.g. slot-derived). */
export function pickTipAccount(tipAccounts: string[], rotation: number): string {
  if (tipAccounts.length === 0) throw new Error("no tip accounts available");
  const idx = ((rotation % tipAccounts.length) + tipAccounts.length) % tipAccounts.length;
  return tipAccounts[idx]!;
}
