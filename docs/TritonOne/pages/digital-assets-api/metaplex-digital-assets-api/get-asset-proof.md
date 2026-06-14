> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-asset-proof.md).

# Get Asset Proof

Fetches the proof path for a given compressed asset/NFT. This method is required for submitting changes to a compressed merkle tree which requires the proof path for the tree it belongs to.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-asset-proof)

| Name | Description                                    | Required |
| ---- | ---------------------------------------------- | -------- |
| id   | The unique identifier of the compressed asset. | Yes      |

<details>

<summary>Request (POST)</summary>

```json
{
  "jsonrpc": "2.0",
  "id": "123",
  "method": "getAssetProof",
  "params": {
    "id": "EZsmgudhX6EFVfrdxmShDiNj365E85x7kpLJCVvPLVSH"
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
GET https://docs.triton.one/digital-assets-api/metaplex-digital-assets-api/get-asset-proof.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
