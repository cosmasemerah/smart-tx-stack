> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-assets-by-creator.md).

# Get Assets By Creator

This method provides the list of assets created by a particular creator. By using this method, developers and users can programmatically access and retrieve the assets created or owned by a specific creator, enabling functionalities like showcasing an artist's portfolio or facilitating transactions involving the creator's assets.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-asset-by-creator)

| Name           | Description                                                                                                                                                                                                               | Required |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| creatorAddress | The address of the creator of the assets.                                                                                                                                                                                 | Yes      |
| onlyVerified   | Indicates whether to retrieve only verified assets or not. Recommended to set to true to be sure that the asset belongs to the creator.                                                                                   | No       |
| sortBy         | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]` | No       |
| page           | The index of the "page" to retrieve.                                                                                                                                                                                      | No       |
| before         | Fetch assets before the given ID.                                                                                                                                                                                         | No       |
| after          | Fetch assets after the given ID.                                                                                                                                                                                          | No       |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getAssetsByCreator",
    "params": [
        "D3XrkNZz6wx6cofot7Zohsf2KSsu2ArngNk8VqU9cTY3",
        true,
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
GET https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-assets-by-creator.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
