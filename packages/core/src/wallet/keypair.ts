import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { Keypair } from "@solana/web3.js";

/** Load a solana-cli-format keypair (JSON array of 64 secret-key bytes).
 * Resolves a relative path against cwd first, then the workspace root —
 * package scripts run with cwd=packages/<name> while keys/ is at the root. */
export function loadKeypair(path: string): Keypair {
  const candidates = isAbsolute(path)
    ? [path]
    : [resolve(path), resolve("../..", path)];
  const found = candidates.find((p) => existsSync(p));
  if (found === undefined) {
    throw new Error(`keypair not found at any of: ${candidates.join(", ")}`);
  }
  const bytes = JSON.parse(readFileSync(found, "utf8")) as number[];
  if (!Array.isArray(bytes) || bytes.length !== 64) {
    throw new Error(`invalid keypair file ${found}: expected 64-byte secret key array`);
  }
  return Keypair.fromSecretKey(Uint8Array.from(bytes));
}
