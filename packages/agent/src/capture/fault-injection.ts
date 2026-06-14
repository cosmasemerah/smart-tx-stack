import type { Connection, VersionedTransaction } from "@solana/web3.js";

/**
 * Deterministic fault injection for the capture run — guarantees the bounty's
 * required ≥2 failures with two unambiguous root causes:
 *
 *  - "stale-blockhash": submit with a blockhash whose validity window has
 *    already elapsed. Achieved by the orchestrator holding a blockhash until the
 *    streamed block height passes its lastValidBlockHeight, then submitting — the
 *    bundle genuinely cannot land, and the lifecycle tracker classifies it as
 *    expired_blockhash (the case the AI agent must detect and recover by
 *    refreshing the blockhash). See orchestrator.waitForBlockhashExpiry.
 *
 *  - "cu-starved": build the action transaction with a compute-unit limit far
 *    below what it needs. Simulation surfaces ComputationalBudgetExceeded, which
 *    is recorded as the submission's simulationError so the tracker classifies
 *    the eventual non-landing as compute_exceeded — a fault no retry can fix, so
 *    the agent should reason its way to an abort rather than a resubmission.
 */
export type InjectionType = "stale-blockhash" | "cu-starved";

/** A CU limit deliberately below the demo transaction's need. A V0 message with
 * two ComputeBudget ixs + two SystemProgram transfers simulates well above this,
 * so 200 reliably trips ComputationalBudgetExceeded. */
export const STARVED_CU_LIMIT = 200;

/** Comfortable CU limit for normal (intended-to-land) bundles. */
export const NORMAL_CU_LIMIT = 1_000;

/**
 * Simulate a built transaction and, if it failed, return a descriptive error
 * string to record as the submission's simulationError — preferring the runtime
 * log line that names a compute-budget *exceedance* (e.g. "...exceeded CUs
 * meter..."), and falling back to the structured InstructionError JSON. Uses
 * replaceRecentBlockhash so a stale blockhash can never mask the compute verdict
 * — the only thing under test here is the CU limit. Returns undefined only when
 * the simulation succeeded. The caller decides compute-ness (the lifecycle
 * classifier keys on /compute|CUs|budget/i) and supplies a fallback.
 */
export async function detectComputeError(
  connection: Connection,
  transaction: VersionedTransaction,
): Promise<string | undefined> {
  const sim = await connection.simulateTransaction(transaction, {
    sigVerify: false,
    replaceRecentBlockhash: true,
    commitment: "processed",
  });
  const err = sim.value.err;
  if (err === null || err === undefined) return undefined;

  const logs = sim.value.logs ?? [];
  const errStr = typeof err === "string" ? err : JSON.stringify(err);
  // The canonical CU-exhaustion line says it *exceeded* a compute resource —
  // this skips benign "Program ComputeBudget111... success" lines.
  const exceededLine = logs.find(
    (l: string) => /exceeded/i.test(l) && /compute|CUs|budget|units/i.test(l),
  );
  return exceededLine ?? errStr;
}
