> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-token-largest-accounts.md).

# Get Token Largest Accounts

Retrieve the 20 largest token accounts for a specific SPL Token.

### Parameters [(Source)](https://solana.com/docs/rpc/http/gettokenlargestaccounts)

| Name   | Description                                     |
| ------ | ----------------------------------------------- |
| pubkey | The unique identifier of the token to retrieve. |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getTokenLargestAccounts",
     "params": [
       "jovWMTogqDpoEWUSFSns2Y9rkJkfJHsTgPWJgzCjwCF",
       {
         "commitment": "confirmed"
       }
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
GET https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-token-largest-accounts.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
