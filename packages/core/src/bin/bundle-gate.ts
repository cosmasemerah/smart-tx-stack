// Phase 3 hybrid gate: submit ONE real Jito bundle into a confirmed Jito leader
// window, detect landing via getBundleStatuses (canonical bundle API), and let
// the Yellowstone slot stream drive commitment progression. Lands bundle #1 of
// the required 10+ and proves the hybrid confirmation path end-to-end.
import { Connection } from "@solana/web3.js";
import { loadConfig, loadDotEnv } from "../config.js";
import { buildTipBundle, pickTipAccount } from "../jito/bundle-builder.js";
import { BundleConfirmer } from "../jito/bundle-confirmer.js";
import { JitoClient } from "../jito/client.js";
import { JitoValidatorRegistry } from "../leader/jito-registry.js";
import { findNextJitoLeaderWindow } from "../leader/leader-window.js";
import { LeaderScheduleCache, rpcSlotLeadersFetcher } from "../leader/schedule.js";
import { JsonlWriter } from "../lifecycle/jsonl-writer.js";
import { LifecycleTracker } from "../lifecycle/tracker.js";
import type { LifecycleRecord } from "../lifecycle/types.js";
import { YellowstoneConsumer } from "../stream/consumer.js";
import { computeTip } from "../tips/tip-strategy.js";
import { fetchTipFloor } from "../tips/tip-source.js";
import { loadKeypair } from "../wallet/keypair.js";

loadDotEnv();
const config = loadConfig();
const keypair = loadKeypair(config.walletKeypairPath!);
const connection = new Connection(config.rpcUrl, "confirmed");
const jito = new JitoClient({ blockEngineUrl: config.jitoBlockEngineUrl, log: console.log });
const writer = new JsonlWriter("logs/lifecycle-log.jsonl");
const log = (line: string) => console.log(`${new Date().toISOString()} ${line}`);

const schedule = new LeaderScheduleCache(rpcSlotLeadersFetcher(config.rpcUrl), { log });
const registry = new JitoValidatorRegistry({ log });
const confirmer = new BundleConfirmer(jito, { log });

let currentSlot = 0;

async function main(): Promise<void> {
  const tipAccounts = await jito.getTipAccounts();
  const tipAccount = pickTipAccount(tipAccounts, Math.floor(Math.random() * tipAccounts.length));
  const floor = await fetchTipFloor();
  const tip = computeTip(floor, 0.6, {
    protocolFloorLamports: 1_000n,
    ceilingLamports: 500_000n,
  });

  let resolveDone: (r: LifecycleRecord) => void;
  const done = new Promise<LifecycleRecord>((r) => {
    resolveDone = r;
  });
  const tracker = new LifecycleTracker((record) => {
    writer.append(record);
    resolveDone(record);
  });

  // Slot + blockMeta stream only: commitment progression + blockhash expiry.
  // (SolInfra won't stream our wallet's txs; landing comes from getBundleStatuses.)
  const consumer = new YellowstoneConsumer({
    endpoint: config.grpcEndpoint,
    xToken: config.grpcXToken,
    log,
  });
  consumer.on({
    onSlot(e) {
      if (e.slot > currentSlot) currentSlot = e.slot;
      if (e.status === "confirmed" || e.status === "finalized") {
        tracker.onSlotStatus(e.slot, e.status, e.receivedAt);
      }
    },
    onBlockMeta(e) {
      if (e.blockHeight !== undefined) tracker.onBlockHeight(e.blockHeight);
    },
  });
  await consumer.start();
  await new Promise((r) => setTimeout(r, 2_000)); // let the slot stream establish currentSlot

  // Confirm an upcoming Jito leader window (req 2.2) before submitting.
  const window = await findNextJitoLeaderWindow(currentSlot, schedule, registry);
  log(
    `current slot ${currentSlot} · next Jito window ${window.nextJitoLeaderSlot ?? "?"} ` +
      `(+${window.slotsUntil ?? "?"} slots, leader ${window.leaderIdentity ?? "?"}, ` +
      `confirmed=${window.jitoLeaderConfirmed} via ${window.confirmationMethod})`,
  );

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
  const bundle = buildTipBundle({
    payer: keypair,
    blockhash,
    lastValidBlockHeight,
    tipAccount,
    tipLamports: tip.tipLamports,
    cuLimit: 1_000,
    cuPriceMicroLamports: 10_000n,
  });
  log(`tip ${tip.tipLamports} lamports → ${tipAccount}; sig ${bundle.signature}`);

  const bundleId = await jito.sendBundle([bundle.base64]);
  log(`submitted bundleId ${bundleId}`);
  tracker.trackSubmission({
    bundleId,
    signature: bundle.signature,
    tipLamports: bundle.tipLamports,
    blockhash: bundle.blockhash,
    lastValidBlockHeight: bundle.lastValidBlockHeight,
    cuLimit: bundle.cuLimit,
    tipFloorP25Lamports: floor.p25,
    confirmationMode: "hybrid-bundle-status",
    leaderWindow: {
      startSlot: window.nextJitoLeaderSlot,
      leaderIdentity: window.leaderIdentity,
      jitoLeaderConfirmed: window.jitoLeaderConfirmed,
      confirmationMethod: window.confirmationMethod,
      submittedSlotsIntoWindow: window.slotsUntil,
    },
  });

  // Hybrid landing detection: getBundleStatuses → landing slot → tracker; the
  // slot stream then upgrades that slot to confirmed/finalized.
  confirmer.watch(bundleId, (landing) => {
    log(`LANDED via getBundleStatuses: slot=${landing.slot} status=${landing.confirmationStatus}`);
    tracker.onTransactionSeen(
      bundle.signature,
      landing.slot,
      Date.now(),
      !(landing.err === null || JSON.stringify(landing.err) === '{"Ok":null}'),
    );
  });

  const record = await Promise.race([
    done,
    new Promise<null>((r) => setTimeout(() => r(null), 120_000)),
  ]);
  confirmer.stop();
  await consumer.stop();

  if (record === null) {
    log("TIMEOUT — no terminal lifecycle record in 120s");
    process.exit(1);
  }
  log(`GATE RESULT ${JSON.stringify(record)}`);
  const landed = record.status === "landed" && record.finalizedSlot !== undefined;
  log(
    landed
      ? `PASS — bundle landed; verify slot ${record.finalizedSlot} at ${record.explorer.solscan}`
      : `OUTCOME ${record.status}/${record.failureClass ?? ""} — ${record.explorer.jitoBundle}`,
  );
  process.exit(landed ? 0 : 1);
}

main().catch((e) => {
  log(`error: ${String(e)}`);
  process.exit(1);
});
