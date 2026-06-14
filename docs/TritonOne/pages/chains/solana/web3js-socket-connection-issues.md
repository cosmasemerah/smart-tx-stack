> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/web3js-socket-connection-issues.md).

# Web3JS Socket/Connection Issues

If you are running high-throughput applications using [`@solana/web3.js`](https://www.npmjs.com/package/@solana/web3.js) in a NodeJS environment, you may encounter persistent socket or connection errors, especially under heavy asynchronous load. This guide explains the root cause of these issues and provides several effective solutions.

***

#### Common Errors

These errors often manifest with messages like `fetch failed`, `Connect Timeout Error`, `ECONNREFUSED`, `ECONNRESET`, or `other side closed`. They are a strong indicator that your application is hitting local system limits for network connections.

<details>

<summary>Click to see full error examples</summary>

```
cause: ConnectTimeoutError: Connect Timeout Error
code: 'UND_ERR_CONNECT_TIMEOUT'
```

```
cause: Error: connect ECONNREFUSED 1.2.3.4:443
code: 'ECONNREFUSED'
```

```
cause: Error: Client network socket disconnected before secure TLS connection was established
code: 'ECONNRESET'
```

```
cause: SocketError: other side closed
code: 'UND_ERR_SOCKET'
```

</details>

***

#### The Root Cause: Port Exhaustion in NodeJS

These errors are not caused by the RPC node or the [`@solana/web3.js`](https://www.npmjs.com/package/@solana/web3.js) library itself. They stem from **NodeJS's implementation of `fetch`**, which uses the `undici` HTTP client. By default, [`undici`](https://www.npmjs.com/package/undici) aggressively opens a new TCP socket for each outgoing request.

Under heavy, concurrent load, this behavior can quickly **exhaust the available ephemeral ports** on your operating system, leading to the connection failures you see.

***

**Diagnosing the Issue**

You can check how many ports your Node process is using on a UNIX-based system with the following command. A high number (in the thousands) is a clear sign of this issue.

```bash
lsof -i -n -P | grep node | awk '{print $9}' | awk -F '->' '{print $1}' | \
awk -F ':' '{print $2}' | sort -u | wc -l
```

***

**External References**

This is a known issue related to connection management in `undici`. You can find more context in these community discussions and articles:

* [GitHub Issue: `undici` hangs/times out when under heavy load](https://github.com/nodejs/undici/issues/583)
* [GitHub Issue: `UND_ERR_SOCKET` on `fetch`](https://github.com/nodejs/undici/issues/2412)
* [Blog Post: Fixing `UND_ERR_SOCKET` in NodeJS](https://sg.wantedly.com/companies/rightcode/post_articles/871110)
* [StackExchange Post: `UND_ERR_SOCKET`](https://ethereum.stackexchange.com/questions/130028/hardhat-deploy-script-on-rsk-throws-und-err-socket)

***

### Recommended Solutions

The fundamental solution is to stop creating a new connection for every request and instead **reuse a pool of connections**.

***

#### Why Limit Connections?

Establishing a new TCP connection requires a TLS handshake, which is a time-consuming process. More details [here](https://www.cloudflare.com/en-gb/learning/ssl/what-happens-in-a-tls-handshake/).  By reusing a smaller pool of persistent connections, your application will be more performant, and it will place significantly less load on both your client machine and our RPC servers.

***

#### What Is an Ideal Connection Count?

We recommend starting with a limit of **50 connections**. You can monitor your port usage with the `lsof` command above. If you see that all 50 connections are consistently in use and your application could benefit, you can gradually increase this limit.

***

#### 1. Limit Connections with a Global Agent (Recommended)

This is the best solution for most applications. You configure NodeJS to use a global agent with a connection pool, forcing the HTTP client to reuse connections.

**For `undici` (Node's default `fetch`):**

Install [`undici`](https://www.npmjs.com/package/undici) and set the global dispatcher at the very beginning of your application's entry point.

```javascript
// At the top of your main application file
import { setGlobalDispatcher, Agent } from "undici";

setGlobalDispatcher(
  new Agent({
    connections: 50, // Recommended starting default
  })
);
```

**For `axios`:**

If you prefer [`axios`](https://www.npmjs.com/package/axios), you can create a client with a dedicated `https.Agent`. The [`@solana/web3.js`](https://www.npmjs.com/package/@solana/web3.js) `Connection` object allows you to pass a custom fetch implementation. A full example can be found at [this Gist](https://gist.github.com/WilfredAlmeida/9adea27abb5958178c4370c5656e89b7).

```javascript
import https from 'https';

const agent = new https.Agent({
  maxSockets: 50, // Recommended starting default
  keepAlive: true,
});

const axiosInstance = axios.create({
  httpsAgent: agent,
});
```

***

#### 2. Use an Alternative Runtime (Bun)

The [Bun](https://bun.sh/) runtime is a modern alternative to NodeJS. Based on our testing, its internal HTTP client handles connection pooling more efficiently and does not exhibit this socket exhaustion issue. This is a great option for new projects but may be a larger change for existing codebases.

#### 3. Using the new version of [\`@solana/web3.js\`](https://github.com/solana-labs/solana-web3.js/tree/master/packages/library).

&#x20;Anza Labs is developing a new and improved version of the library which, as of this writing, is in technical preview. It uses the [`undici`](https://www.npmjs.com/package/undici) library and the errors are less frequent in it. If encountered, with the configuration mentioned in [\[1\]](#id-1.-limit-connections-with-a-global-agent-recommended) they should be resolved. Do note that the library is not compatible with the current version, meaning that it’ll be a ground up rewrite of your codebase.

***

#### 4. A Note on Other Libraries

If you're using SDKs like [jito-ts](https://www.npmjs.com/package/jito-ts) which uses [node-fetch](https://www.npmjs.com/package/node-fetch) underneath, or some other libraries, you may encounter errors like `ERR_STREAM_PREMATURE_CLOSE` which have this same underlying issue and limiting the number of connections for NodeJS has resolved the issue for our customers. The number of connections for libraries like `node-fetch` and others can be limited by providing an `http(s).Agent` configuration. For example

Copy

```
new https.Agent({
  maxSockets: 50,
});
```


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/web3js-socket-connection-issues.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
