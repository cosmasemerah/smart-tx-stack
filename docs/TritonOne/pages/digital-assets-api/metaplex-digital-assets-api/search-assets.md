> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/search-assets.md).

# Search Assets

The method allows users to query and retrieve information about specific NFT assets based on certain criteria (custom-query). This query provides filters such as asset name, owner address, collection ID, or other relevant attributes to narrow down your search. Using this method, users can programmatically explore the Metaplex ecosystem, retrieve information about specific NFT assets, and perform various operations related to those assets, such as transferring ownership or displaying asset metadata.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/search-assets)

| Name                | Description                                                                                                                                                                                                                | Required |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `negate`            | Indicates whether the search criteria should be inverted or not.                                                                                                                                                           | No       |
| `conditionType`     | Indicates whether to retrieve all (`"all"`) or any (`"any"`) asset that matches the search criteria.                                                                                                                       | No       |
| `interface`         | The interface value (one of `["V1_NFT", "V1_PRINT" "LEGACY_NFT", "V2_NFT", "FungibleAsset", "Custom", "Identity", "Executable"]`).                                                                                         | No       |
| `ownerAddress`      | The address of the owner.                                                                                                                                                                                                  | No       |
| `ownerType`         | Type of ownership `["single", "token"]`.                                                                                                                                                                                   | No       |
| `creatorAddress`    | The address of the creator.                                                                                                                                                                                                | No       |
| `creatorVerified`   | Indicates whether the creator must be verified or not.                                                                                                                                                                     | No       |
| `authorityAddress`  | The address of the authority.                                                                                                                                                                                              | No       |
| `grouping`          | The grouping `["key", "value"]` pair.                                                                                                                                                                                      | No       |
| `delegateAddress`   | The address of the delegate.                                                                                                                                                                                               | No       |
| `frozen`            | Indicates whether the asset is frozen or not.                                                                                                                                                                              | No       |
| `supply`            | The supply of the asset.                                                                                                                                                                                                   | No       |
| `supplyMint`        | The address of the supply mint.                                                                                                                                                                                            | No       |
| `compressed`        | Indicates whether the asset is compressed or not.                                                                                                                                                                          | No       |
| `compressible`      | Indicates whether the asset is compressible or not.                                                                                                                                                                        | No       |
| `royaltyTargetType` | Type of royalty `["creators", "fanout", "single"]`.                                                                                                                                                                        | No       |
| `royaltyTarget`     | The target address for royalties.                                                                                                                                                                                          | No       |
| `royaltyAmount`     | The royalties amount.                                                                                                                                                                                                      | No       |
| `burnt`             | Indicates whether the asset is burnt or not.                                                                                                                                                                               | No       |
| `sortBy`            | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]`. | No       |
| `limit`             | The maximum number of assets to retrieve.                                                                                                                                                                                  | No       |
| `page`              | The index of the "page" to retrieve.                                                                                                                                                                                       | No       |
| `before`            | Retrieve assets before the specified ID.                                                                                                                                                                                   | No       |
| `after`             | Retrieve assets after the specified ID.                                                                                                                                                                                    | No       |
| `jsonUri`           | The value for the JSON URI.                                                                                                                                                                                                | No       |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "searchAssets",
    "params": {
        "ownerAddress": "Ewb8XmZ4RbSAxnFY4P4XMtjz5EccYn12bnUF6T4SSvVq",       
        "page": 1,
        "limit": 50
    }
}
```

</details>


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/search-assets.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
