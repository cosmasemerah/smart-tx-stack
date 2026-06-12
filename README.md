# smart-tx-stack

Smart Transaction Stack — Solana transaction infrastructure with Jito bundles, Yellowstone gRPC lifecycle tracking, and an AI retry agent. Superteam Nigeria Advanced Infrastructure Challenge.

> **Status:** Phase 0 (scaffold). Stream consumer, lifecycle tracker, Jito submission, dynamic tips, and the AI agent land in subsequent phases. Full architecture document and operational README ship with the submission.

## Stack

- TypeScript (strict) · Node ≥20 · pnpm workspace · vitest
- `@triton-one/yellowstone-grpc` for streaming (provider-agnostic: any Yellowstone endpoint)
- Jito block engine via raw JSON-RPC (`sendBundle`, base64)
- Claude (Anthropic API) for the autonomous retry agent
- **All money math in integer lamports (`bigint`)** — floats are accepted only at the external-API boundary (`solToLamports`), never in logic

## Quick start

```sh
pnpm install
cp .env.example .env        # defaults run against PublicNode's tokenless Yellowstone gRPC
pnpm typecheck && pnpm test

# generate a burner wallet (gitignored under keys/)
node packages/core/scripts/generate-keypair.mjs keys/burner.json
```

## Layout

```
packages/
  core/          # config, money utils; stream consumer + lifecycle tracker + Jito submit (upcoming)
  agent/         # AI retry agent, consumes core's typed control surface (upcoming)
```

## License

MIT
