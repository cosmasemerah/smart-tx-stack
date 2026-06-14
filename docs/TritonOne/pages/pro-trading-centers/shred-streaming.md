> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/pro-trading-centers/shred-streaming.md).

# Shred streaming

RPC nodes in the trading centers have shred streaming enabled, meaning they receive incoming shreds faster than typical RPC nodes.

Unstaked nodes (RPC nodes) are generally last in Solana's fanout schedule for block data. We can use shred streams to ensure that the RPC node receives the data as soon as any of the other nodes in our data centers.&#x20;

This is enabled by having highly staked validators that can forward shreds. These staked validators typically end up in the first round in the fanout schedule.&#x20;


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/pro-trading-centers/shred-streaming.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
