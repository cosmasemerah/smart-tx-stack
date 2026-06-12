// Generates a burner wallet in solana-cli-compatible format (JSON array of 64
// secret-key bytes). Refuses to overwrite — an existing file may hold funds.
import { Keypair } from "@solana/web3.js";
import { chmodSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const outPath = resolve(process.argv[2] ?? "keys/burner.json");
if (existsSync(outPath)) {
  console.error(`Refusing to overwrite existing keypair at ${outPath}`);
  process.exit(1);
}

const keypair = Keypair.generate();
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(Array.from(keypair.secretKey)));
chmodSync(outPath, 0o600);

console.log(`keypair written to ${outPath}`);
console.log(`public address: ${keypair.publicKey.toBase58()}`);
