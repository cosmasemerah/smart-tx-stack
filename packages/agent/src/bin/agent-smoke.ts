// Live Phase 5 verification: runs the retry agent against the REAL Claude API
// with a SIMULATED control surface (canned failure + market data). Proves the
// live model investigates and produces a reasoned retry decision — no SOL spent
// (resubmitBundle is simulated). Writes the trace to logs/agent-decisions.jsonl.
import Anthropic from "@anthropic-ai/sdk";
import { loadDotEnv } from "@smart-tx-stack/core";
import type { ResubmitInput, StackControlSurface } from "../control-surface.js";
import { AgentDecisionLog } from "../decision-log.js";
import { runRetryAgent } from "../retry-agent.js";

loadDotEnv();
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY not set (.env)");
  process.exit(2);
}

const log = (l: string) => console.log(`${new Date().toISOString()} ${l}`);

// Simulated stack: an expired-blockhash failure with realistic live tip data.
// resubmitBundle just reports success — the point is the model's reasoning.
const surface: StackControlSurface = {
  async getFailureContext() {
    log("tool→ get_failure_context");
    return {
      bundleId: "sim-bundle-1",
      signature: "SimSig11111111111111111111111111111111111111",
      failureClass: "expired_blockhash",
      tipLamports: "5000",
      blockhash: "StaleBlockhash1111111111111111111111111111111",
      lastValidBlockHeight: 404_000_000,
      cuLimit: 1000,
      lastBundleStatus: "Invalid",
      attemptsSoFar: 1,
    };
  },
  async getTipData() {
    log("tool→ get_tip_data");
    return { p25: "1114", p50: "5280", p75: "20084", p95: "100000", p99: "500000", emaP50: "3767", observedAt: new Date().toISOString() };
  },
  async getSlotState() {
    log("tool→ get_slot_state");
    return { currentSlot: 404_000_120, nextJitoLeaderSlot: 404_000_124, slotsUntilJitoLeader: 4, jitoLeaderConfirmed: true, processedToConfirmedP50Ms: 130, recentSkipRate: 0.02 };
  },
  async refreshBlockhash() {
    log("tool→ refresh_blockhash");
    return { blockhash: "FreshBlockhash2222222222222222222222222222222", lastValidBlockHeight: 404_000_270 };
  },
  async resubmitBundle(input: ResubmitInput) {
    log(`tool→ resubmit_bundle tip=${input.tipLamports} timing=${input.timing} (SIMULATED land)`);
    return { bundleId: "sim-bundle-2", signature: "SimSig22222222222222222222222222222222222222", tipLamports: input.tipLamports.toString(), landed: true, landedSlot: 404_000_125 };
  },
  async abort(reason: string) {
    log(`tool→ abort: ${reason}`);
  },
};

const client = new Anthropic();
const decision = await runRetryAgent({ client, surface, log: new AgentDecisionLog() });

console.log("\n=== AGENT REASONING TRACE ===");
for (const step of decision.record.trace) {
  if (step.type === "thinking") console.log(`[thinking] ${step.text}`);
  else if (step.type === "text") console.log(`[say] ${step.text}`);
  else if (step.type === "tool_call") console.log(`[call] ${step.name}(${JSON.stringify(step.input)})`);
  else console.log(`[result] ${step.name} → ${step.content.slice(0, 120)}`);
}
console.log("\n=== DECISION ===", JSON.stringify(decision.action, (_k, v) => (typeof v === "bigint" ? v.toString() : v)));
console.log(`rounds=${decision.record.rounds} tokens=${decision.record.usage.inputTokens}in/${decision.record.usage.outputTokens}out`);
process.exit(decision.action.kind === "resubmitted" && decision.action.landed ? 0 : 1);
