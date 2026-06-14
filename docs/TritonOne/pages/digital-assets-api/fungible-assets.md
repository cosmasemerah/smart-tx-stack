> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/digital-assets-api/fungible-assets.md).

# Fungible Assets

### **Overview**

The DAS API indexes all mints and token accounts for the Solana Token Program and Token Extensions Program. It allows querying token balances, metadata, and associated program details.

#### **Supported Queries**

* **GetAsset**: Fetch details of a specific token mint.
* **GetAssetsByOwner**: Retrieve all tokens (fungible and non-fungible) held by an account.
* **SearchAssets**: Search for assets using filters, including token type.

#### **Querying Token Balances**

DAS API supports querying token balances across:

* SPL Tokens
* Token22 Tokens
* NFTs (regular and compressed NFTs)

**Example Request**

```json
{
    "jsonrpc": "2.0",
    "id": "string",
    "method": "searchAssets",
    "params": {
        "ownerAddress": "5aZZ4duJUKiMsJN9vRsoAn4SDX7agvKu7Q3QdFWRfWze",
        "tokenType": "All"
    }
}
```

**Example Response**

```json
{
    "id": "TokenMintAddress",
    "content": {
        "metadata": {
            "name": "Jito Staked SOL",
            "symbol": "JitoSOL",
            "token_standard": "Fungible"
        },
        "token_info": {
            "symbol": "EXT",
            "balance": 1000000000,
            "supply": 500000000000,
            "decimals": 9,
            "token_program": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
            "associated_token_address": "H7iLu4DPFpzEx1AGN8BCN7Qg966YFndt781p6ukhgki9"
        }
    }
}
```

The DAS API supports Token22 tokens and their extensions. The response includes the `mint_extensions` field when applicable.

**Example Token22 Response**

```json
{
    "mint_extensions": {
        "transfer_fee_config": {
            "withheld_amount": 0,
            "newer_transfer_fee": {
                "epoch": 500,
                "maximum_fee": 1000000000,
                "transfer_fee_basis_points": 500
            },
            "withdraw_withheld_authority": "AuthorityPublicKey",
            "transfer_fee_config_authority": "AuthorityPublicKey"
        }
    }
}
```

### **Conclusion**

The DAS API allows querying of fungible tokens, SPL and Token22, including metadata, balances, and associated program details.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/digital-assets-api/fungible-assets.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
