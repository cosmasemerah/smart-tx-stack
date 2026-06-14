> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api.md).

# API Methods

The API follows the JSON-RPC 2.0 specification, requiring requests to include a method name, parameters, and a unique ID.

| Method                                                                                                   | Description                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [getAsset](/digital-assets-api/metaplex-digital-assets-api/get-asset.md)                                 | Retrieve detailed information about an asset using its unique ID.                                                                                                                    |
| [getAssets](/digital-assets-api/metaplex-digital-assets-api/get-assets.md)                               | Retrieve detailed information about multiple assets using theirs unique IDs.                                                                                                         |
| [getAssetProof](/digital-assets-api/metaplex-digital-assets-api/get-asset-proof.md)                      | Obtain a Merkle proof for verifying the integrity of a compressed asset.                                                                                                             |
| [getAssetProofs](/digital-assets-api/metaplex-digital-assets-api/get-asset-proofs.md)                    | Fetch Merkle proofs for multiple compressed assets in a single request.                                                                                                              |
| [getAssetSignatures](/digital-assets-api/metaplex-digital-assets-api/get-asset-signatures.md)            | Fetch transaction signatures associated with a compressed asset.                                                                                                                     |
| [getAssetsByAuthority](/digital-assets-api/metaplex-digital-assets-api/get-assets-by-authority.md)       | Fetch a list of assets controlled by a specific authority.                                                                                                                           |
| [getAssetsByCreator](/digital-assets-api/metaplex-digital-assets-api/get-assets-by-creator.md)           | List all assets that were created by a specified address.                                                                                                                            |
| [getAssetsByGroup](/digital-assets-api/metaplex-digital-assets-api/get-assets-by-group.md)               | \[TEMPORARILY DISABLED] Get assets that belong to a specified group, identified by a key and value. This method is currently unavailable due to scheduled performance optimizations. |
| [getAssetsByOwner](/digital-assets-api/metaplex-digital-assets-api/get-assets-by-owner.md)               | Retrieve all assets associated with a given owner’s public key.                                                                                                                      |
| [searchAssets](/digital-assets-api/metaplex-digital-assets-api/search-assets.md)                         | Perform a search and apply filters to find assets based on various criteria.                                                                                                         |
| [getNftEditions](/digital-assets-api/metaplex-digital-assets-api/get-nft-editions.md)                    | Retrieve all printable editions for a master edition NFT mint.                                                                                                                       |
| [getTokenAccounts](/digital-assets-api/metaplex-digital-assets-api/get-token-accounts.md)                | Retrieve details of all token accounts associated with a given mint or owner.                                                                                                        |
| [getTokenLargestAccounts](/digital-assets-api/metaplex-digital-assets-api/get-token-largest-accounts.md) | Retrieve 20 largest token accounts for a specific SPL Token.                                                                                                                         |

Each API method is explained in detail on its own page, including required parameters and example requests. Navigate through the documentation to explore each method’s capabilities.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
