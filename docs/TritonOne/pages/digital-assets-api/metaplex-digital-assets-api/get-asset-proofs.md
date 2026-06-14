> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-asset-proofs.md).

# Get Asset Proofs

Get merkle proofs for compressed assets by their IDs.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-asset-proofs)

| Name | Description                                 | Required |
| ---- | ------------------------------------------- | -------- |
| ids  | A set of asset IDs used to retrieve proofs. | Yes      |

<details>

<summary>Request (POST)</summary>

```json
{
  "jsonrpc": "2.0",
  "id": "123",
  "method": "getAssetProofs",
  "params": {
    "ids": [
      "EZsmgudhX6EFVfrdxmShDiNj365E85x7kpLJCVvPLVSH",
      "Hhxb7pNvwi76WTSqFjMX5yXjSso1S3agEJ9kQZP9NQeJ"
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
GET https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-asset-proofs.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
