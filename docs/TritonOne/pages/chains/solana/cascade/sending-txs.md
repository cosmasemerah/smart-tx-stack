> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/cascade/sending-txs.md).

# Transaction sending advice

Sending transactions effectively on Solana requires a client-side strategy that accounts for network congestion and leader schedules. Following these best practices will significantly increase your transaction inclusion rate and create a better experience for your users.

{% hint style="success" %}
**TL;DR: Quick Summary**

* **Handle retries in your own code.** Do not rely on the RPC node to retry for you.
* When sending, set **`maxRetries: 0`**.
* If you need simulations, **do it separately** via `simulateTransaction()` before sending.
* When sending, set **`skipPreflight: true`**.
* Use a recent blockhash from a **`finalized`** or **`confirmed`** commitment level. Never use processed for blockhashes.
* Set a [**tight Compute Unit (CU) budget** and a **competitive priority fee**](#id-3.-set-precise-compute-budgets-and-priority-fees).&#x20;
  {% endhint %}

***

#### 1. Handle Retries in Your Client

Previously, RPC nodes would queue and retry transactions on behalf of the user. During periods of high traffic, this system creates backpressure, saturating the queues and causing widespread transaction failures.

The modern best practice is to manage the retry logic entirely within your own application. This gives you full control over the user experience and leads to more predictable transaction delivery.

* **Your Action:** Build your own asynchronous retry logic (e.g., re-fetching a recent blockhash and re-signing every few seconds).
* **RPC Parameter:** Always include **`maxRetries: 0`** in your `sendTransaction` options. This tells our RPC node not to use its legacy retry queue.

***

#### 2. Simulate First, Then Send

Our Cascade delivery network has more pathways available for transactions that do not require a pre-flight simulation. For the fastest and most reliable delivery, you should separate simulation from execution.

* **Your Action:** If you need to verify a transaction's outcome, call the `simulateTransaction()` method first.
* **RPC Parameter:** When you are ready to send the transaction for real, use `sendTransaction()` with the **`skipPreflight: true`** option.
* **Billing**: `simulateTransaction()` and `sendTransaction()` are two distinct RPC calls, billed independently. That means if you leave `skipPreflight` as `false`, your sends will be billed twice.

***

#### 3. Set Precise Compute Budgets & Priority Fees

A well-defined compute budget and priority fee are critical for getting your transaction included in a block.

* **Compute Budget:** The default CU budget is often too high for simple transactions. Setting an accurate, tight budget helps validators fit your transaction into blocks more efficiently. For example, a simple SOL transfer uses only \~500 CUs. Here is a good page on [How to Optimize Compute Usage on Solana](https://solana.com/developers/guides/advanced/how-to-optimize-compute).
* **Priority Fee:** Including a priority fee is essential. You should check the prevailing market rates for the accounts your transaction needs to write-lock. Our [Improved Priority Fees API](/chains/solana/improved-priority-fees-api.md) can help you determine a competitive fee without overpaying.

***

#### Resources

* **Example Code:** See our [Optimized Transactions Examples](https://github.com/rpcpool/optimized-txs-examples) repository on GitHub for sample client-side retry logic.
* **Further Reading:** This [thread on X by Jordan from Anza Labs](https://x.com/jordaaash/status/1774892862049800524?s=20) provides excellent context on this topic.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/cascade/sending-txs.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
