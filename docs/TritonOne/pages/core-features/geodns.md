> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/core-features/geodns.md).

# Routing

We use a multi-layered architecture to route your API requests quickly and reliably across our global network. This page explains our standard routing method and our next-generation BGP Anycast system.

#### Standard Routing: GeoDNS + Load Balancers

By default, we use GeoDNS to resolve your endpoint's domain name to the geographically closest datacenter. This ensures that your application connects to a server in your region, minimizing network latency.

Your endpoint connects not to a single server, but to a high-availability cluster of load balancers within that datacenter. These load balancers then distribute your requests across our fleet of healthy RPC nodes.

This architecture provides **instantaneous failover**. If a backend server fails, our load balancers immediately and automatically redirect traffic to healthy nodes. This protects your application from disruptions without you having to wait for DNS changes to propagate.

#### Next-Generation Routing: BGP Anycast

For the highest level of performance and reliability, we offer routing via BGP Anycast. This advanced method skips GeoDNS entirely and uses the internet's core routing protocols to direct your traffic to our nearest network entry point.

Once your request enters our network, it travels over our private, dedicated backbone to the appropriate backend servers, bypassing the variable performance and congestion of the public internet.

This provides several key advantages:

* **Lower Latency:** BGP routing is often faster and more efficient than DNS-based routing.
* **Improved Reliability:** Your connection is more resilient as it no longer depends on DNS resolution for routing.
* **Enhanced Performance:** Our dedicated network provides a faster, more secure, and more consistent path for your data.

#### How to Use Anycast Routing

BGP Anycast routing is the future of our network and will become the default over time. This feature is currently available for clients who require the highest performance. If you are interested in using an Anycasted endpoint, please contact our support team.

#### Troubleshooting Connectivity

If you notice you are not being routed to the expected region under our **standard GeoDNS system**, please check the following:

* **VPN Usage:** Are you using a VPN? This will make your requests appear to originate from the VPN's location, not your own.
* **DNS Service:** Some custom DNS services can interfere with location data by masking or removing EDNS information.
* **Proxying:** Routing your traffic through a proxy can interfere with GeoDNS effectiveness. Please see our guide on [Proxying](/core-features/proxying.md) for more details.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/core-features/geodns.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
