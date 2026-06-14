> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/project-yellowstone/old-faithful-historical-archive.md).

# Old Faithful Historical Archive

Old Faithful is Triton's open-source solution to the Solana historical ledger problem, making the entire history of Solana accessible to everyone. Sponsored by the Solana Foundation, this project empowers you to explore Solana's blockchain from genesis to the latest block.

## Key Features

* **Full Historical Access:** Retrieve any Solana block from previous epochs!
* **Flexible APIs:** Access data via standard JSON-RPC, via  or high-performance gRPC streams.
* **Self-Hosted or Managed:** Run your own archive node (requires significant storage) or use Triton's managed endpoints.
* **Open Source:** Built in the open for transparency and community collaboration.

## Getting Started

Old Faithful is automatically integrated into your Triton One subscription. By making a `getBlock` or `getTransaction` call for historical data, our systems will intelligently route you to Old Faithful as required.

### Jetstreamer

[Jetstreamer](https://github.com/anza-xyz/jetstreamer) is our recommended approach to backfilling large amounts of data from the Old Faithful archives. It supports filtering and customizable backends for storing the data. You can also use already existing geyser plugins for processing the data.&#x20;

### Deprecated: gRPC

⚠️ **Service Retired** The current hosted version of the gRPC interface is retired. We are working on an updated version. You can still self-host this. Please contact <support@triton.one> for assistance.

Most JSON-RPC methods can be made with gRPC and for greater efficiency we've also implemented **StreamTransactions** and **StreamBlocks** which allow you to filter large troves of data server side and receive only what's relevant for you. You can see examples in the gRPC [docs](https://docs.old-faithful.net/references/grpc-methods/examples#streaming-methods) page.&#x20;

## Additional Resources

* [Yellowstone Faithful on GitHub](https://github.com/rpcpool/yellowstone-faithful)
* [JSON-RPC Examples](https://docs.old-faithful.net/usage-and-installation/rpc-methods)
* [gRPC Examples](https://docs.old-faithful.net/usage-and-installation/grpc-methods)

## Support

For questions, feedback, or to request access, please contact [customer support](mailto:support@triton.one) or your account representative.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/project-yellowstone/old-faithful-historical-archive.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
