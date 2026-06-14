> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/project-yellowstone/whirligig-websockets.md).

# Whirligig WebSockets

The Whirligig WebSocket Proxy is a Rust-based proxy between a Dragon's Mouth gRPC server and a WebSocket client. It allows the client to send requests to a WebSocket connection rather than through the gRPC protocol. This can be used when WebSocket connections are preferred, such as in a web3 application.

At the 'processed' commitment level most traders use, Whirligig will also provide intra-slot updates. Account updates will arrive up to 400ms faster than previous WebSocket subscriptions.

## WebSocket API

Whirligig aims for full compatibility with the Solana WebSocket API (<https://docs.solana.com/api/websocket>). Please be aware of one extended subscription we introduced: `transactionSubscribe`. This subscription may not be compatible with other providers.

To use Whirligig, append `/whirligig` to your RPC endpoint. Using web3.js, you can pass in a custom WS endpoint like this: `new web3.Connection('rpc_endpoint', { wsEndpoint: 'ws_endpoint' })`.&#x20;

NOTE: Some client software might require another trailing slash like `/whirligig/`.

NOTE: Connections inactive for over 60 seconds get closed. To keep a connection alive, you need to ping the server `{"jsonrpc":"2.0","method":"ping"}` &#x20;

### Whirligig CLI Client

You can check Whirligig CLI Client on GitHub: <https://github.com/rpcpool/yellowstone-whirligig-client>

### Commitment Levels

The Whirligig WebSocket API supports all three commitment levels (processed, confirmed, finalized).

You can, however, also [manage commitment levels](/project-yellowstone/dragons-mouth-grpc-subscriptions.md#managing-commitment-levels) in your app in the same way as you would in [Dragon's Mouth gRPC](/project-yellowstone/dragons-mouth-grpc-subscriptions.md#managing-commitment-levels). Each subscribe method implements a corresponding unsubscribe method which takes the subscription id provided by the subscribe method.

<https://docs.solana.com/cluster/commitments>

"**Processed**": The highest slot of the heaviest fork processed by the node. Ledger state at this slot is not derived from a confirmed or finalized block, but if multiple forks are present, is from the fork the validator believes is most likely to finalize.

"**Confirmed**": The highest slot that has been voted on by supermajority of the cluster, ie. is confirmed. Confirmation incorporates votes from gossip and replay. It does not count votes on descendants of a block, only direct votes on that block, and upholds "optimistic confirmation" guarantees in release 1.3 and onwards.

"**Finalized**": The highest slot having reached max vote lockout, as recognized by a supermajority of the cluster.

### Endpoint

The WebSocket endpoint allows you to stream data from the server to the client in real-time. The default endpoint for the WebSocket is `wss://<your endpoint>.rpcpool.com/<token>/whirligig`.

### Unsubscribe

Every subscription request on success return `id` of subscription, like:

```json
{
  "jsonrpc": "2.0",
  "result": 42,
  "id": 1
}
```

This subscription `id` can be used to unsubscribe from the stream:

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "slotUnsubscribe",
  "params": [42]
}
```

Result would be `true` in case of such subscription was active and removed. In case if subscription doesn't exists, result would be `false`.

```json
{
  "jsonrpc": "2.0",
  "result": true,
  "id": 1
}
```

### accountSubscribe

This method is fully compatiable with Solana WebSocket API. API details: <https://docs.rs/solana-client/latest/solana\\_client/nonblocking/pubsub\\_client/struct.PubsubClient.html#method.account\\_subscribe>

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "accountSubscribe",
  "params": [
    "SysvarC1ock11111111111111111111111111111111",
    {
      "encoding": "base58",
      "commitment": "finalized"
    }
  ]
}

```

`base58` stream data example:

```json
{
  "jsonrpc": "2.0",
  "method": "accountNotification",
  "params": {
    "result": {
      "context": {
        "apiVersion": "1.16.1",
        "slot": 206122916
      },
      "value": {
        "data": [
          "9AAG2zomYcUVKQfondw13yz193crQ5R5zmzdEojhMPXiyYEjD8viLrb",
          "base58"
        ],
        "executable": false,
        "lamports": 1169280,
        "owner": "Sysvar1111111111111111111111111111111111111",
        "rentEpoch": 361,
        "space": 40
      }
    },
    "subscription": 0
  }
}
```

### accountUnsubscribe

See [#Unsubscribe](#unsubscribe).

### blockSubscribe

Fully compatiable with Solana WebSocket API. API details: <https://docs.rs/solana-client/latest/solana\\_client/nonblocking/pubsub\\_client/struct.PubsubClient.html#method.block\\_subscribe>

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "blockSubscribe",
  "params": [
    "all",
    {
      "commitment": "finalized",
      "maxSupportedTransactionVersion": 1,
      "showRewards": false,
      "transactionDetails": "none"
    }
  ]
}
```

stream data example:

```json
{
  "jsonrpc": "2.0",
  "method": "blockNotification",
  "params": {
    "result": {
      "context": {
        "apiVersion": "1.16.1",
        "slot": 206125999
      },
      "value": {
        "block": {
          "blockHeight": 188652385,
          "blockTime": 1689709529,
          "blockhash": "74iqy9xdFvenLkFizkoBkkLRWTyygEeCiiN3B8Z8ma2D",
          "parentSlot": 206125998,
          "previousBlockhash": "Cq5nfgu9Y5KF47J9qj5CTYmt8D5CxBpw8HCRqQZ7o7i9"
        },
        "err": null,
        "slot": 206125999
      }
    },
    "subscription": 0
  }
}
```

### blockUnsubscribe

See [#Unsubscribe](#unsubscribe).

### logsSubscribe

Fully compatiable with Solana WebSocket API. API details: <https://docs.rs/solana-client/latest/solana\\_client/nonblocking/pubsub\\_client/struct.PubsubClient.html#method.logs\\_subscribe>

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "logsSubscribe",
  "params": [
    {
      "mentions": ["8BnEgHoWFysVcuFFX7QztDmzuH8r5ZFvyP3sYwn1XTh6"]
    },
    {
      "commitment": "finalized"
    }
  ]
}
```

stream data example:

```json
{
  "jsonrpc": "2.0",
  "method": "logsNotification",
  "params": {
    "result": {
      "context": {
        "apiVersion": "1.16.1",
        "slot": 206126709
      },
      "value": {
        "err": null,
        "logs": [
          "Program FC81tbGt6JWRXidaWYFXxGnTk4VgobhJHATvTRVMqgWj invoke [1]",
          "Program log: process_instruction: FC81tbGt6JWRXidaWYFXxGnTk4VgobhJHATvTRVMqgWj: 3 accounts, data=[12]",
          "Program log: Instruction: UpdateLendingPool",
          "Program log: current_borrow_rate: 73081853393945351",
          "Program FC81tbGt6JWRXidaWYFXxGnTk4VgobhJHATvTRVMqgWj consumed 23800 of 1000000 compute units",
          "Program FC81tbGt6JWRXidaWYFXxGnTk4VgobhJHATvTRVMqgWj success",
          "Program FC81tbGt6JWRXidaWYFXxGnTk4VgobhJHATvTRVMqgWj invoke [1]",
          "Program log: process_instruction: FC81tbGt6JWRXidaWYFXxGnTk4VgobhJHATvTRVMqgWj: 3 accounts, data=[12]",
          "Program log: Instruction: UpdateLendingPool",
          "Program log: current_borrow_rate: 82164236984041212",
          "Program FC81tbGt6JWRXidaWYFXxGnTk4VgobhJHATvTRVMqgWj consumed 28159 of 976200 compute units",
          "Program FC81tbGt6JWRXidaWYFXxGnTk4VgobhJHATvTRVMqgWj success",
          "Program 2nAAsYdXF3eTQzaeUQS3fr4o782dDg8L28mX39Wr5j8N invoke [1]",
          "Program log: Instruction: LiquidateUnstakeLp",
          "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
          "Program log: Instruction: Transfer",
          "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4740 of 879873 compute units",
          "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
          "Program 2nAAsYdXF3eTQzaeUQS3fr4o782dDg8L28mX39Wr5j8N consumed 79765 of 948041 compute units",
          "Program 2nAAsYdXF3eTQzaeUQS3fr4o782dDg8L28mX39Wr5j8N success",
          "Program 2nAAsYdXF3eTQzaeUQS3fr4o782dDg8L28mX39Wr5j8N invoke [1]",
          "Program log: Instruction: RemoveLiquidity",
          "Program 2nAAsYdXF3eTQzaeUQS3fr4o782dDg8L28mX39Wr5j8N consumed 24767 of 868276 compute units",
          "Program 2nAAsYdXF3eTQzaeUQS3fr4o782dDg8L28mX39Wr5j8N success",
          "Program 2nAAsYdXF3eTQzaeUQS3fr4o782dDg8L28mX39Wr5j8N invoke [1]",
          "Program log: Instruction: SwapAndWithdraw",
          "Program log: withdraw_type: 2,\\n            user_info.pending_repay_0: 0,\\n            user_info.pending_repay_1: 0,\\n            user_info.tkn_0: 0,\\n            user_info.tkn_1: 0,\\n            ",
          "Program log: swap_direction: 0,\\n            amount_in: 0\\n            ",
          "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
          "Program log: Instruction: Transfer",
          "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4785 of 815778 compute units",
          "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
          "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
          "Program log: Instruction: Transfer",
          "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4831 of 807689 compute units",
          "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
          "Program 2nAAsYdXF3eTQzaeUQS3fr4o782dDg8L28mX39Wr5j8N consumed 47497 of 843509 compute units",
          "Program 2nAAsYdXF3eTQzaeUQS3fr4o782dDg8L28mX39Wr5j8N success"
        ],
        "signature": "5UPB2AEWgUafVDEw2xTkup8CUedxCMNL4k7EMuxtcyi1WnYLmpXeYUfBANpnPnpSz6LRwwLnBQf7tViKSFT7ojiB"
      }
    },
    "subscription": 0
  }
}
```

### logsUnsubscribe

See [#Unsubscribe](#unsubscribe).

### programSubscribe

Fully compatiable with Solana WebSocket API. API details: <https://docs.rs/solana-client/latest/solana\\_client/nonblocking/pubsub\\_client/struct.PubsubClient.html#method.program\\_subscribe>

```json
{
  "id": 1,
  "jsonrpc": "2.0",
  "method": "programSubscribe",
  "params": [
    "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX",
    {
      "encoding": "base64+zstd",
      "commitment": "finalized"
    }
  ]
}
```

stream data example:

```json
{
  "jsonrpc": "2.0",
  "method": "programNotification",
  "params": {
    "result": {
      "context": {
        "apiVersion": "1.16.1",
        "slot": 206127070
      },
      "value": {
        "account": {
          "data": [
            "KLUv/QBYDQEAkHNlcnVtQQABAAQAcGFkZGluZwUA03+gI0CxQgAYeABG",
            "base64+zstd"
          ],
          "executable": false,
          "lamports": 457104960,
          "owner": "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX",
          "rentEpoch": 0,
          "space": 65548
        },
        "pubkey": "5qRKrGPYaQmazdtMnia1iC3gFbpgW4CT7KPrHq9nJGm5"
      }
    },
    "subscription": 0
  }
}
```

### programUnsubscribe

See [#Unsubscribe](#unsubscribe).

### signatureSubscribe

Fully compatiable with Solana WebSocket API. API details: <https://docs.rs/solana-client/latest/solana\\_client/nonblocking/pubsub\\_client/struct.PubsubClient.html#method.signature\\_subscribe>

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "signatureSubscribe",
  "params": [
    "2EBVM6cB8vAAD93Ktr6Vd8p67XPbQzCJX47MpReuiCXJAtcjaxpvWpcg9Ege1Nr5Tk3a2GFrByT7WPBjdsTycY9b",
    {
      "commitment": "finalized"
    }
  ]
}
```

stream data example:

```json
{
  "jsonrpc": "2.0",
  "method": "signatureNotification",
  "params": {
    "result": {
      "context": {
        "apiVersion": "1.16.1",
        "slot": 206127070
      },
      "value": {
        "err": null
      }
    },
    "subscription": 24006
  }
}
```

### signatureUnsubscribe

See [#Unsubscribe](#unsubscribe).

### slotSubscribe

Fully compatiable with Solana WebSocket API. API details: <https://docs.rs/solana-client/latest/solana\\_client/nonblocking/pubsub\\_client/struct.PubsubClient.html#method.slot\\_subscribe>

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "slotSubscribe"
}
```

stream data example:

```json
{
  "jsonrpc": "2.0",
  "method": "slotNotification",
  "params": {
    "result": {
      "parent": 206128153,
      "root": 206128115,
      "slot": 206128154
    },
    "subscription": 0
  }
}
```

### slotUnsubscribe

See [#Unsubscribe](#unsubscribe).

### transactionSubscribe

**Solana WebSocket API doesn't support this kind of subscription.**

Method can accept two arguments, first is `filter` and second `config`. In `filter` all fields are optional. `config` argument equal to [RpcBlockSubscribeConfig](https://docs.rs/solana-client/latest/solana_client/rpc_config/struct.RpcBlockSubscribeConfig.html).

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "transactionSubscribe",
  "params": [
    {
      "vote": false,
      "failed": false,
      "signature": "2EBVM6cB8vAAD93Ktr6Vd8p67XPbQzCJX47MpReuiCXJAtcjaxpvWpcg9Ege1Nr5Tk3a2GFrByT7WPBjdsTycY9b",
      "accounts": {
        "include": ["5qRKrGPYaQmazdtMnia1iC3gFbpgW4CT7KPrHq9nJGm5"],
        "exclude": ["srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX"],
        "required": ["TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"]
      }
    },
    {
      "commitment": "processed",
      "encoding": "base58",
      "transactionDetails": "full",
      "showRewards": false,
      "maxSupportedTransactionVersion": 1
    }
  ]
}
```

stream data example:

```json
{
  "jsonrpc": "2.0",
  "method": "transactionNotification",
  "params": {
    "result": {
      "context": {
        "apiVersion": "1.16.1",
        "slot": 206132915
      },
      "value": {
        "slot": 241068727,
        "signature": "2EBVM6cB8vAAD93Ktr6Vd8p67XPbQzCJX47MpReuiCXJAtcjaxpvWpcg9Ege1Nr5Tk3a2GFrByT7WPBjdsTycY9b",
        "transaction": {
          "meta": {
            "computeUnitsConsumed": 27426,
            "err": null,
            "fee": 5000,
            "innerInstructions": [
              {
                "index": 3,
                "instructions": [
                  {
                    "accounts": [
                      7,
                      3,
                      11
                    ],
                    "data": "3DTZbgwsozUF",
                    "programIdIndex": 15,
                    "stackHeight": null
                  },
                  {
                    "accounts": [
                      9,
                      8,
                      11
                    ],
                    "data": "3DTZbgwsozUF",
                    "programIdIndex": 15,
                    "stackHeight": null
                  }
                ]
              }
            ],
            "loadedAddresses": {
              "readonly": [],
              "writable": []
            },
            "logMessages": [
              "Program ComputeBudget111111111111111111111111111111 invoke [1]",
              "Program ComputeBudget111111111111111111111111111111 success",
              "Program GDDMwNyyx8uB6zrqwBFHjLLG3TBYk2F8Az4yrQC5RzMp invoke [1]",
              "Program log: Sequence in order | sequence_num=755609 | last_known=755608",
              "Program GDDMwNyyx8uB6zrqwBFHjLLG3TBYk2F8Az4yrQC5RzMp consumed 3398 of 300000 compute units",
              "Program GDDMwNyyx8uB6zrqwBFHjLLG3TBYk2F8Az4yrQC5RzMp success",
              "Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX invoke [1]",
              "Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX consumed 3820 of 296602 compute units",
              "Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX success",
              "Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX invoke [1]",
              "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
              "Program log: Instruction: Transfer",
              "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4740 of 285091 compute units",
              "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
              "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
              "Program log: Instruction: Transfer",
              "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4740 of 277786 compute units",
              "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
              "Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX consumed 20208 of 292782 compute units",
              "Program srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX success"
            ],
            "postBalances": [
              10194778999,
              1224960,
              457104960,
              2039280,
              23357760,
              1825496640,
              3591360,
              2039280,
              2039280,
              2039280,
              457104960,
              0,
              1,
              1141440,
              1141440,
              934087680
            ],
            "postTokenBalances": [
              {
                "accountIndex": 3,
                "mint": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                "owner": "ASx1wk74GLZsxVrYiBkNKiViPLjnJQVGxKrudRgPir4A",
                "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                "uiTokenAmount": {
                  "amount": "4973704995974757",
                  "decimals": 5,
                  "uiAmount": 49737049959.74757,
                  "uiAmountString": "49737049959.74757"
                }
              },
              {
                "accountIndex": 7,
                "mint": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                "owner": "3oQLKk1TyyXMT14p2i8p95v5jKqsQ5qzZGwxZCTnFC7p",
                "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                "uiTokenAmount": {
                  "amount": "3167826900000000",
                  "decimals": 5,
                  "uiAmount": 31678269000,
                  "uiAmountString": "31678269000"
                }
              },
              {
                "accountIndex": 8,
                "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "owner": "ASx1wk74GLZsxVrYiBkNKiViPLjnJQVGxKrudRgPir4A",
                "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                "uiTokenAmount": {
                  "amount": "148629334218",
                  "decimals": 6,
                  "uiAmount": 148629.334218,
                  "uiAmountString": "148629.334218"
                }
              },
              {
                "accountIndex": 9,
                "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "owner": "3oQLKk1TyyXMT14p2i8p95v5jKqsQ5qzZGwxZCTnFC7p",
                "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                "uiTokenAmount": {
                  "amount": "5797710875",
                  "decimals": 6,
                  "uiAmount": 5797.710875,
                  "uiAmountString": "5797.710875"
                }
              }
            ],
            "preBalances": [
              10194783999,
              1224960,
              457104960,
              2039280,
              23357760,
              1825496640,
              3591360,
              2039280,
              2039280,
              2039280,
              457104960,
              0,
              1,
              1141440,
              1141440,
              934087680
            ],
            "preTokenBalances": [
              {
                "accountIndex": 3,
                "mint": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                "owner": "ASx1wk74GLZsxVrYiBkNKiViPLjnJQVGxKrudRgPir4A",
                "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                "uiTokenAmount": {
                  "amount": "4973704995974757",
                  "decimals": 5,
                  "uiAmount": 49737049959.74757,
                  "uiAmountString": "49737049959.74757"
                }
              },
              {
                "accountIndex": 7,
                "mint": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
                "owner": "3oQLKk1TyyXMT14p2i8p95v5jKqsQ5qzZGwxZCTnFC7p",
                "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                "uiTokenAmount": {
                  "amount": "3167826900000000",
                  "decimals": 5,
                  "uiAmount": 31678269000,
                  "uiAmountString": "31678269000"
                }
              },
              {
                "accountIndex": 8,
                "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "owner": "ASx1wk74GLZsxVrYiBkNKiViPLjnJQVGxKrudRgPir4A",
                "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                "uiTokenAmount": {
                  "amount": "148629334218",
                  "decimals": 6,
                  "uiAmount": 148629.334218,
                  "uiAmountString": "148629.334218"
                }
              },
              {
                "accountIndex": 9,
                "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "owner": "3oQLKk1TyyXMT14p2i8p95v5jKqsQ5qzZGwxZCTnFC7p",
                "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                "uiTokenAmount": {
                  "amount": "5797710875",
                  "decimals": 6,
                  "uiAmount": 5797.710875,
                  "uiAmountString": "5797.710875"
                }
              }
            ],
            "rewards": null,
            "status": {
              "Ok": null
            }
          },
          "transaction": [
            "nMXJYDy61Acdo2FY39i2ENUwNCMDYBWgRi6dNBgJdMHv7NgY4jUS6uwa9YMzyen1nzANm35qQSr189ykkvNzEFRhrULEwNxXA39HRS8JjYwEdUQ7ziXT2bqnFCeJc5rtk2uS7rbrrvEANjeDJ8PVkdJW9ZrxTcpg3nY3S5uVi6t7N2aB2eDmyju1cyRRU5T1aiT9vH1MHornT53XSe9UzuXFEP4sXfJjHovtucUkjqpJqU1PnKcrfK98wNT1Li6zjS8XGreRYNz5N8nNuxhVxFUM9CxQVurQQ3mhAiSYUmsptNgM5RqwSsy1CwebfZRpc35qThUtyu55TGyXh7MAgA8sJCfBrTDCgtWChaDkyqpggKPQ8VnCgLQdPBMwaady3cF3GgMvCpue5ryFW2p3EYgZxME7j6FTgBRjYRd6LuyeyhWp68fsNscYbMY8eZnV6WVVpSoBUpxg9FnyEpCatgS9ZNiTX3Wb8K3Dg4ncxmVutegbxn9uKbEvBNUWn5KV5m2jbmJmSafmMAJrFW3m4pv2HAKHezcEPfNNMCrK5J4Jjjg2JqQBKK9Z1PddhAX4CConAnbF7ZY4xkFnpWVpVi8cJrR6Wsa6VPDMpgzraukYmnwHgrBNx2bQokeZxmpyb7j2f6mWkreQcLZFFDx5tP33XbwSQqNFvtQZzUDJ2zYwMhZmCuN3E4vFgWQgU3Sb9jepy8ev9LniReyPdJRRRGbkJegdxYkbE2XDb3R2p9PF3um3LrKP35MeJgKoDrNBG6UAe6M5Q3cP7JfZGgZVud9GQcVGdnBa9ZbQJyojHnMbV4TDNmi2526dXoi5XqfUhNkrc1PgnAzrKzwZmNyiCX12SSUZLKzgzJTnk7C4gavYNSvhpNcupQyrLEnJf9FkQwhv1uN4WAsYdym6rR5oLuZet9bnebNvJCPWRCT4H59Yrm8y1QTF64hiB9zWazhLawAKAtYdBKteW9gr8BstGDUuo8QRMTyb3jBJYhdoeiKMqZWo",
            "base58"
          ]
        },
        "error": null
      }
    },
    "subscription": 0
  }
}
```

### transactionUnsubscribe

See [#Unsubscribe](#unsubscribe).


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/project-yellowstone/whirligig-websockets.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
