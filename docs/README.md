# Local Documentation Index

Offline copies of the docs for every external integration in this stack.
Fetched 2026-06-14 via each source's **native** export (no third-party scrapers).

## The "wallet transaction stream" (what we were debugging)

That stream is a Yellowstone gRPC **`transactions` subscription** with an
`accountInclude` filter set to our wallet. Its authoritative spec is **not a
website** — it's the installed package's own type defs and proto schema:

| File | What it is |
|---|---|
| [yellowstone-grpc/index.d.ts](yellowstone-grpc/index.d.ts) | `Client` API surface for the **exact installed version (5.0.9)** — `subscribe()`, unary calls, reconnect options |
| [yellowstone-grpc/geyser.d.ts](yellowstone-grpc/geyser.d.ts) | `SubscribeRequest`, `SubscribeRequestFilterTransactions` (`vote`/`failed`/`signature`/`accountInclude`/`accountExclude`/`accountRequired`), `CommitmentLevel` — generated from the proto, version-matched |
| [yellowstone-grpc/geyser.proto](yellowstone-grpc/geyser.proto) | Human-readable schema (from repo master — reference only; the two `.d.ts` above are the version-exact source of truth) |
| [yellowstone-grpc/README.md](yellowstone-grpc/README.md) | Package README |
| [TritonOne/pages/project-yellowstone/dragons-mouth-grpc-subscriptions.md](TritonOne/pages/project-yellowstone/dragons-mouth-grpc-subscriptions.md) | Triton's prose guide to the subscription model |
| [TritonOne/pages/chains/solana/streaming/streaming-troubleshooting-checklist.md](TritonOne/pages/chains/solana/streaming/streaming-troubleshooting-checklist.md) | **Directly relevant to the SolInfra wallet-tx gap** — provider-side streaming troubleshooting |

> The canonical usage example is the repo's `exampleclient.ts` — `request.transactions.client = { accountInclude: [...] }` is the wallet-tx subscription. Worth keeping a copy alongside these.

## Triton One / Yellowstone (full site)

- [TritonOne/ALL-DOCS.md](TritonOne/ALL-DOCS.md) — entire docs in one 369 KB file (`llms-full.txt`)
- [TritonOne/INDEX.txt](TritonOne/INDEX.txt) — link index (`llms.txt`)
- [TritonOne/pages/](TritonOne/pages/) — all 87 pages as individual markdown, original paths preserved

**GitBook native export** (how this was pulled, repeatable for any GitBook site):
`https://<site>/llms.txt`, `https://<site>/llms-full.txt`, or any page + `.md`.

## Still to mirror (same approach, when each phase needs it)

- **Jito** — `https://docs.jito.wtf` (Mintlify: try `/llms.txt` / `/llms-full.txt`; else page `.md`). Needed: Phase 3.
- **@solana/web3.js 1.95** — authoritative local source is `node_modules/.pnpm/.../@solana/web3.js/lib/index.d.ts`. Web docs: solana-web3js / solana.com/docs.
- **@anthropic-ai/sdk** — package README + the `claude-api` skill (re-verify model params at Phase 5 per ADR-6).

## Note on `gitbook-scraper` (PyPI)

Deliberately **not used**. Unverified single-maintainer package (v0.1.1) whose
function is to fetch URLs and write files — needless supply-chain exposure when
GitBook's own `llms.txt` / `.md` export produces cleaner output with zero
install. Prefer native exports or `curl` over ad-hoc scrapers.
