> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-token-accounts.md).

# Get Token Accounts

Retrieve all token accounts linked to a specific mint or owner. Use this to efficiently list all holders of an SPL token or view all tokens owned by a given address.

### Parameters

| Name           | Description                       | Required            |
| -------------- | --------------------------------- | ------------------- |
| `mintAddress`  | The address of associated mint.   | Yes or ownerAddress |
| `ownerAddress` | The owner address of the tokens.  | Yes or mintAddress  |
| `page`         | The current pagination page.      | No                  |
| `limit`        | Number of results per page.       | No                  |
| `cursor`       | Optional pagination cursor.       | No                  |
| `before`       | Return results before the cursor. | No                  |
| `after`        | Return results after the cursor.  | No                  |

<details>

<summary>Request (POST)</summary>

```json
{
    "id": "123",
    "jsonrpc": "2.0",
    "method": "getTokenAccounts",
    "params": {
      "mintAddress": "BUaiggSfm81ZRAeW572dNf1BhXCzZxaWrGNRm5PjSQzY",
      "ownerAddress": "BiKcVb6t6YDZczYjWLjXKwdgAUecdQrp1EJXAfRmu3VR",
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
        "total": 1,
        "limit": 100,
        "page": 1,
        "token_accounts": [
            {
                "address": "EFaMF6bbRnTwDFUZt9FiTjF8hj6w65kLW43YyhyM85HJ",
                "mint": "BUaiggSfm81ZRAeW572dNf1BhXCzZxaWrGNRm5PjSQzY",
                "amount": 1,
                "owner": "BiKcVb6t6YDZczYjWLjXKwdgAUecdQrp1EJXAfRmu3VR",
                "frozen": true,
                "delegate": null,
                "delegated_amount": 0,
                "close_authority": null,
                "extensions": null
            }
        ]
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
GET https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-token-accounts.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
