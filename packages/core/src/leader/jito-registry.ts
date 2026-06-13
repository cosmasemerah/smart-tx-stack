export interface JitoLeaderCheck {
  confirmed: boolean;
  method: "jito-validator-set" | "registry-unavailable";
}

// Verified live 2026-06-12: {"validators":[{"identity_account": "...",
// "running_jito": true|false, ...}]} — identity_account matches the
// identities getSlotLeaders returns.
const DEFAULT_VALIDATORS_URL = "https://kobe.mainnet.jito.network/api/v1/validators";

export interface JitoValidatorRegistryOptions {
  url?: string;
  ttlMs?: number;
  fetchImpl?: typeof fetch;
  log?: (line: string) => void;
}

/**
 * No-auth Jito-leader confirmation (req 2.2): cross-checks a leader identity
 * against the set of validators running the Jito client. On registry outage
 * we keep serving a stale set if we have one, and otherwise answer
 * "registry-unavailable" — a window is never *fabricated* as confirmed.
 */
export class JitoValidatorRegistry {
  private runningJito: Set<string> | undefined;
  private fetchedAt = 0;

  constructor(private readonly options: JitoValidatorRegistryOptions = {}) {}

  async check(identity: string): Promise<JitoLeaderCheck> {
    await this.refreshIfStale();
    if (this.runningJito === undefined) {
      return { confirmed: false, method: "registry-unavailable" };
    }
    return { confirmed: this.runningJito.has(identity), method: "jito-validator-set" };
  }

  get size(): number {
    return this.runningJito?.size ?? 0;
  }

  private async refreshIfStale(): Promise<void> {
    const ttl = this.options.ttlMs ?? 6 * 60 * 60 * 1_000;
    if (this.runningJito !== undefined && Date.now() - this.fetchedAt < ttl) return;

    const fetchImpl = this.options.fetchImpl ?? fetch;
    try {
      const response = await fetchImpl(this.options.url ?? DEFAULT_VALIDATORS_URL);
      const payload = (await response.json()) as {
        validators?: Array<{ identity_account: string; running_jito: boolean }>;
      };
      if (!Array.isArray(payload.validators)) {
        throw new Error("unexpected registry payload shape");
      }
      this.runningJito = new Set(
        payload.validators.filter((v) => v.running_jito).map((v) => v.identity_account),
      );
      this.fetchedAt = Date.now();
      this.options.log?.(
        `[leader] jito validator registry refreshed: ${this.runningJito.size} running_jito`,
      );
    } catch (error) {
      this.options.log?.(`[leader] registry refresh failed: ${String(error)}`);
      // keep any stale set; first-fetch failure leaves the registry unavailable
    }
  }
}
