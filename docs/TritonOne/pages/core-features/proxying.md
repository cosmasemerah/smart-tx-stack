> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/core-features/proxying.md).

# Proxying

## Proxying Traffic

{% hint style="warning" %}
**Warning: We Strongly Advise Against Proxying** Our platform is engineered for optimal performance, reliability, and security through direct connections. Placing a third-party proxy (like Cloudflare) in front of your RPC endpoint is not recommended, as it typically undermines these core features, introduces significant complexity, and degrades performance.
{% endhint %}

Before attempting to implement a proxy, we urge you to contact our support team. We can almost always provide a more direct, performant, and robust solution to achieve your goals without the drawbacks of an additional network layer.

#### Why We Advise Against Proxying

While proxying can be useful in traditional web hosting, it is poorly suited for high-performance RPC infrastructure for several key reasons.

**1. Performance Degradation and Routing Interference**

Proxying actively interferes with the sophisticated routing mechanisms we use to give you a fast and reliable connection.

* **It Breaks Geo-Routing:** Our standard routing uses GeoDNS to connect your users to the closest geographical datacenter. If your proxy isn't geographically distributed or does not provide accurate EDNS information, it will break this functionality, nullifying the latency benefits.
* **It Is Incompatible with BGP Anycast:** Our next-generation Anycast routing provides a significant performance boost by using the internet's core protocols to find the optimal path from your user to our network. This system relies on the user's real IP address. A proxy completely masks this information, making it impossible for the Anycast system to work as intended and routing your traffic sub-optimally.
* **It Delays Failover:** Proxies often cache DNS records. This can interfere with our ability to reroute your traffic during an emergency, leading to reduced redundancy and longer potential downtimes for your application.

**2. Security and Responsibility Concerns**

When you place a proxy in front of our service, you inherit significant security responsibilities.

* **You Add Redundant DDoS Protection:** Many users enable proxies to gain access to DDoS (Distributed Denial-of-Service) mitigation. However, our infrastructure is already well-protected against DDoS attacks, meaning a commercial provider like Cloudflare adds a layer of protection that your endpoint does not need.
* **You Create a Man-in-the-Middle:** By design, your proxy decrypts all traffic between your users and our servers. You assume full responsibility for any security incidents or data leaks that may result from this.
* **SSL/TLS Misconfiguration is Common:** A common mistake is to use insecure proxy SSL modes (like Cloudflare's "Flexible" or "Full" settings without proper validation), which results in unencrypted traffic over parts of the network and breaks end-to-end security. We do not recommend disabling SSL validation.
* **You Must Handle Abuse Prevention:** When you use a proxy, you take over primary responsibility for rate limiting and abuse prevention. Our systems will see all traffic as coming from your proxy's IP, requiring us to partially disable our standard protections for your endpoint.

**3. Technical and Configuration Complexity**

A proxy setup requires careful and complex configuration to avoid breaking functionality.

* **HTTP Header Forwarding:** You must ensure your proxy is configured to correctly forward critical headers, including `Host` and `Origin` (to prevent CORS errors and routing failures) and `X-Forwarded-For` / `X-Real-IP` (to pass the original user IP).
* **Requires a Specialized Token:** You must contact us to be issued a specialized token for your proxy to use. You need to ensure this token is not leaked in proxy error messages or otherwise.
* **DNS-Layer vs. HTTP-Layer Proxies:** Simple DNS-layer proxies (such as Cloudflare's default "Proxy" DNS records) are generally not supported for our shared endpoints. Only full HTTP-layer proxies can be made to work, and they require the complex configuration described above.

If a misconfigured proxy causes abusive traffic, we will be forced to severely limit or block your endpoint.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/core-features/proxying.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
