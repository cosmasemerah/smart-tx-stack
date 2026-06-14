// One-shot, one-stream test (Ace plan = limited streams/day): does the FULL
// token now stream OUR wallet's transactions? Subscribes to slots + all three
// wallet-relevant mechanisms, submits ONE self-transfer, reports which deliver.
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

// Sign first so we can also try an exact-signature filter.
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
  accounts: { acc: { account: [wallet], owner: [], filters: [], nonemptyTxnSignature: false } },
  slots: { s: { filterByCommitment: false, interslotUpdates: false } },
  transactions: { tx: { vote: false, failed: true, accountInclude: [wallet], accountExclude: [], accountRequired: [] } },
  transactionsStatus: { ts: { vote: false, failed: true, accountInclude: [wallet], accountExclude: [], accountRequired: [] } },
  blocks: {},
  blocksMeta: {},
  entry: {},
  accountsDataSlice: [],
  commitment: CommitmentLevel.PROCESSED,
});

let slots = 0;
const ours = { transaction: false, transactionStatus: false, account: false };
stream.on("data", (u: import("@triton-one/yellowstone-grpc").SubscribeUpdate) => {
  if (u.slot) slots += 1;
  if (u.transaction?.transaction && bs58.encode(u.transaction.transaction.signature) === mySig) {
    ours.transaction = true;
    console.log(`  [transaction] OURS slot=${u.transaction.slot}`);
  }
  if (u.transactionStatus && bs58.encode(u.transactionStatus.signature) === mySig) {
    ours.transactionStatus = true;
    console.log(`  [transactionStatus] OURS slot=${u.transactionStatus.slot}`);
  }
  if (u.account?.account?.txnSignature && bs58.encode(u.account.account.txnSignature) === mySig) {
    ours.account = true;
    console.log(`  [account] OURS slot=${u.account.slot}`);
  }
});

console.log(`one-stream wallet test: ${wallet}\nwill submit ${mySig}`);
setTimeout(async () => {
  await connection.sendRawTransaction(tx.serialize(), { skipPreflight: false });
  console.log("submitted");
}, 4_000);

setTimeout(() => {
  stream.destroy();
  console.log(`RESULT slots=${slots} ours=${JSON.stringify(ours)}`);
  const any = ours.transaction || ours.transactionStatus || ours.account;
  console.log(any ? "WALLET STREAMING WORKS — token fix succeeded" : "STILL NOT STREAMING our wallet");
  process.exit(any ? 0 : 1);
}, 45_000);
