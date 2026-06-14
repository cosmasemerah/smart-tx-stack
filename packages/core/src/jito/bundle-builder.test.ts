import { Keypair, PublicKey, VersionedTransaction } from "@solana/web3.js";
import bs58 from "bs58";
import { describe, expect, it } from "vitest";
import { buildTipBundle, pickTipAccount } from "./bundle-builder.js";

const TIP_ACCOUNT = "96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5";

function params(overrides = {}) {
  const payer = Keypair.generate();
  return {
    payer,
    blockhash: Keypair.generate().publicKey.toBase58(), // 32-byte base58 stand-in
    lastValidBlockHeight: 404_000_000,
    tipAccount: TIP_ACCOUNT,
    tipLamports: 25_000n,
    cuLimit: 1_000,
    cuPriceMicroLamports: 10_000n,
    ...overrides,
  };
}

describe("buildTipBundle", () => {
  it("builds a signed single tx with CU budget + action + tip", () => {
    const b = buildTipBundle(params());
    expect(b.transaction.message.compiledInstructions).toHaveLength(4);
    expect(b.signature).toHaveLength(88); // base58 of a 64-byte sig
    expect(b.tipLamports).toBe(25_000n);
    expect(b.tipAccount).toBe(TIP_ACCOUNT);
  });

  it("produces base64 that round-trips to the same signature", () => {
    const b = buildTipBundle(params());
    const decoded = VersionedTransaction.deserialize(Buffer.from(b.base64, "base64"));
    expect(bs58.encode(decoded.signatures[0]!)).toBe(b.signature);
  });

  it("includes the tip account in the transaction's static keys", () => {
    const b = buildTipBundle(params());
    const keys = b.transaction.message.staticAccountKeys.map((k) => k.toBase58());
    expect(keys).toContain(TIP_ACCOUNT);
  });

  it("carries the tip transfer to the tip account for the right lamports", () => {
    const b = buildTipBundle(params({ tipLamports: 42_000n }));
    const keys = b.transaction.message.staticAccountKeys;
    const tipIdx = keys.findIndex((k) => k.equals(new PublicKey(TIP_ACCOUNT)));
    // last instruction is the tip transfer; its accounts reference the tip index
    const tipIx = b.transaction.message.compiledInstructions.at(-1)!;
    expect(tipIx.accountKeyIndexes).toContain(tipIdx);
    // SystemProgram transfer layout: 4-byte instruction index (2) + 8-byte LE lamports
    const lamports = Buffer.from(tipIx.data).readBigUInt64LE(4);
    expect(lamports).toBe(42_000n);
  });

  it("rejects a non-positive tip", () => {
    expect(() => buildTipBundle(params({ tipLamports: 0n }))).toThrow(/positive/);
  });
});

describe("pickTipAccount", () => {
  const accounts = ["a", "b", "c"];
  it("rotates by index", () => {
    expect(pickTipAccount(accounts, 0)).toBe("a");
    expect(pickTipAccount(accounts, 1)).toBe("b");
    expect(pickTipAccount(accounts, 4)).toBe("b");
  });
  it("handles negative rotation", () => {
    expect(pickTipAccount(accounts, -1)).toBe("c");
  });
  it("throws on empty list", () => {
    expect(() => pickTipAccount([], 0)).toThrow();
  });
});
