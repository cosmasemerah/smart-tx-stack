> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/deprecated-calls-solana-2.0.md).

# Solana v2.0: Deprecated RPC Methods

> **NOTICE:** The Solana v2.0 network upgrade has already been deployed to Mainnet. As part of this upgrade, several legacy JSON-RPC methods have been permanently removed. If your application still relies on any of the deprecated methods listed below, it will no longer function as expected. We strongly recommend auditing your codebase and updating to the supported successor methods immediately. These modern alternatives are fully live and supported across all nodes.

***

#### Deprecated Methods and Their Successors

The following table lists all RPC methods that will be removed in v2.0 and the new methods that should be used instead.

| Deprecated Method (Old)             | Successor Method (New)                                                                                                 |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `confirmTransaction`                | `getSignatureStatuses`                                                                                                 |
| `getSignatureStatus`                | `getSignatureStatuses`                                                                                                 |
| `getSignatureConfirmation`          | `getSignatureStatuses`                                                                                                 |
| `getConfirmedSignaturesForAddress`  | `getSignaturesForAddress`                                                                                              |
| `getConfirmedSignaturesForAddress2` | `getSignaturesForAddress`                                                                                              |
| `getConfirmedBlock`                 | `getBlock`                                                                                                             |
| `getConfirmedBlocks`                | `getBlocks`                                                                                                            |
| `getConfirmedBlocksWithLimit`       | `getBlocksWithLimit`                                                                                                   |
| `getConfirmedTransaction`           | `getTransaction`                                                                                                       |
| `getRecentBlockhash`                | `getLatestBlockhash`                                                                                                   |
| `getFees`                           | `getFeeForMessage`                                                                                                     |
| `getFeeCalculatorForBlockhash`      | `isBlockhashValid` or `getFeeForMessage`                                                                               |
| `getSnapshotSlot`                   | `getHighestSnapshotSlot`                                                                                               |
| `getStakeActivation`                | Use `getAccountInfo`. [See this guide for the alternative approach.](https://solana.stackexchange.com/questions/15710) |
| `getTotalSupply`                    | **None.** This method will be removed completely.                                                                      |
| `getFeeRateGovernor`                | **None.** This method will be removed completely.                                                                      |

***

#### Resources

* **Official Transition Guide:** For more technical details, please refer to the [Anza Agave v2.0 Transition Guide on GitHub](https://github.com/anza-xyz/agave/wiki/Agave-v2.0-Transition-Guide).

If you have any questions or need assistance updating your application, please reach out to our support team.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/deprecated-calls-solana-2.0.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
