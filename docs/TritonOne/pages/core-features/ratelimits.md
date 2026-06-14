> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/core-features/ratelimits.md).

# Rate limits

#### Why we have rate limits

We apply rate limits to all our nodes to ensure service stability and protect our infrastructure from abusive traffic. Our goal is to allow legitimate application traffic to flow smoothly while mitigating the impact of aggressive bots.

#### How it works

Rate limits are primarily based on your originating IP address. If you exceed the request limit in a given time window, our server will reply with an **`HTTP 429 Too Many Requests`** status code.

{% hint style="info" %}
**Handling a `429` Error**

Your application's logic for handling rate limits is critical. When you receive a `429` error, you **must pause all requests from that IP for 10 seconds**.

Attempting to retry immediately will only result in more `429` errors and will not succeed. A 10-second backoff is required to get out of the rate-limited state.
{% endhint %}

#### Rate limits on the shared service

Our shared RPC pools have standard rate limits designed for well-written frontend dApp traffic.

* **Default limit:** The standard limit for most methods is **1200 requests per 10 seconds** per IP.
* **Stricter limits:** Computationally expensive methods, such as `getProgramAccounts`, have significantly lower limits.
* **View your limits:** To see the specific limits for your endpoint, visit `https://<your-endpoint>.rpcpool.com/ratelimits`.
* **Monitor programmatically:** Shared pool responses include `X-Ratelimit-*` HTTP headers, allowing you to monitor your current usage in real-time.

#### Custom limits for dedicated nodes

If you have a dedicated node, we can customise your rate limits to perfectly suit your workload.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/core-features/ratelimits.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
