> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/getting-started.md).

# Getting started

Welcome to Triton One! This guide will walk you through the essential first steps to get your application connected to our RPC services.

#### Step 1: Create an account

To get started with using Triton One you will need access to a customer account with an active subscription.

* **Self sign up:** You can sign up following this [link](https://customers.triton.one/onboarding) and make a deposit to activate your account.
* **Contact us directly:** For custom inquiries, you can email us at <support@triton.one> or reach out via [Telegram](https://t.me/tritonone).

Our team will work with you to understand your needs and recommend the best plan, whether it's our shared service or a dedicated node deployment.

#### Step 2: Understand your endpoint vs. your token

Once your account is created, you will receive access to **Endpoints** and **Tokens** through the [Customer Portal](https://customers.triton.one). It is critical to understand the difference:

* **Endpoint URL (for frontend / dApps):**
  * This is the URL you integrate directly into your public-facing dApp or website (e.g., `https://your-app.mainnet.rpcpool.com`).
  * Traffic from these endpoints is typically rate-limited by IP and origin domain to protect against abuse.
  * **Never embed a secret token in your frontend code.**
* **Secret token (for backend services):**
  * A token is a secret key used to authenticate requests from your backend servers, scripts, or trading bots.
  * Backend traffic with a token usually has higher rate limits.
  * **This token must be kept secret.** If you suspect it has been leaked, contact us immediately to have it rotated.

#### 3. Authenticate your request

Triton supports two auth modes:

* **Allowed origins**: tighter rate limit per IP, no secret in the page. Use for browser apps
* **Token auth**: higher rate limit, identifies your account. Recommended for backend services

How you attach the token depends on the protocol.

**x-token header (works for all protocols)**

The `x-token` metadata header authenticates all request types (JSON-RPC, WebSocket, and gRPC).

* Example: `x-token: <your-token>`
* When using the header, the endpoint URL stays clean: `https://<your-endpoint>.mainnet.rpcpool.com`

**Token in the URL path (HTTPS and WSS only)**

JSON-RPC and WebSocket also accept the token in the URL path. Token-in-URL is not supported on gRPC and returns `403`.

Examples:

* `https://<your-endpoint>.mainnet.rpcpool.com/<your-token>`
* `wss://<your-endpoint>.mainnet.rpcpool.com/<your-token>`

#### Step 4: Configure your application

With your endpoint URL, you can now configure your application.

* For standard RPC calls, use the HTTPS URL (e.g., `https://...`).
* For WebSocket subscriptions, replace `https` with `wss` (e.g., `wss://...`).

#### Step 5: Explore the documentation

You're all set! Now you can explore the rest of our documentation to make the most of our service:

* Learn about our [**Core features**](/core-features/introduction.md) like [GeoDNS](/core-features/geodns.md) and [Rate limits](/core-features/ratelimits.md).
* Read our guide on [**Best Practices for Sending Solana Transactions**](/chains/solana/cascade/sending-txs.md).
* Discover our [**Advanced data & streaming**](/project-yellowstone/introduction.md) services for real-time insights.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/getting-started.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
