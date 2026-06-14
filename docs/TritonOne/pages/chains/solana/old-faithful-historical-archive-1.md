> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/old-faithful-historical-archive-1.md).

# Archival Data Access

All our Solana endpoints support querying the full history of the blockchain, all the way back to the genesis block. This allows you to look up historical transactions, blocks, and signatures without needing to manage your own archival infrastructure.

#### How It Works

When you make a request for a transaction, our system will route you to our Alpamayo and block-cache ledger backends. \
\
If the data is within the last several epochs, we will serve it directly from these low-latency endpoints. If the data is older than what these store, the request is automatically forwarded to our long-term archival ledger systems, Hydrant and Old Faithful.

#### Hydrant Archive & Pricing

Our Hydrant archive serves as the final step in our automated lookup process for very old data.&#x20;

* **Pricing:** $10.00 per million queries (or a fraction thereof).
* **Minimum Charge:** $10.00 per month if the service is used.
* **Example Queries:** `getTransaction`, `getBlock`, `getSignaturesForAddress` , `getTransactionsForAddress`.

#### Old Faithful (Next-Generation Archive)

Old Faithful is our modern, open-source solution for accessing Solana's historical ledger that provides gRPC streaming of bulk transaction and block data.

&#x20;It is currently available for use via a separate, dedicated path. Please refer to the full [Old Faithful documentation](/project-yellowstone/old-faithful-historical-archive.md) for details on how to access it today.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/old-faithful-historical-archive-1.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
