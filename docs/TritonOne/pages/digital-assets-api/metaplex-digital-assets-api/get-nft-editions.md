> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-nft-editions.md).

# Get NFT Editions

Get all printable editions for a master edition NFT mint.

### Parameters

| Name          | Description                             | Required |
| ------------- | --------------------------------------- | -------- |
| `mintAddress` | The mint address of the master edition. | Yes      |
| `page`        | The current pagination page.            | No       |
| `limit`       | Number of results per page.             | No       |
| `cursor`      | Optional pagination cursor.             | No       |
| `before`      | Return results before the cursor.       | No       |
| `after`       | Return results after the cursor.        | No       |

<details>

<summary>Request (POST)</summary>

```json
{
    "id": "123",
    "jsonrpc": "2.0",
    "method": "getNftEditions",
    "params": {
      "mintAddress": "BUaiggSfm81ZRAeW572dNf1BhXCzZxaWrGNRm5PjSQzY",
      "page": 1,
      "limit": 100
    }
}
```

</details>

<details>

<summary>Response 200</summary>

```json
{
    "jsonrpc": "2.0",
    "result": {
        "total": 0,
        "limit": 100,
        "master_edition_address": "4faJkL1F5yLKTf9DSgqBmp2DJeUKk9fyfZzMKM1nMbzD",
        "supply": 0,
        "max_supply": 0,
        "page": 1
    },
    "id": "123"
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
GET https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-nft-editions.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
