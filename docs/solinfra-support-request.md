# SolInfra Support Request — Wallet-level transaction streaming (Yellowstone gRPC)

**Account:** emerahcosmas@gmail.com · **Plan:** Ace · **Region:** FRA
**Endpoint:** `fra.grpc.solinfra.dev:443` (gRPC key as `x-token`)
**Context:** Superteam Nigeria "Smart Transaction Stack" bounty build.

## Lead question — is the approved bounty allocation applied?

My bounty credit/upgrade was approved, but the dashboard still shows the **base Ace plan**
(balance $0.00, **GRPC STREAMS limit 1** — a single concurrent stream). It looks like the
bounty grant may have reset to default. Could you confirm the bounty allocation is applied
to this account? I suspect both issues below are a direct consequence of being on the base
tier rather than the intended bounty tier:

- **Single-stream cap (1):** with one stream allowed, the dashboard sits at 1/1 while my
  consumer runs, and reconnects intermittently error (the prior stream isn't released before
  the new connect, so it hits the 1/1 cap). A development+capture workload realistically
  needs more than one concurrent stream.
- **No wallet-level transaction streaming** (detailed below).

## Summary (the capability we need)

Your Yellowstone gRPC slot/block streaming works flawlessly (30-min soak: 3,781 slots
across processed/confirmed/finalized, clean reconnect). However, the **transaction** and
**transactionsStatus** subscriptions do not surface **my own wallet's** transactions, even
though the same subscription types deliver fine for high-traffic program accounts.

## Reproduction (measured 2026-06-13, `@triton-one/yellowstone-grpc` 5.0.9)

Single `subscribe` with these filters, commitment PROCESSED, over a 20s window:

| Subscription | `accountInclude=[SPL Token program]` | `accountInclude=[my wallet]` / `signature=[my sig]` |
|---|---|---|
| `slots` | delivered | delivered |
| `blocksMeta` | delivered | delivered |
| `transactions` | **1265 events** | **0** |
| `transactionsStatus` | **1265 events** | **0** |
| `accounts` (account write) | **0** | **0** |

- My wallet: `HanRzQuYU9HHyw6fqJWLpUcD31dK5KzLkW9x28tYSf1U`
- I submitted 4 transactions during testing; each reached `finalized` with `err: null`
  on-chain (verified via `getSignatureStatuses` against your RPC). None appeared on the
  transaction/transactionsStatus stream via either `account_include` or exact `signature`
  filter.
- The `accounts` (account-write) subscription returns 0 even for the SPL Token program.

## Questions / Asks

1. Is wallet-level (arbitrary account) **transaction / transactionsStatus** streaming enabled
   on the Ace/bounty tier, or gated to a higher tier? If gated, can it be enabled for this
   bounty key?
2. Is there an account-indexing requirement (e.g. only pre-indexed/high-activity accounts are
   matchable by `account_include`)? My wallet is new/low-activity.
3. Is the **`accounts`** (account-write) subscription supported on this endpoint? It returned
   0 even for a busy program.

Stream-based landing confirmation (per-signature processed→confirmed→finalized) is a core
requirement of the bounty, so wallet-level transaction or transactionStatus streaming is the
piece I need. Happy to share full repro logs. Thanks!
