> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-assets.md).

# Get Assets

This method retrieves detailed information about a multiple digital assets/NFTs. The metadata returned includes information about the asset URL, metadata, collection, creators, authorities, compression status and ownership. Alias of `getAsset` method is `getAssetBatch`.

<details>

<summary>Request (POST)</summary>

#### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-assets)

| Name | Description                     |
| ---- | ------------------------------- |
| ids  | A set of asset IDs to retrieve. |

```json
{
  "jsonrpc": "2.0",
  "id": "123",
  "method": "getAssets",
  "params": {
    "ids": [
      "7k7YqWc85BtyTx5UyvNnogv2jPHVe4BZ9HQsFLM8VnoJ",
      "HP2QQgwfTgHNRcX7g3HHMNKxXjAEvQsr1wComqbPfWAR"
    ]
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
GET https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-assets.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
