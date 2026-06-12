import { describe, expect, it } from "vitest";
import { loadConfig } from "./config.js";

const baseEnv = {
  GRPC_ENDPOINT: "https://solana-yellowstone-grpc.publicnode.com:443",
  RPC_URL: "https://api.mainnet-beta.solana.com",
};

describe("loadConfig", () => {
  it("loads required vars and applies defaults", () => {
    const config = loadConfig({ ...baseEnv });
    expect(config.grpcEndpoint).toBe(baseEnv.GRPC_ENDPOINT);
    expect(config.rpcUrl).toBe(baseEnv.RPC_URL);
    expect(config.jitoBlockEngineUrl).toBe(
      "https://mainnet.block-engine.jito.wtf",
    );
    expect(config.grpcXToken).toBeUndefined();
    expect(config.walletKeypairPath).toBeUndefined();
    expect(config.anthropicApiKey).toBeUndefined();
  });

  it("treats empty strings as unset (tokenless PublicNode)", () => {
    const config = loadConfig({ ...baseEnv, GRPC_X_TOKEN: "  " });
    expect(config.grpcXToken).toBeUndefined();
  });

  it("respects explicit overrides", () => {
    const config = loadConfig({
      ...baseEnv,
      GRPC_X_TOKEN: "secret",
      JITO_BLOCK_ENGINE_URL: "https://frankfurt.mainnet.block-engine.jito.wtf",
      WALLET_KEYPAIR_PATH: "./keys/burner.json",
    });
    expect(config.grpcXToken).toBe("secret");
    expect(config.jitoBlockEngineUrl).toBe(
      "https://frankfurt.mainnet.block-engine.jito.wtf",
    );
    expect(config.walletKeypairPath).toBe("./keys/burner.json");
  });

  it("lists every missing required var in one error", () => {
    expect(() => loadConfig({})).toThrow(/GRPC_ENDPOINT, RPC_URL/);
  });
});
