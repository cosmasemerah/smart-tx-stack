> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/core-features/support-faqs.md).

# FAQs

#### Account & Billing

**Q: How do I get an account?** A: The best way to start is by filling out our [onboarding form](https://forms.gle/rT6nPbUE4toyPfbb7). For custom inquiries, you can also email us at <support@triton.one> or contact us on [Telegram](https://t.me/tritonone).

**Q: Do you require long-term contracts?** A: No, our standard billing is month-to-month.

**Q: What payment methods do you accept?** A: We accept:

* USDC (SPL, ERC20 on Ethereum, Tron, Polygon)
* Payments through hel.io (USDC)
* Credit cards (via Coinflow)
* Wire transfers in GBP and USD

**Q: Can I change my plan later?** A: Yes, you can upgrade or downgrade your plan as your needs change.

**Q: How do I cancel my subscription?** A: We require one calendar month's notice for cancellation. This aligns with the notice periods from our own infrastructure vendors.

#### General Technical Questions

**Q: What happens if I hit my rate limit?** A: Your application will receive `HTTP 429` errors. When this happens, you must pause requests for 10 seconds to clear the limit. We strongly recommend implementing a backoff-and-retry mechanism. See our Rate Limits page for more details.

**Q: Can I run scripts on the shared service?** A: No, the shared service is designed for frontend dApp traffic only. Backend scripts and bots require a dedicated node to ensure fair use and stability for everyone.

**Q: What should I do if my secret token is leaked?** A: Contact us immediately. We will disable the compromised token and issue a new one to secure your account.

**Q: How do I connect to WebSockets?** A: Simply replace `https` with `wss` in your RPC endpoint URL. For example: `wss://your-endpoint.rpcpool.com`. We do recommend however to use the gRPC interface for streaming purposes if available, see [Dragon's Mouth gRPC Subscription](/project-yellowstone/dragons-mouth-grpc-subscriptions.md) page for details on how to do that on Solana.&#x20;

#### Solana-Specific Questions

**Q: How can I use Geyser plugins?** A: Geyser plugins can be enabled on our dedicated Solana nodes. They provide powerful, real-time streams of on-chain data. Contact our support team to discuss your specific needs and we can configure a node for you.

**Q: What is the advantage of sending transactions through a staked validator?** A: Staked validators have access to a much larger, reserved connection pool for sending transactions. During periods of high network congestion on Solana, this provides a significant advantage over the limited, highly contested public connection pools. See [Cascade](/chains/solana/cascade.md).

**Q: Can a "processed" transaction on Solana still be dropped?** A: Yes. A transaction is only final once it reaches `confirmed` or `finalized` commitment. Slots containing `processed` transactions can still be dropped during minority forks or network congestion.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/core-features/support-faqs.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
