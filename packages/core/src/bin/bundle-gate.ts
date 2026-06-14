// Phase 3 gate / tip-account confirmation validation: submit ONE real Jito
// bundle and confirm landing from the stream by watching the tip account we
// tip (busy → SolInfra delivers it) and filtering for our own signature.
// Slot stream drives confirmed/finalized. This both proves the confirmation
// path on SolInfra and lands bundle #1 of the required 10+.
import { Connection } from "@solana/web3.js";
import { loadConfig, loadDotEnv } from "../config.js";
import { buildTipBundle, pickTipAccount } from "../jito/bundle-builder.js";
import { JitoClient } from "../jito/client.js";
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

async function main(): Promise<void> {
  const tipAccounts = await jito.getTipAccounts();
  const tipAccount = pickTipAccount(tipAccounts, Math.floor(Math.random() * tipAccounts.length));
  const floor = await fetchTipFloor();
  // High pressure (p95+ band) to win the auction for this validation land;
  // bounded ceiling caps cost. The AI agent tunes pressure per-bundle later.
  const tip = computeTip(floor, 0.85, {
    protocolFloorLamports: 1_000n,
    ceilingLamports: 500_000n,
  });
  log(`tip account ${tipAccount} · tip ${tip.tipLamports} lamports (p95-band, basis=${JSON.stringify(tip.basis)})`);

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

  let resolveDone: (r: LifecycleRecord) => void;
  const done = new Promise<LifecycleRecord>((r) => {
    resolveDone = r;
  });
  const tracker = new LifecycleTracker((record) => {
    writer.append(record);
    resolveDone(record);
  });

  const consumer = new YellowstoneConsumer({
    endpoint: config.grpcEndpoint,
    xToken: config.grpcXToken,
    watchAccounts: [tipAccount], // busy account SolInfra delivers
    transactionFilter: (sig) => sig === bundle.signature, // keep only ours
    log,
  });
  consumer.on({
    onTransaction(e) {
      log(`OUR TX seen on tip-account stream: ${e.signature} slot=${e.slot} err=${e.hasExecutionError}`);
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

  await consumer.start();
  await new Promise((r) => setTimeout(r, 5_000)); // warmup

  log(`submitting bundle (sig ${bundle.signature})`);
  const bundleId = await jito.sendBundle([bundle.base64]);
  log(`bundleId ${bundleId}`);
  tracker.trackSubmission({
    bundleId,
    signature: bundle.signature,
    tipLamports: bundle.tipLamports,
    blockhash: bundle.blockhash,
    lastValidBlockHeight: bundle.lastValidBlockHeight,
    cuLimit: bundle.cuLimit,
    tipFloorP25Lamports: floor.p25,
  });

  // Supplementary (non-authoritative) Jito status polling for the log.
  const statusTimer = setInterval(async () => {
    try {
      const [st] = await jito.getInflightBundleStatuses([bundleId]);
      if (st) {
        log(`inflight status: ${st.status}${st.landedSlot ? ` slot=${st.landedSlot}` : ""}`);
        tracker.onBundleStatus(bundleId, st.status);
      }
    } catch (e) {
      log(`status poll error: ${String(e)}`);
    }
  }, 3_000);
  statusTimer.unref();

  const record = await Promise.race([
    done,
    new Promise<null>((r) => setTimeout(() => r(null), 120_000)),
  ]);
  clearInterval(statusTimer);
  await consumer.stop();

  if (record === null) {
    log("TIMEOUT — no terminal lifecycle record in 90s");
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
