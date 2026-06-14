> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/improved-priority-fees-api.md).

# Improved Priority Fees API

#### The Problem with Standard Priority Fees

Solana's default `getRecentPrioritizationFees` RPC method can be difficult to use effectively for setting a competitive priority fee. It only returns the **minimum** priority fee paid in recent blocks, which is often zero and not a useful indicator of the market rate required for a transaction to land.

#### Our Solution: Percentile-Based Fees

To solve this, we have enhanced the `getRecentPrioritizationFees` method with a `percentile` parameter. You can now request a specific percentile (e.g., 50th for the median fee, 90th for a high-end fee) to get a much more realistic and actionable fee estimate based on recent on-chain activity.

> For other RPC providers or users running their own nodes, we provide the patches to enable this functionality and encourage its adoption for a better developer experience. [Learn more →](/chains/solana/improved-priority-fees-api/for-rpc-providers.md)

#### How to Use the API

The request and response formats are straightforward. The method name remains `getRecentPrioritizationFees`.

**Sample Request**

The `percentile` parameter is an integer between 1 and 10,000, representing a range from 0.01% to 100.00%. For example, `5000` represents the 50th percentile (median).

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "getRecentPrioritizationFees",
  "params": [
    [
      "RNXnAJV1DeBt6Lytjz4wYzvS3d6bhsfidS5Np4ovwZz"
    ],
    {
      "percentile": 5000
    }
  ]
}
```

**Sample Response**

The response format is identical to the standard Solana RPC method, but the prioritizationFee value will reflect the requested percentile instead of the minimum. If no percentile is provided, the method defaults to the original behavior of returning the minimum fee.

```json
{
  "jsonrpc": "2.0",
  "result": [
    {
      "slot": 348126,
      "prioritizationFee": 1000
    },
    {
      "slot": 348127,
      "prioritizationFee": 500
    }
  ],
  "id": 1
}
```

**Client Integration**

Since this is an enhanced method, it may not be available in standard SDKs. We have prepared an example repository with utility functions you can use in your JavaScript/TypeScript codebase to get started quickly.

{% embed url="<https://github.com/rpcpool/solana-prioritization-fees-api/>" %}


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/improved-priority-fees-api.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
