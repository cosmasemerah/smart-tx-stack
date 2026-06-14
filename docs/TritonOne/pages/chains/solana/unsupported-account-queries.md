> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/unsupported-account-queries.md).

# Unsupported Account Queries

Some account-related Solana JSON-RPC methods are too expensive or require specialized indexing that the **shared mainnet** RPC pool cannot serve reliably. This page lists the exact methods that fall outside the shared pool, what error you should expect, and which dedicated product unlocks them.

If your workload depends on any of the methods below, please reach out to our support team to discuss the appropriate setup.

***

#### Hard-disabled on shared mainnet

These methods return HTTP `410 Gone` with the JSON-RPC error `"The RPC call or parameters have been disabled"`:

| Method               | Reason                                                                                | Where to use it                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `getLargestAccounts` | Prohibitively expensive at mainnet scale; scans the entire account set on every call. | Available on **dedicated** nodes by request.                                                        |
| `requestAirdrop`     | Disabled on mainnet (no faucet).                                                      | Use the official Solana faucet at [faucet.solana.com](https://faucet.solana.com) on devnet/testnet. |

***

#### `getProgramAccounts` — restricted on shared mainnet

The default Agave validator software that powers our shared RPC nodes only maintains built-in secondary indexes for a small set of well-known programs (notably SPL Token and Token-2022). For any other program, an unfiltered `getProgramAccounts` request — or one with filters the validator cannot satisfy from a secondary index — must scan the entire account set, which is not feasible to serve on a shared pool.

If you see this error on shared mainnet:

```
<ProgramId> excluded from account secondary indexes; this RPC method unavailable for key
```

…it means the program you are querying is not on the validator’s secondary-index allowlist, and your query cannot be served from the shared pool. Common cases:

* Querying a custom program with `memcmp` filters (any DeFi/perps/lending/governance program).
* Querying SPL Token without the correct `dataSize` filter — see [Token Program](/chains/solana/token-program.md) for the precise filter shape that does work.

**Solution: Steamboat Custom Indexes.** Steamboat is our Postgres-backed `getProgramAccounts` implementation, populated by a Yellowstone gRPC stream and tuned with custom indexes per program and `memcmp` offset. Query times typically drop from seconds to milliseconds. Steamboat runs on dedicated nodes only.

For details, configuration options, and the SPL Token caveat, see [Steamboat Custom Indexes](/project-yellowstone/cloudbreak-custom-indexes.md).

***

#### Methods served by Steamboat

When Steamboat is enabled on your dedicated node, the following JSON-RPC methods are answered by Steamboat rather than the validator. All others continue to be served by the underlying Agave RPC.

| Method                       | Notes                                                                                                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getProgramAccounts`         | Supports `memcmp`, `dataSize`, and `dataSlice` filters. SPL Token is intentionally **not** routed through Steamboat — Agave’s built-in index already handles it. |
| `getTokenAccountsByOwner`    | Served from the same indexed store.                                                                                                                              |
| `getTokenAccountsByDelegate` | Served from the same indexed store.                                                                                                                              |
| `getSlot`                    | Returns the current slot at the requested commitment level.                                                                                                      |
| `getHealth`                  | Returns the Steamboat service health.                                                                                                                            |

Steamboat **does not** currently implement (these calls are still handled by the validator on the same node, but are listed here for completeness):

* `getMultipleAccounts`
* `getAccountInfo`
* `getBalance`
* `getTokenAccountBalance`
* `getTokenAccountsByMint`
* `getVoteAccounts`

These methods are on the Steamboat roadmap.

**Commitment levels.** Steamboat fully supports `confirmed` and `finalized`. The `processed` commitment level is not supported by default — requests with `processed` are either rejected, or rewritten to `confirmed` if the operator has enabled `processed-commitment = "use-confirmed"`. Full `processed` support is planned as an optional plugin.

**Pagination.** Steamboat currently returns all matching accounts in a single response. Paginated responses are on the roadmap; until then, take care with queries that match very large result sets.

***

#### Digital Assets API — disabled methods

The Digital Assets API (DAS) is enabled by default on all our shared and dedicated endpoints. One method is currently turned off:

| Method             | Status               | Notes                                                                                                         |
| ------------------ | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `getAssetsByGroup` | Temporarily disabled | Disabled for maintenance and performance optimisation. Please avoid calling this method until further notice. |

The full list of DAS methods and their parameters lives in the [API Methods](/digital-assets-api/metaplex-digital-assets-api.md) reference.

***

#### Batch behaviour

The following account-related methods are always **unbatched** — submit them as individual JSON-RPC requests rather than as elements of a batch array:

* `getProgramAccounts`
* `getTokenAccountsByOwner`
* `getTokenAccountsByDelegate`

If you submit them inside a batch, the request is split and each call is processed independently on the back end. This is not an error condition — your application will receive a valid batched response — but it does mean batch ordering and atomicity guarantees do not apply to these calls.

***

#### Summary — which product unlocks which method

| You need...                                                         | Use...                                                                                             |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `getLargestAccounts`                                                | Dedicated node, by request.                                                                        |
| `getProgramAccounts` for a custom program at production performance | [Steamboat Custom Indexes](/project-yellowstone/cloudbreak-custom-indexes.md) on a dedicated node. |
| `getTokenAccountsByOwner` / `getTokenAccountsByDelegate` at scale   | Available on shared RPC; Steamboat-backed on dedicated nodes for higher throughput.                |
| NFT and fungible-asset queries (including compressed NFTs)          | [Digital Assets API](/digital-assets-api/introduction.md) — enabled on all endpoints.              |
| `getAssetsByGroup`                                                  | Currently unavailable. Contact support for the recommended workaround.                             |

If you are not sure which product fits your workload, contact our support team — we can review your query patterns and recommend either an index configuration on Steamboat or a different routing setup.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/unsupported-account-queries.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
