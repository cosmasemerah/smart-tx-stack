> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/trading-apis/hermes.md).

# Pyth Hermes

{% hint style="danger" %}
Pyth DAO has announced the deprecation of Pyth Core on July 31st, 2026. As of July 30th, 2026, Triton One Pythnet and Hermes endpoints will stop serving data — see [Pyth price feeds](https://www.pyth.network/price-feeds) for direct integration.
{% endhint %}

[Hermes](https://github.com/pyth-network/pyth-crosschain/tree/main/hermes) is a web service that listens to both **Pythnet** and the **Wormhole Network** for Pyth price updates, and exposes them through a simple web API. It delivers Pyth’s latest price update format, optimized for on-chain verification and usage.

To access the Hermes API, you’ll need a **Pythnet endpoint** provided by Triton.

<br>

### API Access

Hermes allows clients to:

* Query recent price updates via a REST API
* Subscribe to live price updates via WebSocket

The Pyth Network's JavaScript SDKs use Hermes under the hood to fetch price data.

<br>

### Usage

**Frontend REST Access**

Use this format for frontend clients:

```
https://<unique-subdomain>.mainnet.pythnet.rpcpool.com/hermes
```

**Backend REST Access**

For backend access, include your RPC token before /hermes:

```
https://<unique-subdomain>.mainnet.pythnet.rpcpool.com/<secret-token>/hermes
```

**WebSocket Access**

WebSocket access is available at:

```
https://<unique-subdomain>.mainnet.pythnet.rpcpool.com/hermes/ws
```

or, for backend:

```
https://<unique-subdomain>.mainnet.pythnet.rpcpool.com/<secret-token>/hermes/ws
```

Additional Pythnet RPC Access

Your other Pythnet RPC services are available at:

```
https://<unique-subdomain>.mainnet.pythnet.rpcpool.com/<secret-token>
```

*(Note: this is the base endpoint without the /hermes path.)*

<br>

### Documentation

For full Hermes API details, refer to the official docs:

👉 <https://docs.pyth.network/documentation/pythnet-price-feeds/hermes>

<br>


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/trading-apis/hermes.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
