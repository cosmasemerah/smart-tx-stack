# Phase 2 — Wallet Transaction Streaming: Investigated & Resolved

Goal: confirm a bundle's landing **from the stream** (not RPC polling), tracking
Submitted→Processed→Confirmed→Finalized. This note records a real provider quirk we
hit, how we diagnosed it, and the fix that makes landing fully stream-confirmed.

## The quirk

SolInfra Ace does **not** deliver our own wallet's transactions on a `transactions`
(or `transactionsStatus`, or `account`) subscription — `accountInclude=[burner]` and
`signature=[ourSig]` both returned **0**, even for transactions that finalized on-chain
(`err:null`). Yet the same connection streamed cleanly otherwise:

- Slots flow continuously (Phase 1 soak passed).
- The subscription *type* works — `transaction` + `transactionStatus` deliver ~1,265
  events/20s for the busy SPL Token program.

So the stream was healthy and the filter type worked — it just wouldn't match our
low-activity wallet on the `transactions` filter. (Tier-gating and account-indexing were
ruled out; concurrency and token format were ruled out.)

## The fix — confirmed landing via a `blocks` subscription

A Yellowstone **`blocks` subscription filtered to the wallet** *does* deliver our
transactions where the `transactions` filter does not: with
`accountInclude=[burner]` + `includeTransactions: true`, the matched block carries our
transaction, so landing is observed from a real stream event.

Verified empirically (one self-transfer): the tx appeared via the `blocks` subscription
(`viaBlock: true`) while the `transactions` subscription stayed `viaTransaction: false` —
confirming the `blocks` path bypasses the gap. The consumer now subscribes the wallet's
blocks and emits each matching block transaction as a landing event ([`consumer.ts`](../../packages/core/src/stream/consumer.ts)).

**Result:** in the capture run, all 9 landings were confirmed from the stream
(`confirmationMode: "stream-transaction"`, 9/9), with real per-bundle
processed→confirmed deltas. Jito `getBundleStatuses` is retained only as a
belt-and-suspenders fallback. The pure-stream Phase 2 gate now passes on SolInfra.
