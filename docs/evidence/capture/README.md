# Capture run — lifecycle evidence

Real mainnet capture produced by `pnpm --filter @smart-tx-stack/agent capture` (Phase 7).
Raw artifacts here: [`lifecycle-log.jsonl`](./lifecycle-log.jsonl) (one JSON line per submission) and [`agent-decisions.jsonl`](./agent-decisions.jsonl) (the AI agent’s full reasoning trace per decision).

- **Date:** 2026-06-16 (UTC) · **Cluster:** mainnet-beta · **Stream:** SolInfra Yellowstone (FRA), single concurrent connection
- **Wallet (burner):** `HanRzQuYU9HHyw6fqJWLpUcD31dK5KzLkW9x28tYSf1U`
- **Landing confirmation:** the Yellowstone **stream** — our wallet’s transaction is delivered inside a `blocks` subscription filtered to the wallet (`accountInclude` + `includeTransactions`), so landing is observed from a real stream event; slot-stream commitment then drives confirmed→finalized. Jito `getBundleStatuses` is retained only as a fallback. All 9 landings below were confirmed via the stream (`confirmationMode: stream-transaction`).

## Gate result — ✅ PASSED

| Check | Result |
|---|---|
| ≥10 real submissions | **11** |
| ≥2 failures | **2** (both deterministically induced) |
| ≥1 blockhash-expiry detected → reasoned → re-landed by the agent | **yes** (slot 426870503) |
| every retry cross-links to an agent decision (0 fallback retries) | **yes** |
| landing confirmed via the stream (not RPC polling) | **yes — 9/9 `stream-transaction`** |
| landed bundles have explorer-verifiable slots | **9 landed** |

Per-bundle stage latency (from the stream): **processed→confirmed median 88 ms**, **confirmed→finalized 12246 ms** (the ~32-slot finalization gap). Network-health sampler over the run: processed→confirmed p50 ≈136 ms.

## Submissions

| # | type | tip (lamports) | result | slot | explorer |
|---|---|---|---|---|---|
| 1 | happy | 58300 | landed | 426869997 | [solscan](https://solscan.io/tx/2dHHKM26wx4mxXHeNyqEDhd5CD4QmWc3pJxk5nndwGXTcCf55UAL62ny2uKaP8uSWbaFXBCJwNuAD9sibgUNtXkf) |
| 2 | happy | 58300 | landed | 426870034 | [solscan](https://solscan.io/tx/2P6GEDT3sf5giz6WTMTMwY12meCo6wr2Kofb5euzf9WHhFcQC8qNXipoRkEV9th4rWqeoBU9YqrvAFFZHgzL4aV7) |
| 3 | happy | 12000 | landed | 426870069 | [solscan](https://solscan.io/tx/2rVvyRVKFM6VxF9gRKzctH2mfqqtiyGUktoQrexvoEUG5TuU382YkgyPQutUnaTP6iXHw5AVUJRg21p4GD2wKUNd) |
| 4 | happy | 12000 | landed | 426870104 | [solscan](https://solscan.io/tx/3koa8Zr1Vej3mmMdZHitKVvcRsLMxbjAubXmY1tKeLDsqthBRpKD5wDxpR4b4GFQ7DT6Yfe4UX5BVWarz8dg8jQ) |
| 5 | happy | 14725 | landed | 426870139 | [solscan](https://solscan.io/tx/33gqnKrzKcqSm9K4DRiPytzbPH8qA73CcHVLzyuMgshw7E7TVG3iNNn1mUdkVTzKev5JmU7MwmjXQiGGDqTXwQAu) |
| 6 | happy | 14725 | landed | 426870178 | [solscan](https://solscan.io/tx/5LBK1MCuy7gwb8Ay1gu2Y9Z37PbUd3AukXvtbGjmRu1T3KcHYyeoGdcrEg7CUEPqFufikHtfWt1yyybz7ZqqMbco) |
| 7 | happy | 16035 | landed | 426870217 | [solscan](https://solscan.io/tx/5ycTZfr9gY8fhm4sCYqUUNvf3VWUWEmT3qxk7F4fsTi7U2MVq811TfzWnkUPTk8EGDhqDmJgNFrTYeszHVSi4gJD) |
| 8 | happy | 16035 | landed | 426870252 | [solscan](https://solscan.io/tx/3uoWSiNT81QQBS2MmmBTUbj2S9z91JCNE9FPtBFKNjnzjWzHwyiBARkgLsf6dYZLvsjkcEjao3PzTyWvVKZQdWFz) |
| 9 | inject:stale-blockhash | 39958 | expired_blockhash | — | [jito](https://explorer.jito.wtf/bundle/rejected-22iojfo5) |
| 10 | agent-retry | 11931 | landed | 426870503 | [solscan](https://solscan.io/tx/32pLtmVCyV179mKcntEos2QPa486Q7msejRZdWh8axVr1MrTpPKyXJhLtd6GwFHghXZLSd3VhcFpuBbrYZRQicWv) |
| 11 | inject:cu-starved | 44947 | compute_exceeded | — | [jito](https://explorer.jito.wtf/bundle/b0b7afc7272473c5653e89414b0278a764f3fc62e93ad35a872f0d686dd86312) |

> The two failures are deterministic fault injections that cannot land (an expired blockhash / a compute-exceeded tx), so they have no on-chain slot. The agent-retry row is the recovered resubmission of the stale-blockhash bundle.

## AI agent decisions

Each failure was handed to the autonomous retry agent (`claude-opus-4-8`, adaptive thinking). It owns the retry/abort decision — no hardcoded policy. Full traces in [`agent-decisions.jsonl`](./agent-decisions.jsonl).

### `dec_1781620101627_f3eu9v` — expired_blockhash → **resubmitted (landed)**

- rounds: 3 · tool calls: 5 · tokens: 7718 in / 1222 out
- tools: get_failure_context, get_tip_data, get_slot_state, refresh_blockhash, resubmit_bundle
- rationale: "I'll start by gathering the failure context along with live tip and slot data in parallel, since these are independent calls. The classification is clear: **expired_blockhash**. Key findings:\n\n- **Tip (39,958 lamports)** was *not* the problem — it actually sat between p75 (11,931) and p95 (82,000), well above the contested range. The bundle simply aged out before landing.\n- **Network is healthy**:…"

### `dec_1781620200487_25zln9` — compute_exceeded → **aborted**

- rounds: 2 · tool calls: 2 · tokens: 4178 in / 866 out
- tools: get_failure_context, abort_with_reason
- rationale: "I'll start by pulling the failure record to confirm the classification and see the details. The failure record is unambiguous:\n\n- **failureClass:** `compute_exceeded`\n- **simulationError:** \"Program ComputeBudget111... failed: Computational budget exceeded\"\n- **cuLimit:** 200 — the compute unit limit is set absurdly low (200 CU; even a trivial transfer needs far more).\n\n**Root cause:** This is a d…"

