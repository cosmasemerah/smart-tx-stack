> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/validators/node-identity-protection.md).

# Node identity protection

The public-private key pair of the node identity enables the node to vote on behalf of your vote account. We hold this key pair and deploy it to the node.&#x20;

This key pairs account must have a sufficient balance to pay voting fees. This key also accrues rewards that help to offset vote fees (or entirely cover them, depending on stake). Therefore, the balance of the node identity may need to be maintained and topped up regularly.

The node identity must be kept safe and secure. Anyone possessing the node identity could set up a second validator that creates issues for your primary validator (and, in the future, potentially slashing). Malicious parties could also receive the rewards the key accrues or empty its balance.

To protect the node identity, we adopt a setup that ensures in-memory-only keys. When our validators boot, they use a temporary node identity that cannot vote for your vote account. This means that once the validator has started up and caught up with the network, it will be in voting-disabled mode.&#x20;

One of our node operators will then authenticate with our secured, encrypted secret storage and enable the validator node to perform a one-time fetch of the real node identity, which is then activated in the Solana validator's memory.&#x20;

This ensures that the node identity is never stored in an unencrypted form anywhere. It is also never transferred anywhere between the validator node and our encrypted storage. This transit of the node key happens over an entirely authenticated and encrypted stream.

Without access to the validator memory space, you would be unable to retrieve the node identity, and there is no durable storage of the identity on the node itself.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/validators/node-identity-protection.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
