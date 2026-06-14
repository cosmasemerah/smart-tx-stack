> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-assets-by-authority.md).

# Get Assets By Authority

Fetch all the assets belonging to a specific authority. This allows paged responses in order to easily fetch a large number of records.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-asset-by-authority)

| Name             | Description                                                                                                                                                                                       | Required |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| authorityAddress | Address of the asset authority                                                                                                                                                                    | Yes      |
| sortBy           | The Sorting Criteria: Defined as an object `{ sortBy: , sortDirection: }`, where `sortBy` can be `"created", "updated", "recentAction", or "none"`, and `sortDirection` can be `"asc" or "desc"`. | No       |
| limit            | The maximum number of assets to retrieve.                                                                                                                                                         | No       |
| page             | The index of the "page" to retrieve.                                                                                                                                                              | No       |
| before           | Fetch assets before the given ID.                                                                                                                                                                 | No       |
| after            | Fetch assets after the given ID.                                                                                                                                                                  | No       |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getAssetsByAuthority",
    "params": [
        "3pMvTLUA9NzZQd4gi725p89mvND1wRNQM3C8XEv1hTdA",
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
GET https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-assets-by-authority.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
