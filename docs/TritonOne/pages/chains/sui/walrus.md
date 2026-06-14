> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/sui/walrus.md).

# Walrus

[Walrus](https://walrus.xyz/) is a decentralized, scalable, distributed, and fault-tolerant storage layer optimised for storing large binary blobs. Walrus uses Sui for coordination among other things.

Walrus Publisher enables writing data on-chain. Aggregator enables reading data, and Storage nodes provide storage.

Triton hosts Walrus Publishers,  Aggregators. and Storage nodes. Read more about Walrus components from the official [documentation](https://docs.wal.app/dev-guide/components.html).


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/sui/walrus.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
