> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/pro-trading-centers/introduction.md).

# Introduction

Our Pro Trading Centers (PTC) in Amsterdam and Tokyo allow you to trade on Solana with the lowest possible read & write latency. All RPC servers in our Pro Trading Centers receive incoming shred streams from well-staked validators. Also, transactions are routed through the validators for full access to QUIC ports on the Solana cluster.

With Yellowstone gRPC Geyser streams, you can build trading software that reacts to blockchain events up to 400 milliseconds faster than standard RPC services. The fastest traders in the ecosystem are using Geyser.

We also offer, via our partners, bare-metal servers for you to run your trading software. Your trading server will be directly connected to the same rack as the RPC nodes. When you co-locate your trading server in our PTCs, you never need to make a network request outside the data center until you send your transaction to the validators.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/pro-trading-centers/introduction.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
