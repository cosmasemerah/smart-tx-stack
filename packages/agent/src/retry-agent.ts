import type Anthropic from "@anthropic-ai/sdk";
import type { StackControlSurface } from "./control-surface.js";
import {
  type AgentDecisionLog,
  type AgentDecisionRecord,
  type AgentStep,
  type FinalAction,
} from "./decision-log.js";
import { RETRY_AGENT_TOOLS, dispatchTool } from "./tools.js";

const MODEL = "claude-opus-4-8";
const MAX_ROUNDS = 8;

const SYSTEM_PROMPT = `You are the autonomous retry operator for a Solana Jito bundle stack. A bundle has just failed to land. Your job is to decide — from real data, not assumptions — what to change before retrying, then act.

Work like this:
1. Call get_failure_context first to learn how it failed.
2. Investigate with get_tip_data (live tip-floor percentiles, in lamports) and get_slot_state (current slot, next Jito leader window, network-health latency, skip rate).
3. Reason about the ROOT CAUSE, then act:
   - expired_blockhash: the tip was probably fine; refresh_blockhash, keep a sensible tip, resubmit.
   - fee_too_low: the blockhash may still be valid; raise the tip toward a higher percentile from get_tip_data and resubmit (refresh the blockhash too if it is close to expiry).
   - compute_exceeded: a tip/blockhash change will NOT help (the transaction needs more compute units); abort_with_reason.
   - bundle_failure / unclear: use the data to decide — usually refresh the blockhash, set a competitive tip, and resubmit; consider holding for the next Jito window if one is imminent.

Rules:
- Choose the tip from get_tip_data percentiles — never a hardcoded guess. Balance landing probability against cost; do not overpay far beyond the contested percentiles.
- Always refresh the blockhash before resubmitting an expired one.
- If a resubmission does not land, you may reason again and retry with adjustments, but stop once it lands or once you conclude retrying is futile.
- Explain your reasoning concisely in text as you go — your decisions are reviewed.`;

export interface RetryAgentOptions {
  client: Anthropic;
  surface: StackControlSurface;
  log?: AgentDecisionLog;
  decisionId?: string;
  maxRounds?: number;
  now?: () => number;
}

export interface AgentDecision {
  decisionId: string;
  action: FinalAction;
  record: AgentDecisionRecord;
}

function makeDecisionId(now: number): string {
  return `dec_${now}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Run the autonomous retry agent over one failed bundle. Manual tool-use loop
 * (the documented pattern when every tool call must be intercepted and logged)
 * so the full reasoning + tool trace is captured to agent-decisions.jsonl.
 * The agent — not hardcoded logic — decides whether/when/how to retry.
 */
export async function runRetryAgent(opts: RetryAgentOptions): Promise<AgentDecision> {
  const now = opts.now ?? (() => Date.now());
  const decisionId = opts.decisionId ?? makeDecisionId(now());
  const maxRounds = opts.maxRounds ?? MAX_ROUNDS;

  const failureContext = await opts.surface.getFailureContext();
  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content:
        `Bundle ${failureContext.bundleId} failed (classified: ${failureContext.failureClass}). ` +
        `Investigate with the tools and decide what to change before retrying — or abort if retrying cannot help.`,
    },
  ];

  const trace: AgentStep[] = [];
  let finalAction: FinalAction = { kind: "exhausted" };
  let rounds = 0;
  let inputTokens = 0;
  let outputTokens = 0;

  while (rounds < maxRounds) {
    rounds += 1;
    const response = await opts.client.messages.create({
      model: MODEL,
      max_tokens: 16_000,
      thinking: { type: "adaptive", display: "summarized" },
      output_config: { effort: "high" },
      system: SYSTEM_PROMPT,
      tools: RETRY_AGENT_TOOLS,
      messages,
    });
    inputTokens += response.usage.input_tokens;
    outputTokens += response.usage.output_tokens;

    for (const block of response.content) {
      if (block.type === "thinking") trace.push({ type: "thinking", text: block.thinking });
      else if (block.type === "text") trace.push({ type: "text", text: block.text });
    }
    // Preserve full content (incl. thinking blocks w/ signatures) for the loop.
    messages.push({ role: "assistant", content: response.content });

    if (response.stop_reason !== "tool_use") break; // end_turn — agent is done

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of response.content) {
      if (block.type !== "tool_use") continue;
      const input = (block.input ?? {}) as Record<string, unknown>;
      trace.push({ type: "tool_call", name: block.name, input });
      let result;
      try {
        result = await dispatchTool(opts.surface, block.name, input);
      } catch (error) {
        result = { content: JSON.stringify({ error: String(error) }) };
      }
      trace.push({ type: "tool_result", name: block.name, content: result.content });
      toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result.content });
      if (result.terminal !== undefined) finalAction = result.terminal;
    }
    messages.push({ role: "user", content: toolResults });

    // Stop on a terminal outcome: abort, or a resubmission that landed. A
    // resubmission that did NOT land lets the agent reason again (bounded).
    if (finalAction.kind === "aborted") break;
    if (finalAction.kind === "resubmitted" && finalAction.landed) break;
  }

  const record: AgentDecisionRecord = {
    schemaVersion: 1,
    decisionId,
    createdAt: new Date(now()).toISOString(),
    model: MODEL,
    failureContext,
    trace,
    finalAction,
    rounds,
    usage: { inputTokens, outputTokens },
  };
  opts.log?.append(record);
  return { decisionId, action: finalAction, record };
}
