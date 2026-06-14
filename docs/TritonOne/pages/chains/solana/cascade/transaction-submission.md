> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/cascade/transaction-submission.md).

# Transaction Submission API

Triton's Cascade-enabled Solana endpoints support a direct HTTP transaction submission path that bypasses the JSON-RPC layer entirely:

```
POST /sendtx
```

This endpoint is designed for latency-sensitive workloads where every millisecond of overhead matters. It accepts a plain transaction payload over HTTP and eliminates several sources of latency present in a standard `sendTransaction` JSON-RPC call.

#### Why use `/sendtx` instead of `sendTransaction`?

The standard Solana `sendTransaction` RPC method wraps your transaction in a JSON-RPC envelope, which adds overhead at every stage of the request. The `/sendtx` endpoint removes that overhead.

* **No JSON parsing.** The server receives your transaction bytes directly, skipping JSON deserialization.
* **No CORS preflight.** When using `Content-Type: application/octet-stream` or `text/plain`, browsers skip the preflight `OPTIONS` request. That saves a full round-trip.
* **Smaller payloads.** Without the JSON-RPC wrapper (`jsonrpc`, `id`, `method`, `params`), the request body is smaller on the wire.
* **Simpler client code.** You don't need a Solana JSON-RPC client library. A single HTTP POST is all it takes.

This makes `/sendtx` a good fit for **browser-based applications** that are sensitive to preflight latency and **high-frequency backends** that send large volumes of transactions.

If you need a transaction signature returned in the response, use the `response=signature` query parameter. Otherwise, track signatures client-side before submitting. The signature is deterministic and can be derived from the signed transaction before it is sent.

{% hint style="info" %}
If you prefer the standard Solana RPC interface or need full `sendTransaction` options like `skipPreflight`, you can continue using `sendTransaction` as normal. See our [Transaction sending advice](/chains/solana/cascade/sending-txs.md) for best practices.
{% endhint %}

#### Request format

**Method:** `POST`\
**Path:** `/sendtx`

The request body should contain your serialized transaction. You can submit it in one of two ways:

* **Raw bytes.** Set `Content-Type: application/octet-stream` and send the transaction as a binary payload.
* **Encoded string.** Set `Content-Type: text/plain` and send the transaction as a text body (base58 or base64). Use the `encoding` query parameter to indicate the format.

#### Query parameters

| Parameter     | Values             | Required    | Description                                                                 |
| ------------- | ------------------ | ----------- | --------------------------------------------------------------------------- |
| `encoding`    | `base58`, `base64` | No          | Encoding format when sending the transaction as text. Defaults to `base58`. |
| `response`    | `signature`        | Recommended | When set, the response body contains the transaction signature on success.  |
| `max_retries` | integer            | No          | Override the default retry count for this transaction.                      |

#### Optional headers

| Header                      | Description                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `solana-forwardingpolicies` | Comma-separated [Yellowstone Shield](/project-yellowstone/shield-transaction-policies.md) policy addresses to apply when forwarding. |

#### Examples

**Raw bytes**

```bash
curl -X POST 'https://<your-endpoint>/sendtx?response=signature&max_retries=3' \
  -H 'Content-Type: application/octet-stream' \
  --data-binary @transaction.bin
```

**Base64-encoded transaction**

```bash
curl -X POST 'https://<your-endpoint>/sendtx?encoding=base64&response=signature' \
  -H 'Content-Type: text/plain' \
  -d '<base64-encoded-transaction>'
```

**Base64 with a Yellowstone Shield forwarding policy**

```bash
curl -X POST 'https://<your-endpoint>/sendtx?encoding=base64&response=signature' \
  -H 'solana-forwardingpolicies: <policy-address>' \
  -d '<base64-encoded-transaction>'
```

#### Response

**On success:**

* HTTP `200 OK`
* If `response=signature` was set, the body contains the transaction signature as plain text.
* If `response=signature` was not set, the body is empty. Derive the signature client-side from your signed transaction before submitting.

**On error:**

* HTTP `4xx` or `5xx`
* The response body contains error details describing what went wrong.

#### Notes

* `/sendtx` is for transaction submission only. It does not support simulation or other RPC methods.
* For best results, follow our [Transaction sending advice](/chains/solana/cascade/sending-txs.md) for client-side retries, compute budgets, priority fees, and preflight handling.
* If you are using Yellowstone Shield policies, see the [Shield documentation](/project-yellowstone/shield-transaction-policies.md) for configuration details.


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/cascade/transaction-submission.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
