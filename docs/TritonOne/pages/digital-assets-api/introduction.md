> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/introduction.md).

# Introduction

We actively contribute to the development of the Metaplex Digital Assets Standard API (DAS) that is used to interact with Solana NFTs, SPL (Solana Program Library) Tokens and Token-2022 (Token Extension Program), ensuring also production-ready indexing and caching layer.

DAS API provides a fast and scalable way to query digital assets on the Solana blockchain, including Fungible Tokens, Regular and Compressed NFTs. The decompression of NFTs and data caching is done server-side, providing a convenient way to access Digital Assets data and metadata. It is available via all our shared and dedicated endpoints, fully integrated with our RPC Pool infrastructure.

DAS API offers a comprehensive set of features for querying digital assets, including:

* a complete history of blocks and transactions,
* quick access to account data and past account balances,
* Merkle proofs for compressed assets,
* a consistent, easy-to-use interface.

## How to use

The DAS API is enabled by default on all our shared and dedicated endpoints. You can use any of our Solana mainnet RPC endpoints with the DAS API methods, and your queries will be routed automatically.

Available methods are listed and documented in the [API Methods](https://github.com/rpcpool/customer-docs/blob/gitbook/digital-assets-api/digital-assets-api/metaplex-digital-assets-api/README.md) section.

The DAS API is billed on a per-request basis ($50 per million requests). To see detailed billing information, check the Billable Items Chart in your account panel at the customers.triton.one.

[Ratelimits](https://github.com/rpcpool/customer-docs/blob/gitbook/rpc-pool/ratelimits.md) as per your standard RPC Pool will apply.

## Further reading

To learn more about account state compression and Digital Assets, see [developers.metaplex.com/das-api](https://developers.metaplex.com/das-api).

Client and examples: [https://github.com/metaplex-foundation/digital-asset-standard-api](https://github.com/metaplex-foundation/digital-asset-standard-api/tree/main/clients/js#examples)


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/digital-assets-api/introduction.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
