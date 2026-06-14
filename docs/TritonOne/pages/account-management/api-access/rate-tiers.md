> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/account-management/api-access/rate-tiers.md).

# Rate limits

### **Overview**

A rate limit caps how many requests per second an endpoint accepts. Triton enforces it per IP across all nodes to keep endpoints stable and protect against abusive traffic&#x20;

Our goal is to allow legitimate application traffic to flow smoothly while mitigating the impact of aggressive bots.

Endpoints authenticated with a token get a more favourable rate limit than endpoints restricted by allowed origins, since tokens are typically used by backend servers (many users per IP) and allowed origins by browsers (one user per IP).

Rate limits do not affect pricing. Our products are billed by usage (per million requests plus per GB of bandwidth).

### **Get rate limits**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller role.</mark>

<mark style="color:blue;">`GET /api/v1/rate_tiers`</mark>

Returns all Rate Tier types that an Endpoint and Token can get created with.

```json
{
  "rate_tiers": [
    { "name": "free" },
    { "name": "tier1" },
    { "name": "tier2" },
    { "name": "tier3" },
    { "name": "dedi" }
  ]
} 
```


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/account-management/api-access/rate-tiers.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
