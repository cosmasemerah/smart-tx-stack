> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/account-management/api-access/address-watch-lists.md).

# Address Watch Lists

<mark style="color:red;">This feature is only limited to account management API tokens created with the operator or reseller role.</mark>

### Add watch list

<mark style="color:blue;">`POST /api/v1/subscriptions/:subscription-uuid/address_watch_lists`</mark>

**Parameters**

<table><thead><tr><th width="263.3333333333333">Name</th><th>Type</th><th>Description</th></tr></thead><tbody><tr><td><code>variant</code> <mark style="color:red;">*required</mark></td><td><code>string</code></td><td>Must be either <code>collection</code> or <code>tree</code></td></tr><tr><td><code>encoded_value</code> <mark style="color:red;">*required</mark></td><td><code>string</code></td><td></td></tr></tbody></table>

### List watch lists

<mark style="color:blue;">`GET /api/v1/address_watch_lists`</mark>

**Query parameters**

| Name                | Type     | Description |
| ------------------- | -------- | ----------- |
| `variant`           | `string` |             |
| `subscription_uuid` | `string` |             |
| `subscription_type` | `string` |             |

### Delete watch list

<mark style="color:blue;">`DELETE /api/v1/address_watch_lists/:uuid`</mark>


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/account-management/api-access/address-watch-lists.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
