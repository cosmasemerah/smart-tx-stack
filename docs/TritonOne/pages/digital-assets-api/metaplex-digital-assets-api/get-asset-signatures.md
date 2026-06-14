> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-asset-signatures.md).

# Get Asset Signatures

This method retrieves the transaction signatures associated with a compressed digital asset/NFT. It can be identified by its ID or by tree and leaf index.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-asset-signatures)

| Name      | Description                                    | Required       |
| --------- | ---------------------------------------------- | -------------- |
| id        | The unique identifier of the compressed asset. | or tree + leaf |
| tree      | The tree corresponding to the leaf.            | or id          |
| leafIndex | The leaf index of digital compressed asset.    | or id          |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getAssetSignatures",
    "params": {
      "id": "EZsmgudhX6EFVfrdxmShDiNj365E85x7kpLJCVvPLVSH"
    }
}
```

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getAssetSignatures",
    "params": {
      "tree": "J2aFAeninyTqDjucueEHBTN6JDo1i9cZ7LzfNcvnnuo4",
      "leafIndex": 161957
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
GET https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-asset-signatures.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
