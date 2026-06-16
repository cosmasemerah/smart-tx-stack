# smart-tx-stack

A Solana **smart transaction stack**: stream live slot/leader data over Yellowstone gRPC, submit Jito bundles into confirmed Jito leader windows with dynamically-priced tips, track every bundle through its full lifecycle (Submitted → Processed → Confirmed → Finalized) from the stream, classify failures, and let an **AI agent autonomously own the retry decision** — with its reasoning fully on the record.

Built for the Superteam Nigeria *Advanced Infrastructure Challenge*. Runs on **mainnet** (Jito has no devnet endpoints), so every landed slot is verifiable on a public explorer.

> **Architecture doc (separate, public):** the [Architecture](#architecture) section below is the full write-up (also mirrored to a public Notion page linked in the Superteam submission).
> **Live capture evidence:** [`docs/evidence/capture/`](./docs/evidence/capture/) — 11 real submissions, 9 landed, 2 induced failures, agent-driven recovery. Raw artifacts: [`lifecycle-log.jsonl`](./docs/evidence/capture/lifecycle-log.jsonl) · [`agent-decisions.jsonl`](./docs/evidence/capture/agent-decisions.jsonl).

---

## What it does

| Capability | Where |
|---|---|
| Live slot/leader monitoring via Yellowstone gRPC (reconnect + backpressure) | [`packages/core/src/stream/`](./packages/core/src/stream/) |
| Detect the correct leader window **+ confirm the leader runs Jito** (live `running_jito` validator set, not the ~95%-stake assumption) | [`packages/core/src/leader/`](./packages/core/src/leader/) |
| Construct & submit Jito bundles (`sendBundle`, base64, 1 rps) | [`packages/core/src/jito/`](./packages/core/src/jito/) |
| Dynamic tips from live tip-floor data — **no hardcoded values** | [`packages/core/src/tips/`](./packages/core/src/tips/) |
| Lifecycle tracking: Submitted/Processed/Confirmed/Finalized, timestamps, slots, latency deltas | [`packages/core/src/lifecycle/`](./packages/core/src/lifecycle/) |
| Detect & classify 4 failure classes (expired blockhash, fee too low, compute exceeded, bundle failure) | [`tracker.ts`](./packages/core/src/lifecycle/tracker.ts) |
| Landing confirmed from the Yellowstone **stream** — the wallet's tx via a `blocks`-filtered subscription (`getBundleStatuses` kept only as a fallback) | [`consumer.ts`](./packages/core/src/stream/consumer.ts) + [`tracker.ts`](./packages/core/src/lifecycle/tracker.ts) |
| Automatic retries incl. blockhash refresh — **decided by the AI agent** | [`packages/agent/`](./packages/agent/) |
| Deterministic fault injection (stale blockhash, CU-starved) | [`packages/agent/src/capture/fault-injection.ts`](./packages/agent/src/capture/fault-injection.ts) |

**House rule, enforced everywhere:** all money is **integer lamports (`bigint`)**. SOL floats from external APIs are converted to lamports exactly once at the ingestion boundary ([`solToLamports`](./packages/core/src/money/lamports.ts)) and never re-enter arithmetic.

---

## Architecture

![Architecture — landing a bundle and recovering when it doesn't](docs/diagrams/architecture.png)

*A failed bundle isn't a dead end: it crosses one typed boundary to a reasoning agent that changes the right variable and loops back, or correctly refuses — every decision on the record. ([Excalidraw source](docs/diagrams/architecture.excalidraw).)*

Three layers, dependencies pointing one way — `capture → agent → core` — so the AI never touches web3.js, Jito, or the stream directly. That boundary is the bounty's *"clean separation between the AI layer and the core stack"*, and it's a single typed interface:

```
            ┌─────────────────────────────────────────────────────────┐
            │  agent/   AI retry agent (claude-opus-4-8)               │
            │  manual tool loop · visible reasoning → agent-decisions  │
            └───────────────▲─────────────────────────────────────────┘
                            │  StackControlSurface  (the ONLY bridge)
                            │  get_failure_context · get_tip_data ·
                            │  get_slot_state · refresh_blockhash ·
                            │  resubmit_bundle · abort_with_reason
            ┌───────────────┴─────────────────────────────────────────┐
            │  capture/  orchestrator — implements the surface against │
            │            the live stack; fault injection; campaign     │
            └───────────────▲─────────────────────────────────────────┘
                            │
   ┌────────────────────────┴────────────────────────────────────────┐
   │ core/                                                            │
   │  Yellowstone consumer ─▶ bounded queue ─▶ Lifecycle Tracker      │
   │   (slots+blockMeta, ping,    (backpressure)  (commitment buffer, │
   │    from_slot replay, dedupe)                  failure classifier,│
   │        │                                      JSONL log)         │
   │        ▼                                          ▲              │
   │  Leader-window detector + Jito-leader confirm     │              │
   │        │                                          │              │
   │        ▼                                   Bundle Confirmer      │
   │  Bundle builder ─▶ Jito client ─▶ sendBundle  (getBundleStatuses)│
   │        ▲                                                         │
   │  Dynamic tip engine ◀─ tip_floor REST + tip_stream WS           │
   └──────────────────────────────────────────────────────────────────┘
```

**Landing is confirmed from the stream.** SolInfra Ace does not deliver our wallet's transactions on a `transactions` subscription — but it *does* deliver them inside a **`blocks` subscription filtered to the wallet** (`accountInclude` + `includeTransactions`). So the consumer subscribes the wallet's blocks, emits each matching block transaction as a landing event, and the tracker marks the bundle landed from that real stream event; the slot stream then drives commitment progression (confirmed → finalized) and blockMeta height drives blockhash-expiry detection. Every landing in the captured run was confirmed this way (`confirmationMode: "stream-transaction"`, 9/9). Jito's `getBundleStatuses` is retained only as a belt-and-suspenders fallback, and `getInflightBundleStatuses` is ignored (we observed it report `Invalid` for bundles that in fact landed). Because the "processed" stamp is a real stream event rather than a poll, the per-bundle `processedToConfirmed` deltas in the lifecycle log are genuine network measurements.

Design rationale lives in the ADR (`decisions/adr-smart-tx-stack-*.md`): mainnet, TypeScript, raw-JSON-RPC Jito, single-tx bundles (tip in the same tx as the action — the uncle-bandit mitigation), integer lamports, AI Option 4 (autonomous retry), one concurrent gRPC connection.

---

## The AI agent (Option 4 — autonomous retry)

When a bundle fails, the agent — not a hardcoded policy — decides what to change and whether to retry at all. It runs a manual `@anthropic-ai/sdk` tool loop on **`claude-opus-4-8`** with adaptive thinking, and **every** thinking step, tool call, argument, and result is written to `agent-decisions.jsonl`. That trace is the *"reasoning is visible, not sequential automation"* evidence, and each resubmission is stamped with `agentDecisionId` so it cross-links back to the decision that produced it.

From the live capture run:

- **Expired blockhash** → the agent read the live tip floor, noted the failed tip (39,958 lamports) *sat between p75 (11,931) and p95 (82,000)* — above the contested range — and concluded the bundle had simply **"aged out before landing,"** not been underpriced; it refreshed the blockhash and resubmitted into a confirmed Jito window — **landed** (slot `426870503`).
- **Compute exceeded** → the agent identified the `cuLimit` of 200 as the deterministic cause and reasoned that *"neither a higher tip nor a fresh blockhash adds compute units"*, so it **aborted** rather than burn attempts on a futile retry — the fix is an upstream CU-limit change, which a retry can't make.

Two different failures, two correctly different decisions, both reasoned from real data.

---

## Live capture evidence

`pnpm --filter @smart-tx-stack/agent capture` ran the campaign on mainnet. Full table + traces in [`docs/evidence/capture/README.md`](./docs/evidence/capture/README.md).

| Gate check | Result |
|---|---|
| ≥10 real submissions | **11** |
| ≥2 failures | **2** (both deterministically induced) |
| ≥1 blockhash-expiry detected → reasoned → re-landed by the agent | **yes** (slot `426870503`) |
| every retry cross-links to an agent decision (0 fallback retries) | **yes** |
| landing confirmed via the stream, not RPC polling | **yes — 9/9 `stream-transaction`** |
| landed bundles have explorer-verifiable slots | **9 landed** (`426869997`–`426870503`) |

---

## The three questions

### 1. What does the time delta between *processed* and *confirmed* tell you about network health?

It measures how long it takes a stake-weighted supermajority (≥⅔) to vote a slot to **optimistic confirmation** after the leader first produced it. It's a live, **fee-independent** gauge of consensus health *at submission time*.

In our run the per-bundle processed→confirmed delta had a **median of ≈88 ms** (a slot-level sampler over the whole run put p50 ≈136 ms) — comfortably **under one 400 ms slot**, i.e. a healthy, low-latency cluster with no fork or vote-lag pressure. A *widening* delta is the warning sign: it means vote propagation is lagging, slots are being skipped/forked, or the cluster is congested — conditions under which a time-sensitive submission is more likely to miss its window regardless of how much you tip. Because landing is confirmed from the stream rather than a poll, each bundle's "processed" timestamp is a real stream event, so these per-bundle deltas appear directly in the lifecycle log.

For contrast, the **confirmed→finalized** delta we measured was **≈12.2 s** median — that's the structural ~32-slot rooting gap, *not* a health signal, which is exactly why the two deltas answer different questions.

### 2. Why should you never fetch a blockhash at the *finalized* commitment for a time-sensitive transaction?

A blockhash is only valid for **150 blocks (~60–90 s)**. A *finalized* blockhash is already **≥32 slots (~12 s — we measured 12.2 s)** behind the chain tip, so you spend ~20–25 % of the validity window before you've even signed, pushing you toward an expired-blockhash failure for no benefit.

And there's no upside to pay for: a `confirmed` block reverting would require a slashing-grade ≥⅓ equivocation, so optimistic confirmation is safe to build on. Fetch at **`confirmed`** — you get the full validity window and negligible rollback risk. Our stale-blockhash fault injection makes the failure concrete: holding a blockhash past its window got the bundle rejected with `-32602 bundle contains an expired blockhash`, and the agent's correct fix was to refresh (at `confirmed`) and resubmit.

### 3. What happens if the Jito leader skips its slot?

The bundle **doesn't land — and no tip is paid.** The tip is a transfer *inside* the atomic bundle, so it only executes if the bundle is included; a skipped slot costs you nothing but the missed opportunity. The bundle stays pending while the blockhash is valid and otherwise resolves Invalid/Failed; our stack detects the non-landing from the stream (no landing slot + block-height passing `lastValidBlockHeight`), never by trusting an inflight status.

Recovery is to **retarget the next *confirmed* Jito leader window** — we verify the upcoming leader against the live `running_jito` validator set (~690 validators) rather than assuming "~95 % of stake is Jito" — and resubmit with a recomputed tip. That's precisely the agent's retry loop. Depth nuance: an uncled/skipped slot can leak a bundle's transactions for independent rebroadcast, so bundles shouldn't assume absolute atomicity under uncles — which is also why we keep the tip in the *same* transaction as the action, so a rebroadcast still carries both.

---

## Quick start

```sh
pnpm install
cp .env.example .env        # then fill in your provider creds (see below)
pnpm typecheck && pnpm test # 88 unit tests

# generate a fresh burner wallet (gitignored under keys/), then fund it with a little SOL
node packages/core/scripts/generate-keypair.mjs keys/burner.json
```

`.env` (the single source of config; `.env.example` documents every key):

```sh
GRPC_ENDPOINT=fra.grpc.solinfra.dev:443   # any Yellowstone endpoint; bare host:port is fine
GRPC_X_TOKEN=...                          # provider token (omit for tokenless providers)
RPC_URL=https://...                       # unary RPC (leader schedule, blockhash, balance)
JITO_BLOCK_ENGINE_URL=https://mainnet.block-engine.jito.wtf
WALLET_KEYPAIR_PATH=./keys/burner.json
ANTHROPIC_API_KEY=sk-ant-...              # for the retry agent
```

Run things:

```sh
# zero-spend liveness probe: stream + RPC + Jito + tips + leader-window confirmation
pnpm --filter @smart-tx-stack/agent capture check

# full capture campaign (spends real SOL): N happy bundles + 2 induced failures,
# agent owns every retry. Writes logs/{lifecycle-log,agent-decisions}.jsonl
pnpm --filter @smart-tx-stack/agent capture 8

# the AI agent against a simulated surface (no SOL, real model)
pnpm --filter @smart-tx-stack/agent smoke

# core gates
pnpm --filter @smart-tx-stack/core soak          # 30-min stream soak + chaos reconnect
pnpm --filter @smart-tx-stack/core bundle-gate    # land one bundle end-to-end (hybrid confirm)
```

---

## Layout

```
packages/
  core/     # money utils, config, stream consumer, lifecycle tracker + failure classifier,
            # Jito client/builder/confirmer, leader-window + Jito-leader confirmation, tip engine
  agent/    # AI retry agent (tools, tool loop, decision log) behind StackControlSurface;
            # capture/ orchestrator (the live surface impl) + fault injection + capture bin
docs/
  evidence/   # judged capture (lifecycle-log + agent-decisions + summary) + Phase-1 stream soak
  diagrams/   # architecture.excalidraw + rendered PNG
```

## Stack

TypeScript (strict, `NodeNext`, `noUncheckedIndexedAccess`) · Node ≥22 · pnpm workspace · vitest · `@triton-one/yellowstone-grpc` · `@solana/web3.js` · raw JSON-RPC for Jito · `@anthropic-ai/sdk`.

## License

[MIT](./LICENSE)
