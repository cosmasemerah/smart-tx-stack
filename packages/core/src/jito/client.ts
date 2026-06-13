export class JitoRpcError extends Error {
  constructor(
    readonly method: string,
    readonly code: number,
    message: string,
  ) {
    super(`${method}: ${code} ${message}`);
    this.name = "JitoRpcError";
  }
}

export class JitoRateLimitError extends Error {
  constructor(readonly method: string) {
    super(`${method}: rate limited (429) after retry`);
    this.name = "JitoRateLimitError";
  }
}

export type InflightStatus = "Invalid" | "Pending" | "Failed" | "Landed";

export interface InflightBundleStatus {
  bundleId: string;
  status: InflightStatus;
  landedSlot?: number;
}

export interface LandedBundleStatus {
  bundleId: string;
  transactions: string[];
  slot: number;
  confirmationStatus: "processed" | "confirmed" | "finalized";
  err: unknown;
}

/** Status methods wrap results in a context/value envelope; tolerate both. */
type Enveloped<T> = { context?: { slot: number }; value: T } | T;

function unwrap<T>(raw: Enveloped<T>): T {
  return typeof raw === "object" && raw !== null && "value" in (raw as object)
    ? (raw as { value: T }).value
    : (raw as T);
}

export interface JitoClientOptions {
  blockEngineUrl: string;
  /** Floor between requests — Jito's default limit is 1 req/s per IP per region. */
  minRequestIntervalMs?: number;
  fetchImpl?: typeof fetch;
  log?: (line: string) => void;
}

const MAX_BUNDLE_TXS = 5;
const MAX_STATUS_IDS = 5;

/**
 * Jito block-engine JSON-RPC over fetch. Endpoint paths are per-method
 * (verified against docs.jito.wtf 2026-06-12): sendBundle posts to
 * /api/v1/bundles, each status/tip method to /api/v1/<method>.
 * All calls share one token bucket so the per-IP limit is never exceeded
 * regardless of caller concurrency; one internal retry on 429.
 */
export class JitoClient {
  private nextAllowedAt = 0;

  constructor(private readonly options: JitoClientOptions) {}

  async sendBundle(base64Txs: string[]): Promise<string> {
    if (base64Txs.length < 1 || base64Txs.length > MAX_BUNDLE_TXS) {
      throw new RangeError(`sendBundle: bundle must have 1-${MAX_BUNDLE_TXS} txs`);
    }
    return this.rpc<string>("/api/v1/bundles", "sendBundle", [
      base64Txs,
      { encoding: "base64" },
    ]);
  }

  async getTipAccounts(): Promise<string[]> {
    return this.rpc<string[]>("/api/v1/getTipAccounts", "getTipAccounts", []);
  }

  async getInflightBundleStatuses(bundleIds: string[]): Promise<InflightBundleStatus[]> {
    this.assertIdCount("getInflightBundleStatuses", bundleIds);
    const raw = await this.rpc<
      Enveloped<Array<{ bundle_id: string; status: InflightStatus; landed_slot: number | null }>>
    >("/api/v1/getInflightBundleStatuses", "getInflightBundleStatuses", [bundleIds]);
    return unwrap(raw).map((entry) => ({
      bundleId: entry.bundle_id,
      status: entry.status,
      landedSlot: entry.landed_slot ?? undefined,
    }));
  }

  async getBundleStatuses(bundleIds: string[]): Promise<LandedBundleStatus[]> {
    this.assertIdCount("getBundleStatuses", bundleIds);
    const raw = await this.rpc<
      Enveloped<
        Array<{
          bundle_id: string;
          transactions: string[];
          slot: number;
          confirmation_status: "processed" | "confirmed" | "finalized";
          err: unknown;
        } | null>
      >
    >("/api/v1/getBundleStatuses", "getBundleStatuses", [bundleIds]);
    return unwrap(raw)
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
      .map((entry) => ({
        bundleId: entry.bundle_id,
        transactions: entry.transactions,
        slot: entry.slot,
        confirmationStatus: entry.confirmation_status,
        err: entry.err,
      }));
  }

  private assertIdCount(method: string, ids: string[]): void {
    if (ids.length < 1 || ids.length > MAX_STATUS_IDS) {
      throw new RangeError(`${method}: 1-${MAX_STATUS_IDS} bundle ids per call`);
    }
  }

  /** Single shared token bucket; sync reservation makes it concurrency-safe. */
  private async throttle(): Promise<void> {
    const interval = this.options.minRequestIntervalMs ?? 1_100;
    const now = Date.now();
    const startAt = Math.max(now, this.nextAllowedAt);
    this.nextAllowedAt = startAt + interval;
    if (startAt > now) {
      await new Promise((resolve) => setTimeout(resolve, startAt - now));
    }
  }

  private async rpc<T>(path: string, method: string, params: unknown[]): Promise<T> {
    const fetchImpl = this.options.fetchImpl ?? fetch;
    const url = `${this.options.blockEngineUrl}${path}`;
    const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method, params });

    for (let attempt = 0; attempt < 2; attempt += 1) {
      await this.throttle();
      const response = await fetchImpl(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      });

      if (response.status === 429) {
        if (attempt === 0) {
          const retryAfter = Number(response.headers.get("retry-after"));
          const delay = Number.isFinite(retryAfter) && retryAfter > 0
            ? Math.min(retryAfter * 1_000, 5_000)
            : 1_200;
          this.options.log?.(`[jito] ${method} 429 — retrying in ${delay}ms`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        throw new JitoRateLimitError(method);
      }

      const payload = (await response.json()) as {
        result?: T;
        error?: { code: number; message: string };
      };
      if (payload.error !== undefined) {
        throw new JitoRpcError(method, payload.error.code, payload.error.message);
      }
      return payload.result as T;
    }
    throw new JitoRateLimitError(method);
  }
}
