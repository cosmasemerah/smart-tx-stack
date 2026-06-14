> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/project-yellowstone/program-data-streams.md).

# Program Data Streams

## Introduction

Program Data Streams are a high-performance gRPC endpoints that provides real-time, parsed Solana blockchain data streams by program. It solves the critical challenge of efficiently monitoring and reacting to on-chain activities by delivering pre-parsed account states and transaction instructions for specific Solana programs.

Powered by the [Yellowstone Vixen](https://github.com/rpcpool/yellowstone-vixen) open-source framework which provides the building blocks to create custom indexes for specific programs, accounts, and transactions. Vixen Streams enables developers to build responsive applications that can react to on-chain events without the complexity of building and maintaining custom parsing infrastructure.

### The Problem

Traditionally, monitoring blockchain activity requires:

* Polling RPC endpoints, which is inefficient and prone to missing fast-moving events.
* Custom parsing and filtering logic, which is complex to develop and difficult to scale.
* High infrastructure costs, as developers must manage large volumes of raw blockchain data.

### The Solution

Vixen Streams addresses these pain points by providing:

* gRPC Streaming – Real-time, high-performance delivery of parsed Solana blockchain data.
* Multi-Program Support – Detailed parsing for multiple Solana programs, with more coming soon.
* Scalability – Designed to handle high transaction volumes efficiently.
* TypeScript SDK – A simple and secure SDK for TypeScript applications with token-based authentication, abstracting away gRPC and protobuf complexity.

## Getting Started

Install the [Typescript SDK](https://www.npmjs.com/package/@triton-one/vixen-stream)

```bash
npm install @triton-one/vixen-stream
```

### Usage

```typescript
import {
  ProgramStreamsServiceClient,
  ProgramUpdateType,
  credentials,
  createCallCredentials,
  ProgramAddress,
} from "@triton-one/vixen-stream";

const creds = credentials.createSsl();

// <token> is your Triton One authentication token
const callCredentials = createCallCredentials("<token>");

const combinedCredentials = credentials.combineChannelCredentials(
  creds,
  callCredentials
);

// <endpoint> is your Triton One RPC endpoint
const client = new ProgramStreamsServiceClient(
  "<endpoint>",
  combinedCredentials
);

// Subscribe to account and instruction updates for the token keg program
let stream = client.Subscribe({
  program: ProgramAddress.Token,
});

// Handle the update events as you see fit. Write them to a database, call an API, or submit a Solana transaction.
stream.on("data", function (update: ProgramUpdateType<ProgramAddress.Token>) {
  console.log(update);
});

stream.on("end", () => console.log("end"));
stream.on("error", (e: Error) => console.log("error: ", e));
```

## Supported Programs

The following table lists the supported programs and their corresponding addresses. If you need support for additional programs, please reach out to our support.

<table><thead><tr><th width="252.1171875">Program</th><th>Address</th></tr></thead><tbody><tr><td>Token</td><td>TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA</td></tr><tr><td>Token22</td><td>TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb</td></tr><tr><td>OrcaWhirlpool</td><td>whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc</td></tr><tr><td>RaydiumClmm</td><td>CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK</td></tr><tr><td>Meteora</td><td>LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo</td></tr><tr><td>Pumpfun</td><td>6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P</td></tr><tr><td>JupiterSwap</td><td>JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4</td></tr><tr><td>MeteoraAmm</td><td>cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG</td></tr><tr><td>Moonshot</td><td>MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG</td></tr><tr><td>PumpSwaps</td><td>pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA</td></tr><tr><td>RaydiumCpmm</td><td>CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C</td></tr><tr><td>RaydiumAmmv4</td><td>675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8</td></tr><tr><td>KaminoLimitOrders</td><td>LiMoM9rMhrdYrfzUCxQppvxCSG1FcrUK9G8uLq4A1GF</td></tr></tbody></table>

### FAQ

#### ❓ What commitment level are streams set to?

*Answer:* Streams deliver change events for all commitment levels (Processed, Confirmed, and Finalized).

❓ I’m getting a parser error. What should I do?

*Answer:* Make sure you have the latest SDK version installed. Check [npm](https://www.npmjs.com/package/@triton-one/vixen-stream) for the most recent release.

❓ Are streams globally distributed?

*Answer:* Yes. Our infrastructure runs in the USA, EU, and AP regions, minimizing latency for developers worldwide.\
❓ Can I stream multiple programs simultaneously?

*Answer:* Yes. You can open multiple subscriptions to stream data for different programs in parallel.

#### ❓ How do I authenticate?

*Answer:* Authentication is handled via token-based credentials. You must provide a valid Triton One token when initializing the client. Since we are currently in Beta, you’ll need to contact Triton Support to receive a token.

❓ What’s the difference between this and RPC polling?

*Answer:* RPC polling requires repeatedly fetching data and parsing it manually, which is slower and resource-intensive. Vixen Streams pushes pre-parsed, program-specific updates in real time, reducing overhead and improving responsiveness.

❓ Is there rate limiting?

*Answer:* No, there is no rate limiting. However, usage is billed based on bandwidth consumption.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/project-yellowstone/program-data-streams.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
