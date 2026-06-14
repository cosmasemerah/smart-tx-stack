> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/project-yellowstone/dragons-mouth-grpc-subscriptions.md).

# Dragon's Mouth gRPC Subscriptions

Dragon's Mouth is our Geyser-fed gRPC interface that supports streaming:

* Account Writes
* Transactions
* Deshred transactions (pre-execution, beta)
* Entries
* Block notifications
* Slot notifications

It also supports unary operations:

* getLatestBlockhash
* getBlockHeight
* getSlot
* isValidBlockhash
* subscribeReplayInfo

The gRPC streams and RPC calls are supported through Solana's [Geyser](/chains/solana/geyser.md) interface. This is the fastest way to receive updates on on-chain events. This interface is more stable and faster than the traditional WebSocket interface. We recommend using gRPC for all future development of backend clients.

Dragon's Mouth also streams transactions as they are processed in real-time. You will receive multiple account updates within the current slot. This contrasts with regular RPC, where you receive only one update at the end of the slot. For DeFi traders, Dragon's Mouth can give you up to a 400ms advantage over other traders!

Use Dragon's Mouth to stream data directly to your application middle-layer hosted on a cloud service provider. Update your backend database with the lowest possible latency.

gRPC is unsupported by web browsers, so Dragon's Mouth is entirely targeted at backend software. Another Yellowstone project, [Whirligig](/project-yellowstone/whirligig-websockets.md), provides a WebSocket interface to replace the current Solana WebSocket implementation.

### Protocol files

You can find the latest version of protobuf files in the repository <https://github.com/rpcpool/yellowstone-grpc/tree/master/yellowstone-grpc-proto/proto> or use Rust crate <https://crates.io/crates/yellowstone-grpc-proto>.

## Clients/SDKs

We offer sample clients in multiple languages, and you can also use the generic grpcurl client to test the interface. As the underlying gRPC proto can change, it is essential to test with clients matching the current version of the Solana/gRPC interface.

### grpcurl

`grpcurl` is a good client for testing. You will also need the following two Protobuf proto files to describe the protocol:

Example subscription:

```shell
./grpcurl \
  -proto geyser.proto \
  -d '{"slots": { "slots": { } }, "accounts": { "usdc": { "account": ["9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT"] } }, "transactions": {}, "blocks": {}, "blocks_meta": {}}' \
  -H "x-token: <token>" \
  api.rpcpool.com:443 \
  geyser.Geyser/Subscribe
```

Customers should specify their endpoint + token in the example above, developers looking to run their own RPC nodes can test it against their own Solana instances, just remove the x-token header as it's probably not relevant to you.

### client-ubuntu

The yellowstone-grpc project provides a `client-ubuntu` binary for testing gRPC endpoints. Prebuilt binaries are available for Ubuntu 22.04 and 24.04. Download

You can download the latest release from the [Releases](https://github.com/rpcpool/yellowstone-grpc/releases) page.

**Usage Examples**

**Subscribe to all accounts:**

```shell
./client-ubuntu-22.04 --endpoint https://<endpoint> --x-token <token> subscribe --accounts --slots
```

**Subscribe to a specific program** (e.g Raydium)

```shell
./client-ubuntu-22.04 --endpoint https://<endpoint> --x-token <token> subscribe --accounts --slots --accounts-owner 675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8
```

Note: You may also add the `--stats` flag to see useful stats about the subscription, like total amount of accounts / slots streamed + bandwidth

### Rust

A sample Rust client is available at <https://github.com/rpcpool/yellowstone-grpc/tree/master/examples/rust>.

### Golang

A sample Golang client is available at <https://github.com/rpcpool/yellowstone-grpc/tree/master/examples/golang>.

### NodeJS/TypeScript

From version `5.1.x` we supercharged the TypeScript SDK performance with Rust using the NAPI framework. You can read more about it [here](https://blog.triton.one/grpc-js-alternative-napi-rust/).

You can include NodeJS Yellowstone gRPC client as a dependency by running the following command:

```
npm install --save @triton-one/yellowstone-grpc

# or, for yarn:

yarn add @triton-one/yellowstone-grpc
```

A sample Typescript/Nodejs client is available at <https://github.com/rpcpool/yellowstone-grpc/tree/master/examples/typescript>. You can also switch the language of code samples to TypeScript in the following documentation.

#### Initializing the client

Once you have installed the client dependency, you can initialize it as follows:

```javascript
import Client from "@triton-one/yellowstone-grpc";

const client = new Client("https://api.rpcpool.com:443", "<insert your token here>");

// connect to the client
await client.connect();

// now you can call the client methods, e.g.:

const version = await client.getVersion(); // gets the version information
console.log(version);
```

Please note that the client is asynchronous, so it is expected that all calls are executed inside an async block or async function.

#### Subscription streams

You can get updates and send requests through the *subscription stream*. You can create it by calling the `client.subscribe()` method:

```typescript
import { SubscribeRequest } from "@triton-one/yellowstone-grpc";

// Create a subscription stream.
const stream = client.subscribe();

// Collecting all incoming events.
stream.on("data", (data) => {
  console.log("data", data);
});

// Create a subscription request.
const request: SubscribeRequest = {
  // you can use the standard JSON request format here.
  // the following documentation describes available requests and filters.
  ...
};

// Sending a subscription request.
await new Promise<void>((resolve, reject) => {
  stream.write(request, (err) => {
    if (err === null || err === undefined) {
      resolve();
    } else {
      reject(err);
    }
  });
}).catch((reason) => {
  console.error(reason);
  throw reason;
});
```

## Excluded Programs

Certain programs are excluded from all Dragon's Mouth gRPC streams and are also unavailable via `getProgramAccounts`.

| Program                         | Address                                       |
| ------------------------------- | --------------------------------------------- |
| Light Protocol / ZK Compression | `compr6CUsB5m2jS4Y3831ztGSTnDpnKJTKS95d64XVq` |

**Why is Light Protocol /** **ZK Compression excluded?**

The ZK Compression program generates extremely high-volume account updates. Each update produces a \~10MB blob, resulting in several gigabits per second of data. This volume makes it impractical to include in standard gRPC streams.

From a practical standpoint, most users consuming this data are interested in the **end result** processed by the [Photon indexer](https://github.com/helius-labs/photon), not the raw account blobs. If you need ZK Compression data, that is the recommended way to consume it.

## Example Subscribe Requests

Here are examples of subscribe requests you can make to the gRPC interface.

### Subscribe to an account

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{"slots": { "slots": {} }, "accounts": { "wsol/usdc": { "account": ["8BnEgHoWFysVcuFFX7QztDmzuH8r5ZFvyP3sYwn1XTh6"] } }, "transactions": {}, "blocks": {}, "blocks_meta": {}, "accounts_data_slice": [], "commitment": 1}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
import { CommitmentLevel } from "@triton-one/yellowstone-grpc";

const request = {
  "slots": {
    "slots": {}
  },
  "accounts": {
    "wsol/usdc": {
      "account": ["8BnEgHoWFysVcuFFX7QztDmzuH8r5ZFvyP3sYwn1XTh6"]
    }
  },
  "transactions": {},
  "blocks": {},
  "blocksMeta": {},
  "accountsDataSlice": [],
  "commitment": CommitmentLevel.CONFIRMED
};
```

{% endtab %}
{% endtabs %}

This sample subscribes to the SOL-USDC OpenBook account on `confirmed` commitment level. In the example above, "wsol/usdc" is a client-assigned label. You can specify different JSON files to subscribe to different items. You can combine any of these variables below into a JSON to receive a combination of program, account, block, and slot updates.

### Subscribe to an account with \`account\_data\_slice\`

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{
    "accounts": {
        "usdc": {
            "owner": ["TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],
            "filters": [{
                "token_account_state": true
            }, {
                "memcmp": {
                    "offset": 0,
                    "data": {
                        "base58": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
                    }
                }
            }]
        }
    },
    "accounts_data_slice": [{ "offset": 32, "length": 40 }]
}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
import { CommitmentLevel } from "@triton-one/yellowstone-grpc";

const request = {
  "slots": {},
  "accounts": {
    "usdc": {
      "owner": ["TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"],
      "filters": [{
          "tokenAccountState": true
      }, {
          "memcmp": {
              "offset": 0,
              "data": {
                  "base58": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
              }
          }
      }]
    }
  },
  "transactions": {},
  "blocks": {},
  "blocksMeta": {},
  "entry": {},
  "commitment": CommitmentLevel.CONFIRMED
  "accountsDataSlice": [{ "offset": 32, "length": 40 }],
};
```

{% endtab %}
{% endtabs %}

This sample subscribes to the USDC Tokenkeg accounts. With `account_data_slice` instead of receiving all 165 bytes we receive only 40 bytes from account data (`offset` field with 32 gives us `owner` and `lamports`).

### Subscribe to a program

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{"slots": { "slots": {} }, "accounts": { "solend": {  "owner": ["So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo"] } }, "transactions": {}, "blocks": {}, "blocks_meta": {}, "accounts_data_slice": [], "commitment": 0}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
import { CommitmentLevel } from "@triton-one/yellowstone-grpc";

const request = {
  "slots": {
    "slots": {}
  },
  "accounts": {
    "solend": {
      "owner": ["So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo"]
    }
  },
  "transactions": {},
  "blocks": {},
  "blocksMeta": {},
  "accountsDataSlice": [],
  "commitment": CommitmentLevel.PROCESSED
}
```

{% endtab %}
{% endtabs %}

### Subscribe to multiple programs

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{"slots": { "slots": {} }, "accounts": { "programs": {  "owner": [ "So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo", "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"] } }, "transactions": {}, "blocks": {}, "blocks_meta": {}, "accounts_data_slice": []}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
import { CommitmentLevel } from "@triton-one/yellowstone-grpc";

const request = {
  "slots": {
    "slots": {}
  },
  "accounts": {
    "programs": {
      "owner": [
        "So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo",
        "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"
      ]
    }
  },
  "transactions": {},
  "blocks": {},
  "blocksMeta": {},
  "accountsDataSlice": []
};
```

{% endtab %}
{% endtabs %}

OR, if you want different tags for different program updates:

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{"slots": { "slots": {} }, "accounts": { "solend": {  "owner":  ["So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo"] }, "serum": { "owner": ["9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"] } }, "transactions": {}, "blocks": {}, "blocks_meta": {}, "accounts_data_slice": []}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
const request = {
  "slots": {
    "slots": {}
  },
  "accounts": {
    "solend": {
      "owner": ["So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo"]
    },
    "serum": {
      "owner": ["9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"]
    }
  },
  "transactions": {},
  "blocks": {},
  "blocksMeta": {},
  "accountsDataSlice": []
}
```

{% endtab %}
{% endtabs %}

### Subscribe to all finalized non-vote and non-failed transactions

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{"slots": { "slots": {} }, "accounts": {}, "transactions": { "alltxs": { "vote": false, "failed": false }}, "blocks": {}, "blocks_meta": {}, "accounts_data_slice": [], "commitment": 2}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
import { CommitmentLevel } from "@triton-one/yellowstone-grpc";

const request = {
  "slots": {
    "slots": {}
  },
  "accounts": {},
  "transactions": {
    "alltxs": {
      "vote": false,
      "failed": false
    }
  },
  "blocks": {},
  "blocksMeta": {},
  "accountsDataSlice": [],
  "commitment": CommitmentLevel.FINALIZED
};
```

{% endtab %}
{% endtabs %}

For transactions, if all fields are empty, then all transactions are broadcasted. Otherwise, fields work as logical `AND`, and values in arrays as logical `OR`. You can include/exclude vote transactions and include/exclude failed transactions.

### Subscribe to non-vote transactions mentioning an account

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{"slots": { "slots": {} }, "accounts": {}, "transactions": { "serum": { "vote": false, "account_include": [ "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin" ]}}, "blocks": {}, "blocks_meta": {}, "accounts_data_slice": []}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
const request = {
  "slots": {
    "slots": {}
  },
  "accounts": {},
  "transactions": {
    "serum": {
      "vote": false,
      "accountInclude": [
        "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"
      ]
    }
  },
  "blocks": {},
  "blocksMeta": {},
  "accountsDataSlice": []
};
```

{% endtab %}
{% endtabs %}

### Subscribe to transactions excluding accounts

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{"slots": { "slots": {} }, "accounts": {}, "transactions": { "serum": { "account_exclude": [ "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin", "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" ]}}, "blocks": {}, "blocks_meta": {}, "accounts_data_slice": []}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
const request = {
  "slots": {
    "slots": {}
  },
  "accounts": {},
  "transactions": {
    "serum": {
      "accountExclude": [
        "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
      ]
    }
  },
  "blocks": {},
  "blocksMeta": {},
  "accountsDataSlice": []
};
```

{% endtab %}
{% endtabs %}

### Subscribe to transactions mentioning accounts & excluding certain accounts

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{"slots": { "slots": {} }, "accounts": {}, "transactions": { "serum": { "account_include": [ "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin" ], "account_exclude": [ "9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT" ] }}, "blocks": {}, "blocks_meta": {}, "accounts_data_slice": []}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
const request = {
  "slots": {
    "slots": {}
  },
  "accounts": {},
  "transactions": {
    "serum": {
      "accountInclude": [
        "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"
      ],
      "accountExclude": [
        "9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT"
      ]
    }
  },
  "blocks": {},
  "blocksMeta": {},
  "accountsDataSlice": []
};
```

{% endtab %}
{% endtabs %}

### Subscribe to a transaction signature

You can subscribe to an individual transaction signature, which will provide updates as the signature is confirmed and finalized.

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{"slots": {}, "accounts": {}, "transactions": { "sign": { "signature": "5rp2hL9b6kexex11Mugfs3vfU9GhieKruj4CkFFSnu52WLxiGn4VcLLwsB62XURhMmT1j4CZiXT6FFtYbXsLq2Zs"}}, "blocks": {}, "blocks_meta": {}, "accounts_data_slice": []}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
const request = {
  "slots": {},
  "accounts": {},
  "transactions": {
    "sign": {
      "signature": "5rp2hL9b6kexex11Mugfs3vfU9GhieKruj4CkFFSnu52WLxiGn4VcLLwsB62XURhMmT1j4CZiXT6FFtYbXsLq2Zs"
    }
  },
  "blocks": {},
  "blocksMeta": {},
  "accountsDataSlice": []
};
```

{% endtab %}
{% endtabs %}

### Subscribe to slots

You do not need to provide further details to subscribe to slot notifications. All you'll need to provide is a name for the slot updates that they will be tagged as.

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{"slots": { "incoming_slots": {} }, "accounts": {}, "transactions": {}, "blocks": {}, "blocks_meta": {}, "accounts_data_slice": []}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
const request = {
  "slots": {
    "incoming_slots": {}
  },
  "accounts": {},
  "transactions": {},
  "blocks": {},
  "blocksMeta": {},
  "accountsDataSlice": []
};
```

{% endtab %}
{% endtabs %}

### Subscribe to blocks

This will return all the blocks as they are produced. It will send blocks along with the transactions:

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{"slots": {}, "accounts": { }, "transactions": {}, "blocks": { "blocks": {} }, "blocks_meta": {}, "accounts_data_slice": []}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
const request = {
  "slots": {},
  "accounts": {},
  "transactions": {},
  "blocks": {
    "blocks": {}
  },
  "blocksMeta": {},
  "accountsDataSlice": []
};
```

{% endtab %}
{% endtabs %}

By default `Block` message includes all transactions, but you can exclude them or include updated accounts:

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{"slots": {}, "accounts": { }, "transactions": {}, "blocks": { "blocks": {"include_transactions": false, "include_accounts": true} }, "blocks_meta": {}, "accounts_data_slice": []}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
const request = {
  "slots": {},
  "accounts": {},
  "transactions": {},
  "blocks": {
    "blocks": {
      "includeTransactions": false,
      "includeAccounts": true
    }
  },
  "blocksMeta": {},
  "accountsDataSlice": []
};
```

{% endtab %}
{% endtabs %}

If you interested only in transactions/accounts where any of specified accounts are mentioned you can use special filter:

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{"slots": {}, "accounts": { }, "transactions": {}, "blocks": { "blocks": {"account_include": ["So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo"]} }, "blocks_meta": {}, "accounts_data_slice": []}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
const request = {
  "slots": {},
  "accounts": {},
  "transactions": {},
  "blocks": {
    "blocks": {
      "accountInclude": ["So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo"]
    }
  },
  "blocksMeta": {},
  "accountsDataSlice": []
};
```

{% endtab %}
{% endtabs %}

### Subscribe to block metadata

If you want to subscribe just to notifications as blocks are processed without receiving all the transactions, then you can use the block meta subscription:

{% tabs %}
{% tab title="gRPC" %}
{% code overflow="wrap" %}

```json
{"slots": {}, "accounts": {}, "transactions": {}, "blocks": {}, "blocks_meta": { "blockmetadata": {} }, "accounts_data_slice": []}
```

{% endcode %}
{% endtab %}

{% tab title="NodeJS" %}

```javascript
const request = {
  "slots": {},
  "accounts": {},
  "transactions": {},
  "blocks": {},
  "blocksMeta": {
    "blockmetadata": {}
  },
  "accountsDataSlice": []
};
```

{% endtab %}
{% endtabs %}

### Sending pings to keep the stream alive

Some cloud providers (eg. Cloudflare) close idle streams. To avoid this, you need to keep sending pings to the server. The server responds with a `pong` message every 15 seconds.

Here is a rust example for this <https://gist.github.com/lvboudre/7bbcd895ab3b7df3cd6b0ad1450fac88>

Here is an example of how you can do periodic pings and handle the pong responses

```
const PING_INTERVAL_MILLISECONDS = 30000;

// Ping request
const pingRequest: SubscribeRequest = {
    ping: { id: 1 },
    accounts: {},
    accountsDataSlice: [],
    transactions: {},
    transactionsStatus: {},
    blocks: {},
    blocksMeta: {},
    entry: {},
    slots: {},
};

// Sending pings periodically
setInterval(async () => {
  await new Promise<void>((resolve, reject) => {
    stream.write(pingRequest, (err) => {
      if (err === null || err === undefined) {
        resolve();
      } else {
        reject(err);
      }
    });
  }).catch((reason) => {
    console.error(reason);
    throw reason;
  });
}, PING_INTERVAL_MILLISECONDS);

// Handling pong responses
// This goes in your `data` handler
stream.on("data", (data) => {
if (data.pong) {
    console.log("Received Pong response");
  }
});

```

### Modifying subscription

The Subscribe method offers a bi-directional stream, so you can modify the subscription by simply submitting your newly updated subscription string, and you will start receiving updates on your modified filters.

This will entirely overwrite the previous subscription, so ensure your client maintains a local register of the entire subscription config you are interested in.

### Replaying from a slot

Dragon's Mouth supports replaying recently buffered updates by setting `from_slot` on `SubscribeRequest`. This is mainly used to recover from short disconnections.

When a client subscribes with `from_slot`, the server first replays buffered updates starting from that slot and then continues streaming live updates on the same connection.

Important details:

* Replay only covers the server's retained replay window.
* To discover the earliest replayable slot, call the unary `SubscribeReplayInfo` RPC and read `first_available`.
* If `from_slot` is older than the earliest available slot, the request will fail and the client should retry with a newer slot.
* Replay uses the same filters and commitment level as the live subscription.
* Replay starts at a slot boundary. If you reconnect from the last slot you processed, you may receive duplicate updates from that slot, so clients should deduplicate.

This is useful for reconnect logic:

1. Track the latest slot your application has processed.
2. On disconnect, reconnect and resubscribe with `from_slot` set to that slot.
3. If the requested slot is no longer available, fall back to a fresh live subscription or your own backfill path.

**Example replay subscribe request**

gRPC

```json
{
  "slots": {
    "incoming_slots": {}
  },
  "accounts": {},
  "transactions": {
    "alltxs": {
      "vote": false,
      "failed": false
    }
  },
  "blocks": {},
  "blocks_meta": {},
  "accounts_data_slice": [],
  "from_slot": 382001234
}
```

NodeJS

```typescript
const request = {
  slots: {
    incoming_slots: {}
  },
  accounts: {},
  transactions: {
    alltxs: {
      vote: false,
      failed: false
    }
  },
  blocks: {},
  blocksMeta: {},
  accountsDataSlice: [],
  fromSlot: 382001234
};

```

**Example: checking replay availability**

```typescript
const info = await client.subscribeReplayInfo();
console.log(info.firstAvailable);
```

{% hint style="info" %}
For teams running their own Yellowstone gRPC server, replay must be enabled server-side by setting `replay_stored_slots` to a value greater than `0`.
{% endhint %}

### Auto-reconnect (Rust client)

Starting from v13.1.0 the Rust client library handles reconnect automatically. You can enable it when building the client:

```rust
let client = GeyserGrpcClient::build_from_shared(endpoint)?
    .x_token(x_token)?
    .tls_config(ClientTlsConfig::new().with_native_roots())?
    .set_reconnect_config(ReconnectConfig::default())
    .connect()
    .await?;

let mut stream = client.subscribe_once(request).await?;

while let Some(msg) = stream.next().await {
    // stream transparently reconnects on disconnect,
    // replays from last processed slot, and deduplicates replayed messages
}
```

What it does automatically:

* Tracks the last fully processed slot
* On disconnect, reconnects with `from_slot` set to that slot
* Deduplicates messages replayed during the reconnect window
* Falls back to a live subscription if the slot is outside the server's replay window

Auto-reconnect is **disabled by default**. Omit `set_reconnect_config` to get the original single-stream behavior.

### Unsubscribing

If you want to unsubscribe from all streams, send the following request:

{% tabs %}
{% tab title="gRPC" %}

<pre class="language-json" data-overflow="wrap"><code class="lang-json"><strong>{"slots": {}, "accounts": {}, "transactions": {}, "blocks": {}, "blocks_meta": {}}
</strong></code></pre>

{% endtab %}

{% tab title="NodeJS" %}

```javascript
const request = {
  "slots": {},
  "accounts": {},
  "transactions": {},
  "blocks": {},
  "blocksMeta": {},
  "accountsDataSlice": []
};
```

{% endtab %}
{% endtabs %}

This will clear all current subscriptions but keep the connection open for future subscriptions.

## Managing commitment levels

The gRPC streams happen by default on the processed commitment level.

We also support specifying confirmed and finalized commitment levels. In these cases, Dragon's Mouth will buffer the incoming updates for you and release them once the updates have become confirmed or finalized.

For maximum performance, however, we recommend handling commitment levels client side.

To specify commitment level in your Dragon's Mouth gRPC calls provide the following values:

```
enum CommitmentLevel {
  PROCESSED = 0;
  CONFIRMED = 1;
  FINALIZED = 2;
}
```

### Benefits of working at processed

The benefit of working on processed is that you can process transactions as soon as they arrive, but only commit to them once you know whether they are confirmed or finalized. This means that you can get faster response times in your UI by doing a lot of the processing work at a lower commitment level and then be able to surface the changes as soon as you see that the event is committed.

### How to manage \`confirmed\` and \`finalized\`

To manage confirmed and finalized you need to buffer events by slot. Each event (transaction or account write) will have a slot attached to it. You store these events in a buffer ordered by slot.

You then also make sure you subscribe to [slot notifications](#subscribe-to-slots). This will give you information about when a slot is confirmed or finalized. Depending on the commitment level you are interested in, you should release your buffer when you receive the slot notification for a particular slot at a particular commitment level.

You will receive all the transaction notifications or account write notifications for the slot **before** you receive the "confirmed" and "finalized" notification for that slot.

### The special thing about finalized

Unfortunately, due to a quirk (fixed in `master` of solana) in the way that Geyser works on Solana not every slot finalized notification is issued. This means that you need some special processing if you want to handle finalized correctly.

The special handling is as follows: whenever you see a `finalized` slot notification, you need to retroactively mark its ancestors as `finalized` too, even if you didn't receive a notification for them.

## Intra-slot update

The Dragon's Mouth gRPC stream allows subscribers to listen for 'intra-slot' updates, which represent different lifecycle stages a slot goes through inside the RPC node, from the first shred received to a fully replayed slot.

Here's a list of supported intra-slot update events :

```
enum SlotStatus {
  ...
  SLOT_FIRST_SHRED_RECEIVED = 3;
  SLOT_COMPLETED = 4;
  SLOT_CREATED_BANK = 5;
  SLOT_DEAD = 6;
}
```

**SLOT\_FIRST\_SHRED\_RECEIVED**: The remote RPC node you're connected to has received the first shred of a given slot. This does not indicate it has been replayed yet. This event occurs during the [retransmit stage](https://docs.anza.xyz/validator/tvu#retransmit-stage) in the [TVU](https://docs.anza.xyz/validator/tvu).

**SLOT\_CREATED\_BANK**: A bank for the given slot has been created on the remote RPC node you're connected to. Within a validator, a Bank acts as an isolated execution environment during the replay stage (which follows the retransmit stage). Due to the decentralized nature of blockchains, forks are inevitable, meaning a slot can have multiple descendants.

To handle this, validators must be capable of replaying multiple slots that share the same ancestor without their execution interfering with one another. Each slot is assigned its own Bank instance, and these Banks form a fork graph, where each edge represents a parent-child relationship between two banks.

Banks serve as self-contained execution contexts, maintaining replay results and essential metadata about the slot and its lineage. Importantly, a Bank is instantiated once per slot.

**SLOT\_COMPLETED**: All the shreds for the given slot have been received by the RPC node you're connected to. However, this does not necessarily mean that the slot has been fully replayed yet.

**SLOT\_DEAD:** Dead slots are slots that have been rejected by the validator for various reasons, such as invalid transaction signatures in the leader's shreds, incorrect entry hashes during Proof of History (PoH) verification, or an unexpected number of entries in the slot. When a slot is marked as dead, it is discarded by the network as a whole and effectively skipped. This can occur at any point during the replay process, even after the slot has been marked as 'completed'.

Here's a "simplfied" overview of the expected lifecycle of a slot:\\

{% code title="Slot lifecycle through time" %}

```
                                                                                                                                            
                                                                                                                                            
                                                                                                                                            
                                          TIME ->                                                                                           
      ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────►   
      ┌───────────────────────────────────────────────────────┐                                                                             
      │ Slot download                                         │                                                                             
      │ ┌───────────┐┌──────┐         ┌───────┐┌───────────┐  │                                                                             
      │ │FIRST_SHRED││SHRED2│  ...    │SHRED N││ COMPLETED │  │                                                                             
      │ │ RECEIVED  │└──────┘         └───────┘└───────────┘  │                                                                             
      │ └───────────                                          │                                                                             
      └──────────────┌───────────────────────────────────────────────────────────────────────────────┐                                      
                     │ REPLAY STAGE                                                                  │                                      
                     │┌─────────────┐ ┌──────────────┐ ┌───┌───┐┌──────┐    ┌──────────┐ ┌─────────┐ │                                      
                     ││BANK_CREATED │ │ACCOUNT UPDATE│ │TX1│TX2││ENTRY1│... │BLOCK_META│ │PROCESSED│ │                                      
                     │└─────────────┘ └──────────────┘ └───└───┘└──────┘    └──────────┘ └─────────┘ │                                      
                     │                                                                               │                                      
                     └───────────────────────────────────────────────────────────────────────────────┘                                      
                                                                                                    ┌──────────────────────────────────┐    
                                                                                                    │ CONSENSUS                        │    
                                                                                                    │ ┌──────────┐      ┌───────────┐  │    
                                                                                                    │ │CONFIRMED │      │FINALIZED  │  │    
                                                                                                    │ └──────────┘      └───────────┘  │    
                                                                                                    │                                  │    
                                                                                                    └──────────────────────────────────┘    
                                                                                                                                            
```

{% endcode %}

## Deshred transactions (beta)

Dragon's Mouth also supports [`SubscribeDeshred`](https://github.com/rpcpool/yellowstone-grpc/blob/236ebd7b0616dd88407a7a2b61f903a56b92b186/yellowstone-grpc-proto/proto/geyser.proto?ref=blog.triton.one#L12), a separate gRPC stream that delivers transactions reconstructed from shreds before the validator executes them.

This is the earliest usable on-chain signal exposed by Dragon's Mouth. It is designed for latency-sensitive systems that care about transaction intent as early as possible, such as arbitrage, market making, copy trading, liquidations, and HFT pipelines.

Unlike the standard `Subscribe` transaction stream, deshred updates are emitted before Replay. That means you receive the decoded transaction earlier, but without execution context.

A deshred update includes:

* `slot`
* `signature`
* vote flag
* raw transaction
* `loaded_writable_addresses`
* `loaded_readonly_addresses`

The loaded address fields contain addresses resolved from Address Lookup Tables (ALTs), so deshred filters match both static account keys and dynamically loaded addresses.

#### Deshred filters

`SubscribeDeshred` supports:

* `vote`
* `account_include`
* `account_exclude`
* `account_required`

#### Important limitations

* `SubscribeDeshred` is a separate RPC, not a field on `SubscribeRequest`
* deshred data has no execution metadata: no status, logs, inner instructions, balance changes, compute units, or `TransactionStatusMeta`
* deshred data has no confirmation or finality guarantee: a transaction may fail, land on a dead fork, or never confirm
* if you need confirmation and execution results, use Deshred together with the normal `transactions` stream

#### Availability

`SubscribeDeshred` is currently available only on Triton One gRPC servers and is in paid beta. It depends on Triton's validator-side extension and does not work out of the box on a stock Agave node.

For a deeper overview of the architecture and tradeoffs, see [Deshred transactions: the fastest path to Solana data](https://blog.triton.one/deshred-transactions-the-fastest-path-to-solana-data/). For the wire format and RPC definitions, see [`geyser.proto`](https://github.com/rpcpool/yellowstone-grpc/blob/236ebd7b0616dd88407a7a2b61f903a56b92b186/yellowstone-grpc-proto/proto/geyser.proto?ref=blog.triton.one#L12).

#### Rust example

```rust
use {
    futures::{sink::SinkExt, stream::StreamExt},
    solana_signature::Signature,
    std::collections::HashMap,
    tonic::transport::channel::ClientTlsConfig,
    yellowstone_grpc_client::GeyserGrpcClient,
    yellowstone_grpc_proto::prelude::{
        subscribe_update_deshred::UpdateOneof, SubscribeDeshredRequest,
        SubscribeRequestFilterDeshredTransactions, SubscribeRequestPing,
    },
};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let endpoint = std::env::var("ENDPOINT")
        .unwrap_or("https://<endpoint>".into());
    let x_token = std::env::var("X_TOKEN").ok();

    let mut client = GeyserGrpcClient::build_from_shared(endpoint)?
        .x_token(x_token)?
        .tls_config(ClientTlsConfig::new().with_native_roots())?
        .http2_adaptive_window(true)
        .initial_connection_window_size(8 * 1024 * 1024) // 8 MiB
        .initial_stream_window_size(4 * 1024 * 1024) // 4 MiB
        .connect()
        .await?;

    let request = SubscribeDeshredRequest {
        deshred_transactions: HashMap::from([(
            "deshred".into(),
            SubscribeRequestFilterDeshredTransactions {
                vote: Some(false),
                account_include: vec![],
                account_exclude: vec![],
                account_required: vec![],
            },
        )]),
        ping: None,
    };

    let (mut tx, mut stream) =
        client.subscribe_deshred_with_request(Some(request)).await?;

    while let Some(msg) = stream.next().await {
        match msg?.update_oneof {
            Some(UpdateOneof::DeshredTransaction(update)) => {
                let info = update.transaction.as_ref().unwrap();
                let sig = Signature::try_from(info.signature.as_slice())?;
                println!("slot={} sig={sig} vote={}", update.slot, info.is_vote);
            }
            Some(UpdateOneof::Ping(_)) => {
                tx.send(SubscribeDeshredRequest {
                    ping: Some(SubscribeRequestPing { id: 1 }),
                    ..Default::default()
                }).await?;
            }
            Some(UpdateOneof::Pong(_)) => {}
            None => break,
        }
    }

    Ok(())
}
```


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/project-yellowstone/dragons-mouth-grpc-subscriptions.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
