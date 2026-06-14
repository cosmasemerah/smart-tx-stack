> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/trading-apis/metis-swap-api.md).

# Metis Swap API

To utilise Triton One's self-hosted Metis Swap API Binary, you do not need to have any $JUP tokens staked; Triton One has got you covered.

### What is Metis?

Metis is Jupiter's routing and quote engine that brings the power of Jupiter's routing directly to your infrastructure. It scans 20+ DEXes and AMMs across Solana's DeFi ecosystem, calculates optimal routes, splits trades when beneficial, and builds ready-to-sign swap transactions.

#### Key Features

* **Liquidity aggregation**: Combines liquidity from multiple AMMs and DEXes into a single route
* **Platform fees**: Support for platform fees directly in the quote API - set your fee wallet and pass a platform fee parameter
* **ExactOut mode**: Perfect for payment flows where you need to receive an exact output amount (e.g., accepting many tokens but settling in USDC)
* **Circular arbitrage:** Triton enables circular arbitrage routes (e.g. USDC → token → USDC), which are disabled on Jupiter's public API by default

#### Use Cases

Metis API on Triton can power:

* Wallets with simple swap functionality
* Payment gateways that accept many tokens and settle in a single asset
* Trading bots and arbitrage systems (incl. circular arbitrage strategies)
* DEX frontends with clean swap flows

### Getting Started

To start using the Metis Swap API, use the following pathing in your code:

```bash
curl 'https://<endpoint>.rpcpool.com/<private_token>/metis/quote?
```

#### Example Request

```bash
curl 'https://endpoint.rpcpool.com/private_token/metis/quote?\
inputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&\
outputMint=So11111111111111111111111111111111111111112&\
amount=1000000&\
slippageBps=50'
```

### Pricing

The self-hosted Metis Swap API uses metered billing and is not rate-limited.

The price per million Metis queries is $80. There are no rate limits to using this API; therefore, it is recommended to monitor your usage to prevent unexpected costs.

### Availability

Metis Swap API is available for all customers with an active Solana Subscription, on both shared RPC pools and dedicated nodes.

### Executing a Swap

After getting a quote from the <mark style="color:$success;">`/quote`</mark> endpoint, you can execute the swap:

1. **Get a Quote**: Use the <mark style="color:$success;">`/quote`</mark> endpoint (as shown in the example above)
2. **Get Swap Instructions**: Use the response to build your swap transaction
3. **Sign and Send**: Sign the transaction with your wallet and submit to the network

The Metis API builds ready-to-sign swap transactions for you.

#### Example Flow

```bash
# Step 1: Get a quote
curl 'https://endpoint.rpcpool.com/private_token/metis/quote?inputMint=...&outputMint=...&amount=...'

# Step 2: Use the quote response to execute the swap
# (See full documentation for swap endpoint details)
```

For complete details on executing swaps, including the <mark style="color:$success;">`/swap`</mark> and <mark style="color:$success;">`/swap-instructions`</mark> endpoints, refer to the Metis documentation.

### API Documentation

To understand how to use the binary, please refer to the Metis docs at <https://metis.builders/docs/get-quote>.

Read more: <https://blog.triton.one/metis-api-for-solana-swaps-is-live-on-triton/>

<br>


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/trading-apis/metis-swap-api.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
