// Tests the workaround surfaced by the Gemini research for the SolInfra wallet-tx
// gap: does a `blocks` subscription filtered to our wallet (includeTransactions:
// true) deliver OUR OWN transaction, when the isolated `transactions` /
// `transactionsStatus` / `accounts` subscriptions all returned zero?
//
// If the blocks path delivers it -> true stream-based landing confirmation is
// achievable on SolInfra itself (bounty req 2.8 PASS, no provider change). If it
// is still zero, the hybrid (getBundleStatuses + slot stream) is provably the
// right call. Single connection (Ace = 1 stream); one self-transfer; ~50s window.
import { createRequire } from "node:module";
import {
  ComputeBudgetProgram,
  Connection,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import { loadConfig, loadDotEnv } from "../config.js";
import { loadKeypair } from "../wallet/keypair.js";

const requireCjs = createRequire(import.meta.url);
const geyser = requireCjs("@triton-one/yellowstone-grpc") as typeof import("@triton-one/yellowstone-grpc");
const Client = geyser.default;
const { CommitmentLevel } = geyser;

loadDotEnv();
const config = loadConfig();
const keypair = loadKeypair(config.walletKeypairPath!);
const wallet = keypair.publicKey.toBase58();
const endpoint = /:\/\//.test(config.grpcEndpoint) ? config.grpcEndpoint : `https://${config.grpcEndpoint}`;

const client = new Client(endpoint, config.grpcXToken, undefined);
await client.connect();
const connection = new Connection(config.rpcUrl, "confirmed");

// Sign first so the exact signature is known before we subscribe.
const { blockhash } = await connection.getLatestBlockhash("confirmed");
const msg = new TransactionMessage({
  payerKey: keypair.publicKey,
  recentBlockhash: blockhash,
  instructions: [
    ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000 }),
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000_000 }),
    SystemProgram.transfer({ fromPubkey: keypair.publicKey, toPubkey: keypair.publicKey, lamports: 1 }),
  ],
}).compileToV0Message();
const tx = new VersionedTransaction(msg);
tx.sign([keypair]);
const mySig = bs58.encode(tx.signatures[0]!);

const stream = await client.subscribe({
  accounts: {},
  slots: { s: { filterByCommitment: false, interslotUpdates: false } },
  // Comparison path — the one that previously returned zero for our wallet.
  transactions: { tx: { vote: false, failed: true, accountInclude: [wallet], accountExclude: [], accountRequired: [] } },
  transactionsStatus: {},
  // The workaround under test — block-level evaluation filtered to our wallet.
  blocks: { wb: { accountInclude: [wallet], includeTransactions: true, includeAccounts: false, includeEntries: false } },
  blocksMeta: {},
  entry: {},
  accountsDataSlice: [],
  commitment: CommitmentLevel.PROCESSED,
});

let slots = 0;
let blockUpdates = 0;
const ours = { viaBlock: false, viaTransaction: false };

stream.on("error", (e: unknown) => console.log(`STREAM ERROR: ${String(e)}`));
stream.on("data", (u: import("@triton-one/yellowstone-grpc").SubscribeUpdate) => {
  if (u.slot) slots += 1;
  if (u.transaction?.transaction && bs58.encode(u.transaction.transaction.signature) === mySig) {
    ours.viaTransaction = true;
    console.log(`  [transactions sub] OUR TX slot=${u.transaction.slot}`);
  }
  if (u.block) {
    blockUpdates += 1;
    const hit = u.block.transactions?.some((t) => bs58.encode(t.signature) === mySig);
    if (hit) {
      ours.viaBlock = true;
      console.log(`  [blocks sub] OUR TX found in block slot=${u.block.slot} (block carried ${u.block.transactions.length} txs)`);
    } else {
      console.log(`  [blocks sub] block slot=${u.block.slot} matched wallet but our sig not among ${u.block.transactions?.length ?? 0} txs`);
    }
  }
});

console.log(`blocks-multiplex probe\nwallet ${wallet}\nsig    ${mySig}`);
setTimeout(async () => {
  try {
    await connection.sendRawTransaction(tx.serialize(), { skipPreflight: false });
    console.log("submitted");
  } catch (e) {
    console.log(`submit error: ${String(e)}`);
  }
}, 4_000);

setTimeout(() => {
  stream.destroy();
  console.log(`\nRESULT slots=${slots} blockUpdates=${blockUpdates} ours=${JSON.stringify(ours)}`);
  if (ours.viaBlock) {
    console.log("BLOCKS-MULTIPLEX WORKS — our wallet tx arrived via the blocks subscription.");
    console.log("=> pure stream-based landing confirmation is achievable on SolInfra (req 2.8 PASS).");
  } else if (ours.viaTransaction) {
    console.log("transactions sub delivered it (unexpected vs prior runs).");
  } else {
    console.log("STILL ZERO — neither blocks nor transactions delivered our wallet tx. Hybrid is justified.");
  }
  process.exit(ours.viaBlock || ours.viaTransaction ? 0 : 1);
}, 50_000);
