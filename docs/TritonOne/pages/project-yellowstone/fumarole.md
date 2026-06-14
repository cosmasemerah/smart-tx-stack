> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/project-yellowstone/fumarole.md).

# Fumarole Reliable Streams

{% hint style="info" %}
Fumarole is currently in **available by default on all mainnet subscriptions**. For questions or feedback, please reach out through your Triton CS channel.
{% endhint %}

Fumarole is our new streaming system to allow you to be able to reliably stream accounts and transactions.

#### Fumarole provides

* **High availability**: by collecting data from multiple downstream Solana nodes and merging them into a single stream, your stream does not get interrupted if a node restarts or is upgraded.
* Persistence: Fumarole stores up to 4 days of historical state and lets you reconnect your stream if your clients go down. Disconnect and resume from your last position any time within that window.
* **Parallel replay download :** Fumarole can replay in parallel geyser data wherever you left off.

#### How to get started

1. Use your existing mainnet subscription token — no separate access request needed.
2. Read our launch post and get started with the Fume CLI: <https://blog.triton.one/introducing-yellowstone-fumarole>
3. Build your integration with Fumarole via the Rust or Typescript SDKs: <https://github.com/rpcpool/yellowstone-fumarole>

#### Regional Endpoints

Fumarole runs as **independent regional clusters**. We currently operate:

| Region | Endpoint          | Location  |
| ------ | ----------------- | --------- |
| EU     | `ams.rpcpool.com` | Amsterdam |
| US     | `nyc.rpcpool.com` | New York  |

**Choosing an endpoint**

For Fumarole, connect directly to a **regional endpoint** rather than shared `*.mainnet.rpcpool.com` endpoints. Pick the region closest to your backend infrastructure to minimize latency.

{% hint style="warning" %}
Shared `*.mainnet.rpcpool.com` endpoints are **not recommended for Fumarole**. See the next section for why.
{% endhint %}

**Why direct regional endpoints matter for Fumarole**

The shared endpoints (`*.mainnet.rpcpool.com`) routes traffic to the closest regional load balancer based on GeoDNS. For stateless RPC calls this is ideal, any region can serve any request.

**Persistent subscribers in Fumarole are stateful per cluster.** A persistent subscriber and the slot offsets it tracks live locally on the cluster where it was created and **do not replicate across regions**.

If you connect through a shared endpoint, your traffic can be routed to a region where your persistent subscriber does not exist - for example, after a routing change, a network event, or a shift in the perceived geography of your backend. When that happens, your subscriber will not be found on the new cluster and you will need to recreate it.

Pointing your Fumarole client directly at a regional endpoint avoids this entirely.

**Switching regions**

To move a persistent subscriber from one regional cluster to another (e.g., EU → US):

1. Recreate your persistent subscriber on the new cluster - subscribers do not carry over between regional clusters.
2. Point your client to the new regional endpoint.
3. Reconnect. Your existing token continues to work; no token changes are required.

**Cross-region redundancy (customer-managed)**

With multiple regional clusters available, you can implement cross-region redundancy on the client side. If one cluster experiences a major issue, you can fail over to another region by recreating the persistent subscriber **from the last slot you observed on the failing cluster**.

Fumarole makes this type of redundancy easy to handle in the client since it tracks the last **full** slot you consumed.

This pattern is fully customer-managed:

* Your client tracks the last-seen slot per cluster.
* Your client detects the failure and triggers the cutover.
* Triton does not synchronize subscriber state, track last-seen slots, or orchestrate failover between clusters.

If you need this level of redundancy, plan your slot bookkeeping and failover logic accordingly.

#### Migrating from Dragon's Mouth

If you already have code built for our gRPC streams in Dragon's Mouth, integrating with Fumarole for additional reliability is easy. The code changes should be minimal as Fumarole uses the same types as Dragon's Mouth.

The main difference is that you need to manage a **persistent subscriber**, and alter your subscribe request slightly.

For more details see the Github repo:

[Yellowstone-fumarole-client crates.io](https://docs.rs/yellowstone-fumarole-client/0.5.0+solana.3/yellowstone_fumarole_client/)


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/project-yellowstone/fumarole.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
