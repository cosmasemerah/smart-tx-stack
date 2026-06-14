> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/sui.md).

# SUI

As one of the original validators on SUI we provide full service SUI API access. We support:

* Mainnet
  * JSON-RPC (to be deprecated in 2026)
  * GRPC beta (will be replacing JSON-RP)
  * Walrus storage, publisher and aggregator
  * Seal permissioned server
* Testnet
  * JSON-RPC (to be deprecated on 2026)
  * GPRC beta (will be replacing JSON-RPC)
  * Walrus storage, publisher and aggregator
  * Seal open and permissioned server

Sui is rolling out GraphQL alpha, indexed-based APIs, and Triton will support them in Q1-Q2 2026.

Note: the Sui WebSocket API is officially deprecated and is being retired by Mysten Labs.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/sui.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
