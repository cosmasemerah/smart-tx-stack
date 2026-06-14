> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/core-features/introduction.md).

# Introduction

Our platform provides a rich set of features designed to enhance your experience, from core infrastructure guarantees to advanced, chain-specific APIs. This page serves as a guide to some of the key capabilities you can find throughout our documentation.

#### Core Platform Features

These foundational features apply to all our endpoints, providing a baseline of performance, reliability, and security.

* **Global Request Routing** Learn how our multi-layered system using GeoDNS and BGP Anycast ensures low-latency connections for your users worldwide. Read the [Request Routing Guide →](/core-features/geodns.md)
* **Security & Abuse Prevention** A look into our proactive, multi-layered defense system, including intelligent rate limiting, protocol-level traffic filtering, and advanced fingerprinting. Learn about [Abuse Prevention →](/core-features/abuse-prevention.md)
* **High Availability Architecture** Our endpoints are backed by clusters of nodes and load balancers, enabling instantaneous failover to ensure maximum uptime for your application.

#### Support for a Multi-Chain Ecosystem

While Solana is a core part of our services, our infrastructure is built to support a variety of high-performance blockchains. We provide dedicated, reliable RPC access for multiple ecosystems, including:

* [Solana](/chains/solana.md)
* [Sui](/chains/sui.md)
* [Pythnet](/chains/monad.md)
* [Monad](https://docs.triton.one/chains/monad)

#### Advanced Solana Features

As our core offering, Solana benefits from a number of specialized, high-performance features.

* **Cascade Transaction Network** An optimized network for high-performance transaction delivery on Solana, using Stake-Weighted Quality of Service (SWQoS). Explore [Cascade →](/chains/solana/cascade.md)
* **Steamboat Custom Indexes** Serve heavy `getProgramAccounts` queries with exceptional performance using our custom-built, on-chain data indexes. Discover [Steamboat →](/project-yellowstone/cloudbreak-custom-indexes.md)
* **Digital Assets API** A powerful, indexed API for querying NFTs and other digital assets on Solana, including support for compressed NFTs. Read the [Digital Assets API Docs →](/digital-assets-api/introduction.md)

#### Data, Streaming & Archives

We offer multiple ways to stream real-time data or query historical information.

* **Dragon's Mouth (gRPC)** High-performance, low-latency gRPC streams for real-time Solana data, powered by Geyser. Get started with [gRPC →](/project-yellowstone/dragons-mouth-grpc-subscriptions.md)
* **Whirligig (WebSockets)** An improved, more reliable WebSocket implementation for applications that require a stable connection for subscriptions. Learn about [Whirligig WebSockets →](/project-yellowstone/whirligig-websockets.md)
* **Full Chain Archives** Query the entire history of the Solana blockchain, back to the genesis block, using our BigTable and Old Faithful archival solutions. Learn about [Archival Access →](/project-yellowstone/old-faithful-historical-archive.md)

#### Trading APIs & Tools

Gain a competitive edge with our suite of integrated APIs for on-chain trading.

* **Pyth Hermes Price Feeds** Directly query the Pyth Network's high-fidelity, real-time market data from our low-latency endpoints. Learn about [Pyth Hermes →](/trading-apis/hermes.md)


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/core-features/introduction.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
