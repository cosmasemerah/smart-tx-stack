> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/trading-apis/titan-swap-api.md).

# Titan Swap API

### What is Titan?

The Titan Swap API allows you to stream price updates in real-time. The Argos routing engine serves as a meta-aggregator, sourcing data from multiple DEX aggregators and RFQ sources.

Titan Prime offers a unique websocket implementation that streams quote information. This significantly lowers latency and allows front-ends to update prices in real-time without overwhelming the server with HTTP requests.

#### Key Features

* **Real-time** **Streaming**: WebSocket implementation for continuous live price updates
* **Meta-Aggregator**: Sources from multiple DEX aggregators and RFQ sources to minimize slippage
* **Low Latency**: Stream quotes faster than REST polling
* **Dynamically Allocated Real Time Routing:** [DART](https://titan-exchange.gitbook.io/titan/developer-doc/dart-swap-api/overview) dynamically re-optimizes trades at the exact moment of execution, not just at quote time — guaranteeing best execution when it matters most.

#### Use Cases

Titan Swap API is ideal for:

* Trading interfaces requiring real-time price updates
* Price monitoring dashboards
* Trading bots that need low-latency price feeds
* Wallets with live swap pricing

### Getting Started

To access the Titan Swap API through Triton One, use the following pathing:

```
wss://<your-endpoint>.rpcpool.com/<your-token>/titan/api/v1/ws
```

Please make sure you use <mark style="color:$success;">`wss://`</mark> and not <mark style="color:$success;">`https://`</mark> as this is a websocket-based service.

#### Example Connection

```javascript
const ws = new WebSocket('wss://your-endpoint.rpcpool.com/your-token/titan/api/v1/ws');
ws.onopen = () => {
  console.log('Connected to Titan Swap API');
};
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Price update:', data);
};
```

### Executing a Swap

When you receive quote updates via the WebSocket stream, each quote contains swap route information:

1. **Connect to WebSocke**t: Establish connection (as shown above)
2. **Request Swap Quotes**: Send a <mark style="color:$success;">`NewSwapQuoteStream`</mark> request with your swap parameters
3. **Receive Quote Stream**: Get continuous updates with the best routes from multiple providers
4. **Select a Quote**: Choose the best quote based on your criteria (price, provider, etc.)
5. **Execute**: The quote contains either:

* **Instructions**: Build and sign a transaction with the provided instructions
* **Transaction**: A ready-to-sign transaction that you can directly sign and submit

Each <mark style="color:$success;">`SwapRoute`</mark> in the stream includes all the data needed to execute the swap.

For complete details on the request/response format and executing swaps from streaming quotes, refer to the official documentation.

### Pricing

The cost for using streaming services with Triton One is $0.05 per GB.

### Availability

Titan Swap API is available for all customers with an active Solana Subscription, on both shared RPC pools and dedicated nodes.

### API Documentation

To learn about how to use the Titan Swap API, please refer to the Titan Swap API docs here: <https://titan-exchange.gitbook.io/titan/titan-developer-docs/apis/swap-api#websocket-connections>

A TypeScript SDK is also available: <https://www.npmjs.com/package/@titanexchange/sdk-ts>

Read more: <https://blog.triton.one/titan-prime-api-for-solana-swaps-is-live-on-triton/>

<br>

<br>


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/trading-apis/titan-swap-api.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
