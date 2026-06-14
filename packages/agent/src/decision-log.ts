import { JsonlWriter } from "@smart-tx-stack/core";
import type { FailureContext } from "./control-surface.js";
import type { TerminalAction } from "./tools.js";

/** One step in the agent's visible reasoning trace. */
export type AgentStep =
  | { type: "thinking"; text: string }
  | { type: "text"; text: string }
  | { type: "tool_call"; name: string; input: unknown }
  | { type: "tool_result"; name: string; content: string };

export type FinalAction = TerminalAction | { kind: "exhausted" };

/**
 * One agent decision, written to agent-decisions.jsonl. This is the bounty's
 * "reasoning is visible / not sequential automation" evidence, and the
 * cross-link target for lifecycle-log `agentDecisionId` (every agent-driven
 * retry resolves here).
 */
export interface AgentDecisionRecord {
  schemaVersion: 1;
  decisionId: string;
  createdAt: string;
  model: string;
  failureContext: FailureContext;
  /** ordered reasoning + tool trace */
  trace: AgentStep[];
  finalAction: FinalAction;
  rounds: number;
  usage: { inputTokens: number; outputTokens: number };
}

export class AgentDecisionLog {
  private readonly writer: JsonlWriter;
  constructor(filePath = "logs/agent-decisions.jsonl") {
    this.writer = new JsonlWriter(filePath);
  }
  append(record: AgentDecisionRecord): void {
    this.writer.append(record);
  }
}
