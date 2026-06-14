> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-assets-by-group.md).

# Get Assets By Group

{% hint style="warning" %}
Temporary Suspension

This method is currently temporarily disabled for maintenance and performance optimization. Please avoid calling this method until further notice.
{% endhint %}

The method then returns a response containing information about all the assets belonging to a specific group, like a Collection.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-asset-by-group)

| Name       | Description                                                                                                                                                                                                               | Required |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| groupKey   | The key of the group (e.g., `"collection"`).                                                                                                                                                                              | Yes      |
| groupValue | The value of the group.                                                                                                                                                                                                   | Yes      |
| sortBy     | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]` | No       |
| page       | The index of the "page" to retrieve.                                                                                                                                                                                      | No       |
| before     | Fetch assets before the given ID.                                                                                                                                                                                         | No       |
| after      | Fetch assets after the given ID.                                                                                                                                                                                          | No       |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getAssetsByGroup",
    "params": {
        "groupKey": "collection",
        "groupValue": "BUjZjAS2vbbb65g7Z1Ca9ZRVYoJscURG5L3AkVvHP9ac",
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
GET https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-assets-by-group.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
