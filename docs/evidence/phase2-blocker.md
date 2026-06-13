# Phase 2 Gate — Blocked on Provider Transaction Streaming

The Phase 2 gate (one real mainnet transfer tracked Submitted→Processed→Confirmed→Finalized
purely from stream subscriptions) is **code-complete** but cannot pass against SolInfra's
Ace/bounty tier, which does not surface our own wallet's transactions on the stream.

## What we proved

- The transfer **lands** every time (4 live submits, each `finalized, err:null` on-chain).
- The stream is **healthy** (slots flow continuously; Phase 1 soak passed).
- The transaction subscription **type works** — `transaction` + `transactionStatus` deliver
  1265 events/20s for the SPL Token program.
- But `account_include=[burner]` and `signature=[ourSig]` both return **0** for our wallet,
  and the `account` subscription returns 0 even for Token.

Full capability matrix: `references/solana-smart-tx-stack-research §13 (update #4)`.
Reproduce with `pnpm --filter @smart-tx-stack/core exec tsx src/bin/capability-probe.ts`.

## Resolution path

Landing confirmation needs a Yellowstone provider that surfaces *our* wallet's transactions
(`account_include` or `transactionStatus`). Validation is one command once a candidate is
configured:

```sh
# point GRPC_ENDPOINT/GRPC_X_TOKEN at the candidate, then:
pnpm --filter @smart-tx-stack/core transfer-gate
```

Candidates: PublicNode (full Yellowstone, token pending) or SolInfra ticket escalation with
the capability matrix. SolInfra RPC remains our unary RPC regardless. The consumer code is
provider-agnostic — only env values change.
