> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/sui/archival-storage-and-services.md).

# Archival Storage and Services

### Overview

Full nodes on Sui enforce limited data retention for performance and scalability reasons. Once a full node prunes older data, it is no longer available through the standard gRPC or JSON-RPC endpoints.

The **Archival Storage and Service** solves this by providing long-term, consistent access to the full historical record of the Sui blockchain — including old transactions, checkpoints, and object states from genesis. It is the historical backbone for indexers, analytics platforms, exchanges, and any application that needs to query data older than what a full node retains.

The Archival Service exposes the same `LedgerService` gRPC interface, so if you are already using the standard gRPC API, switching to the archival endpoint for historical lookups requires no client changes beyond the endpoint URL.

> **Note:** The standard gRPC full node endpoint does **not** automatically fall back to Archival when data has been pruned. Your application must query the Archival endpoint explicitly for historical data.

***

### Endpoints

#### Shared Clients

Shared plan clients access the Archival Service via a fixed shared endpoint:

```
archive.mainnet.sui.rpcpool.com:443
```

**Authentication** is required via the `X-Token` header:

```
X-Token: <your-token>
```

Your token can be found in your [client panel](https://customers.triton.one/).

***

#### Dedicated Clients

Dedicated plan clients have a private archival endpoint provisioned exclusively for their use:

```
archive-XXX.sui.rpcpool.com:443
```

Replace `XXX` with your dedicated endpoint slug shown in the panel.

**Authentication** is required via the `X-Token` header:

```
X-Token: <your-token>
```

Both your endpoint and token can be found in your [client panel](https://customers.triton.one/).

***

### Authentication

All archival endpoints require the `X-Token` header on every request — the same token used for your standard gRPC endpoint.

Example with `grpcurl`:

```bash
grpcurl \
  -H "X-Token: <your-token>" \
  archive.mainnet.sui.rpcpool.com:443 \
  list
```

***

### What Data is Available

The Archival Service stores and serves the complete history of the Sui mainnet, including:

* **Transactions** — full transaction data from genesis
* **Checkpoints** — complete checkpoint records
* **Object states** — historical object snapshots at past checkpoints
* **Effects and events** — full transaction effects and emitted events

***

### Using the Archival Service

The Archival Service uses the standard Sui gRPC `LedgerService` interface. You interact with it the same way as a regular gRPC full node — the only difference is the endpoint URL.

#### List available services

```bash
grpcurl \
  -H "X-Token: <your-token>" \
  archive.mainnet.sui.rpcpool.com:443 \
  list
```

#### Get a historical transaction

```bash
grpcurl \
  -H "X-Token: <your-token>" \
  -d '{
    "digest": "<transaction-digest>"
  }' \
  archive.mainnet.sui.rpcpool.com:443 \
  sui.rpc.v2.LedgerService/GetTransaction
```

#### Get a historical checkpoint

```bash
grpcurl \
  -H "X-Token: <your-token>" \
  -d '{
    "sequence_number": 12345678
  }' \
  archive.mainnet.sui.rpcpool.com:443 \
  sui.rpc.v2.LedgerService/GetCheckpoint
```

#### Get an object at a historical checkpoint

```bash
grpcurl \
  -H "X-Token: <your-token>" \
  -d '{
    "object_id": "0x<object-id>",
    "version": "<object-version>"
  }' \
  archive.mainnet.sui.rpcpool.com:443 \
  sui.rpc.v2.LedgerService/GetObject
```

> For dedicated clients, replace `archive.mainnet.sui.rpcpool.com` with your dedicated archival endpoint `archive-XXX.sui.rpcpool.com`.

***

### Routing Strategy: Full Node vs. Archival

A common production pattern is to query your standard gRPC endpoint first for recent data, and fall back to the Archival endpoint when data is not found (i.e. when the node returns `NotFound`).

```
Request
  │
  ▼
Standard gRPC endpoint (XXX.sui.rpcpool.com)
  │
  ├─ Found → Return result
  │
  └─ NotFound → Retry on Archival endpoint
                  (archive.mainnet.sui.rpcpool.com
                   or archive-XXX.sui.rpcpool.com)
```

This keeps latency low for recent data while ensuring full coverage for historical lookups.

***

### Endpoint Summary

| Plan          | Standard gRPC Endpoint    | Archival Endpoint                     |
| ------------- | ------------------------- | ------------------------------------- |
| **Shared**    | `XXX.sui.rpcpool.com:443` | `archive.mainnet.sui.rpcpool.com:443` |
| **Dedicated** | `XXX.sui.rpcpool.com:443` | `archive-XXX.sui.rpcpool.com:443`     |

> `XXX` is your unique endpoint slug, visible in the [client panel](https://customers.triton.one/).

Authentication is the same `X-Token` header for both endpoint types.

***

### Resources

* [Official: Archival Store and Service](https://docs.sui.io/develop/accessing-data/archival-store)
* [Official: Querying Historical Data with Archival Service](https://docs.sui.io/develop/accessing-data/archival-store/using-archival-store)
* [grpcurl tool](https://github.com/fullstorydev/grpcurl)


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/sui/archival-storage-and-services.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
