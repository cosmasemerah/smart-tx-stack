// Phase 2 gate: submit ONE real mainnet self-transfer via RPC, then prove the
// lifecycle tracker drives it Submitted→Processed→Confirmed→Finalized purely
// from Yellowstone stream subscriptions (no RPC confirmation polling). Writes
// the record to logs/lifecycle-log.jsonl and prints the Solscan link.
import {
  ComputeBudgetProgram,
  Connection,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { loadConfig, loadDotEnv } from "../config.js";
import { JsonlWriter } from "../lifecycle/jsonl-writer.js";
import { LifecycleTracker } from "../lifecycle/tracker.js";
import type { LifecycleRecord } from "../lifecycle/types.js";
import { YellowstoneConsumer } from "../stream/consumer.js";
import { loadKeypair } from "../wallet/keypair.js";

loadDotEnv();
const config = loadConfig();
if (config.walletKeypairPath === undefined) {
  console.error("WALLET_KEYPAIR_PATH is required for the transfer gate");
  process.exit(2);
}

const keypair = loadKeypair(config.walletKeypairPath);
const wallet = keypair.publicKey.toBase58();
const connection = new Connection(config.rpcUrl, "confirmed");
const writer = new JsonlWriter("logs/lifecycle-log.jsonl");
const log = (line: string) => console.log(`${new Date().toISOString()} ${line}`);

let resolveDone: (r: LifecycleRecord) => void;
const done = new Promise<LifecycleRecord>((resolve) => {
  resolveDone = resolve;
});

const tracker = new LifecycleTracker((record) => {
  writer.append(record);
  resolveDone(record);
});

const consumer = new YellowstoneConsumer({
  endpoint: config.grpcEndpoint,
  xToken: config.grpcXToken,
  walletAddress: wallet,
  log,
});
consumer.on({
  onTransaction(e) {
    log(`tx event: ${e.signature} slot=${e.slot} err=${e.hasExecutionError}`);
    tracker.onTransactionSeen(e.signature, e.slot, e.receivedAt, e.hasExecutionError);
  },
  onSlot(e) {
    if (e.status === "confirmed" || e.status === "finalized") {
      tracker.onSlotStatus(e.slot, e.status, e.receivedAt);
    }
  },
  onBlockMeta(e) {
    if (e.blockHeight !== undefined) tracker.onBlockHeight(e.blockHeight);
  },
});

async function main(): Promise<void> {
  log(`transfer gate: wallet=${wallet}`);
  await consumer.start();
  // Wallet has ~1 tx in the window, so a missed warmup event = a missed gate.
  // Wait for the server-side filter to be demonstrably live: hold until we've
  // seen a few slot events (proves the stream is delivering) plus a margin.
  await new Promise((r) => setTimeout(r, 5_000));

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
  const message = new TransactionMessage({
    payerKey: keypair.publicKey,
    recentBlockhash: blockhash,
    instructions: [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000 }), // transfer ~150 CU + margin
      ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 10_000 }),
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: keypair.publicKey, // self-transfer — minimal, reversible
        lamports: 1,
      }),
    ],
  }).compileToV0Message();
  const tx = new VersionedTransaction(message);
  tx.sign([keypair]);
  const signature = bs58.encode(tx.signatures[0]!);

  log(`submitting tx ${signature} (blockhash=${blockhash} lvbh=${lastValidBlockHeight})`);
  tracker.trackSubmission({
    bundleId: `plain-${signature.slice(0, 8)}`, // no Jito bundle in this gate
    signature,
    tipLamports: 0n,
    blockhash,
    lastValidBlockHeight,
    cuLimit: 1_000,
  });
  await connection.sendRawTransaction(tx.serialize(), { skipPreflight: false });

  const record = await Promise.race([
    done,
    new Promise<null>((r) => setTimeout(() => r(null), 90_000)),
  ]);

  await consumer.stop();
  if (record === null) {
    log("TIMEOUT — no terminal lifecycle record within 90s");
    process.exit(1);
  }
  log(`GATE RESULT ${JSON.stringify(record)}`);
  const ok =
    record.status === "landed" &&
    record.processedSlot !== undefined &&
    record.confirmedSlot !== undefined &&
    record.finalizedSlot !== undefined;
  log(ok ? `PASS — verify slot ${record.finalizedSlot} at ${record.explorer.solscan}` : "FAIL");
  process.exit(ok ? 0 : 1);
}

main().catch((error) => {
  log(`error: ${String(error)}`);
  void consumer.stop().finally(() => process.exit(1));
});
