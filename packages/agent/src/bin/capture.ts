// Phase 7 capture run: drives the live stack through ≥10 real Jito bundle
// submissions including two deterministic fault injections (stale-blockhash,
// cu-starved), with the AI agent owning every retry/abort decision. Produces
// the judged artifacts logs/lifecycle-log.jsonl + logs/agent-decisions.jsonl.
//
// Spends real SOL (tips + fees on landed bundles) and real Anthropic tokens.
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import { Connection } from "@solana/web3.js";
import { JitoClient, lamportsToSolString, loadConfig, loadDotEnv, loadKeypair } from "@smart-tx-stack/core";
import { CaptureOrchestrator } from "../capture/orchestrator.js";

loadDotEnv();
const config = loadConfig();
// Anchor the judged artifacts to the repo-root logs/ regardless of cwd
// (packages/agent/src/bin/capture.ts → up 4 = repo root).
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const log = (line: string) => console.log(`${new Date().toISOString()} ${line}`);

if (!config.walletKeypairPath) {
  console.error("WALLET_KEYPAIR_PATH not set (.env)");
  process.exit(2);
}
if (!config.anthropicApiKey) {
  console.error("ANTHROPIC_API_KEY not set (.env) — Phase 7 needs the live agent");
  process.exit(2);
}

const MIN_BALANCE_LAMPORTS = 5_000_000n; // 0.005 SOL — funding guard
// `check` = zero-spend liveness probe; otherwise the arg is the happy-bundle count.
const mode = process.argv[2] === "check" ? "check" : "run";
const happyCount = mode === "check" ? 0 : Number(process.argv[2] ?? 8);

async function main(): Promise<void> {
  const keypair = loadKeypair(config.walletKeypairPath!);
  const connection = new Connection(config.rpcUrl, "confirmed");

  const balance = BigInt(await connection.getBalance(keypair.publicKey));
  log(`wallet ${keypair.publicKey.toBase58()} balance ${lamportsToSolString(balance)} SOL`);
  if (balance < MIN_BALANCE_LAMPORTS) {
    console.error(
      `balance below ${lamportsToSolString(MIN_BALANCE_LAMPORTS)} SOL — fund the burner before the capture run`,
    );
    process.exit(2);
  }

  const jito = new JitoClient({ blockEngineUrl: config.jitoBlockEngineUrl, log });
  const anthropic = new Anthropic();

  const orchestrator = new CaptureOrchestrator({
    connection,
    jito,
    keypair,
    anthropic,
    config: {
      grpcEndpoint: config.grpcEndpoint,
      grpcXToken: config.grpcXToken,
      rpcUrl: config.rpcUrl,
      lifecyclePath: join(REPO_ROOT, "logs", "lifecycle-log.jsonl"),
      decisionsPath: join(REPO_ROOT, "logs", "agent-decisions.jsonl"),
    },
    log,
  });

  if (mode === "check") {
    log("liveness probe (no spend)…");
    await orchestrator.start();
    const probe = await orchestrator.dryProbe();
    await orchestrator.stop();
    console.log(`\n=== LIVENESS PROBE ===\n${JSON.stringify(probe, null, 2)}`);
    process.exit(0);
  }

  log(`starting capture run (happyCount=${happyCount})…`);
  await orchestrator.start();
  const summary = await orchestrator.runCampaign({ happyCount });
  await orchestrator.stop();

  // ── Report ────────────────────────────────────────────────────────────────
  console.log("\n=== CAPTURE SUMMARY ===");
  console.log(
    JSON.stringify(
      {
        totalSubmissions: summary.totalSubmissions,
        landed: summary.landed,
        failed: summary.failed,
        injectedFailures: summary.injectedFailures,
        agentDecisions: summary.agentDecisions,
        agentRetries: summary.agentRetries,
        fallbackRetries: summary.fallbackRetries,
        blockhashExpiryRecovered: summary.blockhashExpiryRecovered,
        processedToConfirmedP50Ms: summary.latency.p50Ms,
        latencySamples: summary.latency.samples,
      },
      null,
      2,
    ),
  );

  console.log("\n=== LANDED (explorer-verifiable) ===");
  for (const r of summary.records.filter((x) => x.status === "landed")) {
    const tag = r.retryOf ? ` [retry of ${r.retryOf.slice(0, 10)} · ${r.agentDecisionId}]` : "";
    console.log(`  slot ${r.finalizedSlot ?? r.confirmedSlot} · ${r.tipLamports} lamports · ${r.explorer.solscan}${tag}`);
  }
  console.log("\n=== FAILED (induced / incidental) ===");
  for (const r of summary.records.filter((x) => x.status === "failed")) {
    console.log(
      `  ${r.failureClass}${r.injected ? ` (injected:${r.injectionType})` : ""} · bundle ${r.bundleId} · ${r.explorer.jitoBundle}`,
    );
  }

  // ── Phase 7 gate ────────────────────────────────────────────────────────────
  const checks: Array<[string, boolean]> = [
    ["≥10 submissions", summary.totalSubmissions >= 10],
    ["≥2 failures", summary.failed >= 2],
    ["≥1 blockhash-expiry detected→reasoned→re-landed by the agent", summary.blockhashExpiryRecovered],
    ["every retry cross-links to an agent decision (0 fallback retries)", summary.fallbackRetries === 0],
    ["≥1 agent decision recorded", summary.agentDecisions >= 1],
    ["≥1 landed bundle has an explorer-verifiable slot", summary.landed >= 1],
  ];
  console.log("\n=== PHASE 7 GATE ===");
  let allPass = true;
  for (const [label, ok] of checks) {
    console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}`);
    allPass = allPass && ok;
  }
  console.log(`\n${allPass ? "✅ CAPTURE GATE PASSED" : "❌ CAPTURE GATE FAILED"}`);
  console.log("artifacts: logs/lifecycle-log.jsonl · logs/agent-decisions.jsonl");
  process.exit(allPass ? 0 : 1);
}

main().catch((e) => {
  log(`fatal: ${String(e)}`);
  process.exit(1);
});
