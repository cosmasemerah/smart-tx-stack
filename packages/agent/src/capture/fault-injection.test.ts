import { describe, expect, it } from "vitest";
import { detectComputeError } from "./fault-injection.js";

type Conn = Parameters<typeof detectComputeError>[0];
type Tx = Parameters<typeof detectComputeError>[1];

const fakeTx = {} as Tx;

function conn(value: { err: unknown; logs?: string[] }): Conn {
  return {
    simulateTransaction: async () => ({ context: { slot: 1 }, value }),
  } as unknown as Conn;
}

describe("detectComputeError", () => {
  it("returns the runtime compute-budget log line when CUs are exceeded", async () => {
    const result = await detectComputeError(
      conn({
        err: { InstructionError: [2, "ComputationalBudgetExceeded"] },
        logs: [
          "Program ComputeBudget111... success",
          "Program 11111111... consumed 200 of 200 compute units",
          "Program 11111111... failed: exceeded CUs meter",
        ],
      }),
      fakeTx,
    );
    expect(result).toBe("Program 11111111... failed: exceeded CUs meter");
    // and it must match the lifecycle classifier's compute regex
    expect(/compute|CUs|budget/i.test(result!)).toBe(true);
  });

  it("falls back to the structured error when no log line carries the keyword", async () => {
    const result = await detectComputeError(
      conn({ err: { InstructionError: [1, "ComputationalBudgetExceeded"] }, logs: [] }),
      fakeTx,
    );
    expect(result).toContain("ComputationalBudgetExceeded");
    expect(/budget/i.test(result!)).toBe(true);
  });

  it("returns undefined when the simulation has no error", async () => {
    expect(await detectComputeError(conn({ err: null, logs: ["ok"] }), fakeTx)).toBeUndefined();
  });

  it("still surfaces a non-compute error string (recorded, not classified as compute)", async () => {
    const result = await detectComputeError(conn({ err: "BlockhashNotFound", logs: [] }), fakeTx);
    expect(result).toBe("BlockhashNotFound");
    expect(/compute|CUs|budget/i.test(result!)).toBe(false);
  });
});
