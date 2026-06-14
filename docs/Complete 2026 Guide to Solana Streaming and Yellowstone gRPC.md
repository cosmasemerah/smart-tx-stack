---
created: 2026-06-14T11:05:27 (UTC +01:00)
tags: []
source: https://blog.triton.one/complete-guide-to-solana-streaming-and-yellowstone-grpc/
author: Kateryna Shyndina
---

# Complete 2026 Guide to Solana Streaming and Yellowstone gRPC

> ## Excerpt
> Learn how Solana streaming works, what its key characteristics are, when to use it instead of RPC polling, and how to work with the Yellowstone gRPC stack.

---
## TL;DR

-   Starting in 2021, standard RPC polling (repeatedly asking the chain for data) was too slow for HFT, MEV, and high-performance indexing. By the time you get the data, it’s already stale
-   In 2021, Solana recognised this limit and added the Geyser plugin system to Agave. This allowed the node to emit all data directly from memory, enabling the ecosystem to build plugins that run outside the node but tap into its state
-   Triton pioneered the use of gRPC for this interface, building the Yellowstone gRPC plugin. It allows you to subscribe to the specific data you need and receive it the moment it arrives
-   Shortly, other providers and the whole ecosystem adopted Yellowstone to move from pull → push for any workload that needs fresh, structured data: trading, analytics, DEXs, RFQ engines, indexers, explorers, and portfolio management tools
-   We never run streaming services on voting validators. We use dedicated, non-voting nodes specifically for streaming to ensure the stream never competes with consensus (or other RPC requests) for resources
-   Some of the streaming benefits are: minimising latency and data loss, receiving lightweight payloads (strongly typed Protobufs), eliminating "429 Too Many Requests”, and much more

## Introduction

If you are building a trading bot, a real-time indexer, or a DEX on Solana, you have likely hit the "RPC Wall." You hammer an endpoint with getAccountInfo every 200ms, only to get rate-limited or, worse, realise your data is 200ms old by the time it reaches your application logic.

Unlike EVM chains, Solana moves at (almost) the speed of light. On a 400ms block time, being only a little late isn't a thing.

At Triton One, our mission is IBRL – Increase Bandwidth, Reduce Latency. Providing high-performance open-source streaming solutions for the community is one of the ways we achieve it.

This guide walks through how streaming on Solana works, what the Yellowstone stack looks like, how to choose a provider when streaming is your primary workload, when to use RPC vs streaming (and which streaming tools to consider), and how to get started.

## How does the Yellowstone Geyser plugin work?

At its core, Yellowstone gRPC (or Dragon's Mouth, as we call it) is a piece of software that compiles down to a dynamic shared library (a .so file on Linux).

It utilises the Geyser Plugin Interface provided by Solana Labs. When a validator client starts up, we pass it a configuration flag telling it to load our library into its own memory space. Once loaded, Yellowstone isn't just "watching" the node; it becomes part of the node. It registers callbacks (hooks) directly with the node’s AccountsDb and Bank.

Here’s the step-by-step of the data flow:

-   Whenever the node processes a transaction or updates an account state in memory, it triggers a callback to our plugin
-   We capture raw data, accounts, slots, blocks, and transactions before they are even written to disk
-   Instead of waiting for a client to request it, we immediately serialise it to Protobuf and push it out via a gRPC interface opened by the plugin
-   You receive the data stream (at the commitment level of your choice: processed, confirmed, or finalised)

This bypasses the entire JSON-RPC HTTP layer, eliminating request parsing, JSON serialisation overhead, and polling loops. You subscribe once; the node keeps sending data until you disconnect (unsubscribe).

## Where do we run it?

We don’t run Yellowstone on voting validators. Neither do we run it together with nodes serving RPC calls, and we advise our customers with dedicated nodes to do the same (streaming and streaming-only nodes). The goal of streaming is to deliver data immediately, and we want to ensure that speed isn't compromised by "noisy neighbours" spamming heavy RPC calls.

Instead, we run dedicated streaming RPC nodes. These are full bare-metal Solana nodes that follow the cluster and verify the ledger, but don’t vote.

-   Optimised for data. Tuned specifically to handle the massive I/O load of streaming
-   No contention. Your gRPC subscription never competes with the consensus
-   Isolation. We keep streaming nodes physically and logically isolated from general RPC traffic
-   Network topology. We run these nodes next to validators in top-tier data centres to shave every last microsecond of physical latency, optimising the path from validators to RPCs and from there to you

## How to run Triton’s Geyser plugin yourself?

While we sell managed infrastructure, we believe the core tools should be shared. We do this to empower more innovation on the network, protect the ecosystem from single points of failure, and give you alternatives to proprietary SDKs from the moment you start building.

We maintain the suite so you can tinker with it or bootstrap it anytime.

## Yellowstone streaming ecosystem

"Yellowstone" isn't just one engine; it's a suite of open-source tools we built to handle different customer needs. Each project is named after a geyser at Yellowstone National Park because, like a geyser, this infrastructure manages high-pressure, high-speed streams. We’ll focus on its 4 core components:

### 1\. Dragon’s Mouth (aka Yellowstone gRPC)

What it is: Triton’s original ultra-low latency Geyser-fed gRPC interface.  
How it works: It connects directly to the node's memory, ingests raw bank data, outputs strongly typed Protobufs, and immediately sends them over the gRPC connection. This is also our "source of truth" for other Yellowstone tools.  
Use it for: the absolute lowest possible latency. This is for HFT, MEV, RFQ desks, liquidation engines, and arbitrage traders identifying market inefficiencies.

This was our first product in the suite. As revolutionary as it was, it solved only the problems of speed and wasted bandwidth, and only for the backends.  
But at Triton, being the serial problem-solvers we are, we wanted to help everyone. So we kept shipping.

```text
Solana shreds │ │ ▼ [Validator / Follower] │ Geyser callbacks │ ▼ [Dragon's Mouth plugin] │ │ Protobuf over HTTP/2 ▼ [gRPC streams → traders / indexers / infrastructure]
```

### 2\. Whirligig WebSockets

What it is: A high-performance WebSocket proxy that allows you to reap the benefits of Dragon's Mouth for the frontends.  
How it works: It stands between the Dragon’s Mouth plugin and your client. Whirligig ingests the high-speed gRPC stream and translates it into standard Solana JSON-RPC WebSocket messages.  
Use case: Ultra-low latency for frontends (Live feeds for DEXs, dApps & Wallets)

You are probably wondering, why build another WebSocket if Solana JSON-RPC already had one?

Standard WebSocket implementation was a great first “draft” at the beginning of Solana, but with Solana's massive throughput and breakneck speed, standard websockets became unreliable under load, degrading in performance, and frequently disconnecting. Furthermore, they were slow: internally waiting until the end of each slot, rather than streaming updates as they occur within the slot.

Whirligig solved all of these issues by moving streaming logic outside of Agave, while maintaining complete backward compatibility.

```text
[Dragon’s Mouth stack] │ │ gRPC ▼ [Whirligig proxy] │ │ WebSocket (Solana WS API) ▼ [browser / dApp]
```

### 3\. Fumarole reliable streams

What it is: A high-availability, persistent, multiplexed streaming service.  
How it works: It connects to multiple downstream Dragon's Mouth nodes, aggregates the data, removes duplicates (so you don't process the same block twice), sends it through the gRPC connection, and tracks your position in the data stream.  
Use case: When you need whole blocks or confirmed commitment levels for indexers, analytics, lending protocols, and compliance systems that demand 100% data completeness.

We built Fumarole to end the struggle with streaming reliability and eliminate the need for complex backfilling and redundancy logic. Data gaps happen for two reasons:

-   Node restarts: validators patch and reboot
-   Client disconnects: your server goes down, or the network blips

At Triton, we eliminate p.1 via health checks, redundancy, and immediate auto-failover. However, p.2 is just as important.

To eliminate the issue, we created a service that doesn't try for the "perfect scenario" but works well because disconnects happen. It remembers exactly the moment of disconnect, and once reconnected, you start precisely from where you left off, eliminating the need for complex backfilling and redundancy logic.

```text
[DM node A] [DM node B] [DM node C] └─────── gRPC events ───────┘ │ │ ▼ [Fumarole] merge + dedupe + log │ │ gRPC (cursor) ▼ [indexers / DeFi / analytics]
```

### 4\. Old Faithful historical streams

What it is: Historical data streaming via gRPC.  
How it works: It takes data from our massive historical archive and streams it via gRPC as if it were happening live.  
Use it for: Backfilling databases, compliance auditing, taxes, and booting up new indexers.

While developing Old Faithful (the only complete, verified, and public Solana archive), we realised the same gRPC interface could be used to replay history. This solves the "cold start" problem for protocols, relying on streaming. Now you can replay the entire chain history through the exact same pipe you use for live data.

```text
[warehouse nodes] │ │ snapshots ▼ [Old Faithful CAR builder] │ │ CAR archives ▼ [storage: disk / S3 / IPFS] │ │ │ RPC/gRPC (history) │ Geyser replay ▼ ▼ [apps needing history] [Historical streams → indexers]
```

## Shred streaming

If you’re building on Solana, you’ve probably heard of shred streaming. Simply put, shreds are the atomic units of a block: fixed-size, erasure-coded packets of block data that a leader cuts from batched transactions and broadcasts to other validators, who use them to reconstruct entries and replay the full block

High-staked validators are the first to receive shreds. Standard RPC nodes sit much further downstream in Turbine. If you let nature (or Solana) take its course, you’re waiting an extra 15-80 ms (or even >200 ms for certain slots) for propagation hops and block reconstruction before you see anything.

But at Triton, we bypass the wait through:

-   Colocation: our streaming nodes are colocated with high staked validators, giving an edge through rebroadcast shreds whenever they have leader slots
-   Global shred distribution network: we automatically distribute all shreds that hit our edge routers through our global network of low-latency networking links to all our streaming nodes, so they see shreds as soon as they enter our network.

By optimising the ingestion step, we eliminate the physical hops and give you a real, measurable speed advantage.

```text
[leader] │ │ shreds via Turbine ▼ [high-stake Triton validator] │ │ early shreds + replay ▼ [relay nodes] │ │ low-latency hop ▼ [streaming nodes] │ │ gRPC / WS ▼ [HFT / RFQ / bots / indexers]
```

## Decision matrix: when to use what

By now, you’ve probably realised that “streaming” on Solana isn’t one thing; it’s a family of patterns that solve different problems. The only question left is which tool to use, and when.

To make that easier, here’s a simple decision matrix mapping scenarios to the Yellowstone (and non-Yellowstone) component that fits best:

| If you are: | Use: | Because: |
| --- | --- | --- |
| HFT / MEV / RFQ engines | Dragon’s Mouth gRPC | You need to be first to see state updates and react to them. Every millisecond of overhead matters. |
| Mission-critical indexer | Fumarole gRPC | You need 100% data completeness; network instability, or client restarts can’t lead to missed slots. |
| Frontend / dApp UI | Whirligig WebSockets | You need real-time updates for user interfaces to feel instant. |
| Backfills / audits / cold starts | Old Faithful (gRPC replay) | You need to replay history as a stream: backfill databases, run compliance/tax pipelines, or boot new indexers using the exact same interface as live data. |

## When is Solana RPC polling enough?

Before you tear down your infrastructure, let's talk about when you should stick with RPC polling. You likely don’t need streaming if:

-   There's no need for real-time data
-   Your ops are mostly happening off-chain
-   Requests are infrequent (once every few minutes/hours)
-   Your requests don’t have a pattern; they are random, and you wouldn't need to "subscribe" to any one of them for a long period

Industries that usually stick to RPC:

-   Centralised exchanges (one-off reads)
-   Minting / burning (transactional / one-off)
-   RWA / tokenisation (infrequent updates)
-   DePIN (high volume but often batched)
-   Infrastructure (ephemeral sessions)

## How to choose an RPC provider

Speed matters; a lot. But without the other pillars in place, it won’t take you very far. Here’s the complete checklist to keep in mind when you choose a provider for streaming-heavy systems:

### 24/7 uptime

It doesn't matter if your p99 is 90ms if the service goes down during market volatility. You need to be sure your infrastructure will stay responsive no matter what.

### Data freshness

Some providers will serve you cached data at breakneck speeds, but if that data is stale (higher chances when cached), acting on it will be useless, and sometimes cost you losses.

### Feature depth

Many providers simply host our open-source Yellowstone plugin. That's great (we built it for the community), but if you need advanced features like persistent, high-availability streaming, or enhanced WebSockets, you want the team that constantly ships, improves and pioneers such tools.

### Engineering support

Many providers simply host our open-source Yellowstone plugin. That's fine (we built it for the community), but if you need advanced features like Fumarole (deduplication) or Whirligig (WS proxy), you want the team that actually builds and maintains the code.

### Vendor-lock

Vendor lock is easy to ignore when things are going well and very hard to fix in an emergency (changes of terms, unmet scaling needs, or surprise overages). Before you commit to any RPC provider, check whether core components are open source and confirm that you can run the same stack elsewhere. The more of your pipeline you can’t move without rewriting, the more dependent you are on the provider’s will.

### Pricing

If you are building an analytics dashboard, trading bot, explorer, DEX, or liquidator, streaming will be a major expense.

Some providers hide this with “credits” that get expensive at scale, or gate streaming behind high-tier plans. Here’s how the most popular Solana providers compare when it comes to streaming:

Comparison (price per GB of bandwidth streamed):

| Provider | Model | Approx Cost |
| --- | --- | --- |
| Triton One | Usage based | $0.08 |
| Helius | Credits | $0.15 or 30,000 credits |
| Quicknode | Add-ons marketplace | Starts at $499,heavily limited |
| Alchemy | Credits | $0.08 / GB |

## Implementation guide

We don’t believe in proprietary lock-in. The same clients we use in production are open source, so you can read the code, adapt it to your stack, and self-host your own instance.

### [Rust example](https://github.com/rpcpool/yellowstone-grpc/tree/master/yellowstone-grpc-client?ref=blog.triton.one)

The gold standard for performance:

```rust
use { futures::StreamExt, std::collections::HashMap, yellowstone_grpc_client::GeyserGrpcClient, yellowstone_grpc_proto::prelude::{ CommitmentLevel, SubscribeRequest, SubscribeRequestFilterSlots, SubscribeRequestFilterAccounts, subscribe_update::UpdateOneof, }, }; #[tokio::main] async fn main() -> anyhow::Result<()> { // Connect to the gRPC endpoint let mut client = GeyserGrpcClient::build_from_shared("https://your-endpoint.rpcpool.com")? .x_token(Some("your-x-token".to_string()))? .connect() .await?; // Build subscription request let mut slots = HashMap::new(); slots.insert( "client".to_string(), SubscribeRequestFilterSlots { filter_by_commitment: Some(true), interslot_updates: Some(false), }, ); let mut accounts = HashMap::new(); accounts.insert( "client".to_string(), SubscribeRequestFilterAccounts { account: vec![], // specific account pubkeys owner: vec!["675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8".to_string()], // Raydium AMM filters: vec![], nonempty_txn_signature: None, }, ); let request = SubscribeRequest { slots, accounts, commitment: Some(CommitmentLevel::Processed as i32), ..Default::default() }; // Subscribe and handle updates let (mut _tx, mut stream) = client.subscribe_with_request(Some(request)).await?; while let Some(message) = stream.next().await { match message?.update_oneof { Some(UpdateOneof::Slot(slot)) => { println!("Slot: {}, Status: {}", slot.slot, slot.status); } Some(UpdateOneof::Account(account)) => { println!("Account update at slot: {}", account.slot); } _ => {} } } Ok(()) }
```

### [TypeScript example](https://github.com/rpcpool/yellowstone-grpc/tree/master/yellowstone-grpc-client-nodejs?ref=blog.triton.one)

We recently released a NAPI upgrade for the grpc-js client for TypeScript. This increases throughput by 4x compared to standard JS implementations, removing the single-thread bottleneck ([read the deep dive](https://blog.triton.one/grpc-js-alternative-napi-rust/)).

```ts
import Client, { CommitmentLevel, SubscribeRequest, } from "@triton-one/yellowstone-grpc"; async function main() { // Connect to the gRPC endpoint const client = new Client("https://your-endpoint.rpcpool.com", "your-x-token", { grpcMaxDecodingMessageSize: 64 * 1024 * 1024, // 64MiB }); await client.connect(); // Subscribe to events const stream = await client.subscribe(); // Handle stream events const streamClosed = new Promise<void>((resolve, reject) => { stream.on("error", (error) => { reject(error); stream.end(); }); stream.on("end", resolve); stream.on("close", resolve); }); // Process incoming data stream.on("data", (data) => { if (data.slot) { console.log(`Slot: ${data.slot.slot}, Status: ${data.slot.status}`); } if (data.account) { console.log(`Account update at slot: ${data.account.slot}`); } }); // Build and send subscription request const request: SubscribeRequest = { accounts: { client: { account: [], owner: ["675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"], // Raydium AMM filters: [], }, }, slots: { client: { filterByCommitment: true }, }, transactions: {}, transactionsStatus: {}, entry: {}, blocks: {}, blocksMeta: {}, commitment: CommitmentLevel.PROCESSED, accountsDataSlice: [], ping: undefined, }; await new Promise<void>((resolve, reject) => { stream.write(request, (err) => (err ? reject(err) : resolve())); }); await streamClosed; } main().catch(console.error);
```

## Streaming vs RPC performance comparison

We’ve spent years obsessing over these microseconds, so you don’t have to. Here’s how the main approaches compare at a high level.

| Metric | Standard RPC (Polling) | Native RPC WebSockets | Yellowstone gRPC (Dragon’s Mouth) |
| --- | --- | --- | --- |
| Latency\* | p90 ~150ms for slots | p90 ~10ms for slots, ~374ms for accounts | p90 ~5ms for slots, ~215ms for accounts |
| Payload size | High (JSON + Base64) | Medium (JSON) | Low (Protobuf binary) |
| Reliability | Medium (rate limits, retries) | Low–Medium (fragile connections) | High, especially with Fumarole persistence |
| Backpressure | None (client can spam) | Limited | Native HTTP/2 + gRPC flow control |
| Complexity | Low | Medium | Higher, requires Protobuf and gRPC tooling |
| Best for | Simple apps, occasional reads | UIs with low traffic,“ok” real-time UX | HFT, MEV, indexers, high-traffic and volume dApps |

\*Measured from a Triton mainnet RPC endpoint

## Start building

Streaming is how you keep up with Solana’s throughput and turn microseconds into an edge instead of a liability.

Whether you use Triton’s managed services or bootstrap your own Dragon’s Mouth and Whirligig stack on bare metal, you get:

-   Open-source building blocks
-   Production-grade performance and reliability
-   A path that doesn’t vendor-lock you
