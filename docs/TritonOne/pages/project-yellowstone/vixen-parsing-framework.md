> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/project-yellowstone/vixen-parsing-framework.md).

# Vixen Parsing Framework

## Overview

Yellowstone Vixen is a modular framework for building program-aware, real-time Solana data pipelines. Built to consume Solana events and transform them into structured, actionable data, Vixen powers indexing, analytics, and real-time application backends with ease.

At its core, Vixen listens to Dragon’s Mouth gRPC streams and routes program-specific changes through composable parsers and handlers, letting developers observe, react to, and enrich blockchain activity at scale.

> Use it to build your own indexer, analytics pipeline, or event-driven application—without writing low-level Solana RPC or deserialization logic.

## Why Use Yellowstone Vixen?

Traditional Solana infrastructure is expensive to scale, difficult to extend, and requires deep protocol expertise to interpret data. Vixen changes that by offering:

* ✅ Cost Efficiency: Share a single Dragon’s Mouth stream among multiple pipelines, and only process what you need.
* ⚙️ Operational Simplicity: Vixen is lightweight and dependency-free—easy to run in your own infra, Docker, or Kubernetes.
* 📊 Observability Built In: Get real-time metrics via Prometheus: lag, throughput, error rates.
* 🧱 Composability: Reusable parser crates handle complex cross-program interactions (like CPIs).
* 🔌 Stream-Ready Outputs: Serve parsed data directly to clients over your own gRPC interfaces.

## Key Features

| Feature                       | Description                                                                                   |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| 🛠 Parser + Handler System    | Easily transform raw Solana account/instruction data into structured models with logic hooks. |
| 🔥 Dragon’s Mouth Integration | Ingest real-time Geyser data with a few lines of config.                                      |
| 📈 Prometheus Metrics         | Out-of-the-box support for /metrics scraping.                                                 |
| 🧪 Offline Testing            | Use devnet fixtures to test locally without Solana node access.                               |
| 🔄 gRPC Server                | Serve custom, program-specific streams to your own clients.                                   |

## Quick Start

Here’s a minimal example that listens to Token Program updates and logs parsed data.

```rust
use yellowstone_vixen::Pipeline;
use yellowstone_vixen_parser::token_program::{AccountParser, InstructionParser};
use yellowstone_vixen_yellowstone_grpc_source::YellowstoneGrpcSource;

#[derive(Debug)]
pub struct Logger;

impl<V: std::fmt::Debug + Sync> vixen::Handler<V> for Logger {
    async fn handle(&self, value: &V) -> vixen::HandlerResult<()> {
        tracing::info!(?value);
        Ok(())
    }
}

fn main() {
    // Set up logging and config parsing
    ...

    yellowstone_vixen::Runtime::builder()
        .source(YellowstoneGrpcSource::new())
        .account(Pipeline::new(AccountParser, [Logger]))
        .instruction(Pipeline::new(InstructionParser, [Logger]))
        .metrics(yellowstone_vixen::metrics::Prometheus)
        .commitment_level(yellowstone_vixen::CommitmentLevel::Confirmed)
        .build(config)
        .run();
}
```

```
RUST_LOG=info cargo run -- --config ./Vixen.toml
```

## Prometheus Setup

To run Prometheus locally and collect Vixen metrics:

```
sudo docker-compose up
```

Then visit <http://localhost:9090> to explore.

## Supported Programs

\
Vixen ships with built-in support for a wide and growing set of Solana programs:

| Program                               | Parser                                                                                                                 |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Jupiter Aggregator v6                 | [jupiter-swap-parser](https://github.com/rpcpool/yellowstone-vixen/tree/main/crates/jupiter-swap-parser)               |
| Pump.fun / AMM                        | [pumpfun-parser](https://github.com/rpcpool/yellowstone-vixen/blob/main/crates/pumpfun-parser)                         |
| Boop.fun                              | [boop-parser](https://github.com/rpcpool/yellowstone-vixen/tree/main/crates/boop-parser)                               |
| Kamino Limit Orders                   | [kamino-limit-orders-parser](https://github.com/rpcpool/yellowstone-vixen/blob/main/crates/kamino-limit-orders-parser) |
| Raydium AMM / CLMM / CPMM / Launchpad | [View all Raydium parsers](https://github.com/rpcpool/yellowstone-vixen/tree/main/crates)                              |
| Meteora Vault / DLMM / Pools / DBC    | [View Meteora parsers](https://github.com/rpcpool/yellowstone-vixen/tree/main/crates)                                  |
| Whirlpools                            | [orca-whirlpool-parser](https://github.com/rpcpool/yellowstone-vixen/blob/main/crates/orca-whirlpool-parser)           |
| Virtuals                              | [virtuals-parser](https://github.com/rpcpool/yellowstone-vixen/blob/main/crates/virtuals-parser)                       |
| …                                     | Custom parser support available                                                                                        |

Need support for a new program? [Contact us](mailto:support@triton.one).

You can easily create a parser crate with the [Vixen parser generator](/project-yellowstone/vixen-parsing-framework/generate-parsers-with-codama.md) for Codama, using any IDL specification that Codama supports.

## Dragon’s Mouth Integration

Yellowstone Vixen is powered by [Dragon’s Mouth](/project-yellowstone/dragons-mouth-grpc-subscriptions.md), a high-performance gRPC source for Solana Geyser events.

## Developer Resources

* [🧪 Parser Testing with Fixtures](https://github.com/rpcpool/yellowstone-vixen/tree/main/crates/mock)

  Simulate devnet transactions and accounts offline.
* [📂 Example Pipelines](https://github.com/rpcpool/yellowstone-vixen/tree/main/examples)

  Learn by example—real pipelines for multiple programs.
* [📝 Config File Template](https://github.com/rpcpool/yellowstone-vixen/blob/main/Vixen.example.toml)

  Use this as your base to start streaming.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/project-yellowstone/vixen-parsing-framework.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
