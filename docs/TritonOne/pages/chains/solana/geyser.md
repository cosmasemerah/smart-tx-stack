> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/geyser.md).

# Geyser

We are happy to configure dedicated Geyser nodes.&#x20;

You can see the current set of Geyser plugins that we support here:\
<https://github.com/rpcpool/solana-geyser-park>.

If you want to run a Geyser setup, our recommendation is to have a dedicated node just for Geyser. It is possible to run Geyser and RPC on a single node, but you will face a risk that your RPC calls could put the node behind which would also cause Geyser to fall behind. This could eventually lead to missed Geyser updates.&#x20;

For complete reliability you would need two dedicated nodes. This would enable both failover in case one node goes down but also in cases where we need to upgrade the Solana version or any other regular maintenance of the node.&#x20;

Contact us via your customer support channel if you would like to enable Geyser on your node. We are happy to get on a call to discuss your requirements and experiences of working with Geyser.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/geyser.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
