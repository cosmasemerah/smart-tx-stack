> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-assets-by-owner.md).

# Get Assets By Owner

The method returns a list of assets owned by a certain address or account. You can query the API for all assets associated with that owner by supplying the owner's pubkey as a parameter.

This is the more efficient version of \`getTokenAccountsByOwner\` in the standard Solana RPC API and allows you to access and retrieve the assets owned by a specific address, enabling functionalities like displaying a user's NFT collection, managing ownership, or facilitating transactions involving the owner's assets.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-asset-by-owner)

| Name         | Description                                                                                                                                                                                       | Required |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| ownerAddress | Address of the asset authority                                                                                                                                                                    | Yes      |
| sortBy       | The Sorting Criteria: Defined as an object `{ sortBy: , sortDirection: }`, where `sortBy` can be `"created", "updated", "recentAction", or "none"`, and `sortDirection` can be `"asc" or "desc"`. | Yes      |
| limit        | The maximum number of assets to retrieve.                                                                                                                                                         | No       |
| page         | The index of the "page" to retrieve.                                                                                                                                                              | No       |
| before       | Fetch assets before the given ID.                                                                                                                                                                 | No       |
| after        | Fetch assets after the given ID.                                                                                                                                                                  | No       |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getAssetsByOwner",
    "params": [
        "9kPPbeBAvCtJCZ98EFKabxp7wTeFQRseCYDRdovyfUfz",
        {
            "sortBy": "created",
            "sortDirection": "desc"
        },
        50,
        1,
        null,
        null
    ]
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
GET https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-assets-by-owner.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
