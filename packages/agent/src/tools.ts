import type { StackControlSurface } from "./control-surface.js";

/** Anthropic tool schema (name + description + JSON-schema input). */
export interface ToolDef {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required: string[];
    additionalProperties: false;
  };
}

export const RETRY_AGENT_TOOLS: ToolDef[] = [
  {
    name: "get_failure_context",
    description:
      "Return the failed bundle's lifecycle record: failure classification, tip (lamports), blockhash, lastValidBlockHeight, compute limit, any simulation error, last Jito bundle status, and attempts so far. Call this first.",
    input_schema: { type: "object", properties: {}, required: [], additionalProperties: false },
  },
  {
    name: "get_tip_data",
    description:
      "Return current Jito tip-floor percentiles (p25/p50/p75/p95/p99 and the EMA of p50), all in integer lamports. Use this to choose a competitive but cost-aware tip — do not invent a number.",
    input_schema: { type: "object", properties: {}, required: [], additionalProperties: false },
  },
  {
    name: "get_slot_state",
    description:
      "Return current slot, the next confirmed Jito leader window and how many slots away it is, the recent processed→confirmed latency (ms) as a network-health signal, and recent skip rate. Use this to judge timing and congestion.",
    input_schema: { type: "object", properties: {}, required: [], additionalProperties: false },
  },
  {
    name: "refresh_blockhash",
    description:
      "Fetch a fresh recent blockhash and its lastValidBlockHeight. Required before resubmitting if the failure was an expired blockhash.",
    input_schema: { type: "object", properties: {}, required: [], additionalProperties: false },
  },
  {
    name: "resubmit_bundle",
    description:
      "Resubmit the bundle with your chosen tip and timing. Refresh the blockhash first if it expired. This rebuilds the bundle with the latest blockhash, applies your tip, submits, and reports whether it landed.",
    input_schema: {
      type: "object",
      properties: {
        tip_lamports: {
          type: "integer",
          minimum: 1000,
          description: "Tip in integer lamports (Jito minimum is 1000). Base this on get_tip_data.",
        },
        timing: {
          type: "string",
          enum: ["now", "next-jito-window"],
          description: "Submit immediately, or hold for the next confirmed Jito leader window.",
        },
        reasoning: {
          type: "string",
          description: "One sentence: why this tip and timing, given the failure and live data.",
        },
      },
      required: ["tip_lamports", "timing", "reasoning"],
      additionalProperties: false,
    },
  },
  {
    name: "abort_with_reason",
    description:
      "Give up on this bundle without resubmitting. Use when retrying cannot help (e.g. a deterministic compute error that a tip/blockhash change won't fix).",
    input_schema: {
      type: "object",
      properties: {
        reason: { type: "string", description: "Why retrying won't help." },
      },
      required: ["reason"],
      additionalProperties: false,
    },
  },
];

export type TerminalAction =
  | { kind: "resubmitted"; tipLamports: bigint; timing: string; landed: boolean; landedSlot?: number; signature: string; bundleId: string }
  | { kind: "aborted"; reason: string };

export interface ToolCallResult {
  /** JSON string returned to the model as the tool_result content */
  content: string;
  /** set when this tool call concludes the agent's decision */
  terminal?: TerminalAction;
}

/** Parse an agent-supplied lamport value as a non-negative integer bigint —
 * the float→integer money boundary. Rejects non-integers and out-of-range. */
function toLamports(value: unknown): bigint {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n) || n < 0 || n > Number.MAX_SAFE_INTEGER) {
    throw new RangeError(`tip_lamports must be a non-negative integer: ${String(value)}`);
  }
  return BigInt(n);
}

/**
 * Execute one tool call against the control surface and return the result the
 * model should see. The two terminal tools (resubmit/abort) also surface a
 * TerminalAction so the loop can record the decision.
 */
export async function dispatchTool(
  surface: StackControlSurface,
  name: string,
  input: Record<string, unknown>,
): Promise<ToolCallResult> {
  switch (name) {
    case "get_failure_context":
      return { content: JSON.stringify(await surface.getFailureContext()) };
    case "get_tip_data":
      return { content: JSON.stringify(await surface.getTipData()) };
    case "get_slot_state":
      return { content: JSON.stringify(await surface.getSlotState()) };
    case "refresh_blockhash":
      return { content: JSON.stringify(await surface.refreshBlockhash()) };
    case "resubmit_bundle": {
      const tipLamports = toLamports(input.tip_lamports);
      const timing = input.timing === "next-jito-window" ? "next-jito-window" : "now";
      const outcome = await surface.resubmitBundle({ tipLamports, timing });
      return {
        content: JSON.stringify(outcome),
        terminal: {
          kind: "resubmitted",
          tipLamports,
          timing,
          landed: outcome.landed,
          landedSlot: outcome.landedSlot,
          signature: outcome.signature,
          bundleId: outcome.bundleId,
        },
      };
    }
    case "abort_with_reason": {
      const reason = String(input.reason ?? "");
      await surface.abort(reason);
      return { content: JSON.stringify({ aborted: true, reason }), terminal: { kind: "aborted", reason } };
    }
    default:
      return { content: JSON.stringify({ error: `unknown tool: ${name}` }) };
  }
}
