// Provider capability probe (no on-chain spend). Reports which Yellowstone
// subscription types the configured endpoint actually delivers, using a
// known-busy reference account (SPL Token program) so a zero count means
// "not delivered by this tier", not "no matching activity".
//
// Motivation: SolInfra's Ace/bounty tier streams slot- and block-level data
// but did NOT deliver transaction/transactionsStatus/account updates for our
// (low-activity) wallet during Phase 2 bring-up — see
// references/solana-smart-tx-stack-research §13. Run this against any
// candidate provider to confirm transaction-level streaming before relying on
// it for landing confirmation.
//
// Usage: tsx src/bin/capability-probe.ts [referenceAccount] [seconds]
import { createRequire } from "node:module";
import { loadConfig, loadDotEnv } from "../config.js";

const requireCjs = createRequire(import.meta.url);
const geyser = requireCjs(
  "@triton-one/yellowstone-grpc",
) as typeof import("@triton-one/yellowstone-grpc");
const Client = geyser.default;
const { CommitmentLevel } = geyser;

loadDotEnv();
const config = loadConfig();
const reference = process.argv[2] ?? "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
const seconds = Number(process.argv[3] ?? "20");

const endpoint = /:\/\//.test(config.grpcEndpoint)
  ? config.grpcEndpoint
  : `https://${config.grpcEndpoint}`;
const client = new Client(endpoint, config.grpcXToken, undefined);
await client.connect();

const counts = { slot: 0, blockMeta: 0, transaction: 0, transactionStatus: 0, account: 0 };
const stream = await client.subscribe({
  accounts: { a: { account: [reference], owner: [], filters: [], nonemptyTxnSignature: false } },
  slots: { s: { filterByCommitment: false, interslotUpdates: false } },
  transactions: {
    t: { vote: false, failed: true, accountInclude: [reference], accountExclude: [], accountRequired: [] },
  },
  transactionsStatus: {
    ts: { vote: false, failed: true, accountInclude: [reference], accountExclude: [], accountRequired: [] },
  },
  blocks: {},
  blocksMeta: { bm: {} },
  entry: {},
  accountsDataSlice: [],
  commitment: CommitmentLevel.PROCESSED,
});

stream.on("data", (u: import("@triton-one/yellowstone-grpc").SubscribeUpdate) => {
  if (u.slot) counts.slot += 1;
  if (u.blockMeta) counts.blockMeta += 1;
  if (u.transaction) counts.transaction += 1;
  if (u.transactionStatus) counts.transactionStatus += 1;
  if (u.account) counts.account += 1;
});

console.log(`capability probe: endpoint=${endpoint} reference=${reference} window=${seconds}s`);
setTimeout(() => {
  stream.destroy();
  console.log(`CAPABILITIES ${JSON.stringify(counts)}`);
  for (const [k, v] of Object.entries(counts)) {
    console.log(`  ${k.padEnd(18)} ${v > 0 ? "DELIVERED" : "not delivered"} (${v})`);
  }
  process.exit(0);
}, seconds * 1_000);
