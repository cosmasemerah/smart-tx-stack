> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana.md).

# Solana

Welcome to our documentation for the Solana ecosystem. Our platform provides best-in-class infrastructure for developers, traders, and enterprises, offering everything from standard RPC access to a suite of high-performance, proprietary tools that give you a competitive edge.

#### Core RPC Services

* **Full API Support:** We offer complete compatibility with the standard Solana JSON-RPC and WebSocket APIs across **Mainnet**, **Testnet**, and **Devnet**, ensuring seamless integration with any existing Solana SDK or tool.
* **Complete Historical Archive:** All our endpoints provide access to the full history of the Solana blockchain. You can query any transaction or block, all the way back to genesis, using our powerful archival solutions. Learn more about our [Archival solutions →](/project-yellowstone/old-faithful-historical-archive.md)

#### Enhanced Features ([Project Yellowstone →](/project-yellowstone/introduction.md))

Project Yellowstone is our suite of Solana infrastructure improvements designed for superior performance and capability.

* **Steamboat Custom Indexes:** Serve heavy `getProgramAccounts` queries with exceptional performance using our custom-built, on-chain data indexes that can reduce query times from seconds to milliseconds. Discover [Steamboat →](/project-yellowstone/cloudbreak-custom-indexes.md)
* **Advanced Data Streaming:** Access real-time on-chain data through a variety of powerful tools, including low-latency gRPC streams and improved, highly reliable WebSockets. Compare our [Streaming options →](/chains/solana/streaming.md)
* **Parsed Program Streams (Vixen):** Go beyond raw data with our service that provides real-time, pre-parsed data streams for popular on-chain programs, saving you immense development and data processing overhead. Explore [Vixen Program Data Streams →](/project-yellowstone/vixen-parsing-framework.md)

#### High-Performance Transaction Sending

* **Cascade Network:** Our optimized network for transaction delivery, using Solana's Stake-Weighted Quality of Service (SWQoS) to provide a more reliable path to network leaders, especially during periods of high congestion. Learn about the [Cascade Network →](/chains/solana/cascade.md)
* **Transaction Sending Advice:** Follow our best practices for client-side retries, CU budgets, and priority fees to maximize your transaction inclusion rate. Read our [Transaction Sending Advice →](/chains/solana/cascade/sending-txs.md)
* **Yellowstone Shield:** Protect your transactions from MEV and other validator-level risks by creating on-chain policies that control which validators are allowed to process your transactions. Learn how to use [Yellowstone Shield →](/project-yellowstone/shield-transaction-policies.md)

#### Specialized APIs

* **Digital Assets API (DAS):** A powerful, indexed API for querying NFTs, fungible tokens (SPL and Token22), and other digital assets on Solana, including first-class support for compressed NFTs. Explore the [Digital Assets API →](/digital-assets-api/introduction.md)
* **Jito Bundle Simulation:** For advanced traders, we offer support for Jito RPC on dedicated nodes, giving you access to `simulateBundle` for complex atomic arbitrage and MEV strategies. Learn about [Jito Bundle Simulation →](/trading-apis/bundle-simulation-with-jito.md)

#### Developer Guides

* **Web3.js Connection Issues:** A guide to diagnosing and fixing common socket and connection errors when using the `@solana/web3.js` library in NodeJS environments. Troubleshoot [Web3.js issues →](/chains/solana/web3js-socket-connection-issues.md)
* **Solana v2.0 Deprecated Calls:** Stay ahead of network upgrades by reviewing the list of RPC calls that will be deprecated in Solana v2.0 and their modern replacements. See the list of [deprecated calls →](/chains/solana/deprecated-calls-solana-2.0.md)


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
