> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/streaming/streaming-troubleshooting-checklist.md).

# Streaming Troubleshooting Checklist

If you’ve started experiencing Dragon’s Mouth gRPC disconnects recently, this page is for you. Solana’s average daily TPS has almost doubled since December, and the full-chain feed can now spike to \~1.3-1.8 Gbps.

Use this checklist to confirm that your environment can keep up with the current Solana throughput.\
If some answers are “no”, that’s ok, we just want you to get the full picture before contacting Triton support.

***

* #### My subscriber host has at least 5 Gbps of network capacity to the internet

  5 Gbps is strongly recommended for large or full-chain subscriptions. In cloud environments, instance types are often capped at 1 Gbps by default
* #### My round-trip latency from the subscriber to the Triton endpoint is ≤ 50 ms

  Lower latency gives you more headroom for variability in network conditions. Measure it from the same machine that runs your subscriber client, using `ping`
* #### Zstd compression is enabled

  Without compression, bandwidth requirements increase significantly, and it becomes much harder to stay on the tip of the blockchain during spikes
* #### Adaptive window size is set to true

  This setting allows the client to adjust flow-control window sizes automatically based on throughput
* #### No cloud Lambdas!

  Cloud Lambdas, like AWS, do not play well with streaming connections. They can leave many open connections on the servers, which can degrade service.
* #### I'm not using vanilla NodeJS

  Vanilla NodeJS is too slow for Solana and requires a special client library. Use Rust, Golang, or the special NodeJS/TypeScript client discussed on our [gRPC Subscriptions](/chains/solana/streaming.md#dragons-mouth-grpc) page.
* #### I’ve tested my stream capacity with the test client

  Use the client-ubuntu tool described on the [gRPC Subscriptions](/chains/solana/streaming.md#dragons-mouth-grpc) page to benchmark your streaming setup. If it outputs a ping message every 10 seconds and you get a total between 60-80 Mbps, it means your setup is keeping up great, and you can stay on the chain’s tip without any disconnections.\
  \
  Can be run using:\
  `./client-ubuntu-22.04 --http2-adaptive-window true ---compression zstd --endpoint http://aaa.mainnet.rpcpool.com --x-token <token> subscribe --transactions --accounts --stats`
* #### I’ve considered other Triton streaming options for my workload

  If you’re using Dragon’s Mouth, we assume your workload prioritises lowest latency over absolute data completeness, persistence, and redundancy.<br>

  If you’d prefer the guarantees over speed, for example, if you run accounting, analytics, indexing, or compliance workloads, consider using Fumarole (beta) instead of raw gRPC.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/streaming/streaming-troubleshooting-checklist.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
