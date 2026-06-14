# Capture run — lifecycle evidence

Real mainnet capture produced by `pnpm --filter @smart-tx-stack/agent capture` (Phase 7).
Raw artifacts in this folder: [`lifecycle-log.jsonl`](./lifecycle-log.jsonl) (one JSON line per submission) and [`agent-decisions.jsonl`](./agent-decisions.jsonl) (the AI agent’s full reasoning trace per decision).

- **Date:** 2026-06-14 (UTC)  ·  **Cluster:** mainnet-beta  ·  **Stream:** SolInfra Yellowstone (FRA), single concurrent connection
- **Wallet (burner):** `HanRzQuYU9HHyw6fqJWLpUcD31dK5KzLkW9x28tYSf1U`
- **Confirmation:** hybrid — Jito `getBundleStatuses` landing slot + Yellowstone slot-stream commitment (confirmed→finalized)

## Gate result — ✅ PASSED

| Check | Result |
|---|---|
| ≥10 real submissions | **11** |
| ≥2 failures | **2** (both deterministically induced) |
| ≥1 blockhash-expiry detected → reasoned → re-landed by the agent | **yes** (slot 426461546) |
| every retry cross-links to an agent decision (0 fallback retries) | **yes** |
| landed bundles have explorer-verifiable slots | **9 landed** |

Network-health timing observed over the run: **processed→confirmed p50 ≈ 127 ms** (739 slot samples); **confirmed→finalized 12084 ms** median (range 11786–13168 ms) — the ~32-slot finalization gap.

## Submissions

| # | type | tip (lamports) | result | slot | explorer |
|---|---|---|---|---|---|
| 1 | happy | 8290 | landed | 426461032 | [solscan](https://solscan.io/tx/23qsu6yYfv4ujXqbbahpjWwUd6hcLNAbV6AnrmtPe8uLXXq52dZMouSq3jzfLbCw6UTTv2h63R7rFULVYXvrPBED) |
| 2 | happy | 8290 | landed | 426461067 | [solscan](https://solscan.io/tx/3hZw4Kj8w9stXnvgjC9ZRkWD6KFYzEybqLzj3q5kDM6o1NtRCBT8Kdwd3Mi1y3yAVZhsVaUetB6H9gVSKg4ceJA1) |
| 3 | happy | 8832 | landed | 426461105 | [solscan](https://solscan.io/tx/2NZD6WE2pvwNC1bTDqR7tGDoVzUUC6ffMS5F4aXtXyv6apCxzqhKUA31vyhAYwh6E9Aehtyc5t1kbEXvTHTocr7t) |
| 4 | happy | 8832 | landed | 426461140 | [solscan](https://solscan.io/tx/5J2A846ZwBWpXjHBi88MhQ35VygV2WJFhW33HhNwoCEQrpxryA9ZUywuUPXSHDYeegiFwzvJmXwjQXWGAztvSeJf) |
| 5 | happy | 7343 | landed | 426461184 | [solscan](https://solscan.io/tx/3KsGirpHVBfDo2nVj5uYVraMViSMJa2nfa7PUTbn6opq3KyxYSi6y1NRRBFqg9iQ5wtcrGG9UW6dVVbWjZ6jBaTs) |
| 6 | happy | 10222 | landed | 426461219 | [solscan](https://solscan.io/tx/5oCNzRR77iAYpLoz4xLUxQZf7H3ds2hKh3c89DcyEcU92V7gMsANemKM3TofJHe5wpC7Gc4aBZukqiK6MSySuk9v) |
| 7 | happy | 10222 | landed | 426461264 | [solscan](https://solscan.io/tx/4fnwWydeDKjc5krUerEdFRYTK3Hwe9LxKEhKxBu5a5KVkcnv2aGUTbhLdPsMrMMDDFeNM9wXkNHvWBeoyur9yvWY) |
| 8 | happy | 9820 | landed | 426461299 | [solscan](https://solscan.io/tx/2CmKN2BA1zYPsyQT5MxjhzTtB4cuyis7Ku53cA4uaD2UZoGBfbA4yrx5nGhbmenoMGaa8us7qzAxWUKMdSPoXo17) |
| 9 | inject:stale-blockhash | 43604 | expired_blockhash | — | [jito](https://explorer.jito.wtf/bundle/rejected-2nzuG1Wb) |
| 10 | agent-retry | 8000 | landed | 426461546 | [solscan](https://solscan.io/tx/41vX4Ntr1EvDmmVDLiuRrqiGR6pVvAUjcN435srLy492s3qm4f4LMqHiHFGQioMR77H8YsAzqGHvzYfB2oEVo52p) |
| 11 | inject:cu-starved | 113334 | compute_exceeded | — | [jito](https://explorer.jito.wtf/bundle/4efbd3d04f414087ef94e1fc892a396a9c2a205599f7dd6f5bb3e76ac1094a71) |

> The two failures never land by design (an expired blockhash / a compute-exceeded tx cannot be included), so they have no on-chain slot — their bundle ids are shown for the Jito explorer. The agent-retry on row 10 is the recovered resubmission of the stale-blockhash bundle.

## AI agent decisions

Each failure was handed to the autonomous retry agent (`claude-opus-4-8`, adaptive thinking). It owns the retry/abort decision — no hardcoded retry policy. Full traces in [`agent-decisions.jsonl`](./agent-decisions.jsonl).

### `dec_1781457989547_k23876` — expired_blockhash → **resubmitted (landed)**

- rounds: 3 · tool calls: 5 · tokens: 7838 in / 1303 out
- tools used: get_failure_context, get_tip_data, get_slot_state, refresh_blockhash, resubmit_bundle
- rationale: "I'll start by gathering the failure context and live network data in parallel. Root cause is clear: the bundle failed on **expired_blockhash**, not on fee. Notably the prior tip was **43,604 lamports** — already well above p75 (6,007) and approaching p95 (100,000), so it was generous; fee was never the problem.\n\nKey signals:\n- **Blockhash expired** → must refresh before resubmitting.\n- **Network healthy**: p50 proces…"

### `dec_1781458083396_xutcx2` — compute_exceeded → **aborted**

- rounds: 2 · tool calls: 2 · tokens: 4203 in / 788 out
- tools used: get_failure_context, abort_with_reason
- rationale: "I'll start by pulling the failure's lifecycle record to confirm the classification and details. The failure context is conclusive, so let me reason about the root cause before deciding whether any live tip/timing data is even relevant.\n\n**Root cause analysis:**\n- `failureClass: compute_exceeded`\n- `simulationError: \"Program ComputeBudget111111111111111111111111111111 failed: Computational budget exceeded\"`\n- `cuLimit…"

