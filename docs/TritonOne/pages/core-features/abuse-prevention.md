> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/core-features/abuse-prevention.md).

# Abuse prevention

#### Our Philosophy

We take a proactive approach to abuse prevention with two primary goals:

1. **Protect Your Application:** Ensure that malicious traffic doesn't disrupt the service for your legitimate users.
2. **Protect Your Bill:** Prevent runaway bots or abusive traffic from causing unexpected charges.

Our abuse prevention systems are a core feature built over several years of experience running high-demand public and private endpoints.

{% hint style="info" %}
**A Note on Proxies**

We manage abuse prevention natively, so you do not need to place third-party proxies (like Cloudflare) in front of our service. In fact, doing so often introduces disadvantages like centralization and man-in-the-middle security risks. For a detailed explanation, please see our [guide on Proxying](/core-features/proxying.md).
{% endhint %}

#### How We Protect You

Our strategy is a multi-layered defense designed to filter out malicious traffic while allowing legitimate requests to pass through smoothly. Key components include:

* **Access Control (Endpoints vs. Tokens):** We provide a clear distinction between two methods of access. **Public Endpoints** are for your frontend dApp and are secured by an allowlist of web origins you provide. **Secret Tokens** are for your backend services and must be kept private.
* **Intelligent** [**Rate Limiting**](/core-features/ratelimits.md)**:** Our platform enforces carefully tuned Rate Limits based on IP address and other factors to prevent any single actor from overwhelming the service.
* **Traffic Filtering:** Our load balancers inspect incoming traffic to ensure it conforms to valid JSON-RPC specifications. Malformed requests or traffic that doesn't resemble a useful RPC call is denied at the edge before it can impact backend nodes.
* **Advanced Fingerprinting:** We employ sophisticated fingerprinting techniques to identify and block malicious actors attempting to circumvent our security measures, such as by spoofing authentication credentials or web origins. This protects against more advanced and persistent abuse patterns.

#### Your Role in Security

Properly using endpoints and tokens is the most important step you can take to secure your service.

* **NEVER** expose a secret Token in public source code, like a frontend JavaScript application. Use your public Endpoint URL instead.
* **ALWAYS** keep your Tokens secure on your backend, treating them like any other API key or password.

For applications like mobile or desktop apps where embedding a token may seem necessary, please contact our support team first. We will help you find a secure setup for your use case.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/core-features/abuse-prevention.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
