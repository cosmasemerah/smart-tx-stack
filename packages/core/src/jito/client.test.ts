import { describe, expect, it, vi } from "vitest";
import { JitoClient, JitoRateLimitError, JitoRpcError } from "./client.js";

function mockFetch(handler: (url: string, body: unknown) => unknown, status = 200): typeof fetch {
  return vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body));
    return {
      status,
      headers: new Map<string, string>() as unknown as Headers,
      json: async () => handler(String(input), body),
    } as unknown as Response;
  }) as unknown as typeof fetch;
}

function client(fetchImpl: typeof fetch) {
  return new JitoClient({
    blockEngineUrl: "https://mainnet.block-engine.jito.wtf",
    minRequestIntervalMs: 0, // disable throttle delay in tests
    fetchImpl,
  });
}

describe("JitoClient", () => {
  it("sends a bundle to /api/v1/bundles with the base64 encoding param", async () => {
    let seenUrl = "";
    let seenParams: unknown;
    const fetchImpl = mockFetch((url, body) => {
      seenUrl = url;
      seenParams = (body as { params: unknown }).params;
      return { jsonrpc: "2.0", id: 1, result: "bundle-xyz" };
    });
    const id = await client(fetchImpl).sendBundle(["dHg="]);
    expect(id).toBe("bundle-xyz");
    expect(seenUrl).toBe("https://mainnet.block-engine.jito.wtf/api/v1/bundles");
    expect(seenParams).toEqual([["dHg="], { encoding: "base64" }]);
  });

  it("rejects bundles outside 1-5 transactions", async () => {
    const c = client(mockFetch(() => ({ result: "x" })));
    await expect(c.sendBundle([])).rejects.toThrow(/1-5/);
    await expect(c.sendBundle(new Array(6).fill("dHg="))).rejects.toThrow(/1-5/);
  });

  it("maps getInflightBundleStatuses snake_case + landed_slot null", async () => {
    const fetchImpl = mockFetch(() => ({
      result: {
        context: { slot: 100 },
        value: [
          { bundle_id: "a", status: "Landed", landed_slot: 426000000 },
          { bundle_id: "b", status: "Invalid", landed_slot: null },
        ],
      },
    }));
    const out = await client(fetchImpl).getInflightBundleStatuses(["a", "b"]);
    expect(out).toEqual([
      { bundleId: "a", status: "Landed", landedSlot: 426000000 },
      { bundleId: "b", status: "Invalid", landedSlot: undefined },
    ]);
  });

  it("unwraps getBundleStatuses and drops null entries", async () => {
    const fetchImpl = mockFetch(() => ({
      result: {
        value: [
          {
            bundle_id: "a",
            transactions: ["sig1"],
            slot: 426000001,
            confirmation_status: "confirmed",
            err: null,
          },
          null,
        ],
      },
    }));
    const out = await client(fetchImpl).getBundleStatuses(["a", "z"]);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ bundleId: "a", confirmationStatus: "confirmed" });
  });

  it("retries once on 429 then throws JitoRateLimitError", async () => {
    let calls = 0;
    const fetchImpl = vi.fn(async () => {
      calls += 1;
      return {
        status: 429,
        headers: new Map([["retry-after", "0"]]) as unknown as Headers,
        json: async () => ({}),
      } as unknown as Response;
    });
    const c = new JitoClient({
      blockEngineUrl: "https://mainnet.block-engine.jito.wtf",
      minRequestIntervalMs: 0,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    await expect(c.getTipAccounts()).rejects.toBeInstanceOf(JitoRateLimitError);
    expect(calls).toBe(2);
  });

  it("surfaces JSON-RPC errors as JitoRpcError", async () => {
    const fetchImpl = mockFetch(() => ({ error: { code: -32602, message: "bad params" } }));
    await expect(client(fetchImpl).getTipAccounts()).rejects.toBeInstanceOf(JitoRpcError);
  });

  it("serializes concurrent calls through one token bucket", async () => {
    const times: number[] = [];
    const fetchImpl = mockFetch(() => {
      times.push(Date.now());
      return { result: [] };
    });
    const c = new JitoClient({
      blockEngineUrl: "https://mainnet.block-engine.jito.wtf",
      minRequestIntervalMs: 40,
      fetchImpl,
    });
    await Promise.all([c.getTipAccounts(), c.getTipAccounts(), c.getTipAccounts()]);
    expect(times).toHaveLength(3);
    // second and third are spaced by ~the interval, proving the shared bucket
    expect(times[1]! - times[0]!).toBeGreaterThanOrEqual(30);
    expect(times[2]! - times[1]!).toBeGreaterThanOrEqual(30);
  });
});
