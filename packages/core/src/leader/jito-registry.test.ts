import { describe, expect, it, vi } from "vitest";
import { JitoValidatorRegistry } from "./jito-registry.js";

const payload = {
  validators: [
    { identity_account: "jitoOne", running_jito: true },
    { identity_account: "jitoTwo", running_jito: true },
    { identity_account: "plain", running_jito: false },
  ],
};

function registry(fetchImpl: typeof fetch) {
  return new JitoValidatorRegistry({ fetchImpl, url: "https://registry.test/validators" });
}

describe("JitoValidatorRegistry", () => {
  it("confirms a leader in the running_jito set", async () => {
    const r = registry(vi.fn(async () => ({ json: async () => payload }) as unknown as Response));
    expect(await r.check("jitoOne")).toEqual({ confirmed: true, method: "jito-validator-set" });
    expect(await r.check("plain")).toEqual({ confirmed: false, method: "jito-validator-set" });
    expect(r.size).toBe(2);
  });

  it("caches within TTL — one fetch across many checks", async () => {
    const fetchImpl = vi.fn(async () => ({ json: async () => payload }) as unknown as Response);
    const r = registry(fetchImpl);
    await r.check("jitoOne");
    await r.check("jitoTwo");
    await r.check("plain");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("reports registry-unavailable (never fabricates confirmed) on first-fetch failure", async () => {
    const r = registry(
      vi.fn(async () => {
        throw new Error("network down");
      }) as unknown as typeof fetch,
    );
    expect(await r.check("jitoOne")).toEqual({
      confirmed: false,
      method: "registry-unavailable",
    });
  });

  it("keeps serving a stale set after a later refresh fails", async () => {
    let call = 0;
    const fetchImpl = vi.fn(async () => {
      call += 1;
      if (call === 1) return { json: async () => payload } as unknown as Response;
      throw new Error("down");
    });
    const r = new JitoValidatorRegistry({
      fetchImpl: fetchImpl as unknown as typeof fetch,
      url: "https://registry.test/validators",
      ttlMs: 0, // force a refresh attempt on every check
    });
    expect((await r.check("jitoOne")).confirmed).toBe(true);
    // second check triggers a failing refresh but the stale set still answers
    expect((await r.check("jitoOne")).confirmed).toBe(true);
    expect((await r.check("jitoOne")).method).toBe("jito-validator-set");
  });
});
