> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/improved-priority-fees-api/for-rpc-providers.md).

# For RPC Providers

If you're an RPC provider or run your own RPC nodes and would like to integrate this feature, here's the patch you'd need to apply to your Solana

{% embed url="<https://github.com/rpcpool/solana-public/tree/v1.17.23-getrpf>" %}

{% embed url="<https://github.com/anza-xyz/agave/issues/3332>" %}

{% embed url="<https://github.com/anza-xyz/agave/pull/217>" %}


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/improved-priority-fees-api/for-rpc-providers.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
