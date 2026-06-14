> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/cascade/buying-transaction-bandwidth.md).

# Acquiring Transaction Bandwidth

Our Cascade network used to include an open marketplace where you could buy guaranteed transaction bandwidth, these days we offer this for free. This allows your application to bypass congested public routes by using Solana's Stake-Weighted Quality of Service (SWQoS), ensuring more reliable transaction delivery.\
\
Cascade endpoints are used to send transactions over SWQoS transaction bandwidth using our open source transaction sending software. Transactions sent to the the endpoint you will get with your account are always routed to the nearest gateway, ensuring the lowest latency possible from any backend location you might have.\
\
Cascade-only endpoints are possible with us, you are not required to have additional RPC subscriptions with us.

#### How to acquire Transaction Bandwidth

In order to have access to the SWQoS transaction network Triton One needs to add bandwidth for usage to your endpoint. In order to get access please follow the following steps:

1. Make sure you have an active account with us. If you are not yet a Triton One customer make sure to onboard yourself through this link: [https://customers.triton.one/onboarding?utm\_source=docs](https://customers.triton.one/onboarding?utm_source=steve)
2. Once you have an active account, open a conversation with our support team by navigating to the customer dashboard at <https://customers.triton.one> and finding the purple "Talk to Support" button in the lower right corner.
3. In the chat bubble that opens request transaction bandwidth.
4. Once your bid is successful and your bandwidth becomes available , ensure your application is configured to take full advantage of the Cascade network. Following our best practices is critical for performance. [→ Read our Transaction Sending Advice](/chains/solana/cascade/sending-txs.md)


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/cascade/buying-transaction-bandwidth.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
