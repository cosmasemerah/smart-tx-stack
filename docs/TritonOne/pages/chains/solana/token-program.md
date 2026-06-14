> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/token-program.md).

# Token Program

### Query by mint

You can query all the token accounts by mint using getProgramAccounts.

#### Original token program

When querying the original token program  it is important to specify dataSize as 165 to ensure that you are querying only valid token accounts.

{% tabs %}
{% tab title="getProgramAccounts" %}

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getProgramAccounts",
    "params": [
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      {
        "filters": [
          {
              "dataSize": 165
          },
          {
            "memcmp": {
              "offset": 0,
              "bytes": "j14XLJZSVMcUYpAfajdZRpnfHUpJieZHS4aPektLWvh"
            }
          }
        ],
        "encoding": "base64"
      }
    ] 
}
```

{% endtab %}
{% endtabs %}

#### Token22

When querying Token 22 you do not add the dataSize parameter but instead filter by the byte on offset 165.

{% tabs %}
{% tab title="getProgramAccounts" %}

```json
{
    "jsonrpc":"2.0",
    "id":1,
    "method":"getProgramAccounts",
    "params":[
        "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
        {
            "filters": [
                {"memcmp": {"offset":0, "bytes": "FRAGJ157KSDfGvBJtCSrsTWUqFnZhrw4aC8N8LqHuoos"}},
                {"memcmp": {"offset":165,"bytes": [2] }
                }
            ],
            "encoding": "base64",
            "commitment":"confirmed"
        }
    ]
}
```

{% endtab %}
{% endtabs %}

### Query by owner

The standard method for querying by owner is [`getTokenAccountsByOwner`](https://solana.com/docs/rpc/http/gettokenaccountsbyowner).  You can also use getProgramAccounts to query the same data, with the added possibiltiy of more advanced filtering.

#### Original token program

{% tabs %}
{% tab title="getTokenAccountsByOwner" %}

```json
{
   "jsonrpc": "2.0",
   "id": 1,
   "method": "getTokenAccountsByOwner",
   "params": [
     "B4aJyVCibxP1J95RccZ57DPJWEfkkzUDbm9DuFD9bonk",
     {
       "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
     },
     {
       "commitment": "finalized",
       "encoding": "jsonParsed"
     }
   ]
}
```

{% endtab %}

{% tab title="getProgramAccounts" %}

```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getProgramAccounts",
    "params": [
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      {
        "filters": [
          {
              "dataSize": 165
          },
          {
            "memcmp": {
              "offset": 32,
              "bytes": "B4aJyVCibxP1J95RccZ57DPJWEfkkzUDbm9DuFD9bonk"
            }
          }
        ],
        "encoding": "base64",
        "commitment": "confirmed"
      }
    ] 
}
```

{% endtab %}
{% endtabs %}

#### Token22

{% tabs %}
{% tab title="getTokenAccountsByOwner" %}

```json
{
   "jsonrpc": "2.0",
   "id": 1,
   "method": "getTokenAccountsByOwner",
   "params": [
     "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn",
     {
       "programId": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
     },
     {
       "commitment": "finalized",
       "encoding": "jsonParsed"
     }
   ]
}
```

{% endtab %}

{% tab title="getProgramAccounts" %}

```json
{
    "jsonrpc":"2.0",
    "id":1,
    "method":"getProgramAccounts",
    "params":[
        "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
        {
            "filters": [
                {"memcmp": {"offset":32, "bytes": "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn"}},
                {"memcmp": {"offset":165,"bytes": [2] }
                }
            ],
            "encoding": "base64",
            "commitment":"confirmed"
        }
    ]
}
```

{% endtab %}
{% endtabs %}

### Troubleshooting

A common error you may see when querying Token programs via getProgramAccounts is the following:

```
TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA excluded from account secondary indexes; this RPC method unavailable for key
```

If you see this error, please double check that you have included the parameters correctly as per above - especially that you have provided the correct dataSize parameter. If you are still facing errors, please contact us via our customer support channels.

### Digital Assets API

For a higher level API with better filtering functions, you can also use the Digital Assets API. This API supports both traditional tokens as well as compressed NFTs within the same interface, allowing you to query the full set of tokens owned by a user.

[Read more about the Digital Assets API](/digital-assets-api/introduction.md).


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/token-program.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
