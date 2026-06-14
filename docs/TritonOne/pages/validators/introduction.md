> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/validators/introduction.md).

# Introduction

Running a validator helps protect and decentralize the Solana network and earns continued rewards through the stake you can attract to your validator.

Our hosted validators utilize the infrastructure we have built over time as a top RPC provider and running validators on the Solana network.

On the validators we run, we ensure:

* Access by a limited team.
* Node identity keys in-memory only.
* 24/7 monitoring to ensure consistent voting.

Triton One owns the validator identity key. You or your team control the vote account withdrawal authority. Control over the withdrawal authority means you have complete control over the vote account.

Before you commit to running a validator, you should make sure that:

1. You are willing to fund vote fees until you have attracted enough stake to break even; this is approximately 1 SOL/day.
2. You can attract enough delegations to break even (TX fees - voting expenses) and make a profit eventually. Currently, this is in the range of 375 000 delegated SOL.

If you merely wish to access staking rewards, you can also stake with existing validators without running your own; see [https://validators.app](https://validators.app/) for details about existing validators and stake pools.

Validators deployed through Triton are compatible with all current Solana validator clients that adhere to protocol specifications. The choice of client is left entirely to the validator owner. Triton monitors compatibility and vote performance across supported clients, which include:

* Agave – the official reference implementation of the Solana validator, maintained by (Anza)(<https://anza.xyz/>) . Agave is feature-complete and receives all protocol updates first, serving as the baseline for all other clients.
* Jito-Solana – a fork of Agave maintained by (Jito Labs)(<https://jito.network/>), integrating an MEV auction system. This client allows validators to receive transaction bundles from a private relay and earn additional rewards through MEV tips, with minimal configuration overhead.
* Paladin – a fork of Jito-Solana maintained by the (Paladin)(<https://www.paladin.one/>) team. It offers stricter bundle filtering and supports a protected transaction pathway that mitigates frontrunning and sandwich attacks. It is designed to improve fairness in MEV distribution while remaining fully compatible with Solana’s consensus.
* Frankendancer – a hybrid validator client maintained by (Jump Crypto)(<https://jumpcrypto.com/firedancer/>), combining a Firedancer networking and block ingestion stack with consensus execution provided by Agave. It is engineered for high performance and low-latency block processing and is already in production on mainnet with active participation.

Each of these clients is capable of full validator participation. Triton validates client behavior continuously to ensure correct protocol operation.

To participate in the Triton SWQoS – Cascade Routing Layer, which provides a prioritized stream of transactions and the opportunity to generate additional revenue, non-triton validators must configure their infrastructure to accept authenticated traffic from Triton’s transaction distribution layer. This system is opt-in and compatible with supported clients. For configuration and operational details, see: (Providing Transaction Bandwidth)(<https://docs.triton.one/chains/solana/cascade/providing-transaction-bandwidth>)


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/validators/introduction.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
