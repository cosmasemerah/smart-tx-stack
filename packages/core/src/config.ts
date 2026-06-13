export interface Config {
  /** Yellowstone gRPC endpoint (provider-agnostic: SolInfra, PublicNode, …). */
  grpcEndpoint: string;
  /** Optional x-token — PublicNode is tokenless, SolInfra will require one. */
  grpcXToken?: string;
  /** Unary RPC fallback; never the landing-confirmation path. */
  rpcUrl: string;
  jitoBlockEngineUrl: string;
  walletKeypairPath?: string;
  anthropicApiKey?: string;
}

const DEFAULT_JITO_BLOCK_ENGINE_URL = "https://mainnet.block-engine.jito.wtf";

function required(env: NodeJS.ProcessEnv, key: string, missing: string[]): string {
  const value = env[key]?.trim();
  if (!value) {
    missing.push(key);
    return "";
  }
  return value;
}

function optional(env: NodeJS.ProcessEnv, key: string): string | undefined {
  const value = env[key]?.trim();
  return value ? value : undefined;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const missing: string[] = [];
  const config: Config = {
    grpcEndpoint: required(env, "GRPC_ENDPOINT", missing),
    grpcXToken: optional(env, "GRPC_X_TOKEN"),
    rpcUrl: required(env, "RPC_URL", missing),
    jitoBlockEngineUrl:
      optional(env, "JITO_BLOCK_ENGINE_URL") ?? DEFAULT_JITO_BLOCK_ENGINE_URL,
    walletKeypairPath: optional(env, "WALLET_KEYPAIR_PATH"),
    anthropicApiKey: optional(env, "ANTHROPIC_API_KEY"),
  };
  if (missing.length > 0) {
    throw new Error(
      `Missing required env vars: ${missing.join(", ")} (see .env.example)`,
    );
  }
  return config;
}

/** Load .env into process.env if present (native Node, no dependency).
 * Tries the cwd first, then the workspace root — package scripts run with
 * cwd=packages/<name> while the single .env lives at the repo root. */
export function loadDotEnv(paths: string[] = [".env", "../../.env"]): void {
  for (const path of paths) {
    try {
      process.loadEnvFile(path);
      return;
    } catch {
      // try the next location; .env is optional (shell env also works)
    }
  }
}
