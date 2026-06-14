> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/readme.md).

# Introduction

Welcome! This is the official documentation for Triton One's high-performance blockchain RPC services. Whether you're building your first dApp or managing a high-frequency trading operation, our goal is to provide you with reliable, fast, and feature-rich infrastructure.

#### Who is this for?

* **dApp Developers:** Get fast and reliable RPC access for your application's frontend and backend needs.
* **Data Analysts:** Leverage our advanced streaming and archival services to get deep insights into on-chain activity.
* **Traders & Arbitrage Bots:** Use our low-latency transaction delivery network to gain a competitive edge.
* **Validators:** Integrate with our network to provide and monetize transaction bandwidth.

#### Getting Started

If you're new here, the best place to start is our [**Getting Started Guide**](/getting-started.md). It will walk you through the process of creating an account, understanding your endpoints, and making your first API call.

#### Our Services

* **Core RPC Features:** Learn about our global infrastructure, including GeoDNS routing, rate limiting, and security features.
* **Chain-Specific Guides:** Find detailed information for the chains we support, including Solana, SUI, and more.
* **Advanced Data & Streaming:** Dive deep with our powerful data streaming solutions like gRPC and improved WebSockets.
* **Trading Solutions:** Explore our Cascade network for optimized, low-latency transaction delivery.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/readme.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
