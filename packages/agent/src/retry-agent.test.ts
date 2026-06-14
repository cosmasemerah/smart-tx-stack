import type Anthropic from "@anthropic-ai/sdk";
import { describe, expect, it, vi } from "vitest";
import type { ResubmitInput, StackControlSurface } from "./control-surface.js";
import { runRetryAgent } from "./retry-agent.js";

// Minimal scripted Claude client: each create() returns the next queued message.
function scriptedClient(responses: Array<Partial<Anthropic.Message>>) {
  const calls: unknown[] = [];
  let i = 0;
  const client = {
    messages: {
      create: vi.fn(async (params: unknown) => {
        calls.push(params);
        const r = responses[Math.min(i++, responses.length - 1)] ?? {};
        return {
          content: r.content ?? [],
          stop_reason: r.stop_reason ?? "end_turn",
          usage: r.usage ?? { input_tokens: 10, output_tokens: 5 },
        };
      }),
    },
  };
  return { client: client as unknown as Anthropic, calls };
}

const toolUse = (id: string, name: string, input: unknown) =>
  ({ type: "tool_use", id, name, input }) as unknown as Anthropic.ContentBlock;
const thinking = (text: string) =>
  ({ type: "thinking", thinking: text, signature: "sig" }) as unknown as Anthropic.ContentBlock;
const text = (t: string) => ({ type: "text", text: t }) as unknown as Anthropic.ContentBlock;

function surfaceMock(over: Partial<StackControlSurface> = {}): StackControlSurface {
  return {
    getFailureContext: vi.fn(async () => ({
      bundleId: "b1", signature: "sig1", failureClass: "expired_blockhash" as const,
      tipLamports: "5000", blockhash: "bh", lastValidBlockHeight: 1000, attemptsSoFar: 1,
    })),
    getTipData: vi.fn(async () => ({
      p25: "1000", p50: "5000", p75: "20000", p95: "100000", p99: "500000", emaP50: "4000", observedAt: "t",
    })),
    getSlotState: vi.fn(async () => ({ currentSlot: 100, jitoLeaderConfirmed: true })),
    refreshBlockhash: vi.fn(async () => ({ blockhash: "bh2", lastValidBlockHeight: 1200 })),
    resubmitBundle: vi.fn(async (input: ResubmitInput) => ({
      bundleId: "b2", signature: "sig2", tipLamports: input.tipLamports.toString(), landed: true, landedSlot: 1150,
    })),
    abort: vi.fn(async () => {}),
    ...over,
  };
}

describe("runRetryAgent", () => {
  it("drives an expired-blockhash recovery: investigate → refresh → resubmit (landed)", async () => {
    const { client, calls } = scriptedClient([
      { stop_reason: "tool_use", content: [thinking("blockhash likely expired"), text("Let me check."), toolUse("t1", "get_failure_context", {})] },
      { stop_reason: "tool_use", content: [toolUse("t2", "refresh_blockhash", {})] },
      { stop_reason: "tool_use", content: [text("Tip ~p50, fresh blockhash."), toolUse("t3", "resubmit_bundle", { tip_lamports: 5000, timing: "now", reasoning: "expiry, tip fine" })] },
    ]);
    const surface = surfaceMock();
    const decision = await runRetryAgent({ client, surface });

    expect(decision.action).toMatchObject({ kind: "resubmitted", landed: true, tipLamports: 5000n });
    expect(surface.refreshBlockhash).toHaveBeenCalledOnce();
    expect(surface.resubmitBundle).toHaveBeenCalledWith({ tipLamports: 5000n, timing: "now" });
    // visible reasoning captured
    expect(decision.record.trace.some((s) => s.type === "thinking")).toBe(true);
    expect(decision.record.trace.some((s) => s.type === "tool_call")).toBe(true);
    // correct model + adaptive thinking + tools were requested
    const firstCall = calls[0] as { model: string; thinking: { type: string }; tools: unknown[] };
    expect(firstCall.model).toBe("claude-opus-4-8");
    expect(firstCall.thinking.type).toBe("adaptive");
    expect(firstCall.tools).toHaveLength(6);
  });

  it("aborts on compute_exceeded without resubmitting", async () => {
    const { client } = scriptedClient([
      { stop_reason: "tool_use", content: [toolUse("t1", "get_failure_context", {})] },
      { stop_reason: "tool_use", content: [text("Compute error — a retry can't fix this."), toolUse("t2", "abort_with_reason", { reason: "compute units exceeded; needs higher CU limit, not a retry" })] },
    ]);
    const surface = surfaceMock({
      getFailureContext: vi.fn(async () => ({
        bundleId: "b1", signature: "sig1", failureClass: "compute_exceeded" as const,
        tipLamports: "5000", blockhash: "bh", lastValidBlockHeight: 1000,
        simulationError: "exceeded CUs meter", attemptsSoFar: 1,
      })),
    });
    const decision = await runRetryAgent({ client, surface });

    expect(decision.action).toMatchObject({ kind: "aborted" });
    expect(surface.resubmitBundle).not.toHaveBeenCalled();
    expect(surface.abort).toHaveBeenCalledOnce();
  });

  it("retries after a non-landing resubmit, then stops when it lands", async () => {
    let attempt = 0;
    const surface = surfaceMock({
      resubmitBundle: vi.fn(async (input: ResubmitInput) => {
        attempt += 1;
        return {
          bundleId: `b${attempt}`, signature: `sig${attempt}`,
          tipLamports: input.tipLamports.toString(),
          landed: attempt >= 2, // first resubmit fails, second lands
          landedSlot: attempt >= 2 ? 1150 : undefined,
        };
      }),
    });
    const { client } = scriptedClient([
      { stop_reason: "tool_use", content: [toolUse("t1", "resubmit_bundle", { tip_lamports: 5000, timing: "now", reasoning: "first try" })] },
      { stop_reason: "tool_use", content: [text("Did not land — raise tip."), toolUse("t2", "resubmit_bundle", { tip_lamports: 50000, timing: "now", reasoning: "bump to p95" })] },
    ]);
    const decision = await runRetryAgent({ client, surface });

    expect(surface.resubmitBundle).toHaveBeenCalledTimes(2);
    expect(decision.action).toMatchObject({ kind: "resubmitted", landed: true, tipLamports: 50000n });
  });

  it("appends the decision to the log when provided", async () => {
    const appended: unknown[] = [];
    const log = { append: (r: unknown) => appended.push(r) };
    const { client } = scriptedClient([
      { stop_reason: "tool_use", content: [toolUse("t1", "abort_with_reason", { reason: "x" })] },
    ]);
    await runRetryAgent({ client, surface: surfaceMock(), log: log as never, decisionId: "dec_test" });
    expect(appended).toHaveLength(1);
    expect((appended[0] as { decisionId: string }).decisionId).toBe("dec_test");
  });
});
