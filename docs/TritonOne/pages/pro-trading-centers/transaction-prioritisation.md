> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/pro-trading-centers/transaction-prioritisation.md).

# Transaction prioritisation

The new QUIC protocol for Solana transactions introduces a limited number of connection slots and rate limits for anonymous and un-staked RPC nodes. This means that an un-staked node might see slower transaction propagation during periods of high contention.

On the network layer, we can forward your transactions via staked nodes to increase the bandwidth to all QUICports, ensuring your transaction reaches the validator. With access to all QUIC bandwidth, your RPC node will not be rate-limited.

We also recommend adding TX prioritization fees or utilizing systems like Jito for your transaction forwarding; these work together with our TX prioritization to improve your transaction speed during network contention.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/pro-trading-centers/transaction-prioritisation.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
