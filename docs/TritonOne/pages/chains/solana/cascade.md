> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/cascade.md).

# Cascade

Cascade is our high-performance transaction delivery network for Solana, designed to provide a more reliable and predictable path for your transactions to land on-chain, especially during periods of high network congestion.

#### How It Works

Cascade utilizes Solana's **Stake-Weighted Quality of Service (SWQoS)**, allowing transactions to be sent through the reserved, private connection pools of staked validators. This bypasses the often-congested public TPU ports that standard RPC services use, resulting in a higher delivery success rate.

#### Key Components

* **Bandwidth Marketplace** ~~A marketplace where application developers can~~ [~~buy reserved transaction bandwidth~~](/chains/solana/cascade/buying-transaction-bandwidth.md) ~~and validators can~~ [~~sell their excess bandwidth~~](/chains/solana/cascade/providing-transaction-bandwidth.md)~~, creating a fair market price for priority access.~~ The marketplace has been sunset, we now add SWQoS transaction bandwidth for free at your request.
* **Best Practices for Sending** To get the most out of Cascade, it's crucial to structure your transactions correctly. Following our [Transaction Sending Advice](/chains/solana/cascade/sending-txs.md) for client-side retries, compute budgets, and priority fees will significantly improve performance.
* **Yellowstone Shield Integration** Cascade is fully integrated with [Yellowstone Shield](/project-yellowstone/shield-transaction-policies.md), allowing you to apply on-chain policies to control exactly which validators are allowed to process your transactions, protecting you from MEV and other risks.

#### Getting Access

To start sending transactions through the Cascade network, please contact our support team to get set up.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/cascade.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
