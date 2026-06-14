> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/streaming.md).

# Streaming

Real-time on-chain data is the lifeblood of modern Web3 applications. We offer a suite of powerful streaming solutions, each tailored to a specific use case—from simple frontend notifications to the high-throughput, low-latency demands of MEV searchers and trading bots.

Streaming data from Solana requires a high-bandwidth Internet connection and a fast client environment. Frequent disconnections are a sign of a weak client setup. See our [Streaming Troubleshooting Checklist](/chains/solana/streaming/streaming-troubleshooting-checklist.md) for helpful tips.

***

#### Dragon's Mouth (gRPC)

**The fastest way to get real-time on-chain data.** Dragon's Mouth is a gRPC interface powered by Geyser, streaming account and transaction updates directly from Solana validators.

* **Best for:** Backend applications, high-frequency trading bots, MEV searchers, and any system where milliseconds matter.
* **Key Feature:** Provides **intra-slot updates**, delivering data up to 400ms faster than standard WebSockets by showing you state changes as they happen, not just at the end of a slot.
* **Note:** gRPC is not supported in web browsers and is intended for server-to-server communication.

**Learn more about** [**Dragon's Mouth gRPC →**](/project-yellowstone/dragons-mouth-grpc-subscriptions.md)

***

#### Whirligig (WebSockets)

**A better, faster, stronger WebSocket.** Whirligig is a high-performance, drop-in replacement for Solana's standard WebSocket API, built on top of our Dragon's Mouth gRPC streams.

* **Best for:** Web3 frontends, real-time user interfaces, and easily upgrading existing applications that already use WebSockets.
* **Key Feature:** Offers the same **intra-slot update** advantages as gRPC but over a browser-compatible WebSocket connection, making your dApp feel significantly more responsive.

**Learn more about** [**Whirligig WebSockets →**](/project-yellowstone/whirligig-websockets.md)

***

#### Fumarole (Reliable Streams)

**A persistent, "never miss an event" streaming solution.** Fumarole is designed for applications where guaranteed data delivery is absolutely critical.

* **Best for:** Accounting systems, compliance tools, analytics platforms, and any application that needs a complete and verifiable history of events.
* **Key Feature:** Allows your client to disconnect and reconnect to the stream at a later time, automatically backfilling any data that was missed. It also supports horizontal scaling via persistent subscribers.

**Learn more about** [**Fumarole Reliable Streams →**](/project-yellowstone/fumarole.md)


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/streaming.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
