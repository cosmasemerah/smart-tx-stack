# Introduction

Welcome! This is the official documentation for Triton One's high-performance blockchain RPC services. Whether you're building your first dApp or managing a high-frequency trading operation, our goal is to provide you with reliable, fast, and feature-rich infrastructure.

#### Who is this for?

* **dApp Developers:** Get fast and reliable RPC access for your application's frontend and backend needs.
* **Data Analysts:** Leverage our advanced streaming and archival services to get deep insights into on-chain activity.
* **Traders & Arbitrage Bots:** Use our low-latency transaction delivery network to gain a competitive edge.
* **Validators:** Integrate with our network to provide and monetize transaction bandwidth.

#### Getting Started

If you're new here, the best place to start is our [**Getting Started Guide**](/getting-started). It will walk you through the process of creating an account, understanding your endpoints, and making your first API call.

#### Our Services

* **Core RPC Features:** Learn about our global infrastructure, including GeoDNS routing, rate limiting, and security features.
* **Chain-Specific Guides:** Find detailed information for the chains we support, including Solana, SUI, and more.
* **Advanced Data & Streaming:** Dive deep with our powerful data streaming solutions like gRPC and improved WebSockets.
* **Trading Solutions:** Explore our Cascade network for optimized, low-latency transaction delivery.


# Getting started

Welcome to Triton One! This guide will walk you through the essential first steps to get your application connected to our RPC services.

#### Step 1: Create an account

To get started with using Triton One you will need access to a customer account with an active subscription.

* **Self sign up:** You can sign up following this [link](https://customers.triton.one/onboarding) and make a deposit to activate your account.
* **Contact us directly:** For custom inquiries, you can email us at <support@triton.one> or reach out via [Telegram](https://t.me/tritonone).

Our team will work with you to understand your needs and recommend the best plan, whether it's our shared service or a dedicated node deployment.

#### Step 2: Understand your endpoint vs. your token

Once your account is created, you will receive access to **Endpoints** and **Tokens** through the [Customer Portal](https://customers.triton.one). It is critical to understand the difference:

* **Endpoint URL (for frontend / dApps):**
  * This is the URL you integrate directly into your public-facing dApp or website (e.g., `https://your-app.mainnet.rpcpool.com`).
  * Traffic from these endpoints is typically rate-limited by IP and origin domain to protect against abuse.
  * **Never embed a secret token in your frontend code.**
* **Secret token (for backend services):**
  * A token is a secret key used to authenticate requests from your backend servers, scripts, or trading bots.
  * Backend traffic with a token usually has higher rate limits.
  * **This token must be kept secret.** If you suspect it has been leaked, contact us immediately to have it rotated.

#### 3. Authenticate your request

Triton supports two auth modes:

* **Allowed origins**: tighter rate limit per IP, no secret in the page. Use for browser apps
* **Token auth**: higher rate limit, identifies your account. Recommended for backend services

How you attach the token depends on the protocol.

**x-token header (works for all protocols)**

The `x-token` metadata header authenticates all request types (JSON-RPC, WebSocket, and gRPC).

* Example: `x-token: <your-token>`
* When using the header, the endpoint URL stays clean: `https://<your-endpoint>.mainnet.rpcpool.com`

**Token in the URL path (HTTPS and WSS only)**

JSON-RPC and WebSocket also accept the token in the URL path. Token-in-URL is not supported on gRPC and returns `403`.

Examples:

* `https://<your-endpoint>.mainnet.rpcpool.com/<your-token>`
* `wss://<your-endpoint>.mainnet.rpcpool.com/<your-token>`

#### Step 4: Configure your application

With your endpoint URL, you can now configure your application.

* For standard RPC calls, use the HTTPS URL (e.g., `https://...`).
* For WebSocket subscriptions, replace `https` with `wss` (e.g., `wss://...`).

#### Step 5: Explore the documentation

You're all set! Now you can explore the rest of our documentation to make the most of our service:

* Learn about our [**Core features**](/core-features/introduction) like [GeoDNS](/core-features/geodns) and [Rate limits](/core-features/ratelimits).
* Read our guide on [**Best Practices for Sending Solana Transactions**](/chains/solana/cascade/sending-txs).
* Discover our [**Advanced data & streaming**](/project-yellowstone/introduction) services for real-time insights.


# Introduction

Our platform provides a rich set of features designed to enhance your experience, from core infrastructure guarantees to advanced, chain-specific APIs. This page serves as a guide to some of the key capabilities you can find throughout our documentation.

#### Core Platform Features

These foundational features apply to all our endpoints, providing a baseline of performance, reliability, and security.

* **Global Request Routing** Learn how our multi-layered system using GeoDNS and BGP Anycast ensures low-latency connections for your users worldwide. Read the [Request Routing Guide →](/core-features/geodns)
* **Security & Abuse Prevention** A look into our proactive, multi-layered defense system, including intelligent rate limiting, protocol-level traffic filtering, and advanced fingerprinting. Learn about [Abuse Prevention →](/core-features/abuse-prevention)
* **High Availability Architecture** Our endpoints are backed by clusters of nodes and load balancers, enabling instantaneous failover to ensure maximum uptime for your application.

#### Support for a Multi-Chain Ecosystem

While Solana is a core part of our services, our infrastructure is built to support a variety of high-performance blockchains. We provide dedicated, reliable RPC access for multiple ecosystems, including:

* [Solana](/chains/solana)
* [Sui](/chains/sui)
* [Pythnet](/chains/monad)
* [Monad](https://docs.triton.one/chains/monad)

#### Advanced Solana Features

As our core offering, Solana benefits from a number of specialized, high-performance features.

* **Cascade Transaction Network** An optimized network for high-performance transaction delivery on Solana, using Stake-Weighted Quality of Service (SWQoS). Explore [Cascade →](/chains/solana/cascade)
* **Steamboat Custom Indexes** Serve heavy `getProgramAccounts` queries with exceptional performance using our custom-built, on-chain data indexes. Discover [Steamboat →](/project-yellowstone/cloudbreak-custom-indexes)
* **Digital Assets API** A powerful, indexed API for querying NFTs and other digital assets on Solana, including support for compressed NFTs. Read the [Digital Assets API Docs →](/digital-assets-api/introduction)

#### Data, Streaming & Archives

We offer multiple ways to stream real-time data or query historical information.

* **Dragon's Mouth (gRPC)** High-performance, low-latency gRPC streams for real-time Solana data, powered by Geyser. Get started with [gRPC →](/project-yellowstone/dragons-mouth-grpc-subscriptions)
* **Whirligig (WebSockets)** An improved, more reliable WebSocket implementation for applications that require a stable connection for subscriptions. Learn about [Whirligig WebSockets →](/project-yellowstone/whirligig-websockets)
* **Full Chain Archives** Query the entire history of the Solana blockchain, back to the genesis block, using our BigTable and Old Faithful archival solutions. Learn about [Archival Access →](/project-yellowstone/old-faithful-historical-archive)

#### Trading APIs & Tools

Gain a competitive edge with our suite of integrated APIs for on-chain trading.

* **Pyth Hermes Price Feeds** Directly query the Pyth Network's high-fidelity, real-time market data from our low-latency endpoints. Learn about [Pyth Hermes →](/trading-apis/hermes)


# Routing

We use a multi-layered architecture to route your API requests quickly and reliably across our global network. This page explains our standard routing method and our next-generation BGP Anycast system.

#### Standard Routing: GeoDNS + Load Balancers

By default, we use GeoDNS to resolve your endpoint's domain name to the geographically closest datacenter. This ensures that your application connects to a server in your region, minimizing network latency.

Your endpoint connects not to a single server, but to a high-availability cluster of load balancers within that datacenter. These load balancers then distribute your requests across our fleet of healthy RPC nodes.

This architecture provides **instantaneous failover**. If a backend server fails, our load balancers immediately and automatically redirect traffic to healthy nodes. This protects your application from disruptions without you having to wait for DNS changes to propagate.

#### Next-Generation Routing: BGP Anycast

For the highest level of performance and reliability, we offer routing via BGP Anycast. This advanced method skips GeoDNS entirely and uses the internet's core routing protocols to direct your traffic to our nearest network entry point.

Once your request enters our network, it travels over our private, dedicated backbone to the appropriate backend servers, bypassing the variable performance and congestion of the public internet.

This provides several key advantages:

* **Lower Latency:** BGP routing is often faster and more efficient than DNS-based routing.
* **Improved Reliability:** Your connection is more resilient as it no longer depends on DNS resolution for routing.
* **Enhanced Performance:** Our dedicated network provides a faster, more secure, and more consistent path for your data.

#### How to Use Anycast Routing

BGP Anycast routing is the future of our network and will become the default over time. This feature is currently available for clients who require the highest performance. If you are interested in using an Anycasted endpoint, please contact our support team.

#### Troubleshooting Connectivity

If you notice you are not being routed to the expected region under our **standard GeoDNS system**, please check the following:

* **VPN Usage:** Are you using a VPN? This will make your requests appear to originate from the VPN's location, not your own.
* **DNS Service:** Some custom DNS services can interfere with location data by masking or removing EDNS information.
* **Proxying:** Routing your traffic through a proxy can interfere with GeoDNS effectiveness. Please see our guide on [Proxying](/core-features/proxying) for more details.


# Abuse prevention

#### Our Philosophy

We take a proactive approach to abuse prevention with two primary goals:

1. **Protect Your Application:** Ensure that malicious traffic doesn't disrupt the service for your legitimate users.
2. **Protect Your Bill:** Prevent runaway bots or abusive traffic from causing unexpected charges.

Our abuse prevention systems are a core feature built over several years of experience running high-demand public and private endpoints.

{% hint style="info" %}
**A Note on Proxies**

We manage abuse prevention natively, so you do not need to place third-party proxies (like Cloudflare) in front of our service. In fact, doing so often introduces disadvantages like centralization and man-in-the-middle security risks. For a detailed explanation, please see our [guide on Proxying](/core-features/proxying).
{% endhint %}

#### How We Protect You

Our strategy is a multi-layered defense designed to filter out malicious traffic while allowing legitimate requests to pass through smoothly. Key components include:

* **Access Control (Endpoints vs. Tokens):** We provide a clear distinction between two methods of access. **Public Endpoints** are for your frontend dApp and are secured by an allowlist of web origins you provide. **Secret Tokens** are for your backend services and must be kept private.
* **Intelligent** [**Rate Limiting**](/core-features/ratelimits)**:** Our platform enforces carefully tuned Rate Limits based on IP address and other factors to prevent any single actor from overwhelming the service.
* **Traffic Filtering:** Our load balancers inspect incoming traffic to ensure it conforms to valid JSON-RPC specifications. Malformed requests or traffic that doesn't resemble a useful RPC call is denied at the edge before it can impact backend nodes.
* **Advanced Fingerprinting:** We employ sophisticated fingerprinting techniques to identify and block malicious actors attempting to circumvent our security measures, such as by spoofing authentication credentials or web origins. This protects against more advanced and persistent abuse patterns.

#### Your Role in Security

Properly using endpoints and tokens is the most important step you can take to secure your service.

* **NEVER** expose a secret Token in public source code, like a frontend JavaScript application. Use your public Endpoint URL instead.
* **ALWAYS** keep your Tokens secure on your backend, treating them like any other API key or password.

For applications like mobile or desktop apps where embedding a token may seem necessary, please contact our support team first. We will help you find a secure setup for your use case.


# Rate limits

#### Why we have rate limits

We apply rate limits to all our nodes to ensure service stability and protect our infrastructure from abusive traffic. Our goal is to allow legitimate application traffic to flow smoothly while mitigating the impact of aggressive bots.

#### How it works

Rate limits are primarily based on your originating IP address. If you exceed the request limit in a given time window, our server will reply with an **`HTTP 429 Too Many Requests`** status code.

{% hint style="info" %}
**Handling a `429` Error**

Your application's logic for handling rate limits is critical. When you receive a `429` error, you **must pause all requests from that IP for 10 seconds**.

Attempting to retry immediately will only result in more `429` errors and will not succeed. A 10-second backoff is required to get out of the rate-limited state.
{% endhint %}

#### Rate limits on the shared service

Our shared RPC pools have standard rate limits designed for well-written frontend dApp traffic.

* **Default limit:** The standard limit for most methods is **1200 requests per 10 seconds** per IP.
* **Stricter limits:** Computationally expensive methods, such as `getProgramAccounts`, have significantly lower limits.
* **View your limits:** To see the specific limits for your endpoint, visit `https://<your-endpoint>.rpcpool.com/ratelimits`.
* **Monitor programmatically:** Shared pool responses include `X-Ratelimit-*` HTTP headers, allowing you to monitor your current usage in real-time.

#### Custom limits for dedicated nodes

If you have a dedicated node, we can customise your rate limits to perfectly suit your workload.


# Proxying

## Proxying Traffic

{% hint style="warning" %}
**Warning: We Strongly Advise Against Proxying** Our platform is engineered for optimal performance, reliability, and security through direct connections. Placing a third-party proxy (like Cloudflare) in front of your RPC endpoint is not recommended, as it typically undermines these core features, introduces significant complexity, and degrades performance.
{% endhint %}

Before attempting to implement a proxy, we urge you to contact our support team. We can almost always provide a more direct, performant, and robust solution to achieve your goals without the drawbacks of an additional network layer.

#### Why We Advise Against Proxying

While proxying can be useful in traditional web hosting, it is poorly suited for high-performance RPC infrastructure for several key reasons.

**1. Performance Degradation and Routing Interference**

Proxying actively interferes with the sophisticated routing mechanisms we use to give you a fast and reliable connection.

* **It Breaks Geo-Routing:** Our standard routing uses GeoDNS to connect your users to the closest geographical datacenter. If your proxy isn't geographically distributed or does not provide accurate EDNS information, it will break this functionality, nullifying the latency benefits.
* **It Is Incompatible with BGP Anycast:** Our next-generation Anycast routing provides a significant performance boost by using the internet's core protocols to find the optimal path from your user to our network. This system relies on the user's real IP address. A proxy completely masks this information, making it impossible for the Anycast system to work as intended and routing your traffic sub-optimally.
* **It Delays Failover:** Proxies often cache DNS records. This can interfere with our ability to reroute your traffic during an emergency, leading to reduced redundancy and longer potential downtimes for your application.

**2. Security and Responsibility Concerns**

When you place a proxy in front of our service, you inherit significant security responsibilities.

* **You Add Redundant DDoS Protection:** Many users enable proxies to gain access to DDoS (Distributed Denial-of-Service) mitigation. However, our infrastructure is already well-protected against DDoS attacks, meaning a commercial provider like Cloudflare adds a layer of protection that your endpoint does not need.
* **You Create a Man-in-the-Middle:** By design, your proxy decrypts all traffic between your users and our servers. You assume full responsibility for any security incidents or data leaks that may result from this.
* **SSL/TLS Misconfiguration is Common:** A common mistake is to use insecure proxy SSL modes (like Cloudflare's "Flexible" or "Full" settings without proper validation), which results in unencrypted traffic over parts of the network and breaks end-to-end security. We do not recommend disabling SSL validation.
* **You Must Handle Abuse Prevention:** When you use a proxy, you take over primary responsibility for rate limiting and abuse prevention. Our systems will see all traffic as coming from your proxy's IP, requiring us to partially disable our standard protections for your endpoint.

**3. Technical and Configuration Complexity**

A proxy setup requires careful and complex configuration to avoid breaking functionality.

* **HTTP Header Forwarding:** You must ensure your proxy is configured to correctly forward critical headers, including `Host` and `Origin` (to prevent CORS errors and routing failures) and `X-Forwarded-For` / `X-Real-IP` (to pass the original user IP).
* **Requires a Specialized Token:** You must contact us to be issued a specialized token for your proxy to use. You need to ensure this token is not leaked in proxy error messages or otherwise.
* **DNS-Layer vs. HTTP-Layer Proxies:** Simple DNS-layer proxies (such as Cloudflare's default "Proxy" DNS records) are generally not supported for our shared endpoints. Only full HTTP-layer proxies can be made to work, and they require the complex configuration described above.

If a misconfigured proxy causes abusive traffic, we will be forced to severely limit or block your endpoint.


# FAQs

With our user-friendly platform and thorough documentation, our customer

#### Account & Billing

**Q: How do I get an account?** A: The best way to start is by filling out our [onboarding form](https://forms.gle/rT6nPbUE4toyPfbb7). For custom inquiries, you can also email us at <support@triton.one> or contact us on [Telegram](https://t.me/tritonone).

**Q: Do you require long-term contracts?** A: No, our standard billing is month-to-month.

**Q: What payment methods do you accept?** A: We accept:

* USDC (SPL, ERC20 on Ethereum, Tron, Polygon)
* Payments through hel.io (USDC)
* Credit cards (via Coinflow)
* Wire transfers in GBP and USD

**Q: Can I change my plan later?** A: Yes, you can upgrade or downgrade your plan as your needs change.

**Q: How do I cancel my subscription?** A: We require one calendar month's notice for cancellation. This aligns with the notice periods from our own infrastructure vendors.

#### General Technical Questions

**Q: What happens if I hit my rate limit?** A: Your application will receive `HTTP 429` errors. When this happens, you must pause requests for 10 seconds to clear the limit. We strongly recommend implementing a backoff-and-retry mechanism. See our Rate Limits page for more details.

**Q: Can I run scripts on the shared service?** A: No, the shared service is designed for frontend dApp traffic only. Backend scripts and bots require a dedicated node to ensure fair use and stability for everyone.

**Q: What should I do if my secret token is leaked?** A: Contact us immediately. We will disable the compromised token and issue a new one to secure your account.

**Q: How do I connect to WebSockets?** A: Simply replace `https` with `wss` in your RPC endpoint URL. For example: `wss://your-endpoint.rpcpool.com`. We do recommend however to use the gRPC interface for streaming purposes if available, see [Dragon's Mouth gRPC Subscription](/project-yellowstone/dragons-mouth-grpc-subscriptions) page for details on how to do that on Solana.&#x20;

#### Solana-Specific Questions

**Q: How can I use Geyser plugins?** A: Geyser plugins can be enabled on our dedicated Solana nodes. They provide powerful, real-time streams of on-chain data. Contact our support team to discuss your specific needs and we can configure a node for you.

**Q: What is the advantage of sending transactions through a staked validator?** A: Staked validators have access to a much larger, reserved connection pool for sending transactions. During periods of high network congestion on Solana, this provides a significant advantage over the limited, highly contested public connection pools. See [Cascade](/chains/solana/cascade).

**Q: Can a "processed" transaction on Solana still be dropped?** A: Yes. A transaction is only final once it reaches `confirmed` or `finalized` commitment. Slots containing `processed` transactions can still be dropped during minority forks or network congestion.


# Security practices

At Triton One, we are committed to a defense-in-depth security model to protect our global infrastructure and our customers' services. This document provides an overview of the technical and operational measures we take to ensure the security and integrity of our platform.

#### Access Control

Secure access to our infrastructure is controlled through a centralized Identity and Access Management (IAM) system governed by the principle of least privilege.

* **Authentication:** We enforce strict password policies and mandate the use of Multi-Factor Authentication (MFA) for all services, requiring hardware security tokens (like Yubikeys) for an added layer of protection.
* **Single Sign-On (SSO):** All access to external and internal services is gated through our SSO provider to ensure centralized control and auditing.
* **SSH Access:** All SSH access to our servers is strictly controlled. We use bastion hosts (jump servers), short-lived SSH certificates issued by a central authority, and require hardware key-based authentication instead of passwords.

#### Network Security

Our network is designed to be secure by default, minimizing exposure and encrypting all traffic.

* **Private Network Backbone:** All internal traffic between our servers travels over a private, encrypted network backbone, completely isolated from the public internet.
* **Host Firewalls:** Every host is protected by a firewall configured with a minimal exposure policy. Only the specific ports required for a host's services are opened, and access is restricted to trusted internal subnets.
* **Data in Transit:** All data is encrypted in transit by default, whether it is moving across our internal network or over the public internet via HTTPS.

#### System and Endpoint Security

The security of our individual systems and the devices our team uses is paramount.

* **Secure Employee Workstations:** All employee devices used for work are required to have full disk encryption, up-to-date antivirus software, and must use a VPN when connected to any untrusted network.
* **Automated Patching:** Our servers receive automated security patches on a daily basis to protect against the latest threats.
* **Vulnerability Monitoring:** We continuously monitor critical software packages for new Common Vulnerabilities and Exposures (CVEs) to ensure they are patched proactively.

#### Personnel and Procedural Security

Our security posture is strengthened by our rigorous internal processes and the training of our team.

* **Onboarding and Offboarding:** We follow a formal, secure process for onboarding new employees, granting access gradually based on need. When an employee departs, a strict offboarding procedure is initiated to immediately and completely revoke all access to all systems.
* **Security Training:** Our team undergoes regular security awareness training to stay informed about the latest security best practices, tools, and procedures.

#### Auditing, Alerting, and Incident Response

We believe in proactive monitoring and having a clear plan for any potential issues.

* **Continuous Auditing:** We use automated tools to perform daily security audits on all hosts, checking for compliance with our security policies and identifying potential risks.
* **Real-Time Alerting:** Our systems are monitored 24/7 with a sophisticated alerting stack that notifies our on-call team of any suspicious activity or critical security events.
* **Incident Response & Disaster Recovery:** We have formal, well-documented Security Incident Response and Disaster Recovery plans based on NIST standards. These procedures ensure we can respond to and resolve any potential incidents swiftly and effectively.

#### Contact information

* For general concerns regarding privacy or security, please email <support@triton.one>.
* For urgent security reports, please contact <noc@triton.one>.


# Data Privacy

We are committed to the responsible handling of data and full compliance with privacy regulations such as GDPR. This page outlines our policies regarding the customer data we process to provide our services.

#### What Customer Data We Handle

To operate our services, we process three main categories of customer-related data:

* **Validator Node Identity Keys:** For customers running validators on our infrastructure.
* **RPC Service Log Data:** Logs generated by user interaction with our RPC endpoints.
* **Customer Account & Billing Information:** Information required for account management and invoicing.

#### How We Protect Your Data

We employ strict measures to protect the data you entrust to us.

* **Validator Keys:** Private keys are a critical asset. They are never stored or transmitted unencrypted and only ever exist in a decrypted state inside the relevant processes memory while in active use.
* **Billing Information:** Sensitive payment details, such as credit card numbers, are never stored on our systems. All billing is handled by separate, dedicated, and compliant third-party payment processors.

#### RPC Log Data and Privacy Levels

We provide different levels of data privacy to suit our customers' needs.

**Shared Services**

On our **shared services**, all data collection is for the sole purpose of abuse prevention and operational stability. We do not identify or de-anonymize individual end-users, and our standard log retention period is four weeks.

**Dedicated Services**

For our **dedicated services**, we offer customers direct control over their logging policies to meet specific legal or privacy requirements. You can choose from the following levels:

* **Max Privacy:** No request parameters or payloads are logged. This offers the highest level of privacy but may limit our ability to detect certain types of abuse. This is the required policy for any shared infrastructure components.
* **Enhanced Privacy (Default):** We may log method parameters but cannot link the signer of a transaction to the originating IP address. This provides a balance of operational insight and user privacy.
* **GDPR Privacy:** We may log all parameters for technical support, legal, or compliance reasons. All data is handled in a fully GDPR-compliant manner.

For any questions regarding our data privacy policies, please contact us at **<support@triton.one>**.


# Solana

Welcome to our documentation for the Solana ecosystem. Our platform provides best-in-class infrastructure for developers, traders, and enterprises, offering everything from standard RPC access to a suite of high-performance, proprietary tools that give you a competitive edge.

#### Core RPC Services

* **Full API Support:** We offer complete compatibility with the standard Solana JSON-RPC and WebSocket APIs across **Mainnet**, **Testnet**, and **Devnet**, ensuring seamless integration with any existing Solana SDK or tool.
* **Complete Historical Archive:** All our endpoints provide access to the full history of the Solana blockchain. You can query any transaction or block, all the way back to genesis, using our powerful archival solutions. Learn more about our [Archival solutions →](/project-yellowstone/old-faithful-historical-archive)

#### Enhanced Features ([Project Yellowstone →](/project-yellowstone/introduction))

Project Yellowstone is our suite of Solana infrastructure improvements designed for superior performance and capability.

* **Steamboat Custom Indexes:** Serve heavy `getProgramAccounts` queries with exceptional performance using our custom-built, on-chain data indexes that can reduce query times from seconds to milliseconds. Discover [Steamboat →](/project-yellowstone/cloudbreak-custom-indexes)
* **Advanced Data Streaming:** Access real-time on-chain data through a variety of powerful tools, including low-latency gRPC streams and improved, highly reliable WebSockets. Compare our [Streaming options →](/chains/solana/streaming)
* **Parsed Program Streams (Vixen):** Go beyond raw data with our service that provides real-time, pre-parsed data streams for popular on-chain programs, saving you immense development and data processing overhead. Explore [Vixen Program Data Streams →](/project-yellowstone/vixen-parsing-framework)

#### High-Performance Transaction Sending

* **Cascade Network:** Our optimized network for transaction delivery, using Solana's Stake-Weighted Quality of Service (SWQoS) to provide a more reliable path to network leaders, especially during periods of high congestion. Learn about the [Cascade Network →](/chains/solana/cascade)
* **Transaction Sending Advice:** Follow our best practices for client-side retries, CU budgets, and priority fees to maximize your transaction inclusion rate. Read our [Transaction Sending Advice →](/chains/solana/cascade/sending-txs)
* **Yellowstone Shield:** Protect your transactions from MEV and other validator-level risks by creating on-chain policies that control which validators are allowed to process your transactions. Learn how to use [Yellowstone Shield →](/project-yellowstone/shield-transaction-policies)

#### Specialized APIs

* **Digital Assets API (DAS):** A powerful, indexed API for querying NFTs, fungible tokens (SPL and Token22), and other digital assets on Solana, including first-class support for compressed NFTs. Explore the [Digital Assets API →](/digital-assets-api/introduction)
* **Jito Bundle Simulation:** For advanced traders, we offer support for Jito RPC on dedicated nodes, giving you access to `simulateBundle` for complex atomic arbitrage and MEV strategies. Learn about [Jito Bundle Simulation →](/trading-apis/bundle-simulation-with-jito)

#### Developer Guides

* **Web3.js Connection Issues:** A guide to diagnosing and fixing common socket and connection errors when using the `@solana/web3.js` library in NodeJS environments. Troubleshoot [Web3.js issues →](/chains/solana/web3js-socket-connection-issues)
* **Solana v2.0 Deprecated Calls:** Stay ahead of network upgrades by reviewing the list of RPC calls that will be deprecated in Solana v2.0 and their modern replacements. See the list of [deprecated calls →](/chains/solana/deprecated-calls-solana-2.0)


# Streaming

Real-time on-chain data is the lifeblood of modern Web3 applications. We offer a suite of powerful streaming solutions, each tailored to a specific use case—from simple frontend notifications to the high-throughput, low-latency demands of MEV searchers and trading bots.

Streaming data from Solana requires a high-bandwidth Internet connection and a fast client environment. Frequent disconnections are a sign of a weak client setup. See our [Streaming Troubleshooting Checklist](/chains/solana/streaming/streaming-troubleshooting-checklist) for helpful tips.

***

#### Dragon's Mouth (gRPC)

**The fastest way to get real-time on-chain data.** Dragon's Mouth is a gRPC interface powered by Geyser, streaming account and transaction updates directly from Solana validators.

* **Best for:** Backend applications, high-frequency trading bots, MEV searchers, and any system where milliseconds matter.
* **Key Feature:** Provides **intra-slot updates**, delivering data up to 400ms faster than standard WebSockets by showing you state changes as they happen, not just at the end of a slot.
* **Note:** gRPC is not supported in web browsers and is intended for server-to-server communication.

**Learn more about** [**Dragon's Mouth gRPC →**](/project-yellowstone/dragons-mouth-grpc-subscriptions)

***

#### Whirligig (WebSockets)

**A better, faster, stronger WebSocket.** Whirligig is a high-performance, drop-in replacement for Solana's standard WebSocket API, built on top of our Dragon's Mouth gRPC streams.

* **Best for:** Web3 frontends, real-time user interfaces, and easily upgrading existing applications that already use WebSockets.
* **Key Feature:** Offers the same **intra-slot update** advantages as gRPC but over a browser-compatible WebSocket connection, making your dApp feel significantly more responsive.

**Learn more about** [**Whirligig WebSockets →**](/project-yellowstone/whirligig-websockets)

***

#### Fumarole (Reliable Streams)

**A persistent, "never miss an event" streaming solution.** Fumarole is designed for applications where guaranteed data delivery is absolutely critical.

* **Best for:** Accounting systems, compliance tools, analytics platforms, and any application that needs a complete and verifiable history of events.
* **Key Feature:** Allows your client to disconnect and reconnect to the stream at a later time, automatically backfilling any data that was missed. It also supports horizontal scaling via persistent subscribers.

**Learn more about** [**Fumarole Reliable Streams →**](/project-yellowstone/fumarole)


# Streaming Troubleshooting Checklist

If you’ve started experiencing Dragon’s Mouth gRPC disconnects recently, this page is for you. Solana’s average daily TPS has almost doubled since December, and the full-chain feed can now spike to \~1.3-1.8 Gbps.

Use this checklist to confirm that your environment can keep up with the current Solana throughput.\
If some answers are “no”, that’s ok, we just want you to get the full picture before contacting Triton support.

***

* #### My subscriber host has at least 5 Gbps of network capacity to the internet

  5 Gbps is strongly recommended for large or full-chain subscriptions. In cloud environments, instance types are often capped at 1 Gbps by default
* #### My round-trip latency from the subscriber to the Triton endpoint is ≤ 50 ms

  Lower latency gives you more headroom for variability in network conditions. Measure it from the same machine that runs your subscriber client, using `ping`
* #### Zstd compression is enabled

  Without compression, bandwidth requirements increase significantly, and it becomes much harder to stay on the tip of the blockchain during spikes
* #### Adaptive window size is set to true

  This setting allows the client to adjust flow-control window sizes automatically based on throughput
* #### No cloud Lambdas!

  Cloud Lambdas, like AWS, do not play well with streaming connections. They can leave many open connections on the servers, which can degrade service.
* #### I'm not using vanilla NodeJS

  Vanilla NodeJS is too slow for Solana and requires a special client library. Use Rust, Golang, or the special NodeJS/TypeScript client discussed on our [gRPC Subscriptions](/chains/solana/streaming#dragons-mouth-grpc) page.
* #### I’ve tested my stream capacity with the test client

  Use the client-ubuntu tool described on the [gRPC Subscriptions](/chains/solana/streaming#dragons-mouth-grpc) page to benchmark your streaming setup. If it outputs a ping message every 10 seconds and you get a total between 60-80 Mbps, it means your setup is keeping up great, and you can stay on the chain’s tip without any disconnections.\
  \
  Can be run using:\
  `./client-ubuntu-22.04 --http2-adaptive-window true ---compression zstd --endpoint http://aaa.mainnet.rpcpool.com --x-token <token> subscribe --transactions --accounts --stats`
* #### I’ve considered other Triton streaming options for my workload

  If you’re using Dragon’s Mouth, we assume your workload prioritises lowest latency over absolute data completeness, persistence, and redundancy.<br>

  If you’d prefer the guarantees over speed, for example, if you run accounting, analytics, indexing, or compliance workloads, consider using Fumarole (beta) instead of raw gRPC.


# Geyser

We are happy to configure dedicated Geyser nodes.&#x20;

You can see the current set of Geyser plugins that we support here:\
<https://github.com/rpcpool/solana-geyser-park>.

If you want to run a Geyser setup, our recommendation is to have a dedicated node just for Geyser. It is possible to run Geyser and RPC on a single node, but you will face a risk that your RPC calls could put the node behind which would also cause Geyser to fall behind. This could eventually lead to missed Geyser updates.&#x20;

For complete reliability you would need two dedicated nodes. This would enable both failover in case one node goes down but also in cases where we need to upgrade the Solana version or any other regular maintenance of the node.&#x20;

Contact us via your customer support channel if you would like to enable Geyser on your node. We are happy to get on a call to discuss your requirements and experiences of working with Geyser.


# Token Program

There are multiple methods to choose from when querying data from the Token Program.

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

[Read more about the Digital Assets API](/digital-assets-api/introduction).


# Archival Data Access

All our Solana endpoints support querying the full history of the blockchain, all the way back to the genesis block. This allows you to look up historical transactions, blocks, and signatures without needing to manage your own archival infrastructure.

#### How It Works

When you make a request for a transaction, our system will route you to our Alpamayo and block-cache ledger backends. \
\
If the data is within the last several epochs, we will serve it directly from these low-latency endpoints. If the data is older than what these store, the request is automatically forwarded to our long-term archival ledger systems, Hydrant and Old Faithful.

#### Hydrant Archive & Pricing

Our Hydrant archive serves as the final step in our automated lookup process for very old data.&#x20;

* **Pricing:** $10.00 per million queries (or a fraction thereof).
* **Minimum Charge:** $10.00 per month if the service is used.
* **Example Queries:** `getTransaction`, `getBlock`, `getSignaturesForAddress` , `getTransactionsForAddress`.

#### Old Faithful (Next-Generation Archive)

Old Faithful is our modern, open-source solution for accessing Solana's historical ledger that provides gRPC streaming of bulk transaction and block data.

&#x20;It is currently available for use via a separate, dedicated path. Please refer to the full [Old Faithful documentation](/project-yellowstone/old-faithful-historical-archive) for details on how to access it today.


# Improved Priority Fees API

#### The Problem with Standard Priority Fees

Solana's default `getRecentPrioritizationFees` RPC method can be difficult to use effectively for setting a competitive priority fee. It only returns the **minimum** priority fee paid in recent blocks, which is often zero and not a useful indicator of the market rate required for a transaction to land.

#### Our Solution: Percentile-Based Fees

To solve this, we have enhanced the `getRecentPrioritizationFees` method with a `percentile` parameter. You can now request a specific percentile (e.g., 50th for the median fee, 90th for a high-end fee) to get a much more realistic and actionable fee estimate based on recent on-chain activity.

> For other RPC providers or users running their own nodes, we provide the patches to enable this functionality and encourage its adoption for a better developer experience. [Learn more →](/chains/solana/improved-priority-fees-api/for-rpc-providers)

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


# For RPC Providers

If you're an RPC provider or run your own RPC nodes and would like to integrate this feature, here's the patch you'd need to apply to your Solana

{% embed url="<https://github.com/rpcpool/solana-public/tree/v1.17.23-getrpf>" %}

{% embed url="<https://github.com/anza-xyz/agave/issues/3332>" %}

{% embed url="<https://github.com/anza-xyz/agave/pull/217>" %}


# Cascade

Transaction Delivery Network

Cascade is our high-performance transaction delivery network for Solana, designed to provide a more reliable and predictable path for your transactions to land on-chain, especially during periods of high network congestion.

#### How It Works

Cascade utilizes Solana's **Stake-Weighted Quality of Service (SWQoS)**, allowing transactions to be sent through the reserved, private connection pools of staked validators. This bypasses the often-congested public TPU ports that standard RPC services use, resulting in a higher delivery success rate.

#### Key Components

* **Bandwidth Marketplace** ~~A marketplace where application developers can~~ [~~buy reserved transaction bandwidth~~](/chains/solana/cascade/buying-transaction-bandwidth) ~~and validators can~~ [~~sell their excess bandwidth~~](/chains/solana/cascade/providing-transaction-bandwidth)~~, creating a fair market price for priority access.~~ The marketplace has been sunset, we now add SWQoS transaction bandwidth for free at your request.
* **Best Practices for Sending** To get the most out of Cascade, it's crucial to structure your transactions correctly. Following our [Transaction Sending Advice](/chains/solana/cascade/sending-txs) for client-side retries, compute budgets, and priority fees will significantly improve performance.
* **Yellowstone Shield Integration** Cascade is fully integrated with [Yellowstone Shield](/project-yellowstone/shield-transaction-policies), allowing you to apply on-chain policies to control exactly which validators are allowed to process your transactions, protecting you from MEV and other risks.

#### Getting Access

To start sending transactions through the Cascade network, please contact our support team to get set up.


# Transaction Submission API

Direct HTTP endpoint for submitting Solana transactions through Cascade without JSON-RPC overhead.

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
If you prefer the standard Solana RPC interface or need full `sendTransaction` options like `skipPreflight`, you can continue using `sendTransaction` as normal. See our [Transaction sending advice](/chains/solana/cascade/sending-txs) for best practices.
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

| Header                      | Description                                                                                                                       |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `solana-forwardingpolicies` | Comma-separated [Yellowstone Shield](/project-yellowstone/shield-transaction-policies) policy addresses to apply when forwarding. |

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
* For best results, follow our [Transaction sending advice](/chains/solana/cascade/sending-txs) for client-side retries, compute budgets, priority fees, and preflight handling.
* If you are using Yellowstone Shield policies, see the [Shield documentation](/project-yellowstone/shield-transaction-policies) for configuration details.


# Transaction sending advice

Recommendations to optimize transaction delivery through our Cascade network.

Sending transactions effectively on Solana requires a client-side strategy that accounts for network congestion and leader schedules. Following these best practices will significantly increase your transaction inclusion rate and create a better experience for your users.

{% hint style="success" %}
**TL;DR: Quick Summary**

* **Handle retries in your own code.** Do not rely on the RPC node to retry for you.
* When sending, set **`maxRetries: 0`**.
* If you need simulations, **do it separately** via `simulateTransaction()` before sending.
* When sending, set **`skipPreflight: true`**.
* Use a recent blockhash from a **`finalized`** or **`confirmed`** commitment level. Never use processed for blockhashes.
* Set a [**tight Compute Unit (CU) budget** and a **competitive priority fee**](#id-3.-set-precise-compute-budgets-and-priority-fees).&#x20;
  {% endhint %}

***

#### 1. Handle Retries in Your Client

Previously, RPC nodes would queue and retry transactions on behalf of the user. During periods of high traffic, this system creates backpressure, saturating the queues and causing widespread transaction failures.

The modern best practice is to manage the retry logic entirely within your own application. This gives you full control over the user experience and leads to more predictable transaction delivery.

* **Your Action:** Build your own asynchronous retry logic (e.g., re-fetching a recent blockhash and re-signing every few seconds).
* **RPC Parameter:** Always include **`maxRetries: 0`** in your `sendTransaction` options. This tells our RPC node not to use its legacy retry queue.

***

#### 2. Simulate First, Then Send

Our Cascade delivery network has more pathways available for transactions that do not require a pre-flight simulation. For the fastest and most reliable delivery, you should separate simulation from execution.

* **Your Action:** If you need to verify a transaction's outcome, call the `simulateTransaction()` method first.
* **RPC Parameter:** When you are ready to send the transaction for real, use `sendTransaction()` with the **`skipPreflight: true`** option.
* **Billing**: `simulateTransaction()` and `sendTransaction()` are two distinct RPC calls, billed independently. That means if you leave `skipPreflight` as `false`, your sends will be billed twice.

***

#### 3. Set Precise Compute Budgets & Priority Fees

A well-defined compute budget and priority fee are critical for getting your transaction included in a block.

* **Compute Budget:** The default CU budget is often too high for simple transactions. Setting an accurate, tight budget helps validators fit your transaction into blocks more efficiently. For example, a simple SOL transfer uses only \~500 CUs. Here is a good page on [How to Optimize Compute Usage on Solana](https://solana.com/developers/guides/advanced/how-to-optimize-compute).
* **Priority Fee:** Including a priority fee is essential. You should check the prevailing market rates for the accounts your transaction needs to write-lock. Our [Improved Priority Fees API](/chains/solana/improved-priority-fees-api) can help you determine a competitive fee without overpaying.

***

#### Resources

* **Example Code:** See our [Optimized Transactions Examples](https://github.com/rpcpool/optimized-txs-examples) repository on GitHub for sample client-side retry logic.
* **Further Reading:** This [thread on X by Jordan from Anza Labs](https://x.com/jordaaash/status/1774892862049800524?s=20) provides excellent context on this topic.


# Acquiring Transaction Bandwidth

Onboarding and Bidding for Cascade Marketplace

Our Cascade network used to include an open marketplace where you could buy guaranteed transaction bandwidth, these days we offer this for free. This allows your application to bypass congested public routes by using Solana's Stake-Weighted Quality of Service (SWQoS), ensuring more reliable transaction delivery.\
\
Cascade endpoints are used to send transactions over SWQoS transaction bandwidth using our open source transaction sending software. Transactions sent to the the endpoint you will get with your account are always routed to the nearest gateway, ensuring the lowest latency possible from any backend location you might have.\
\
Cascade-only endpoints are possible with us, you are not required to have additional RPC subscriptions with us.

#### How to acquire Transaction Bandwidth

In order to have access to the SWQoS transaction network Triton One needs to add bandwidth for usage to your endpoint. In order to get access please follow the following steps:

1. Make sure you have an active account with us. If you are not yet a Triton One customer make sure to onboard yourself through this link: [https://customers.triton.one/onboarding?utm\_source=docs](https://customers.triton.one/onboarding?utm_source=steve)
2. Once you have an active account, open a conversation with our support team by navigating to the customer dashboard at <https://customers.triton.one> and finding the purple "Talk to Support" button in the lower right corner.
3. In the chat bubble that opens request transaction bandwidth.
4. Once your bid is successful and your bandwidth becomes available , ensure your application is configured to take full advantage of the Cascade network. Following our best practices is critical for performance. [→ Read our Transaction Sending Advice](/chains/solana/cascade/sending-txs)


# Providing Transaction Bandwidth

Cascade Bandwidth Marketplace

As a validator, you can monetize your unused, stake-weighted transaction bandwidth by selling it on the Cascade Marketplace. This provides a new revenue stream for you and your delegators while helping to improve Solana's overall transaction delivery robustness.

#### The Validator's Opportunity in Transaction Delivery

One of the biggest challenges on a high-throughput network like Solana is managing network traffic to ensure a good user experience. Public validator endpoints are permissionless, making them a target for bot spam and congestion during periods of high demand.

To solve this, Solana provides multiple pathways for transaction delivery, making the entire system more robust. These routes include:

* **Public Ports:** Free to use, but subject to intense competition and network congestion.
* **Jito Auctions:** Allow searchers to bid for top-of-block priority inclusion.
* **Stake-Weighted Quality of Service (SWQoS):** A mechanism that grants staked validators a reserved, private bandwidth allocation, proportional to their stake weight.

This reserved SWQoS bandwidth is a valuable, often underutilized asset. The [**Cascade Marketplace**](/chains/solana/cascade) was created to connect validators who want to sell this capacity with applications and traders who need a reliable, priority pathway for their transactions, creating a fair market price for this bandwidth.

***

#### How It Works

**Calculating Your Bandwidth**

Your available transaction bandwidth is determined by your percentage of the total active stake in a given epoch, multiplied by the total network capacity of 500000 Packets Per Second (PPS).\
\&#xNAN;*Example: A validator with 0.1% of the total stake has 500 PPS of bandwidth to use or sell.*

**Marketplace Operation**

We operate the auction, collect bids from buyers, determine the market-clearing floor price, and handle all customer billing and support.

**Revenue Share**

Revenue from the marketplace is split, with **55% going to the bandwidth provider (you) and your delegators**, and 45% to Triton One as the marketplace operator.

**Compliance**

Participation in the marketplace requires AML/KYC verification to comply with regulations.

***

#### Technical Onboarding Guide

To begin providing bandwidth, you'll need to install and configure our open-source forwarding agent, **Yellowstone Jet**.

**Step 1: Install Yellowstone Jet**

Yellowstone Jet is a transaction forwarder that receives transactions from the Cascade network via gRPC and forwards them to the leader using your validator's identity over QUIC. You can run Jet on your validator node or on a separate machine.\
👉 [Get Yellowstone Jet on GitHub](https://github.com/rpcpool/yellowstone-jet)

**Step 2: Receive Marketplace Credentials**

Once you are approved as a provider, our support team will issue you a marketplace endpoint and a secret token for your Jet instance to authenticate.

**Step 3: Configure Jet**

You will need to create a `yml` configuration file for Jet. The configuration specifies your validator identity, the upstream RPC/gRPC endpoints, and the Cascade gateway credentials we provide.

<details>

<summary>Example `yellowstone-jet.yml` Configuration</summary>

```yaml
tracing:
  json: true # change to `true` for production

# Enabled features  
features:
  enabled_features:
    - transaction_payload_v2
    - yellowstone_shield
    
identity:
  # Do not send transactions if Quic identity doesn't match specified one
  expected: << validator identity pubkey >> 
  # Keypair, if you don't want to use dynamic loading, specify the keypair path here
  #keypair: << validator identity key >>


# RPC & gRPC for upstream validator
upstream:
  # gRPC service endpoint
  primary_grpc:
    endpoint: <<either grpc running locally on your validator or the rpcpool.com endpoint you have been provided>>
    # Optional token for access to gRPC
    x_token: << either remove this if you use your own validator grpc or use the token provided by triton >>
  secondary_grpc: null # leave null if using triton grpc, if using your own grpc put the triton one here

  # RPC endpoint, this needs to support gPA and the program id index
  # We recommend you use the one provided by us.
  rpc: https://<< endpoint >>/<< token >>
  # Cluster nodes information update interval in milliseconds
  cluster_nodes_update_interval: 30s

# Jet gateway
jet_gateway:
  #max_streams: null # number of transactions per 100ms to accept, set this if you don't want to provide the full bandwidth to Cascade
  endpoints:
    - << endpoint >>
  x_token: << jet gateway token aaa-aaa-ddd-eee >>

# Admin server listen options
listen_admin:
  # RPC listen address
  bind:
    - 127.0.0.1:11888 # if you want to track data with prometheus specify a different address here
  # Number of RPC threads to process requests
  # worker_threads: 2

# Solana-like server listen options
listen_solana_like:
  # Solana like RPC listen address
  bind:
    - 127.0.0.1:11899
  # Number of RPC threads to process requests
  #worker_threads: 2
  # Allow to do sanitize check on RPC server (required for ALTs), supported only on patched nodes
  # If option set to `true`` then Jet would check `sanitizeTransaction` method before start
  # See https://github.com/rpcpool/solana-public/tree/v1.17.31-rpc-sanitize-tx
  proxy_sanitize_check: false
  # Allow to do preflight check on RPC server (simulateTransaction)
  proxy_preflight_check: false

# Send retry options 
send_transaction_service:
  # Send transaction to number of leaders
  leader_forward_count: 2
  
  # relay_only_mode : effectively no retry is schedule per transaction, simply fanout to upcoming leaders.
  #
  # ignores `default_max_retries`, `service_max_retries`, `stop_send_on_commitment` and `retry_rate`
  # WE RECOMMEND setting relay_only_mode=true, for staked jet instance for best performance.
  # retry can add a lot of overhead and is better handled by the original transaction sender (the client).
  relay_only_mode: true
  
  # Default max retries of sending transaction
  default_max_retries: 0
  
  # Service max retries
  service_max_retries: 0
  
  # Try to send transaction every retry_rate duration
  retry_rate: 1s


# QUIC config

quic:
  # Maximum number of concurrent connections to remote peers validators.
  # We recommend 1024, since most of the stake is cover by 1024 validators.
  max_concurrent_connection: 1024
  # How many "endpoint" to host connections.
  # Each endpoint creates an Event loop that actual send the transaction to remote peers.
  # Many connections can share the same endpoint.
  # For maximum performance, it should be equal to `max_concurrent_connections`
  # default: 5
  endpoint_count: 1024
  # Number of immediate retries in case of failed send
  send_retry_count: 1
  # How far in the leader schedule from current slot should we pre-emptively warm-up connections.
  # default is none, we recommend 10
  connection_prediction_lookahead: 10
  # Kind of Quic port: `normal` or `forwards`
  tpu_port: forwards
  # Quic handshake timeout ~ timeout to connect to a remote peer.
  # Default is `solana_sdk::quic::QUIC_CONNECTION_HANDSHAKE_TIMEOUT` -- 2s
  # we recommend 4s, or 6-8s if you are geographically localted APAC (Asia-Pacific)
  connection_handshake_timeout: 4s
  # The outbound udp port range to use.
  # The range must be greater than or equal to `endpoint_count` and cover at least 5 ports.
  endpoint_port_range:
    start: 35000
    end: 45000
    
prometheus:
  url: https://<< endpoint >>/<< token >>/pushgw
  push_interval: 30s
```

</details>

**Step 4: Run Jet as a Service**

We recommend running Jet as a `systemd` service to ensure it's always running.

<details>

<summary>Example `yellowstone-jet.service` file</summary>

```ini
[Unit]
Description=Yellowstone Jet transaction forwarder
After=network-online.target
StartLimitIntervalSec=0

[Service]
Type=simple
User=solana
Group=solana
ExecStart=/path/to/your/yellowstone-jet --config /etc/yellowstone-jet.yml
Restart=always
RestartSec=5
LimitNOFILE=700000

[Install]
WantedBy=multi-user.target
```

</details>

**Step 5: Load Your Validator Identity**

For security, Jet can load your validator identity at runtime without it ever touching the disk. After starting the service, run one of the following commands:

```bash
# To load from a keypair file (Jet needs read access)
/path/to/yellowstone-jet admin set-identity --identity /path/to/validator-keypair.json

# To load from stdin (more secure, no file access needed)
cat /path/to/validator-keypair.json | /path/to/yellowstone-jet admin set-identity
```

**Step 6: Verify Operation**

You can check that your Jet instance is running and connected by fetching its metrics:

```bash
curl -s http://127.0.0.1:11888/metrics
```


# Web3JS Socket/Connection Issues

Dealing with Socket/Connection issues in Web3JS

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


# Solana v2.0: Deprecated RPC Methods

> **NOTICE:** The Solana v2.0 network upgrade has already been deployed to Mainnet. As part of this upgrade, several legacy JSON-RPC methods have been permanently removed. If your application still relies on any of the deprecated methods listed below, it will no longer function as expected. We strongly recommend auditing your codebase and updating to the supported successor methods immediately. These modern alternatives are fully live and supported across all nodes.

***

#### Deprecated Methods and Their Successors

The following table lists all RPC methods that will be removed in v2.0 and the new methods that should be used instead.

| Deprecated Method (Old)             | Successor Method (New)                                                                                                 |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `confirmTransaction`                | `getSignatureStatuses`                                                                                                 |
| `getSignatureStatus`                | `getSignatureStatuses`                                                                                                 |
| `getSignatureConfirmation`          | `getSignatureStatuses`                                                                                                 |
| `getConfirmedSignaturesForAddress`  | `getSignaturesForAddress`                                                                                              |
| `getConfirmedSignaturesForAddress2` | `getSignaturesForAddress`                                                                                              |
| `getConfirmedBlock`                 | `getBlock`                                                                                                             |
| `getConfirmedBlocks`                | `getBlocks`                                                                                                            |
| `getConfirmedBlocksWithLimit`       | `getBlocksWithLimit`                                                                                                   |
| `getConfirmedTransaction`           | `getTransaction`                                                                                                       |
| `getRecentBlockhash`                | `getLatestBlockhash`                                                                                                   |
| `getFees`                           | `getFeeForMessage`                                                                                                     |
| `getFeeCalculatorForBlockhash`      | `isBlockhashValid` or `getFeeForMessage`                                                                               |
| `getSnapshotSlot`                   | `getHighestSnapshotSlot`                                                                                               |
| `getStakeActivation`                | Use `getAccountInfo`. [See this guide for the alternative approach.](https://solana.stackexchange.com/questions/15710) |
| `getTotalSupply`                    | **None.** This method will be removed completely.                                                                      |
| `getFeeRateGovernor`                | **None.** This method will be removed completely.                                                                      |

***

#### Resources

* **Official Transition Guide:** For more technical details, please refer to the [Anza Agave v2.0 Transition Guide on GitHub](https://github.com/anza-xyz/agave/wiki/Agave-v2.0-Transition-Guide).

If you have any questions or need assistance updating your application, please reach out to our support team.


# Unsupported Account Queries

Account-related JSON-RPC methods that are disabled, restricted, or require dedicated infrastructure on Triton One shared mainnet RPC.

Some account-related Solana JSON-RPC methods are too expensive or require specialized indexing that the **shared mainnet** RPC pool cannot serve reliably. This page lists the exact methods that fall outside the shared pool, what error you should expect, and which dedicated product unlocks them.

If your workload depends on any of the methods below, please reach out to our support team to discuss the appropriate setup.

***

#### Hard-disabled on shared mainnet

These methods return HTTP `410 Gone` with the JSON-RPC error `"The RPC call or parameters have been disabled"`:

| Method               | Reason                                                                                | Where to use it                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `getLargestAccounts` | Prohibitively expensive at mainnet scale; scans the entire account set on every call. | Available on **dedicated** nodes by request.                                                        |
| `requestAirdrop`     | Disabled on mainnet (no faucet).                                                      | Use the official Solana faucet at [faucet.solana.com](https://faucet.solana.com) on devnet/testnet. |

***

#### `getProgramAccounts` — restricted on shared mainnet

The default Agave validator software that powers our shared RPC nodes only maintains built-in secondary indexes for a small set of well-known programs (notably SPL Token and Token-2022). For any other program, an unfiltered `getProgramAccounts` request — or one with filters the validator cannot satisfy from a secondary index — must scan the entire account set, which is not feasible to serve on a shared pool.

If you see this error on shared mainnet:

```
<ProgramId> excluded from account secondary indexes; this RPC method unavailable for key
```

…it means the program you are querying is not on the validator’s secondary-index allowlist, and your query cannot be served from the shared pool. Common cases:

* Querying a custom program with `memcmp` filters (any DeFi/perps/lending/governance program).
* Querying SPL Token without the correct `dataSize` filter — see [Token Program](/chains/solana/token-program) for the precise filter shape that does work.

**Solution: Steamboat Custom Indexes.** Steamboat is our Postgres-backed `getProgramAccounts` implementation, populated by a Yellowstone gRPC stream and tuned with custom indexes per program and `memcmp` offset. Query times typically drop from seconds to milliseconds. Steamboat runs on dedicated nodes only.

For details, configuration options, and the SPL Token caveat, see [Steamboat Custom Indexes](/project-yellowstone/cloudbreak-custom-indexes).

***

#### Methods served by Steamboat

When Steamboat is enabled on your dedicated node, the following JSON-RPC methods are answered by Steamboat rather than the validator. All others continue to be served by the underlying Agave RPC.

| Method                       | Notes                                                                                                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getProgramAccounts`         | Supports `memcmp`, `dataSize`, and `dataSlice` filters. SPL Token is intentionally **not** routed through Steamboat — Agave’s built-in index already handles it. |
| `getTokenAccountsByOwner`    | Served from the same indexed store.                                                                                                                              |
| `getTokenAccountsByDelegate` | Served from the same indexed store.                                                                                                                              |
| `getSlot`                    | Returns the current slot at the requested commitment level.                                                                                                      |
| `getHealth`                  | Returns the Steamboat service health.                                                                                                                            |

Steamboat **does not** currently implement (these calls are still handled by the validator on the same node, but are listed here for completeness):

* `getMultipleAccounts`
* `getAccountInfo`
* `getBalance`
* `getTokenAccountBalance`
* `getTokenAccountsByMint`
* `getVoteAccounts`

These methods are on the Steamboat roadmap.

**Commitment levels.** Steamboat fully supports `confirmed` and `finalized`. The `processed` commitment level is not supported by default — requests with `processed` are either rejected, or rewritten to `confirmed` if the operator has enabled `processed-commitment = "use-confirmed"`. Full `processed` support is planned as an optional plugin.

**Pagination.** Steamboat currently returns all matching accounts in a single response. Paginated responses are on the roadmap; until then, take care with queries that match very large result sets.

***

#### Digital Assets API — disabled methods

The Digital Assets API (DAS) is enabled by default on all our shared and dedicated endpoints. One method is currently turned off:

| Method             | Status               | Notes                                                                                                         |
| ------------------ | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `getAssetsByGroup` | Temporarily disabled | Disabled for maintenance and performance optimisation. Please avoid calling this method until further notice. |

The full list of DAS methods and their parameters lives in the [API Methods](/digital-assets-api/metaplex-digital-assets-api) reference.

***

#### Batch behaviour

The following account-related methods are always **unbatched** — submit them as individual JSON-RPC requests rather than as elements of a batch array:

* `getProgramAccounts`
* `getTokenAccountsByOwner`
* `getTokenAccountsByDelegate`

If you submit them inside a batch, the request is split and each call is processed independently on the back end. This is not an error condition — your application will receive a valid batched response — but it does mean batch ordering and atomicity guarantees do not apply to these calls.

***

#### Summary — which product unlocks which method

| You need...                                                         | Use...                                                                                          |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `getLargestAccounts`                                                | Dedicated node, by request.                                                                     |
| `getProgramAccounts` for a custom program at production performance | [Steamboat Custom Indexes](/project-yellowstone/cloudbreak-custom-indexes) on a dedicated node. |
| `getTokenAccountsByOwner` / `getTokenAccountsByDelegate` at scale   | Available on shared RPC; Steamboat-backed on dedicated nodes for higher throughput.             |
| NFT and fungible-asset queries (including compressed NFTs)          | [Digital Assets API](/digital-assets-api/introduction) — enabled on all endpoints.              |
| `getAssetsByGroup`                                                  | Currently unavailable. Contact support for the recommended workaround.                          |

If you are not sure which product fits your workload, contact our support team — we can review your query patterns and recommend either an index configuration on Steamboat or a different routing setup.


# Agave - AccountsDB: Storage Files shrinking process

Basically shrinking is a process that is periodically executed by Agave and the goal is to remove from files accounts that are not longer valid because a new version exists.

* It happens once per second (hardcoded):

  ```bash
  const SHRINK_INTERVAL: Duration = Duration::from_secs(1);
  ```
* it is controlled by 2 config flags:

  ```bash
  --accounts-shrink-ratio  # defaults to 0.8
  --accounts-shrink-optimize-total-space  # defaults to true

  ```
* So basically the process goes like this: each second the bank (inside the AccountsBackgroundService) will execute `shrink_candidate_slots()` (<https://github.com/anza-xyz/agave/blob/master/runtime/src/accounts_background_service.rs#L566>) which will check a list of files marked as canditates for shrinking, a file becomes a candidate if its rate of valid (not old) accounts goes bellow `accounts-shrink-ratio`. The second key point in the logic is that it will calculate the total valid accounts byes over the total accounts byte(if the 2nd config flag is true), and then it will order the list of candidates starting by the ones with more dead accounts, and it will iterate shrinking files until the rate of live accounts becomes higher than `accounts-shrink-ratio`. All files that were not shrinked remains in the queue for the next shrinking iteration
  * it reads storage files inside `shrink_collect()` which returns accounts marked as dead
  * it does not modify the original file, instead if generates a new one with only the valid accounts and then point to the updated one
  * if `accounts-shrink-optimize-total-space` is false, it will shrink all files individually without any global context in each iteration
  * to check if an account inside a file is dead or not there is 2 ways:
    * checks `AccountStorageEntry::obsolete_accounts` (accounts will be written here inside `_store_accounts_frozen` in <https://github.com/anza-xyz/agave/blob/master/accounts-db/src/accounts_db.rs#L5738>) if the offset for the account is there filter it out
    * For remaining accounts not filered out in the 1st step above it will look for them in the `AccountsDb::accounts_index` (on `load_accounts_index_for_shrink()`). if the index for the account is pointing to the slot of the current Storage file being analyzed, means the account is still valid, if not marks it as dead and filter it out

The consequence of this process is that the storage and thus the snapshot, doesn’t have any guarantee over old data, it might or might not be there. So we need to only keep the last version of each account before being able to trust at all any data we read from the snapshot


# getTransactionsForAddress

Transaction history API for retrieving address activity with server-side filtering, configurable sort order, pagination, and optional full transaction details.

`getTransactionsForAddress` is designed for workloads that would otherwise require calling `getSignaturesForAddress` followed by `getTransaction` for every returned signature.

That standard two-step pattern works, but it creates an N+1 request flow: one request to discover signatures, then one additional request per transaction to fetch details. It also pushes filtering, pagination management, token-account expansion, and result assembly onto the client.

This method combines those steps into a single address-history query. It can return either signature-level results or full transaction payloads, apply filters server-side, preserve a single pagination cursor, and optionally include token-account activity owned by the requested address.

`getTransactionsForAddress` is a custom RPC method. It is not part of the standard Solana JSON-RPC API, but it follows the same JSON-RPC request and response envelope style as standard Solana RPC methods.

## Request

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getTransactionsForAddress",
  "params": [
    "AddressBase58",
    {
      "transactionDetails": "signatures",
      "sortOrder": "desc",
      "limit": 100,
      "paginationToken": null,
      "filters": {
        "slot": { "gte": 250000000 },
        "status": "any",
        "tokenAccounts": "none"
      }
    }
  ]
}
```

## Parameters

| Parameter | Type   | Required | Description                              |
| --------- | ------ | -------- | ---------------------------------------- |
| address   | string | Yes      | Base58 Solana account address to search. |
| options   | object | No       | Query options and filters.               |

## Options

| Option                         | Type                                   | Default                           | Description                                  |
| ------------------------------ | -------------------------------------- | --------------------------------- | -------------------------------------------- |
| transactionDetails             | signatures \| full                     | signatures                        | Controls response detail.                    |
| sortOrder                      | asc \| desc                            | desc                              | Sort by slot and transaction position.       |
| limit                          | number                                 | 1000 for signatures, 100 for full | Maximum number of results.                   |
| paginationToken                | string                                 | null                              | Token returned from a previous response.     |
| commitment                     | confirmed \| finalized                 | finalized                         | Commitment level.                            |
| minContextSlot                 | number                                 | none                              | Fails if the node has not reached this slot. |
| encoding                       | json \| jsonParsed \| base58 \| base64 | json                              | Used when transactionDetails is full.        |
| maxSupportedTransactionVersion | number                                 | none                              | Used when transactionDetails is full.        |
| filters                        | object                                 | none                              | Optional filters.                            |

## Filters

| Filter        | Type                          | Description                                                          |
| ------------- | ----------------------------- | -------------------------------------------------------------------- |
| slot          | comparison object             | Filter by slot. Supports gte, gt, lte, lt.                           |
| blockTime     | comparison object             | Filter by block time. Supports gte, gt, lte, lt, eq.                 |
| signature     | comparison object             | Filter by transaction signature position. Supports gte, gt, lte, lt. |
| status        | any \| succeeded \| failed    | Filter by transaction status.                                        |
| tokenAccounts | none \| balanceChanged \| all | Include token-owner activity for the address.                        |

Comparison object example:

```json
{
  "gte": 250000000,
  "lt": 260000000
}
```

## Token Account Filtering

`tokenAccounts` controls whether token-account activity owned by the requested address is included.

| Value          | Behavior                                                                  |
| -------------- | ------------------------------------------------------------------------- |
| none           | Only transactions where the address appears directly.                     |
| all            | Also include transactions involving token accounts owned by the address.  |
| balanceChanged | Include owned token-account transactions only when token balance changed. |

Token-owner activity is derived from transaction pre/post token balance metadata.

## Response

{% tabs %}
{% tab title="Signatures" %}
When `transactionDetails` is `signatures`, each result contains transaction metadata.

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "signature": "TransactionSignatureBase58",
        "slot": 250000001,
        "transactionIndex": 12,
        "err": null,
        "memo": null,
        "blockTime": 1700000000,
        "confirmationStatus": "finalized"
      }
    ],
    "paginationToken": "250000001:12"
  },
  "id": 1
}
```

{% endtab %}

{% tab title="Full Transactions" %}
When `transactionDetails` is `full`, each result contains the encoded transaction and metadata.

```json
{
  "jsonrpc": "2.0",
  "result": {
    "data": [
      {
        "slot": 250000001,
        "transactionIndex": 12,
        "blockTime": 1700000000,
        "transaction": {...},
        "meta": {...}
      }
    ],
    "paginationToken": "250000001:12"
  },
  "id": 1
}
```

{% endtab %}
{% endtabs %}

## Pagination

Use the returned `paginationToken` in the next request to continue scanning.

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "getTransactionsForAddress",
  "params": [
    "AddressBase58",
    {
      "limit": 100,
      "paginationToken": "250000001:12"
    }
  ]
}
```

## Example: Successful Transactions Only

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getTransactionsForAddress",
  "params": [
    "AddressBase58",
    {
      "filters": {
        "status": "succeeded"
      }
    }
  ]
}
```

## Example: Token Balance Changes

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getTransactionsForAddress",
  "params": [
    "OwnerAddressBase58",
    {
      "filters": {
        "tokenAccounts": "balanceChanged"
      }
    }
  ]
}
```

## Example: Slot Range

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getTransactionsForAddress",
  "params": [
    "AddressBase58",
    {
      "filters": {
        "slot": {
          "gte": 250000000,
          "lt": 251000000
        }
      }
    }
  ]
}
```


# SUI

As one of the original validators on SUI we provide full service SUI API access. We support:

* Mainnet
  * JSON-RPC (to be deprecated in 2026)
  * GRPC beta (will be replacing JSON-RP)
  * Walrus storage, publisher and aggregator
  * Seal permissioned server
* Testnet
  * JSON-RPC (to be deprecated on 2026)
  * GPRC beta (will be replacing JSON-RPC)
  * Walrus storage, publisher and aggregator
  * Seal open and permissioned server

Sui is rolling out GraphQL alpha, indexed-based APIs, and Triton will support them in Q1-Q2 2026.

Note: the Sui WebSocket API is officially deprecated and is being retired by Mysten Labs.


# Walrus

[Walrus](https://walrus.xyz/) is a decentralized, scalable, distributed, and fault-tolerant storage layer optimised for storing large binary blobs. Walrus uses Sui for coordination among other things.

Walrus Publisher enables writing data on-chain. Aggregator enables reading data, and Storage nodes provide storage.

Triton hosts Walrus Publishers,  Aggregators. and Storage nodes. Read more about Walrus components from the official [documentation](https://docs.wal.app/dev-guide/components.html).


# gRPC

### Overview

The Sui gRPC API is a fast, type-safe, and efficient interface for interacting with the Sui blockchain. It replaces the deprecated JSON-RPC protocol and is now generally available. gRPC uses [Protocol Buffers](https://protobuf.dev/overview/) for compact, high-performance data serialization, and supports both standard request-response calls and real-time server-side streaming — no polling required.

> **Note:** JSON-RPC is deprecated and will be deactivated in July 2026. Migrating to gRPC is strongly recommended for all production integrations.

### When to use gRPC

gRPC is the best choice when you need:

* **High-performance, low-latency** point lookups for transactions, objects, and checkpoints
* **Real-time streaming** subscriptions (replaces deprecated WebSocket support)
* **Strongly typed clients** generated from `.proto` definitions in TypeScript, Go, Rust, and other languages
* **Scalable backend systems** — indexers, exchanges, bots, and dashboards

For frontends, developer tooling, or flexible filtered historical queries, consider GraphQL RPC as an alternative.

> **Important:** gRPC full nodes do not automatically fall back to Archival Storage for historical data. If your integration requires deep historical lookups, use the Archival Storage and Services endpoint directly.

***

### Endpoints

#### Free Test Endpoint (Mainnet — rate-limited)

We provide a free shared gRPC endpoint for testing and evaluation purposes. It is strictly rate-limited and intended for development use only, **not for production traffic**.

```
mainnet.sui.rpcpool.com:443
```

No authentication token is required for this endpoint.

***

#### Shared Clients

Shared plan clients access gRPC via the standard shared endpoint. Your unique endpoint hostname is available in the [client panel](https://customers.triton.one/).

**Endpoint format:**

```
XXX.sui.rpcpool.com:443
```

Replace `XXX` with your specific endpoint slug shown in the panel.

**Authentication** is required via the `X-Token` header:

```
X-Token: <your-token>
```

Both your endpoint and token can be found in your [client panel](https://customers.triton.one/).

***

#### Dedicated Clients

Dedicated plan clients have a private endpoint provisioned exclusively for their use.

**Endpoint format:**

```
XXX.sui.rpcpool.com:443
```

Replace `XXX` with your dedicated endpoint slug shown in the panel.

**Authentication** is required via the `X-Token` header:

```
X-Token: <your-token>
```

Both your endpoint and token can be found in your [client panel](https://customers.triton.one/).

***

### Authentication

All non-free endpoints require the `X-Token` header to be included with every request. You can find your token in the client panel.

When using `grpcurl`:

```bash
grpcurl \
  -H "X-Token: <your-token>" \
  XXX.sui.rpcpool.com:443 \
  list
```

When using a generated gRPC client (e.g. in Go or TypeScript), add the token as a metadata field on every call:

```
key:   "x-token"
value: "<your-token>"
```

***

### Available Services

The Sui gRPC API is defined via `.proto` files available in the [`sui-apis` repository on GitHub](https://github.com/MystenLabs/sui-apis/tree/main/proto). The following services are available:

| Service                        | Purpose                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| `TransactionExecutionService`  | Submit and execute signed transactions on the Sui network                             |
| `LedgerService`                | Look up checkpoints, transactions, and objects from current state and recent history  |
| `StateService`                 | Query live onchain data: balances, owned objects, dynamic fields; dry-run simulations |
| `SubscriptionService`          | Stream live checkpoint updates in real time                                           |
| `MovePackageService`           | Access deployed Move package metadata and content                                     |
| `SignatureVerificationService` | Validate signatures (including zkLogin) outside of transaction execution              |
| `NameService`                  | Resolve SuiNS names to addresses and perform reverse lookups                          |

Use these `.proto` definitions to generate type-safe client libraries in your language of choice.

***

### Quickstart: grpcurl Examples

[`grpcurl`](https://github.com/fullstorydev/grpcurl) is the easiest way to explore the API from the command line.

#### List available services

```bash
grpcurl \
  -H "X-Token: <your-token>" \
  XXX.sui.rpcpool.com:443 \
  list
```

#### List methods in LedgerService

```bash
grpcurl \
  -H "X-Token: <your-token>" \
  XXX.sui.rpcpool.com:443 \
  list sui.rpc.v2.LedgerService
```

#### Get the latest checkpoint

```bash
grpcurl \
  -H "X-Token: <your-token>" \
  -d '{}' \
  XXX.sui.rpcpool.com:443 \
  sui.rpc.v2.LedgerService/GetLatestCheckpoint
```

#### Get a transaction (events and effects)

```bash
grpcurl \
  -H "X-Token: <your-token>" \
  -d '{
    "digest": "<transaction-digest>",
    "read_mask": {
      "paths": ["effects", "events"]
    }
  }' \
  XXX.sui.rpcpool.com:443 \
  sui.rpc.v2.LedgerService/GetTransaction
```

#### Subscribe to live checkpoints (streaming)

```bash
grpcurl \
  -H "X-Token: <your-token>" \
  -d '{}' \
  XXX.sui.rpcpool.com:443 \
  sui.rpc.v2.SubscriptionService/SubscribeCheckpoints
```

***

### Key Concepts

#### Field Masks

Use `read_mask` to request only the fields you need, reducing response size and latency:

```json
{
  "read_mask": {
    "paths": ["digest", "effects", "events"]
  }
}
```

Pass `"*"` to request all fields. If `read_mask` is omitted, it defaults to `*`. In batch requests, only the top-level `read_mask` is respected.

#### Pagination

List APIs (owned objects, balances, etc.) return paginated results. Use `page_size` to control batch size and pass the returned `next_page_token` into the next request to continue. An empty `next_page_token` means you have reached the end. Keep all other request parameters constant between pages.

#### Encodings

* `Address` and `ObjectId`: 64-character hex with a `0x` prefix
* `Digest`: Base58 encoded
* `TypeTag` / `StructTag`: Canonical string format

#### Errors

Errors follow the [gRPC richer error model](https://grpc.io/docs/guides/error/#richer-error-model). Detailed error information is provided in the `grpc-status-details-bin` header as a Base64-encoded `google.rpc.Status` message.

***

### Resources

* [Sui gRPC Reference (official)](https://docs.sui.io/references/fullnode-protocol)
* [Proto definitions — sui-apis on GitHub](https://github.com/MystenLabs/sui-apis/tree/main/proto)
* [Official: What is gRPC?](https://docs.sui.io/develop/accessing-data/grpc/what-is-grpc)
* [Official: Querying Data with gRPC](https://docs.sui.io/develop/accessing-data/grpc/using-grpc)
* [grpcurl tool](https://github.com/fullstorydev/grpcurl)


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


# Monad

Monad is a Layer-1 blockchain delivering high performance, decentralization, and EVM compatibility with 10.000 TPS, 0.8s finality, and 0.4s block times

## Overview

### Block explorers

* Mainnet: <https://monadvision.com>
* Testnet: <https://testnet.monadvision.com/>

### Developer docs

* [https://docs.monad.xyz](https://docs.monad.xyz/)

## APIs

{% hint style="warning" %}
The differences between Monad and the standard Geth client are described here: <https://docs.monad.xyz/reference/rpc-differences>
{% endhint %}

### JSON-RPC

Monad supports most of the JSON-RPC methods available in Geth. You can find the official documentation [here](https://docs.monad.xyz/reference/json-rpc/)

The linked documentation also includes cURL examples where you just need to replace the RPC URL, e.g:

```bash
curl --request POST \
     --url <TRITON_URL> \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --data '
{
  "id": 0,
  "jsonrpc": "2.0",
  "method": "eth_blockNumber",
  "params": []
}
'
```

Expected result:

```bash
{
    "jsonrpc": "2.0",
    "result": "0x23feb61",
    "id": 0
}
```

### Websocket

The websocket API is also available in Monad. You can find the official documentation [here](https://docs.monad.xyz/reference/websockets)

See an example below how to test websocket using the `wscat` utility:

**Install node-ws in Linux**:

```bash
sudo apt update
sudo apt install node-ws
```

**Subscribe to websockets**:

```bash
wscat -c wss://<TRITON_URL>
Connected (press CTRL+C to quit)
> { "id": 1, "jsonrpc": "2.0", "method": "eth_subscribe", "params": ["newHeads"] }
```

Expected result:

{% code overflow="wrap" %}

```bash
< {"jsonrpc":"2.0","result":"0x42cef98808e973c28e55c2ecd59c85c5","id":1}
< {"jsonrpc":"2.0","method":"eth_subscription","params":{"subscription":"0x42cef98808e973c28e55c2ecd59c85c5","result":{"hash":"0x3b4e76a0bcfcc7b6f6eb0c44ca8d95f59ae3feb9fb378922b5e9697beee6178e","parentHash":"0x68f6ed9d35ad80209efd9c6a8c23557da367a424233ef15b6c9a562544fa059e","sha3Uncles":"0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347","miner":"0x63ce5e9d70b77c60ccc68158eafe6398c9ce61f8","stateRoot":"0x5d232d542a1beee75e0803af58d34f5d6305ea8c6c6da01535d793b54e300590","transactionsRoot":"0x8bcc011db89df7ec8f35b55fdc6f4d0fe3823e6b08df32f088b318348225b71d","receiptsRoot":"0xfcde62dec790860f76d45e98f50df4878b6880860305c8b3990d5432535d6b09","logsBloom":"0x242c804d010488e04260419090320020c1820200100c00008024002430004002040e2402402001000014150106020821200400504410200020802a002120008c46401600204020880000000842000af12008060108c480a14064000080414800040200200a8a08400100a4a4190808054c0044010130270419012390000c08000040400419001000074080301700000000400c510201080848000041400000021600048090048a210040000009504001000000000006080392400202a05808000410008a400460000801802038481110020041000a00601000000816006228008018c000030041040c4081089400182004001000040c02410048002412000080","difficulty":"0x0","number":"0x23fee0f","gasLimit":"0xbebc200","gasUsed":"0x203788b","timestamp":"0x6924aa80","extraData":"0x0000000000000000000000000000000000000000000000000000000000000000","mixHash":"0x753243a7ce528c3925b31dc1b6c33fc784e6a68ebc2dedbbef8b4c53fe25de66","nonce":"0x0000000000000000","baseFeePerGas":"0x174876e800","withdrawalsRoot":"0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421","blobGasUsed":"0x0","excessBlobGas":"0x0","parentBeaconBlockRoot":"0x0000000000000000000000000000000000000000000000000000000000000000","requestsHash":"0x0000000000000000000000000000000000000000000000000000000000000000","totalDifficulty":"0x0","size":"0x30f"}}}
```

{% endcode %}

*Note: JS examples are also available in the official documentation.*


# Pythnet

{% hint style="danger" %}
Pyth DAO has announced the deprecation of Pyth Core on July 31st, 2026. As of July 30th, 2026, Triton One Pythnet and Hermes endpoints will stop serving data — see [Pyth price feeds](https://www.pyth.network/price-feeds) for direct integration.
{% endhint %}

We provide dedicated access points for Pythnet RPC as well as [Hermes](/trading-apis/hermes) API endpoints with all Triton subscriptions.&#x20;


# Others

Should you require other chains than our standard offering? Get in touch at <help@triton.one>. We run validators and nodes across a wide range of blockchain ecosystems and are always happy to lend our expertise to run dedicated setups for you.&#x20;


# Introduction

We actively contribute to the development of the Metaplex Digital Assets Standard API (DAS) that is used to interact with Solana NFTs, SPL (Solana Program Library) Tokens and Token-2022 (Token Extension Program), ensuring also production-ready indexing and caching layer.

DAS API provides a fast and scalable way to query digital assets on the Solana blockchain, including Fungible Tokens, Regular and Compressed NFTs. The decompression of NFTs and data caching is done server-side, providing a convenient way to access Digital Assets data and metadata. It is available via all our shared and dedicated endpoints, fully integrated with our RPC Pool infrastructure.

DAS API offers a comprehensive set of features for querying digital assets, including:

* a complete history of blocks and transactions,
* quick access to account data and past account balances,
* Merkle proofs for compressed assets,
* a consistent, easy-to-use interface.

## How to use

The DAS API is enabled by default on all our shared and dedicated endpoints. You can use any of our Solana mainnet RPC endpoints with the DAS API methods, and your queries will be routed automatically.

Available methods are listed and documented in the [API Methods](https://github.com/rpcpool/customer-docs/blob/gitbook/digital-assets-api/digital-assets-api/metaplex-digital-assets-api/README.md) section.

The DAS API is billed on a per-request basis ($50 per million requests). To see detailed billing information, check the Billable Items Chart in your account panel at the customers.triton.one.

[Ratelimits](https://github.com/rpcpool/customer-docs/blob/gitbook/rpc-pool/ratelimits.md) as per your standard RPC Pool will apply.

## Further reading

To learn more about account state compression and Digital Assets, see [developers.metaplex.com/das-api](https://developers.metaplex.com/das-api).

Client and examples: [https://github.com/metaplex-foundation/digital-asset-standard-api](https://github.com/metaplex-foundation/digital-asset-standard-api/tree/main/clients/js#examples)


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


# API Methods

The API follows the JSON-RPC 2.0 specification, requiring requests to include a method name, parameters, and a unique ID.

| Method                                                                                                | Description                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [getAsset](/digital-assets-api/metaplex-digital-assets-api/get-asset)                                 | Retrieve detailed information about an asset using its unique ID.                                                                                                                    |
| [getAssets](/digital-assets-api/metaplex-digital-assets-api/get-assets)                               | Retrieve detailed information about multiple assets using theirs unique IDs.                                                                                                         |
| [getAssetProof](/digital-assets-api/metaplex-digital-assets-api/get-asset-proof)                      | Obtain a Merkle proof for verifying the integrity of a compressed asset.                                                                                                             |
| [getAssetProofs](/digital-assets-api/metaplex-digital-assets-api/get-asset-proofs)                    | Fetch Merkle proofs for multiple compressed assets in a single request.                                                                                                              |
| [getAssetSignatures](/digital-assets-api/metaplex-digital-assets-api/get-asset-signatures)            | Fetch transaction signatures associated with a compressed asset.                                                                                                                     |
| [getAssetsByAuthority](/digital-assets-api/metaplex-digital-assets-api/get-assets-by-authority)       | Fetch a list of assets controlled by a specific authority.                                                                                                                           |
| [getAssetsByCreator](/digital-assets-api/metaplex-digital-assets-api/get-assets-by-creator)           | List all assets that were created by a specified address.                                                                                                                            |
| [getAssetsByGroup](/digital-assets-api/metaplex-digital-assets-api/get-assets-by-group)               | \[TEMPORARILY DISABLED] Get assets that belong to a specified group, identified by a key and value. This method is currently unavailable due to scheduled performance optimizations. |
| [getAssetsByOwner](/digital-assets-api/metaplex-digital-assets-api/get-assets-by-owner)               | Retrieve all assets associated with a given owner’s public key.                                                                                                                      |
| [searchAssets](/digital-assets-api/metaplex-digital-assets-api/search-assets)                         | Perform a search and apply filters to find assets based on various criteria.                                                                                                         |
| [getNftEditions](/digital-assets-api/metaplex-digital-assets-api/get-nft-editions)                    | Retrieve all printable editions for a master edition NFT mint.                                                                                                                       |
| [getTokenAccounts](/digital-assets-api/metaplex-digital-assets-api/get-token-accounts)                | Retrieve details of all token accounts associated with a given mint or owner.                                                                                                        |
| [getTokenLargestAccounts](/digital-assets-api/metaplex-digital-assets-api/get-token-largest-accounts) | Retrieve 20 largest token accounts for a specific SPL Token.                                                                                                                         |

Each API method is explained in detail on its own page, including required parameters and example requests. Navigate through the documentation to explore each method’s capabilities.


# Get Asset

This method retrieves detailed information about a specific digital asset/NFT. The metadata returned includes information about the asset URL, metadata, collection, creators, authorities, compression status and ownership.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-asset)

| Name | Description                                     | Required |
| ---- | ----------------------------------------------- | -------- |
| id   | The unique identifier of the asset to retrieve. | Yes      |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getAsset",
    "params": {
      "id": "7k7YqWc85BtyTx5UyvNnogv2jPHVe4BZ9HQsFLM8VnoJ"
    }
}
```

</details>


# Get Assets

This method retrieves detailed information about a multiple digital assets/NFTs. The metadata returned includes information about the asset URL, metadata, collection, creators, authorities, compression status and ownership. Alias of `getAsset` method is `getAssetBatch`.

<details>

<summary>Request (POST)</summary>

#### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-assets)

| Name | Description                     |
| ---- | ------------------------------- |
| ids  | A set of asset IDs to retrieve. |

```json
{
  "jsonrpc": "2.0",
  "id": "123",
  "method": "getAssets",
  "params": {
    "ids": [
      "7k7YqWc85BtyTx5UyvNnogv2jPHVe4BZ9HQsFLM8VnoJ",
      "HP2QQgwfTgHNRcX7g3HHMNKxXjAEvQsr1wComqbPfWAR"
    ]
  }
} 
```

</details>


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


# Get Asset Proofs

Get merkle proofs for compressed assets by their IDs.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-asset-proofs)

| Name | Description                                 | Required |
| ---- | ------------------------------------------- | -------- |
| ids  | A set of asset IDs used to retrieve proofs. | Yes      |

<details>

<summary>Request (POST)</summary>

```json
{
  "jsonrpc": "2.0",
  "id": "123",
  "method": "getAssetProofs",
  "params": {
    "ids": [
      "EZsmgudhX6EFVfrdxmShDiNj365E85x7kpLJCVvPLVSH",
      "Hhxb7pNvwi76WTSqFjMX5yXjSso1S3agEJ9kQZP9NQeJ"
    ]
  }
} 
```

</details>


# Get Asset Signatures

This method retrieves the transaction signatures associated with a compressed digital asset/NFT. It can be identified by its ID or by tree and leaf index.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-asset-signatures)

| Name      | Description                                    | Required       |
| --------- | ---------------------------------------------- | -------------- |
| id        | The unique identifier of the compressed asset. | or tree + leaf |
| tree      | The tree corresponding to the leaf.            | or id          |
| leafIndex | The leaf index of digital compressed asset.    | or id          |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getAssetSignatures",
    "params": {
      "id": "EZsmgudhX6EFVfrdxmShDiNj365E85x7kpLJCVvPLVSH"
    }
}
```

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getAssetSignatures",
    "params": {
      "tree": "J2aFAeninyTqDjucueEHBTN6JDo1i9cZ7LzfNcvnnuo4",
      "leafIndex": 161957
    }
}
```

</details>


# Get Assets By Authority

Fetch all the assets belonging to a specific authority. This allows paged responses in order to easily fetch a large number of records.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-asset-by-authority)

| Name             | Description                                                                                                                                                                                       | Required |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| authorityAddress | Address of the asset authority                                                                                                                                                                    | Yes      |
| sortBy           | The Sorting Criteria: Defined as an object `{ sortBy: , sortDirection: }`, where `sortBy` can be `"created", "updated", "recentAction", or "none"`, and `sortDirection` can be `"asc" or "desc"`. | No       |
| limit            | The maximum number of assets to retrieve.                                                                                                                                                         | No       |
| page             | The index of the "page" to retrieve.                                                                                                                                                              | No       |
| before           | Fetch assets before the given ID.                                                                                                                                                                 | No       |
| after            | Fetch assets after the given ID.                                                                                                                                                                  | No       |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getAssetsByAuthority",
    "params": [
        "3pMvTLUA9NzZQd4gi725p89mvND1wRNQM3C8XEv1hTdA",
        {
            "sortBy": "created",
            "sortDirection": "desc"
        },
        50,
        1,
        null,
        null
    ]
}
```

</details>


# Get Assets By Creator

This method provides the list of assets created by a particular creator. By using this method, developers and users can programmatically access and retrieve the assets created or owned by a specific creator, enabling functionalities like showcasing an artist's portfolio or facilitating transactions involving the creator's assets.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-asset-by-creator)

| Name           | Description                                                                                                                                                                                                               | Required |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| creatorAddress | The address of the creator of the assets.                                                                                                                                                                                 | Yes      |
| onlyVerified   | Indicates whether to retrieve only verified assets or not. Recommended to set to true to be sure that the asset belongs to the creator.                                                                                   | No       |
| sortBy         | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]` | No       |
| page           | The index of the "page" to retrieve.                                                                                                                                                                                      | No       |
| before         | Fetch assets before the given ID.                                                                                                                                                                                         | No       |
| after          | Fetch assets after the given ID.                                                                                                                                                                                          | No       |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getAssetsByCreator",
    "params": [
        "D3XrkNZz6wx6cofot7Zohsf2KSsu2ArngNk8VqU9cTY3",
        true,
        {
            "sortBy": "created",
            "sortDirection": "desc"
        },
        50,
        1,
        null,
        null
    ]
}
```

</details>


# Get Assets By Group

{% hint style="warning" %}
Temporary Suspension

This method is currently temporarily disabled for maintenance and performance optimization. Please avoid calling this method until further notice.
{% endhint %}

The method then returns a response containing information about all the assets belonging to a specific group, like a Collection.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-asset-by-group)

| Name       | Description                                                                                                                                                                                                               | Required |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| groupKey   | The key of the group (e.g., `"collection"`).                                                                                                                                                                              | Yes      |
| groupValue | The value of the group.                                                                                                                                                                                                   | Yes      |
| sortBy     | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]` | No       |
| page       | The index of the "page" to retrieve.                                                                                                                                                                                      | No       |
| before     | Fetch assets before the given ID.                                                                                                                                                                                         | No       |
| after      | Fetch assets after the given ID.                                                                                                                                                                                          | No       |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getAssetsByGroup",
    "params": {
        "groupKey": "collection",
        "groupValue": "BUjZjAS2vbbb65g7Z1Ca9ZRVYoJscURG5L3AkVvHP9ac",
        "page": 1,
        "limit": 50
    }
}
```

</details>


# Get Assets By Owner

The method returns a list of assets owned by a certain address or account. You can query the API for all assets associated with that owner by supplying the owner's pubkey as a parameter.

This is the more efficient version of \`getTokenAccountsByOwner\` in the standard Solana RPC API and allows you to access and retrieve the assets owned by a specific address, enabling functionalities like displaying a user's NFT collection, managing ownership, or facilitating transactions involving the owner's assets.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/get-asset-by-owner)

| Name         | Description                                                                                                                                                                                       | Required |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| ownerAddress | Address of the asset authority                                                                                                                                                                    | Yes      |
| sortBy       | The Sorting Criteria: Defined as an object `{ sortBy: , sortDirection: }`, where `sortBy` can be `"created", "updated", "recentAction", or "none"`, and `sortDirection` can be `"asc" or "desc"`. | Yes      |
| limit        | The maximum number of assets to retrieve.                                                                                                                                                         | No       |
| page         | The index of the "page" to retrieve.                                                                                                                                                              | No       |
| before       | Fetch assets before the given ID.                                                                                                                                                                 | No       |
| after        | Fetch assets after the given ID.                                                                                                                                                                  | No       |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getAssetsByOwner",
    "params": [
        "9kPPbeBAvCtJCZ98EFKabxp7wTeFQRseCYDRdovyfUfz",
        {
            "sortBy": "created",
            "sortDirection": "desc"
        },
        50,
        1,
        null,
        null
    ]
}
```

</details>


# Search Assets

The method allows users to query and retrieve information about specific NFT assets based on certain criteria (custom-query). This query provides filters such as asset name, owner address, collection ID, or other relevant attributes to narrow down your search. Using this method, users can programmatically explore the Metaplex ecosystem, retrieve information about specific NFT assets, and perform various operations related to those assets, such as transferring ownership or displaying asset metadata.

### Parameters [(Source)](https://developers.metaplex.com/das-api/methods/search-assets)

| Name                | Description                                                                                                                                                                                                                | Required |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `negate`            | Indicates whether the search criteria should be inverted or not.                                                                                                                                                           | No       |
| `conditionType`     | Indicates whether to retrieve all (`"all"`) or any (`"any"`) asset that matches the search criteria.                                                                                                                       | No       |
| `interface`         | The interface value (one of `["V1_NFT", "V1_PRINT" "LEGACY_NFT", "V2_NFT", "FungibleAsset", "Custom", "Identity", "Executable"]`).                                                                                         | No       |
| `ownerAddress`      | The address of the owner.                                                                                                                                                                                                  | No       |
| `ownerType`         | Type of ownership `["single", "token"]`.                                                                                                                                                                                   | No       |
| `creatorAddress`    | The address of the creator.                                                                                                                                                                                                | No       |
| `creatorVerified`   | Indicates whether the creator must be verified or not.                                                                                                                                                                     | No       |
| `authorityAddress`  | The address of the authority.                                                                                                                                                                                              | No       |
| `grouping`          | The grouping `["key", "value"]` pair.                                                                                                                                                                                      | No       |
| `delegateAddress`   | The address of the delegate.                                                                                                                                                                                               | No       |
| `frozen`            | Indicates whether the asset is frozen or not.                                                                                                                                                                              | No       |
| `supply`            | The supply of the asset.                                                                                                                                                                                                   | No       |
| `supplyMint`        | The address of the supply mint.                                                                                                                                                                                            | No       |
| `compressed`        | Indicates whether the asset is compressed or not.                                                                                                                                                                          | No       |
| `compressible`      | Indicates whether the asset is compressible or not.                                                                                                                                                                        | No       |
| `royaltyTargetType` | Type of royalty `["creators", "fanout", "single"]`.                                                                                                                                                                        | No       |
| `royaltyTarget`     | The target address for royalties.                                                                                                                                                                                          | No       |
| `royaltyAmount`     | The royalties amount.                                                                                                                                                                                                      | No       |
| `burnt`             | Indicates whether the asset is burnt or not.                                                                                                                                                                               | No       |
| `sortBy`            | Sorting criteria. This is specified as an object `{ sortBy: <value>, sortDirection: <value> }`, where `sortBy` is one of `["created", "updated", "recentAction", "none"]` and `sortDirection` is one of `["asc", "desc"]`. | No       |
| `limit`             | The maximum number of assets to retrieve.                                                                                                                                                                                  | No       |
| `page`              | The index of the "page" to retrieve.                                                                                                                                                                                       | No       |
| `before`            | Retrieve assets before the specified ID.                                                                                                                                                                                   | No       |
| `after`             | Retrieve assets after the specified ID.                                                                                                                                                                                    | No       |
| `jsonUri`           | The value for the JSON URI.                                                                                                                                                                                                | No       |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "searchAssets",
    "params": {
        "ownerAddress": "Ewb8XmZ4RbSAxnFY4P4XMtjz5EccYn12bnUF6T4SSvVq",       
        "page": 1,
        "limit": 50
    }
}
```

</details>


# Get NFT Editions

Get all printable editions for a master edition NFT mint.

### Parameters

| Name          | Description                             | Required |
| ------------- | --------------------------------------- | -------- |
| `mintAddress` | The mint address of the master edition. | Yes      |
| `page`        | The current pagination page.            | No       |
| `limit`       | Number of results per page.             | No       |
| `cursor`      | Optional pagination cursor.             | No       |
| `before`      | Return results before the cursor.       | No       |
| `after`       | Return results after the cursor.        | No       |

<details>

<summary>Request (POST)</summary>

```json
{
    "id": "123",
    "jsonrpc": "2.0",
    "method": "getNftEditions",
    "params": {
      "mintAddress": "BUaiggSfm81ZRAeW572dNf1BhXCzZxaWrGNRm5PjSQzY",
      "page": 1,
      "limit": 100
    }
}
```

</details>

<details>

<summary>Response 200</summary>

```json
{
    "jsonrpc": "2.0",
    "result": {
        "total": 0,
        "limit": 100,
        "master_edition_address": "4faJkL1F5yLKTf9DSgqBmp2DJeUKk9fyfZzMKM1nMbzD",
        "supply": 0,
        "max_supply": 0,
        "page": 1
    },
    "id": "123"
}
```

</details>


# Get Token Accounts

Retrieve all token accounts linked to a specific mint or owner. Use this to efficiently list all holders of an SPL token or view all tokens owned by a given address.

### Parameters

| Name           | Description                       | Required            |
| -------------- | --------------------------------- | ------------------- |
| `mintAddress`  | The address of associated mint.   | Yes or ownerAddress |
| `ownerAddress` | The owner address of the tokens.  | Yes or mintAddress  |
| `page`         | The current pagination page.      | No                  |
| `limit`        | Number of results per page.       | No                  |
| `cursor`       | Optional pagination cursor.       | No                  |
| `before`       | Return results before the cursor. | No                  |
| `after`        | Return results after the cursor.  | No                  |

<details>

<summary>Request (POST)</summary>

```json
{
    "id": "123",
    "jsonrpc": "2.0",
    "method": "getTokenAccounts",
    "params": {
      "mintAddress": "BUaiggSfm81ZRAeW572dNf1BhXCzZxaWrGNRm5PjSQzY",
      "ownerAddress": "BiKcVb6t6YDZczYjWLjXKwdgAUecdQrp1EJXAfRmu3VR",
      "page": 1,
      "limit": 100
    }
}
```

</details>

<details>

<summary>Response 200</summary>

```json
{
    "jsonrpc": "2.0",
    "result": {
        "total": 1,
        "limit": 100,
        "page": 1,
        "token_accounts": [
            {
                "address": "EFaMF6bbRnTwDFUZt9FiTjF8hj6w65kLW43YyhyM85HJ",
                "mint": "BUaiggSfm81ZRAeW572dNf1BhXCzZxaWrGNRm5PjSQzY",
                "amount": 1,
                "owner": "BiKcVb6t6YDZczYjWLjXKwdgAUecdQrp1EJXAfRmu3VR",
                "frozen": true,
                "delegate": null,
                "delegated_amount": 0,
                "close_authority": null,
                "extensions": null
            }
        ]
    },
    "id": "123"
}
```

</details>


# Get Token Largest Accounts

Retrieve the 20 largest token accounts for a specific SPL Token.

### Parameters [(Source)](https://solana.com/docs/rpc/http/gettokenlargestaccounts)

| Name   | Description                                     |
| ------ | ----------------------------------------------- |
| pubkey | The unique identifier of the token to retrieve. |

<details>

<summary>Request (POST)</summary>

```json
{
    "jsonrpc": "2.0",
    "id": "123",
    "method": "getTokenLargestAccounts",
     "params": [
       "jovWMTogqDpoEWUSFSns2Y9rkJkfJHsTgPWJgzCjwCF",
       {
         "commitment": "confirmed"
       }
     ]
}
```

</details>


# Introduction

Solana RPC 2.0

Yellowstone National Park in the Western US is known for its many geysers. Collectively, our new blockchain infrastructure is called Project Yellowstone, and we named each sub-project after one of the geysers at Yellowstone National Park.

The Yellowstone projects form a service explicitly built for high-performance blockchain data delivery. Backend services can use gRPC subscriptions through Dragon's Mouth, and front-end GUIs will feel faster due to Steamboat custom indexes and Whirligig WebSockets.&#x20;

Together with the Solana Foundation, we have also built a new historical archive called Old Faithful, through which all of Solana's transaction and block data is available at low cost and through decentralised means.

We are excited to build a better Solana!


# Dragon's Mouth gRPC Subscriptions

Streaming Account Updates for Backend Applications.

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

The gRPC streams and RPC calls are supported through Solana's [Geyser](/chains/solana/geyser) interface. This is the fastest way to receive updates on on-chain events. This interface is more stable and faster than the traditional WebSocket interface. We recommend using gRPC for all future development of backend clients.

Dragon's Mouth also streams transactions as they are processed in real-time. You will receive multiple account updates within the current slot. This contrasts with regular RPC, where you receive only one update at the end of the slot. For DeFi traders, Dragon's Mouth can give you up to a 400ms advantage over other traders!

Use Dragon's Mouth to stream data directly to your application middle-layer hosted on a cloud service provider. Update your backend database with the lowest possible latency.

gRPC is unsupported by web browsers, so Dragon's Mouth is entirely targeted at backend software. Another Yellowstone project, [Whirligig](/project-yellowstone/whirligig-websockets), provides a WebSocket interface to replace the current Solana WebSocket implementation.

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


# Old Faithful Historical Archive

Old Faithful is Triton's open-source solution to the Solana historical ledger problem, making the entire history of Solana accessible to everyone. Sponsored by the Solana Foundation, this project empowers you to explore Solana's blockchain from genesis to the latest block.

## Key Features

* **Full Historical Access:** Retrieve any Solana block from previous epochs!
* **Flexible APIs:** Access data via standard JSON-RPC, via  or high-performance gRPC streams.
* **Self-Hosted or Managed:** Run your own archive node (requires significant storage) or use Triton's managed endpoints.
* **Open Source:** Built in the open for transparency and community collaboration.

## Getting Started

Old Faithful is automatically integrated into your Triton One subscription. By making a `getBlock` or `getTransaction` call for historical data, our systems will intelligently route you to Old Faithful as required.

### Jetstreamer

[Jetstreamer](https://github.com/anza-xyz/jetstreamer) is our recommended approach to backfilling large amounts of data from the Old Faithful archives. It supports filtering and customizable backends for storing the data. You can also use already existing geyser plugins for processing the data.&#x20;

### Deprecated: gRPC

⚠️ **Service Retired** The current hosted version of the gRPC interface is retired. We are working on an updated version. You can still self-host this. Please contact <support@triton.one> for assistance.

Most JSON-RPC methods can be made with gRPC and for greater efficiency we've also implemented **StreamTransactions** and **StreamBlocks** which allow you to filter large troves of data server side and receive only what's relevant for you. You can see examples in the gRPC [docs](https://docs.old-faithful.net/references/grpc-methods/examples#streaming-methods) page.&#x20;

## Additional Resources

* [Yellowstone Faithful on GitHub](https://github.com/rpcpool/yellowstone-faithful)
* [JSON-RPC Examples](https://docs.old-faithful.net/usage-and-installation/rpc-methods)
* [gRPC Examples](https://docs.old-faithful.net/usage-and-installation/grpc-methods)

## Support

For questions, feedback, or to request access, please contact [customer support](mailto:support@triton.one) or your account representative.


# Old Faithful Public Report

July 13, 2024

### Introduction

Triton One Limited (“Triton”) has completed the initial phases of the Old Faithful project to make Solana's ledger history widely available to the community through decentralized means. We have validated the archive's integrity from Solana’s genesis and uploaded copies to S3-compatible storage. With this completion of the initial phase of the Old Faithful project, Solana now has widely available copies of ledger history and new tooling required to verify the archive’s integrity.

While conducting our work, we learned of missing data files (“snapshots”) for less than five hundred blocks, representing four minutes and eighteen seconds. Engineers successfully verified the correctness of these slots by developing new verification tooling.

This document discusses the Old Faithful project for a general audience and a proof to demonstrate the complete validity of the Solana archive using this new method. See the footnotes below for more detailed information, including an open-sourcing of all tooling and work related to Old Faithful and ledger verification.

### Solana Archive & Google BigTable

In the early days of Solana development, RPC nodes ran on Google Cloud. Cloud hosting provided convenience and simplicity for developers focused on iterating a new codebase. Solana generates more ledger data than can be easily stored on a single computing instance, so the developers used Google BigTable for ledger storage. Trent Nelson from Anza says, “Every bad decision was the right decision at the time.” Using BigTable for ledger storage made sense because the RPCs were in Google Cloud, and network traffic between RPC & BigTable was free. Over time, RPCs moved to bare metal servers outside Google Cloud, and network egress from BigTable to external servers became very expensive. Access to the archives became a pain point for the developer community.

### Old Faithful

Blockchain research projects require access to historical data. Independent researchers struggled to gain affordable access to Solana ledger history since the Archives were only available in BigTable through a handful of entities. To solve this problem, Linus Kendall, Triton Co-Founder, and Richard Patel, currently with the Jump Crypto Firedancer team, brainstormed possible solutions. The two of them thought that Content Addressable aRchive (“CAR”) files would provide a scalable file format that can be saved long-term on various storage platforms, such as any S3-compatible storage platform.

The objective of The Old Faithful project, financially supported by The Solana Foundation, is to copy the entire Solana archive into CAR files accessible by the community. As part of the project, we also independently verified the archive's integrity from its genesis.

### Snapshot Warehouse

In the Solana Labs (now “Anza”) client, the term “account snapshots” or just "snapshot" refers to the capture of the account state at a given slot. Since storing snapshots is computationally expensive, they are written at fixed, somewhat infrequent intervals. In addition to account snapshots, these nodes keep backup copies of the Solana ledger data produced by the node. The collection of snapshot & ledger files is called “the warehouse.”

The warehouse files are saved in cloud storage (Anza uses Google Cloud Storage/GCS, and Triton One uses Backblaze B2 for this storage) for later retrieval and processing.

Asynchronously, an RPC node uploads new blocks to BigTable. The RPC also regularly creates a snapshot of the then-current account state and backfills the BigTable as needed for each epoch.

Solana Labs managed the original snapshot warehouse and shared it with external parties when requested. Over time, multiple ecosystem players, including Triton, copied the files to create & maintain independent warehouses. Triton and several other ecosystem participants also received a copy of the BigTable archive to maintain independent database instances. At this time, there are a handful of independent BigTable instances.

### Missing Proof-of-History Entries

Our research discovered that warehouse ledger backup files were missing for less than five hundred slots, representing four minutes and eighteen seconds, in Epoch 208 (August 3, 2021). The BigTable database included all transactions for the slots, but the warehouse files were missing. The source warehouse files are needed because BigTable does not include the Proof-of-History tick data or the entry batches (“entries”) required to verify the block hashes using the existing tooling. An alternative proof would be required to show that the BigTable ledger history was valid.

### Alternative Proof

One of Solana's unique features is that it includes redundant hashes to verify account state and history. Every block has a “block hash,” which includes the hash from the previous block as input. Validators reference the “bank hash” for a slot when they vote to confirm blocks and resolve forks. Each validator's vote contains the bank hash for the slot they are voting for. A vote for a block N is implicitly a vote for any block that is a parent of N. The bank hashes are included in the votes, and the votes are included in the blocks. Therefore, PoH is generally not needed to verify state transitions – it is possible to prove the validity of ledger history using the votes.

Engineers from Anza led the effort to create the tooling required for an alternative, cryptographically valid proof. At a high level, the proof: 1) starts with a known and verified block hash & bank hash immediately preceding the gap. Then, within the gap, 2) replay transactions from BigTable for each slot to determine the bank hash, 3) confirm that a supermajority of validators voted for the bank hash, and finally, 4) compare the final bank hash at the end of the gap to the votes from known blocks immediately after the gap.

Anza engineers created the alternative proof by replaying transactions and analyzing votes. They also created tooling to show that the transaction history is valid. Triton has independently verified the alternative proof, and we can confirm the Solana transaction history is complete and valid.

We encourage others in the community to verify the alternative proof. Links to documentation and tooling appear in the Footnotes section below.

### Summary

Triton has completed the initial phases of the Old Faithful project to make Solana ledger history widely available. We have uploaded copies of the CAR files to S3-compatible storage. We will also continue the project with the support of The Solana Foundation. With this completion of the initial phase of the Old Faithful project, Solana now has widely available copies of ledger history and the tooling required to verify the archive’s integrity.

### Footnotes

Links for Further Research:

* Old Faithful website: <https://old-faithful.net/>
* Old Faithful Git repo: <https://github.com/rpcpool/yellowstone-faithful/issues>
* Old Faithful Technical Documentation: <https://docs.old-faithful.net/>
* Anza Ledger Tool: <https://github.com/anza-xyz/agave/tree/master/ledger-tool>
* Anza BigTable Git Repo: <https://github.com/solana-labs/solana-bigtable>

Major Contributors:

* Linus Kendall, Co-Founder, Triton One Limited
* Slavomir Balsan, Software Engineer, Triton One Limited
* Steve Czabaniuk, Software Engineer, Anza
* Tyera Eulberg, Technical Project Leader, Anza
* Richard Patel, Firedancer Core Contributor, Jump Crypto


# Cloudbreak Custom Indexes

Cloudbreak serves `getProgramAccounts`, account lookups, and SPL token queries from a purpose-built index, so they stay fast even for programs with millions of accounts. On a Triton endpoint where Cloudbreak is enabled, these methods are answered by the index automatically. You call them like any other Solana RPC method; there is nothing to enable or route on your side.

{% hint style="info" %}
Cloudbreak serves current account state. It does not stream updates or serve transaction history. Pair it with Dragon's Mouth when you need a live feed.
{% endhint %}

### What Cloudbreak does

Cloudbreak handles these workloads:

* `getProgramAccounts` against a program with a large account set, especially with `memcmp` or `dataSize` filters you run repeatedly.
* Account and balance lookups: `getAccountInfo`, `getMultipleAccounts`, `getBalance`.
* SPL token queries by owner, delegate, or mint, and token balances.

What to expect:

* These methods read indexed state, so they return current account data quickly and handle large result sets without timing out.
* Methods Cloudbreak does not cover (`getVoteAccounts`, transaction methods, block methods) are not accelerated; your endpoint continues to serve them as usual.
* For a live feed of account or transaction changes, use Dragon's Mouth instead of polling these methods.

### How it works

Cloudbreak builds its index from a validator snapshot for the starting state and a Yellowstone gRPC stream of account updates to stay current. It tracks both `confirmed` and `finalized` commitment as the chain advances, so a query reads the same state the chain has reached at the commitment you ask for.

It verifies its data against the validator's own account hash: a lattice hash computed over every account's address, lamports, owner, executable flag, and data. When that hash matches the validator's, the indexed state is identical to on-chain state at that slot.

### Making requests

The Cloudbreak-accelerated methods are standard Solana JSON-RPC, so you call them the same way you call any other method on your RPC endpoint. There is nothing Cloudbreak-specific to install or configure on the client side, and existing Solana clients (`@solana/web3.js`, `solana-py`, and others) work without changes.

Every call is an HTTP POST with `Content-Type: application/json`:

```shell
curl https://<your-rpc-endpoint> \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"getSlot","params":[]}'
```

A few things to know before your first query:

* **Coverage is automatic.** The most widely used Solana programs are already indexed and served by Cloudbreak, and programs that receive enough query traffic are added over time, so common queries are fast with no setup on your side. See [How indexes get created](#how-indexes-get-created).
* **Commitment levels** are `confirmed` and `finalized`. The default is `finalized`. `processed` is rejected by default with error `-32003`. See Commitment and consistency.
* **Encodings** are `base64`, `base58`, `base64+zstd`, and `jsonParsed`. If you do not set `encoding`, the response uses the legacy `binary` format, which is a single base58 string rather than a `[data, encoding]` array. Set `encoding` to `base64` for most uses.

{% hint style="warning" %}
The default `binary` encoding and `base58` only work for account data under 128 bytes. Larger accounts return `-32602` with a message telling you to switch to `base64`. Because the default is `binary`, set `encoding` to `base64` whenever an account can exceed 128 bytes.
{% endhint %}

### Supported methods

| Method                       | Returns                                                        |
| ---------------------------- | -------------------------------------------------------------- |
| `getAccountInfo`             | A single account, or `null`.                                   |
| `getMultipleAccounts`        | An array of accounts (each `null` if missing), in input order. |
| `getBalance`                 | The lamport balance of an account.                             |
| `getProgramAccounts`         | All accounts owned by a program, with filters.                 |
| `getTokenAccountsByOwner`    | SPL Original and Token-2022 token accounts owned by a wallet.  |
| `getTokenAccountsByDelegate` | SPL Original and Token-2022 accounts a delegate controls.      |
| `getTokenAccountsByMint`     | SPL Original and Token-2022 accounts of a given mint.          |
| `getTokenAccountBalance`     | The token amount held by a token account.                      |
| `getSlot`                    | The current slot at a commitment level.                        |
| `getVersion`                 | The upstream Solana version and Cloudbreak build.              |
| `getGenesisHash`             | The cluster genesis hash.                                      |
| `getHealth`                  | Service health.                                                |

#### getAccountInfo

Returns the account at a single address, or `null` if it is not in the indexed set. Compatible with the standard [Solana `getAccountInfo` API](https://solana.com/docs/rpc/http/getaccountinfo).

Position 0 is the account pubkey (base58), required. Position 1 is an optional config object:

| Field            | Required | Default     | Description                                                    |
| ---------------- | -------- | ----------- | -------------------------------------------------------------- |
| `encoding`       | optional | `binary`    | `base64`, `base58`, `base64+zstd`, or `jsonParsed`.            |
| `dataSlice`      | optional | full data   | `{ "offset": <number>, "length": <number> }`.                  |
| `commitment`     | optional | `finalized` | `confirmed` or `finalized`.                                    |
| `minContextSlot` | optional | none        | Fail with `-32000` if the index has not reached this slot yet. |

{% tabs %}
{% tab title="Request" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getAccountInfo",
  "params": [
    "4fYNw3dojWmQ4dXtSGE9epjRGy9pFSx62YypT7avPYvA",
    { "encoding": "base64", "commitment": "confirmed" }
  ]
}
```

{% endtab %}

{% tab title="Response" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "context": { "slot": 250000042 },
    "value": {
      "lamports": 1234567,
      "owner": "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
      "executable": false,
      "rentEpoch": 18446744073709551615,
      "space": 752,
      "data": ["<base64-string>", "base64"]
    }
  }
}
```

{% endtab %}
{% endtabs %}

When the account is not found, `value` is `null`.

#### getMultipleAccounts

Returns one entry per requested address, in the same order, with `null` for any address not in the indexed set. Compatible with the standard [Solana `getMultipleAccounts` API](https://solana.com/docs/rpc/http/getmultipleaccounts).

Position 0 is an array of pubkeys (base58), required. Position 1 is the same optional config object as `getAccountInfo`.

{% tabs %}
{% tab title="Request" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getMultipleAccounts",
  "params": [
    [
      "4fYNw3dojWmQ4dXtSGE9epjRGy9pFSx62YypT7avPYvA",
      "11111111111111111111111111111111"
    ],
    { "encoding": "base64" }
  ]
}
```

{% endtab %}

{% tab title="Response" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "context": { "slot": 250000042 },
    "value": [
      {
        "lamports": 1234567,
        "owner": "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        "executable": false,
        "rentEpoch": 18446744073709551615,
        "space": 752,
        "data": ["<base64-string>", "base64"]
      },
      null
    ]
  }
}
```

{% endtab %}
{% endtabs %}

#### getBalance

Returns the lamport balance of an account, or `0` if it is not in the indexed set. Compatible with the standard [Solana `getBalance` API](https://solana.com/docs/rpc/http/getbalance).

Position 0 is the account pubkey (base58), required. Position 1 is an optional config object accepting `commitment` and `minContextSlot`.

{% tabs %}
{% tab title="Request" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getBalance",
  "params": [
    "4fYNw3dojWmQ4dXtSGE9epjRGy9pFSx62YypT7avPYvA",
    { "commitment": "confirmed" }
  ]
}
```

{% endtab %}

{% tab title="Response" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "context": { "slot": 250000042 },
    "value": 1234567
  }
}
```

{% endtab %}
{% endtabs %}

#### getProgramAccounts

Returns every account owned by a program, with optional filtering. This is the method Cloudbreak is built to accelerate. Compatible with the standard [Solana `getProgramAccounts` API](https://solana.com/docs/rpc/http/getprogramaccounts).

Position 0 is the program pubkey (base58 string), required. Position 1 is an optional config object:

| Field            | Required | Default     | Description                                                                                 |
| ---------------- | -------- | ----------- | ------------------------------------------------------------------------------------------- |
| `encoding`       | optional | `binary`    | `base64`, `base58`, `base64+zstd`, or `jsonParsed`.                                         |
| `filters`        | optional | none        | Array of `memcmp` and/or `dataSize` filters. All filters must match.                        |
| `dataSlice`      | optional | full data   | `{ "offset": <number>, "length": <number> }`. Returns only that byte range of account data. |
| `commitment`     | optional | `finalized` | `confirmed` or `finalized`.                                                                 |
| `minContextSlot` | optional | none        | Fail with `-32000` if the index has not reached this slot yet.                              |
| `withContext`    | optional | `false`     | When `true`, wrap the result in `{ "context": { "slot": N }, "value": [...] }`.             |

A `memcmp` filter matches a base58-encoded byte sequence at a fixed offset: `{ "memcmp": { "offset": 32, "bytes": "<base58-bytes>" } }`. A `dataSize` filter matches accounts of an exact data length: `{ "dataSize": 165 }`.

The example below fetches Raydium AMM accounts of a fixed size at `confirmed`, asking for the slot context alongside the result.

{% tabs %}
{% tab title="Request" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getProgramAccounts",
  "params": [
    "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
    {
      "encoding": "base64",
      "commitment": "confirmed",
      "withContext": true,
      "filters": [{ "dataSize": 752 }]
    }
  ]
}
```

{% endtab %}

{% tab title="Response" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "context": { "slot": 250000042 },
    "value": [
      {
        "pubkey": "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2",
        "account": {
          "lamports": 1234567,
          "owner": "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
          "executable": false,
          "rentEpoch": 18446744073709551615,
          "space": 752,
          "data": ["<base64-string>", "base64"]
        }
      }
    ]
  }
}
```

{% endtab %}
{% endtabs %}

Without `withContext`, `result` is the array directly rather than the `{ context, value }` envelope, matching standard Solana RPC behavior.

{% hint style="info" %}
`getProgramAccounts` responses are streamed back as a chunked HTTP body, so a client can begin parsing accounts before the query finishes and peak memory stays bounded on both ends. Standard HTTP and JSON-RPC clients consume the chunked body transparently. If a request fails before the first batch is sent, you get a normal JSON-RPC error. If it fails partway through streaming, the body is truncated and your JSON parser reports an incomplete document. Treat a parse error on a large response as a failed request and retry.
{% endhint %}

#### getTokenAccountsByOwner

Returns the Original and Token-2022 token accounts owned by a wallet, both from the. Cloudbreak indexes the token owner and mint as dedicated columns, so this method stays fast even though the SPL Token program holds hundreds of millions of accounts. Compatible with the standard [Solana `getTokenAccountsByOwner` API](https://solana.com/docs/rpc/http/gettokenaccountsbyowner).

{% hint style="info" %}
For SPL token data, use the token methods rather than a raw `getProgramAccounts` against the Token program. The token methods hit purpose-built indexes; an unfiltered `getProgramAccounts` over the entire Token program is not indexed and is not a supported access pattern.
{% endhint %}

Position 0 is the owner pubkey (base58), required. Position 1 is a filter object, required, with exactly one of:

| Filter                               | Description                                                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `{ "mint": "<mint-pubkey>" }`        | Restrict to a single mint.                                                                                                           |
| `{ "programId": "<token-program>" }` | Restrict to SPL Token (`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`) or Token-2022 (`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`). |

Position 2 is an optional config object accepting `encoding`, `dataSlice`, `commitment`, and `minContextSlot`, with the same meanings as in `getProgramAccounts`.

The example below fetches a wallet's USDC accounts and decodes them with `jsonParsed`.

{% tabs %}
{% tab title="Request" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getTokenAccountsByOwner",
  "params": [
    "<owner-wallet-pubkey>",
    { "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
    { "encoding": "jsonParsed", "commitment": "confirmed" }
  ]
}
```

{% endtab %}

{% tab title="Response" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "context": { "slot": 250000042 },
    "value": [
      {
        "pubkey": "<token-account-pubkey>",
        "account": {
          "lamports": 2039280,
          "owner": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "executable": false,
          "rentEpoch": 18446744073709551615,
          "space": 165,
          "data": {
            "program": "spl-token",
            "parsed": {
              "type": "account",
              "info": {
                "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "owner": "<owner-wallet-pubkey>",
                "tokenAmount": {
                  "amount": "1000000",
                  "decimals": 6,
                  "uiAmount": 1.0,
                  "uiAmountString": "1"
                },
                "state": "initialized",
                "isNative": false
              }
            },
            "space": 165
          }
        }
      }
    ]
  }
}
```

{% endtab %}
{% endtabs %}

The token methods always wrap their result in the `{ context, value }` envelope, matching standard Solana RPC.

#### getTokenAccountsByDelegate

Identical parameters and response shape to `getTokenAccountsByOwner`, but position 0 is the delegate pubkey and results are the Original and Token-2022 token accounts that delegate has authority over. Compatible with the standard [Solana `getTokenAccountsByDelegate` API](https://solana.com/docs/rpc/http/gettokenaccountsbydelegate).

{% tabs %}
{% tab title="Request" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getTokenAccountsByDelegate",
  "params": [
    "<delegate-pubkey>",
    { "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
    { "encoding": "jsonParsed" }
  ]
}
```

{% endtab %}

{% tab title="Response" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "context": { "slot": 250000042 },
    "value": [
      {
        "pubkey": "<token-account-pubkey>",
        "account": {
          "lamports": 2039280,
          "owner": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "executable": false,
          "rentEpoch": 18446744073709551615,
          "space": 165,
          "data": {
            "program": "spl-token",
            "parsed": {
              "type": "account",
              "info": {
                "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "owner": "<owner-wallet-pubkey>",
                "delegate": "<delegate-pubkey>",
                "delegatedAmount": {
                  "amount": "500000",
                  "decimals": 6,
                  "uiAmount": 0.5,
                  "uiAmountString": "0.5"
                },
                "state": "initialized",
                "isNative": false
              }
            },
            "space": 165
          }
        }
      }
    ]
  }
}
```

{% endtab %}
{% endtabs %}

#### getTokenAccountsByMint

Returns the Original and Token-2022 token accounts of a given mint. This is a Cloudbreak extension; standard Solana RPC has no `getTokenAccountsByMint`. Position 0 is the mint pubkey (base58), required. Position 1 is an optional config object:

| Field            | Required | Default     | Description                                                    |
| ---------------- | -------- | ----------- | -------------------------------------------------------------- |
| `programId`      | optional | SPL Token   | Token program to query: SPL Token or Token-2022.               |
| `encoding`       | optional | `binary`    | `base64`, `base58`, `base64+zstd`, or `jsonParsed`.            |
| `dataSlice`      | optional | full data   | `{ "offset": <number>, "length": <number> }`.                  |
| `commitment`     | optional | `finalized` | `confirmed` or `finalized`.                                    |
| `minContextSlot` | optional | none        | Fail with `-32000` if the index has not reached this slot yet. |

The result is always wrapped in the `{ context, value }` envelope and is streamed like `getProgramAccounts`.

{% tabs %}
{% tab title="Request" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getTokenAccountsByMint",
  "params": [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    { "encoding": "jsonParsed", "commitment": "confirmed" }
  ]
}
```

{% endtab %}

{% tab title="Response" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "context": { "slot": 250000042 },
    "value": [
      {
        "pubkey": "<token-account-pubkey>",
        "account": {
          "lamports": 2039280,
          "owner": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          "executable": false,
          "rentEpoch": 18446744073709551615,
          "space": 165,
          "data": {
            "program": "spl-token",
            "parsed": {
              "type": "account",
              "info": {
                "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                "owner": "<owner-wallet-pubkey>",
                "tokenAmount": {
                  "amount": "1000000",
                  "decimals": 6,
                  "uiAmount": 1.0,
                  "uiAmountString": "1"
                },
                "state": "initialized",
                "isNative": false
              }
            },
            "space": 165
          }
        }
      }
    ]
  }
}
```

{% endtab %}
{% endtabs %}

#### getTokenAccountBalance

Returns the token amount held by a token account. Compatible with the standard [Solana `getTokenAccountBalance` API](https://solana.com/docs/rpc/http/gettokenaccountbalance).

Position 0 is the token account pubkey (base58), required. Position 1 is an optional commitment config `{ "commitment": "confirmed" }`. Unlike the other methods, this one does not accept `minContextSlot`.

{% tabs %}
{% tab title="Request" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getTokenAccountBalance",
  "params": ["<token-account-pubkey>", { "commitment": "confirmed" }]
}
```

{% endtab %}

{% tab title="Response" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "context": { "slot": 250000042 },
    "value": {
      "amount": "1000000",
      "decimals": 6,
      "uiAmount": 1.0,
      "uiAmountString": "1"
    }
  }
}
```

{% endtab %}
{% endtabs %}

#### Network and service methods

These return service and chain metadata. None take account-specific parameters.

| Method           | Returns                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `getSlot`        | The current slot at the requested commitment. Accepts an optional `{ "commitment": ..., "minContextSlot": ... }` config.        |
| `getVersion`     | A `{ "solana-core": "<version>-cloudbreak<version>" }` object identifying the upstream Solana version and the Cloudbreak build. |
| `getGenesisHash` | The genesis hash of the cluster this index tracks.                                                                              |
| `getHealth`      | `"ok"` when the index is healthy, or an error while it is bootstrapping a snapshot or repairing a slot gap.                     |

{% tabs %}
{% tab title="Request" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "getSlot",
  "params": [{ "commitment": "confirmed" }]
}
```

{% endtab %}

{% tab title="Response" %}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": 250000042
}
```

{% endtab %}
{% endtabs %}

### Batch requests

Send an array of request objects to run several in one round trip. The response is an array of results in the same order. Within a batch, `getProgramAccounts` and `getTokenAccountsByMint` are buffered into a complete response rather than streamed, since the array has to be assembled before it is sent.

{% tabs %}
{% tab title="Request" %}

```json
[
  { "jsonrpc": "2.0", "id": 1, "method": "getSlot", "params": [] },
  { "jsonrpc": "2.0", "id": 2, "method": "getVersion", "params": [] }
]
```

{% endtab %}

{% tab title="Response" %}

```json
[
  { "jsonrpc": "2.0", "id": 1, "result": 250000042 },
  {
    "jsonrpc": "2.0",
    "id": 2,
    "result": { "solana-core": "2.1.0-cloudbreak0.1.0" }
  }
]
```

{% endtab %}
{% endtabs %}

### Commitment and consistency

Cloudbreak tracks two commitment levels and serves point-in-time reads against them.

* **`confirmed`** reflects account state as soon as a block is confirmed. The indexer writes the slot's accounts first, then advances the confirmed marker, so a confirmed read never sees a half-written slot.
* **`finalized`** (the default) reflects state once the slot is finalized and superseded account versions have been deleted.

`processed` commitment support is coming soon.

Use `minContextSlot` to guarantee freshness. If you read a slot from one call and want a later query to be at least as fresh, pass that slot as `minContextSlot`. If the index has not reached it, the call fails with `-32000` rather than returning stale data.

Use `withContext: true` on `getProgramAccounts` when you need to know which slot a result corresponds to. The account, token, and balance methods always include the context.

### How indexes get created

A `getProgramAccounts` query is fast when an index matches its filter shape. Cloudbreak creates these indexes from real traffic: it counts the query shapes it receives, and once a shape is requested often enough it builds the matching index automatically, backing off while the index catches up so this never competes with ingestion. SPL Token program queries are handled by the dedicated token methods rather than this path.

A query with no matching index yet still returns correct results, it just runs slower until the index is built.

### Performance characteristics

* **Account and balance lookups** (`getAccountInfo`, `getMultipleAccounts`, `getBalance`, `getTokenAccountBalance`) resolve directly by address, with no filter index needed.
* **`getProgramAccounts` and token queries** return in milliseconds once an index matches the query shape. A shape with no matching index still returns correct data, it just runs slower until the index exists. See How indexes get created.
* **Repeated queries are cached.** Triton runs Cloudbreak with response caching on. For each query shape (program, filters, encoding, data slice, and commitment), the serialized response is kept, and the next time you run that query only the accounts that changed since the last response are read and re-encoded. Frequent polling of the same query stays cheap.
* **Large results stream back in full.** A response is sent as the index reads it, so a large `getProgramAccounts` result starts arriving right away and comes back complete rather than timing out or hitting a response-size limit.

### Error reference

| Code     | Name                                     | Meaning                                                                                                                             |
| -------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `-32601` | Method not found                         | The method is not implemented. See Supported methods.                                                                               |
| `-32602` | Invalid params                           | Bad pubkey, malformed filter, or `base58` requested for data over 128 bytes.                                                        |
| `-32000` | Slot behind min context slot             | The index has not yet reached your `minContextSlot`.                                                                                |
| `-32003` | Processed commitment not (yet) supported | You requested `processed`; use `confirmed` or `finalized`. Processed commitment will be supported in a future version of Cloudbreak |
| `-32603` | Internal error                           | A database error or a query that exceeded the server-side timeout.                                                                  |

### FAQ

**Can I send the exact same requests I send to a normal Solana RPC node?** Yes, for the supported methods. The request and response formats are JSON-RPC 2.0 and match standard Solana RPC, so existing clients and tooling work without changes.

**Why does my `getProgramAccounts` for a program return `-32010`?** That program's accounts are not indexed, so Cloudbreak cannot serve the query. Widely used programs are indexed automatically; if you hit this for a program you expect to be covered, let the Triton team know.

**Why does `getAccountInfo` return `null` for an account I know exists on-chain?** The account's owner program is not among the programs Cloudbreak indexes, so the account is not stored. Account lookups return `null` (or `0` for `getBalance`) rather than an error in that case.

**Why is one `getProgramAccounts` query fast and a similar one slow?** The fast one has a matching index and the slow one does not. A new query shape becomes fast once it is requested often enough for automatic index creation to pick it up. Both return correct data regardless.

**My large `getProgramAccounts` response failed to parse. What happened?** A streamed response that errors partway through is truncated on purpose, so your JSON parser reports an incomplete document. Treat that as a failed request and retry; do not treat a partial body as a partial result.

**How fresh is the data?** A `confirmed` read reflects state at the latest confirmed slot; a `finalized` read reflects the latest finalized slot. Use `withContext: true` to see the exact slot, and `minContextSlot` to require a minimum.

**Can I get a live stream of changes instead of polling?** Use Dragon's Mouth. Cloudbreak answers point-in-time queries; Dragon's Mouth streams updates as they occur.


# Whirligig WebSockets

Better, Faster, Stronger Solana WebSockets

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

You can, however, also [manage commitment levels](/project-yellowstone/dragons-mouth-grpc-subscriptions#managing-commitment-levels) in your app in the same way as you would in [Dragon's Mouth gRPC](/project-yellowstone/dragons-mouth-grpc-subscriptions#managing-commitment-levels). Each subscribe method implements a corresponding unsubscribe method which takes the subscription id provided by the subscribe method.

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


# Fumarole Reliable Streams

Scalable and reliable streaming of account and transaction data.

{% hint style="info" %}
Fumarole is currently in **available by default on all mainnet subscriptions**. For questions or feedback, please reach out through your Triton CS channel.
{% endhint %}

Fumarole is our new streaming system to allow you to be able to reliably stream accounts and transactions.

#### Fumarole provides

* **High availability**: by collecting data from multiple downstream Solana nodes and merging them into a single stream, your stream does not get interrupted if a node restarts or is upgraded.
* Persistence: Fumarole stores up to 4 days of historical state and lets you reconnect your stream if your clients go down. Disconnect and resume from your last position any time within that window.
* **Parallel replay download :** Fumarole can replay in parallel geyser data wherever you left off.

#### How to get started

1. Use your existing mainnet subscription token — no separate access request needed.
2. Read our launch post and get started with the Fume CLI: <https://blog.triton.one/introducing-yellowstone-fumarole>
3. Build your integration with Fumarole via the Rust or Typescript SDKs: <https://github.com/rpcpool/yellowstone-fumarole>

#### Regional Endpoints

Fumarole runs as **independent regional clusters**. We currently operate:

| Region | Endpoint          | Location  |
| ------ | ----------------- | --------- |
| EU     | `ams.rpcpool.com` | Amsterdam |
| US     | `nyc.rpcpool.com` | New York  |

**Choosing an endpoint**

For Fumarole, connect directly to a **regional endpoint** rather than shared `*.mainnet.rpcpool.com` endpoints. Pick the region closest to your backend infrastructure to minimize latency.

{% hint style="warning" %}
Shared `*.mainnet.rpcpool.com` endpoints are **not recommended for Fumarole**. See the next section for why.
{% endhint %}

**Why direct regional endpoints matter for Fumarole**

The shared endpoints (`*.mainnet.rpcpool.com`) routes traffic to the closest regional load balancer based on GeoDNS. For stateless RPC calls this is ideal, any region can serve any request.

**Persistent subscribers in Fumarole are stateful per cluster.** A persistent subscriber and the slot offsets it tracks live locally on the cluster where it was created and **do not replicate across regions**.

If you connect through a shared endpoint, your traffic can be routed to a region where your persistent subscriber does not exist - for example, after a routing change, a network event, or a shift in the perceived geography of your backend. When that happens, your subscriber will not be found on the new cluster and you will need to recreate it.

Pointing your Fumarole client directly at a regional endpoint avoids this entirely.

**Switching regions**

To move a persistent subscriber from one regional cluster to another (e.g., EU → US):

1. Recreate your persistent subscriber on the new cluster - subscribers do not carry over between regional clusters.
2. Point your client to the new regional endpoint.
3. Reconnect. Your existing token continues to work; no token changes are required.

**Cross-region redundancy (customer-managed)**

With multiple regional clusters available, you can implement cross-region redundancy on the client side. If one cluster experiences a major issue, you can fail over to another region by recreating the persistent subscriber **from the last slot you observed on the failing cluster**.

Fumarole makes this type of redundancy easy to handle in the client since it tracks the last **full** slot you consumed.

This pattern is fully customer-managed:

* Your client tracks the last-seen slot per cluster.
* Your client detects the failure and triggers the cutover.
* Triton does not synchronize subscriber state, track last-seen slots, or orchestrate failover between clusters.

If you need this level of redundancy, plan your slot bookkeeping and failover logic accordingly.

#### Migrating from Dragon's Mouth

If you already have code built for our gRPC streams in Dragon's Mouth, integrating with Fumarole for additional reliability is easy. The code changes should be minimal as Fumarole uses the same types as Dragon's Mouth.

The main difference is that you need to manage a **persistent subscriber**, and alter your subscribe request slightly.

For more details see the Github repo:

[Yellowstone-fumarole-client crates.io](https://docs.rs/yellowstone-fumarole-client/0.5.0+solana.3/yellowstone_fumarole_client/)


# Fumarole Cluster Failover Guide

{% hint style="info" %}
This guide shows how to implement cross-region failover for Fumarole from the subscriber side. For an overview of regional clusters and the redundancy model, see [Fumarole Reliable Streams.](/project-yellowstone/fumarole)
{% endhint %}

Fumarole runs as **independent regional clusters**. Persistent subscriber state does not replicate across regions. This means that if your primary cluster experiences a major outage, you can fail over to another region, but the cutover is fully customer-managed and requires you to recreate your persistent subscriber on the secondary cluster from the last slot you consumed.

This guide walks through the full failover lifecycle: preparation, detection, cutover, and failback.

#### Scope and assumptions

This guide assumes:

* You have an active Fumarole integration on one regional cluster (your **primary**).
* You have access to a second regional cluster (your **secondary**), the same token works on both.
* You can implement client-side logic that tracks per-cluster state and reacts to outage signals.

The example throughout this guide uses **EU (`ams.rpcpool.com`)** as primary and **US (`nyc.rpcpool.com`)** as secondary. The procedure is symmetric, it applies in either direction.

{% hint style="warning" %}
Triton does **not** orchestrate failover for you, failover is **customer-managed**. We do not synchronize subscriber state, track your last-consumed slot, or trigger the cutover. Everything described below runs on your side. This page tells you exactly what to do.
{% endhint %}

#### Before you start

Failover is only possible if you do the prep work ahead of time. Put these in place during normal operation, not during the outage.

**1. Track the last fully-consumed slot per cluster.**

Your client must keep a record of the highest slot you have successfully processed end-to-end from each cluster. Persist this value durably (e.g. in your database, in Redis, in a file) anywhere that survives a process restart. You will need it to recreate the subscriber on the secondary cluster at the correct position.

Fumarole exposes the last **full** slot you have consumed, so you can rely on that value rather than computing it yourself.

**2. Build your outage-detection logic.**

Decide what counts as a cluster-level failure for your workload (see Detecting an outage below) and instrument the client to surface it.

**3. Make sure your processing pipeline is idempotent.**

There will be a small overlap window during failover where the same slot may be delivered from both clusters. Your downstream processing must tolerate seeing the same slot twice without producing duplicate side effects.

#### Detecting an outage

A failover is only worth the effort when the primary is genuinely down. Transient hiccups should be handled by normal reconnect logic, not failover.

Before triggering a failover, make sure the problem is on the cluster and not on your side. Some signals worth tracking:

* **Stream interruption that does not recover on reconnect.** Fumarole is built to survive normal node restarts and rolling upgrades. If you have been disconnected for more than a few minutes and reconnect attempts keep failing, that is beyond normal recovery.
* **`fume test-config` against the failing endpoint fails or hangs.** This is the most direct check that the cluster is reachable.
* **No new slots advancing.** The `fumarole_offset_lag_from_tip` metric on your client should normally trend toward zero. If it is growing unbounded and your network is healthy, the cluster is not advancing the log.
* **"Not found" or stale errors** for a persistent subscriber you know was healthy minutes ago.

{% hint style="warning" %}
**Check whether the problem is differential.** If only some of your clients are affected but others are fine, the problem is likely on your side: network, host, or deployment. Do not fail over.
{% endhint %}

If `fume test-config` succeeds against the failing endpoint and the subscriber exists, but you are not receiving data, that is worth a CS-channel ping before declaring a full failover.

#### Failover procedure

When your detection logic concludes the primary cluster is down, execute the following sequence.

**Step 1 — Stop the primary client**

Halt consumption from `ams.rpcpool.com`. Stop reconnect attempts.

**Step 2 — Read the last fully-consumed slot for the primary**

How you read `last_primary_slot` depends on whether the failover is planned or reactive.\
\
**Planned failover**, primary still healthy: gracefully stop your consumer (stop accepting new events and let in-flight processing drain) then take the slot of the last event your pipeline finished processing. The running client already has this value; no separate lookup is needed. If you also keep a durable record (recommended, see [Before you start](#before-you-start)), the two should agree.<br>

**Reactive failover**, primary unreachable: read `last_primary_slot` from the durable per-cluster value you have been tracking. This is the only source available when the primary is down. If you do not have such a record, your options are to start the secondary at LATEST (accepts a gap) or at a conservatively older slot (accepts duplicates). Fumarole guarantees at-least-once delivery, so duplicates are always safe to choose over data loss.

**Step 3 — Create the subscriber on the secondary cluster**

Connect to the secondary cluster and create the persistent subscriber there, starting from `last_primary_slot + 1`.

```bash
fume --config ~/.fumarole/config-us.yaml create \
  --name my-app-failover \
  --from_slot 312500001
```

If a subscriber with that name already exists on the secondary cluster from a previous failover, delete it first:

```bash
fume --config ~/.fumarole/config-us.yaml delete --name my-app-failover
fume --config ~/.fumarole/config-us.yaml create \
  --name my-app-failover \
  --from_slot 312500001
```

The same pattern applies whether you use the Fume CLI or the Rust / TypeScript SDK, create a fresh subscriber pointing at your recovery slot.

**Step 4 — Begin consuming from the secondary**

Start your client against `nyc.rpcpool.com`. Resume normal processing.

Until the secondary catches up to live tip, you will be receiving historical data. Expect some replay delay proportional to the gap between `last_primary_slot` and the current chain tip.

**Step 5 — Confirm forward progress**

Once the secondary is at live tip and slots are advancing normally, your failover is complete. Log the cutover and update your monitoring to track the new active cluster.

#### Failing back to the primary

When the primary cluster recovers, you have a choice:

* **Stay on the secondary.** Acceptable if the secondary is geographically reasonable for your workload.
* **Fail back to the primary.** Necessary if the secondary is far from your backend and you accepted the failover only for availability.

If you decide to fail back, run the failover procedure in reverse:

1. Track the last fully-consumed slot on the secondary.
2. Stop the secondary client.
3. Create the primary subscriber starting from `last_secondary_slot + 1` (deleting the existing primary subscriber first if needed).
4. Start consuming from the primary.
5. Confirm forward progress.

{% hint style="warning" %}
Failback is a planned operation, not an emergency one. Schedule it during a low-traffic window and verify the primary has been stable for some time before cutting back.
{% endhint %}

#### Common pitfalls

* **Failing over on a transient blip.** A single dropped connection is not a cluster outage. Tune your detection thresholds so normal reconnects do not trip failover.
* **Not persisting the last-consumed slot.** If you only hold it in memory and your process restarts mid-outage, you have lost your resume point. Persist it durably.
* **Forgetting the subscriber starts at `last_slot + 1`.** Starting at `last_slot` itself replays the slot you already processed, which widens the duplicate window.
* **Assuming token-or-permission errors mean an outage.** Authentication failures are not outage signals, they indicate a client configuration problem, not a cluster problem.

#### Quick reference

| Phase     | What you do                                                                                                                                                                                                                                                            |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prepare   | Track last-consumed slot per cluster, build detection logic, ensure idempotent processing                                                                                                                                                                              |
| Detect    | Run `fume test-config`, watch the `fumarole_offset_lag_from_tip` metric, and check for "not found" / stale errors on your subscriber. See the [Fume CLI reference](https://github.com/rpcpool/yellowstone-fumarole/blob/main/apps/yellowstone-fumarole-cli/README.md). |
| Cut over  | Stop primary client → read `last_primary_slot` → create subscriber on secondary from `last_primary_slot + 1` → start consuming → confirm progress                                                                                                                      |
| Fail back | Same procedure in reverse, scheduled rather than reactive                                                                                                                                                                                                              |


# Program Data Streams

Real-time Solana program data streams

## Introduction

Program Data Streams are a high-performance gRPC endpoints that provides real-time, parsed Solana blockchain data streams by program. It solves the critical challenge of efficiently monitoring and reacting to on-chain activities by delivering pre-parsed account states and transaction instructions for specific Solana programs.

Powered by the [Yellowstone Vixen](https://github.com/rpcpool/yellowstone-vixen) open-source framework which provides the building blocks to create custom indexes for specific programs, accounts, and transactions. Vixen Streams enables developers to build responsive applications that can react to on-chain events without the complexity of building and maintaining custom parsing infrastructure.

### The Problem

Traditionally, monitoring blockchain activity requires:

* Polling RPC endpoints, which is inefficient and prone to missing fast-moving events.
* Custom parsing and filtering logic, which is complex to develop and difficult to scale.
* High infrastructure costs, as developers must manage large volumes of raw blockchain data.

### The Solution

Vixen Streams addresses these pain points by providing:

* gRPC Streaming – Real-time, high-performance delivery of parsed Solana blockchain data.
* Multi-Program Support – Detailed parsing for multiple Solana programs, with more coming soon.
* Scalability – Designed to handle high transaction volumes efficiently.
* TypeScript SDK – A simple and secure SDK for TypeScript applications with token-based authentication, abstracting away gRPC and protobuf complexity.

## Getting Started

Install the [Typescript SDK](https://www.npmjs.com/package/@triton-one/vixen-stream)

```bash
npm install @triton-one/vixen-stream
```

### Usage

```typescript
import {
  ProgramStreamsServiceClient,
  ProgramUpdateType,
  credentials,
  createCallCredentials,
  ProgramAddress,
} from "@triton-one/vixen-stream";

const creds = credentials.createSsl();

// <token> is your Triton One authentication token
const callCredentials = createCallCredentials("<token>");

const combinedCredentials = credentials.combineChannelCredentials(
  creds,
  callCredentials
);

// <endpoint> is your Triton One RPC endpoint
const client = new ProgramStreamsServiceClient(
  "<endpoint>",
  combinedCredentials
);

// Subscribe to account and instruction updates for the token keg program
let stream = client.Subscribe({
  program: ProgramAddress.Token,
});

// Handle the update events as you see fit. Write them to a database, call an API, or submit a Solana transaction.
stream.on("data", function (update: ProgramUpdateType<ProgramAddress.Token>) {
  console.log(update);
});

stream.on("end", () => console.log("end"));
stream.on("error", (e: Error) => console.log("error: ", e));
```

## Supported Programs

The following table lists the supported programs and their corresponding addresses. If you need support for additional programs, please reach out to our support.

<table><thead><tr><th width="252.1171875">Program</th><th>Address</th></tr></thead><tbody><tr><td>Token</td><td>TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA</td></tr><tr><td>Token22</td><td>TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb</td></tr><tr><td>OrcaWhirlpool</td><td>whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc</td></tr><tr><td>RaydiumClmm</td><td>CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK</td></tr><tr><td>Meteora</td><td>LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo</td></tr><tr><td>Pumpfun</td><td>6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P</td></tr><tr><td>JupiterSwap</td><td>JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4</td></tr><tr><td>MeteoraAmm</td><td>cpamdpZCGKUy5JxQXB4dcpGPiikHawvSWAd6mEn1sGG</td></tr><tr><td>Moonshot</td><td>MoonCVVNZFSYkqNXP6bxHLPL6QQJiMagDL3qcqUQTrG</td></tr><tr><td>PumpSwaps</td><td>pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA</td></tr><tr><td>RaydiumCpmm</td><td>CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C</td></tr><tr><td>RaydiumAmmv4</td><td>675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8</td></tr><tr><td>KaminoLimitOrders</td><td>LiMoM9rMhrdYrfzUCxQppvxCSG1FcrUK9G8uLq4A1GF</td></tr></tbody></table>

### FAQ

#### ❓ What commitment level are streams set to?

*Answer:* Streams deliver change events for all commitment levels (Processed, Confirmed, and Finalized).

❓ I’m getting a parser error. What should I do?

*Answer:* Make sure you have the latest SDK version installed. Check [npm](https://www.npmjs.com/package/@triton-one/vixen-stream) for the most recent release.

❓ Are streams globally distributed?

*Answer:* Yes. Our infrastructure runs in the USA, EU, and AP regions, minimizing latency for developers worldwide.\
❓ Can I stream multiple programs simultaneously?

*Answer:* Yes. You can open multiple subscriptions to stream data for different programs in parallel.

#### ❓ How do I authenticate?

*Answer:* Authentication is handled via token-based credentials. You must provide a valid Triton One token when initializing the client. Since we are currently in Beta, you’ll need to contact Triton Support to receive a token.

❓ What’s the difference between this and RPC polling?

*Answer:* RPC polling requires repeatedly fetching data and parsing it manually, which is slower and resource-intensive. Vixen Streams pushes pre-parsed, program-specific updates in real time, reducing overhead and improving responsiveness.

❓ Is there rate limiting?

*Answer:* No, there is no rate limiting. However, usage is billed based on bandwidth consumption.


# Shield Transaction Policies

Learn more about Shield in our blog post: [Introducing Yellowstone Shield 🚫🛡️](https://blog.triton.one/introducing-yellowstone-shield)

### What is Shield?

Yellowstone Shield lets you control which validators can process your Solana transactions. It's a simple but powerful idea: create a list of validators you trust (allowlist) or don't trust (blocklist), and your transactions will only go to the validators that match your criteria.

**Why use Shield?** Some validators engage in practices that can harm users, such as:

* **Sandwich attacks** - Inserting transactions before and after yours to extract value
* **Frontrunning** - Copying and executing your transaction idea before you
* **Other harmful MEV strategies** - Various techniques to extract value at users' expense

Shield helps you avoid these validators by simply not sending your transactions to them.

### How It Works

1. **Create a Policy** - You create an on-chain list of validators (either "allow these validators" or "block these validators")
2. **Own Your Policy** - When you create a policy, you receive a special token that gives you control over that policy
3. **Use the Policy** - Add your policy's address to your transactions
4. **Automatic Filtering** - The RPC checks each validator against your policy and only sends transactions to approved validators

**What happens to blocked transactions?** If the current validator doesn't meet your criteria, the transaction is dropped - it won't be sent to that validator. The system doesn't hold or queue transactions.

**Note about time-critical transactions**: Since Shield can drop transactions when no eligible validators are available, be careful using strict policies with time-sensitive operations like arbitrage or liquidations.

**Important**: This only works with Shield-enabled RPCs (like those using Yellowstone Jet). Standard Solana RPCs will ignore the policy parameter.

### Quick Start

If you're already using an RPC that supports Shield (like Triton RPC with Cascade), just add the policy to your transaction:

#### RPC Method Parameter

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "sendTransaction",
  "params": [
    "<base64_encoded_transaction>",
    {
      "encoding": "base64",
      "skipPreflight": true,
      "forwardingPolicies": ["<your_policy_pda>"]
    }
  ]
}
```

#### HTTP Header (Alternative)

```
Solana-ForwardingPolicies: "<your_policy_pda>,<your_policy_pda2>"
```

### Understanding Policies and Tokens

When you create a Shield policy:

* An SPL token (using Token Extensions) is created
* You receive 1 token in your wallet
* This token gives you control over the policy
* As the creator, you keep the mint authority and can mint more tokens if needed
* Anyone holding the token can manage the policy (add/remove validators)
* The policy lives on-chain and can be used by anyone who knows its address

**Note**: Since the token is fungible and more can be minted, you could potentially share policy management with others by minting and sending them tokens.

### Important: Protection Limitations

Shield policies are **not automatic protection against harmful validator practices**. Here's why:

* Policies only block validators that are on your blocklist (or not on your allowlist)
* New validators join Solana every epoch
* Validators engaging in harmful practices (like sandwich attacks or frontrunning) can appear at any time
* **Policy maintainers must actively update their lists** to catch validators that harm users

Think of it as a filter, not a guarantee. The quality of protection depends entirely on how well the policy is maintained.

### Finding and Using Existing Policies

#### Policy Explorer

Visit [validators.app/yellowstone-shield](https://www.validators.app/yellowstone-shield?locale=en\&network=mainnet) to:

* Browse all existing policies
* See which validators are included/excluded
* Copy policy addresses for your transactions
* Check when policies were last updated

#### Common Policy Types

**Allow Lists**

* Top validators by stake
* Geographically distributed validators
* Performance-based selection

**Block Lists (Deny Lists)**

* Validators known for sandwich attacks or frontrunning
* Poor performing validators
* Community-flagged validators

### Creating Your Own Policy

#### Prerequisites

* Solana CLI installed and configured
* SOL for transaction fees
* A list of validator addresses

#### Step 1: Install Shield CLI

```bash
git clone https://github.com/rpcpool/yellowstone-shield
cd yellowstone-shield
cargo build --release --bin yellowstone-shield-cli
```

#### Step 2: Prepare Metadata

Create a JSON file describing your policy:

```json
{
  "name": "My Validator Policy",
  "symbol": "MVP",
  "description": "Blocks validators known for sandwich attacks",
  "image": "https://your-image-url.com/image.png",
  "external_url": "https://your-website.com",
  "attributes": []
}
```

Upload this file to IPFS or Arweave and save the URL.

#### Step 3: Create the Policy

```bash
# For a blocklist (deny these validators)
yellowstone-shield-cli policy create \
  --strategy deny \
  --name "My Validator Policy" \
  --symbol "MVP" \
  --uri "https://your-metadata-url.json"

# For an allowlist (only allow these validators)
yellowstone-shield-cli policy create \
  --strategy allow \
  --name "My Validator Policy" \
  --symbol "MVP" \
  --uri "https://your-metadata-url.json"
```

The CLI will output your policy's mint address - save this! You'll receive 1 token and retain mint authority, allowing you to mint more tokens later if you want to share policy management with others.

#### Step 4: Add Validators

Create a text file with validator addresses (one per line):

```
ValidatorAddress1...
ValidatorAddress2...
ValidatorAddress3...
```

Then add them to your policy:

```bash
yellowstone-shield-cli identities add \
  --mint <your_mint_address> \
  --identities-path validators.txt
```

#### Managing Your Policy

To manage a policy (add/remove validators), you must hold at least 1 token in your wallet. If you've transferred all your tokens to others, you'll lose the ability to manage the policy.

**Update validators (replace entire list):**

```bash
yellowstone-shield-cli identities update \
  --mint <mint_address> \
  --identities-path new_validators.txt
```

**Remove specific validators:**

```bash
yellowstone-shield-cli identities remove \
  --mint <mint_address> \
  --identities-path validators_to_remove.txt
```

**View policy details:**

```bash
yellowstone-shield-cli policy show --mint <mint_address>
```

### For RPC Providers

If you're running your own RPC and want to support Shield:

1. **Using Yellowstone Jet** - Shield support is built-in
2. **Custom Integration** - Use the [yellowstone-shield-store](https://crates.io/crates/yellowstone-shield-store) crate to:
   * Cache policies locally
   * Check validators against policies
   * Integrate with your transaction forwarding logic

### For Developers

Shield policies only work with RPCs that support them. You can't use the standard Solana web3.js methods - you need to make direct RPC calls:

```typescript
// Prepare and sign your transaction
import { Transaction } from '@solana/web3.js';
import bs58 from 'bs58';

const transaction = new Transaction().add(/* your instructions */);
const signedTx = await wallet.signTransaction(transaction);
const serializedTx = bs58.encode(signedTx.serialize());

// Send with Shield policy
const response = await fetch('https://your-shield-enabled-rpc.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'sendTransaction',
    params: [
      serializedTx,
      {
        encoding: 'base58',
        skipPreflight: true,
        forwardingPolicies: ['<policy_pda>']
      }
    ]
  })
});

const result = await response.json();
const signature = result.result;
```

### Key Points to Remember

1. **Policies need maintenance** - New validators appear every epoch. Lists must be updated regularly to remain effective.
2. **It's just a filter** - Shield simply prevents transactions from going to certain validators. It doesn't guarantee protection from sandwich attacks or transaction failures.
3. **Token = Control** - When you create a policy, you get an SPL token. Anyone with this token can manage the policy. As the creator, you can mint more tokens to share control.
4. **Anyone can use your policy** - Once created, anyone who knows the policy address can use it in their transactions.
5. **Not all RPCs support Shield** - Only use Shield-enabled RPCs like those using Yellowstone Jet.

### Resources

* **GitHub Repository**: [yellowstone-shield](https://github.com/rpcpool/yellowstone-shield)
* **Policy Explorer**: [validators.app/yellowstone-shield](https://www.validators.app/yellowstone-shield?locale=en\&network=mainnet)
* **Blog Post**: [Introducing Yellowstone Shield](https://blog.triton.one/introducing-yellowstone-shield)
* **Rust Crate**: [yellowstone-shield-store](https://crates.io/crates/yellowstone-shield-store)


# Vixen Parsing Framework

Real-Time Solana Data Pipeline Framework

## Overview

Yellowstone Vixen is a modular framework for building program-aware, real-time Solana data pipelines. Built to consume Solana events and transform them into structured, actionable data, Vixen powers indexing, analytics, and real-time application backends with ease.

At its core, Vixen listens to Dragon’s Mouth gRPC streams and routes program-specific changes through composable parsers and handlers, letting developers observe, react to, and enrich blockchain activity at scale.

> Use it to build your own indexer, analytics pipeline, or event-driven application—without writing low-level Solana RPC or deserialization logic.

## Why Use Yellowstone Vixen?

Traditional Solana infrastructure is expensive to scale, difficult to extend, and requires deep protocol expertise to interpret data. Vixen changes that by offering:

* ✅ Cost Efficiency: Share a single Dragon’s Mouth stream among multiple pipelines, and only process what you need.
* ⚙️ Operational Simplicity: Vixen is lightweight and dependency-free—easy to run in your own infra, Docker, or Kubernetes.
* 📊 Observability Built In: Get real-time metrics via Prometheus: lag, throughput, error rates.
* 🧱 Composability: Reusable parser crates handle complex cross-program interactions (like CPIs).
* 🔌 Stream-Ready Outputs: Serve parsed data directly to clients over your own gRPC interfaces.

## Key Features

| Feature                       | Description                                                                                   |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| 🛠 Parser + Handler System    | Easily transform raw Solana account/instruction data into structured models with logic hooks. |
| 🔥 Dragon’s Mouth Integration | Ingest real-time Geyser data with a few lines of config.                                      |
| 📈 Prometheus Metrics         | Out-of-the-box support for /metrics scraping.                                                 |
| 🧪 Offline Testing            | Use devnet fixtures to test locally without Solana node access.                               |
| 🔄 gRPC Server                | Serve custom, program-specific streams to your own clients.                                   |

## Quick Start

Here’s a minimal example that listens to Token Program updates and logs parsed data.

```rust
use yellowstone_vixen::Pipeline;
use yellowstone_vixen_parser::token_program::{AccountParser, InstructionParser};
use yellowstone_vixen_yellowstone_grpc_source::YellowstoneGrpcSource;

#[derive(Debug)]
pub struct Logger;

impl<V: std::fmt::Debug + Sync> vixen::Handler<V> for Logger {
    async fn handle(&self, value: &V) -> vixen::HandlerResult<()> {
        tracing::info!(?value);
        Ok(())
    }
}

fn main() {
    // Set up logging and config parsing
    ...

    yellowstone_vixen::Runtime::builder()
        .source(YellowstoneGrpcSource::new())
        .account(Pipeline::new(AccountParser, [Logger]))
        .instruction(Pipeline::new(InstructionParser, [Logger]))
        .metrics(yellowstone_vixen::metrics::Prometheus)
        .commitment_level(yellowstone_vixen::CommitmentLevel::Confirmed)
        .build(config)
        .run();
}
```

```
RUST_LOG=info cargo run -- --config ./Vixen.toml
```

## Prometheus Setup

To run Prometheus locally and collect Vixen metrics:

```
sudo docker-compose up
```

Then visit <http://localhost:9090> to explore.

## Supported Programs

\
Vixen ships with built-in support for a wide and growing set of Solana programs:

| Program                               | Parser                                                                                                                 |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Jupiter Aggregator v6                 | [jupiter-swap-parser](https://github.com/rpcpool/yellowstone-vixen/tree/main/crates/jupiter-swap-parser)               |
| Pump.fun / AMM                        | [pumpfun-parser](https://github.com/rpcpool/yellowstone-vixen/blob/main/crates/pumpfun-parser)                         |
| Boop.fun                              | [boop-parser](https://github.com/rpcpool/yellowstone-vixen/tree/main/crates/boop-parser)                               |
| Kamino Limit Orders                   | [kamino-limit-orders-parser](https://github.com/rpcpool/yellowstone-vixen/blob/main/crates/kamino-limit-orders-parser) |
| Raydium AMM / CLMM / CPMM / Launchpad | [View all Raydium parsers](https://github.com/rpcpool/yellowstone-vixen/tree/main/crates)                              |
| Meteora Vault / DLMM / Pools / DBC    | [View Meteora parsers](https://github.com/rpcpool/yellowstone-vixen/tree/main/crates)                                  |
| Whirlpools                            | [orca-whirlpool-parser](https://github.com/rpcpool/yellowstone-vixen/blob/main/crates/orca-whirlpool-parser)           |
| Virtuals                              | [virtuals-parser](https://github.com/rpcpool/yellowstone-vixen/blob/main/crates/virtuals-parser)                       |
| …                                     | Custom parser support available                                                                                        |

Need support for a new program? [Contact us](mailto:support@triton.one).

You can easily create a parser crate with the [Vixen parser generator](/project-yellowstone/vixen-parsing-framework/generate-parsers-with-codama) for Codama, using any IDL specification that Codama supports.

## Dragon’s Mouth Integration

Yellowstone Vixen is powered by [Dragon’s Mouth](/project-yellowstone/dragons-mouth-grpc-subscriptions), a high-performance gRPC source for Solana Geyser events.

## Developer Resources

* [🧪 Parser Testing with Fixtures](https://github.com/rpcpool/yellowstone-vixen/tree/main/crates/mock)

  Simulate devnet transactions and accounts offline.
* [📂 Example Pipelines](https://github.com/rpcpool/yellowstone-vixen/tree/main/examples)

  Learn by example—real pipelines for multiple programs.
* [📝 Config File Template](https://github.com/rpcpool/yellowstone-vixen/blob/main/Vixen.example.toml)

  Use this as your base to start streaming.


# Generate Parsers with Codama

How-to generate Vixen parser with Codama

This guide walks you through generating a [Vixen](https://github.com/rpcpool/yellowstone-vixen) Parser using [Codama](https://github.com/abklabs/codama), a tool for rendering Rust SDKs and parser implementations from IDLs.

Vixen is a framework for building real-time program data pipelines in Rust. This guide helps you scaffold a parser that can be used in the Vixen runtime to decode and process Solana program data.

#### Prerequisites

1. **An `idl.json` file:** Either Anchor-generated or custom.
2. **Install** [**pnpm**](https://pnpm.io/)**:** Or use npm/yarn if preferred.
3. **Initialize a JavaScript Project:**

   ```bash
   pnpm init
   ```

#### Installation

Install the required Codama packages:

```bash
pnpm install @codama/renderers-vixen-parser
```

Also, install dependencies for the parser generation script:

```bash
pnpm install \
  @codama/nodes \
  @codama/nodes-from-anchor \
  @codama/renderers-core \
  @codama/visitors-core
```

#### Setup

**Create a Parser Generation Script**

Create a new file, `codama.cjs`:

```javascript
const path = require("node:path");
const { rootNode } = require("@codama/nodes");
const { rootNodeFromAnchor } = require("@codama/nodes-from-anchor");
const { readJson } = require("@codama/renderers-core");
const { visit } = require("@codama/visitors-core");
const { renderVisitor } = require("@codama/renderers-vixen-parser");

const projectName = "example-parser";
const idl = readJson(path.join(__dirname, "idl.json"));
const node = rootNodeFromAnchor(idl);

visit(
    node,
    renderVisitor({
        projectFolder: __dirname,
        projectName,
    }),
);
```

> **Tip:** The `projectName` is used for the Cargo crate name of the generated parser.

**Run the Code Generation Script**

```bash
node codama.cjs
```

Your folder structure should look like:

```
example-parser/
├── proto/
│   └── example_parser.proto
├── src/
│   ├── generated_parser/
│   ├── generated_sdk/
│   └── lib.rs
├── build.rs
├── Cargo.toml
├── codama.cjs
└── idl.json
```

**Build and Verify**

```bash
cargo build
```

If successful, you now have a working parser for Solana account data using Yellowstone Vixen.

#### Completion

Congratulations! You now have a custom Vixen parser ready for integration into a Vixen pipeline.


# Payments

Here is a step-by-step guide on how to sign up and process payments on Hel.io via the Triton One customer site:

1. Open your preferred web browser and go to <https://customers.triton.one> and login to your Triton One account.

<figure><img src="/files/jJdcF2hDni5WobhMIPCz" alt=""><figcaption></figcaption></figure>

2. You will be prompted that your RPC account is still inactive. To activate the account, make a payment via Hel.io web3 payment. You can opt to click on the account name (follow step #3) or click on "here" or the banner on the link (directly proceeds to step #4).

<figure><img src="/files/CySKKwlYPH9a22nozg2x" alt=""><figcaption></figcaption></figure>

3. You will be routed to the account dashboard, which shows the account is still inactive. Click on the "Inactive Pay Stream" banner.

<figure><img src="/files/lmdBWNoV8F7bdm9Tbo91" alt=""><figcaption></figcaption></figure>

4. You see the Hel.io Pay Stream page. Click on "Connect Wallet”.

<figure><img src="/files/sNxxBbtMpXn6Elfw9uin" alt=""><figcaption></figcaption></figure>

5. Select "Web" or "Extension" if prompted.

<figure><img src="/files/Yh9FVJWTWp1VjpaeSdQF" alt=""><figcaption></figcaption></figure>

6. Tap on "Connect".

<figure><img src="/files/EUmtkyqDfNVgtlZB2P1s" alt=""><figcaption></figcaption></figure>

7. Click "Approve".

<figure><img src="/files/1steXhHiJ4zfoy34kUV1" alt=""><figcaption></figcaption></figure>

8. Check the settings for duration and price. If all entries are correct click "Pay".

<figure><img src="/files/jcKq3LE5JpPMCm3pnV3P" alt=""><figcaption></figcaption></figure>

9. The page will show "Approving transaction".

<figure><img src="/files/MipaB0sCBw27o5ZB9Rbw" alt=""><figcaption></figcaption></figure>

10. &#x20;Payment is done! To stop the pay stream, click on "Stop Pay Stream".

<figure><img src="/files/FvB8UPYEOLtjnR6lIPfU" alt=""><figcaption></figcaption></figure>

11. Click "Approve".

<figure><img src="/files/pPhOoxHINT7ViZx3CZ09" alt=""><figcaption></figcaption></figure>

12. Payment confirmation is sent via email.

<figure><img src="/files/nHcB51zdNdPIcmO3BHDF" alt=""><figcaption></figcaption></figure>

13. Navigate back to <https://customers.triton.one>. You may need to refresh the page to display the activated RPC account.

<figure><img src="/files/W96z6exnjLs06E7UIBRU" alt=""><figcaption></figcaption></figure>


# Account management API

We provide an account management REST API which can allow you to automatically manage your Triton subscriptions and services.&#x20;

To get access to the account management API, send an email to <help@triton.one> or contact us over any of your dedicated support channels.&#x20;


# Introduction

First, make sure you have an account and request account management API access from us before making account management API requests. You can contact us to create an account for you, or if you already have one, you can sign into the UI [here](https://customers.triton.one). Once logged in, if you requested Operator or Reseller access, you'll be able to create API tokens that you can use to make scoped, authenticated requests for your users and accounts.


# Auth & Headers

### **Auth**

Pass your token in through the Authorization header to make scoped, authenticated requests against the account management API. You can use the `GET /api/v1/accounts` endpoint to test your token. If you get a 200 status code response, your token is being passed correctly. This token is only used for the account management API (`customers.rpcpool.com/api`). You'll create separate tokens for consuming the RPC API.

Examples in this account management API guide are demonstrated using curl, but you should use an HTTP library of your choice.

```
$ curl -H "Authorization: secret" -H "Content-Type: application/json" -H "Accept:application/json" https://customers.triton.one/api/v1/accounts         
```

### **Headers**

All endpoints accept and return JSON, and you should pass both an Accept and Content-Type header of `application/json`


# Accounts

### **Overview**

Accounts are only used for billing. You cannot create new accounts yourself. Instead, you'll need to ask an administrator to do this for you, if you'd like to have separate billing for your subscriptions.

### List Accounts

<mark style="color:blue;">`GET /api/v1/accounts`</mark>

Returns all accounts that the current authentication token has access to.

**Parameters**

All parameters are optional.

<table><thead><tr><th width="220">Name</th><th width="216.33333333333331">Type</th><th>Description</th></tr></thead><tbody><tr><td>name</td><td><code>string</code></td><td>Will filter the results by account name, there is nothing by default</td></tr><tr><td>per</td><td><code>integer</code></td><td>Will limit the results to NN entries per page, defaults to 50</td></tr><tr><td>page</td><td><code>integer</code></td><td>Will return the results from passed page, defaults to 1</td></tr></tbody></table>

**Request**

Example requests with page filtering, number of accounts per page and filtering by name.

```url
curl 'https://customers.triton.one/api/v1/accounts' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json"
```

```url
curl 'https://customers.triton.one/api/v1/accounts?name=Account-123' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

```
curl 'https://customers.triton.one/api/v1/accounts?per=10&page=2' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

#### Response

Returns a hash with the `accounts` key containing an array of account objects and the `meta`  containing pagination data.

```json
{
   "accounts": [
      { account_object_1 },
      { account_object_2 },
      { account_object_3 },
      ...
   ],
   "meta": {
      "current_page": 1,
      "next_page": null,
      "per_page": 50,
      "prev_page": null,
      "total_pages": 1,
      "total_count": 3
   }
}
```

### Get Account

<mark style="color:blue;">`GET /api/v1/accounts/:account-uuid`</mark>

Get Account that the current authentication token has access to.

**Parameters**

`account-uuid` is the only parameter that needs to be provided.

**Request**

Example request containing `account-uuid`

```url
curl 'https://customers.triton.one/api/v1/accounts/c92a9cea-47cc-494b-b1b0-4230a2316ee5' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

#### Response

Returns a hash with the `account` key containing an account object. The response data for the account object is the same as for <mark style="color:blue;">`GET /api/v1/accounts`</mark>. Below is the sample response.

```json
{
   "account": {
      "uuid": "c92a9cea-47cc-494b-b1b0-4230a2316ee5",
      "name": "John Doe",
      "billing_address1": "1645 S Telegraph Rd",
      "billing_address2": null,
      "billing_address3": null,
      "billing_city": "Bloomfield Hills",
      "billing_state_or_province": "Michigan",
      "billing_postal_code": "48302",
      "billing_country_code": "US",
      "telephone_country_code": "US",
      "telephone": "(248) 858-2300",
      "last_time_activated":"28/06/2023",
      "is_active": true,
      "created_at": "2023-06-22T09:11:11Z",
      "updated_at": "2023-06-28T11:26:52Z",
      "users_count": 1,
      "tokens_count": 6,
      "endpoints_count": 4,
      "subscriptions_count": 2,
      "is_helio_pay_stream_active": true,
      "pay_stream_id": "639cbc90a989eacb2574a055",
      "metrics_enabled": false,
      "payment_method": "manual",
      "maximum_tokens": -1,
      "address_watch_lists": false,
      "allow_ip_ranges": false,
      "subscriptions": [
         {
            "uuid": "74ea9d9a-4b2a-4f01-af47-1c175f8a2af6",
            "name": "Mainnet Shared Subscription",
            "account_uuid": "c92a9cea-47cc-494b-b1b0-4230a2316ee5",
            "subscription_type": "mainnet-shared",
            "starts_at": null,
            "ends_at": null,
            "is_active": true,
            "endpoints_count": 2,
            "tokens_count": 4
            "supported_rate_tiers": [
               {
                  "uuid": "ca141949-a46f-446a-abee-a031e501fea0",
                  "name": "developer",
                  "active_tokens_count": 5,
                  "active_endpoints_count": 4,
                  "supported_subscription_type_uuids": [
                     "413defdd-b011-4dda-8145-fa782524284c"
                  ]
               }
            ]
         }
      ],
      "deactivation_reasons": [
         {
            "description": "Deactivation reason description",
            "created_at": "2023-06-26T20:16:05Z"
         }
      ]
   }
}
```

### **Create Account**

<mark style="color:red;">This API is only limited to account management API tokens created with the admin role.</mark>

### **Update Account**

<mark style="color:blue;">`PUT /api/v1/accounts/:account-uuid`</mark>

Update account that the current authentication token has access to.

**Parameters**

All parameters are optional unless marked as required.

<table><thead><tr><th width="311">Name</th><th width="155.33333333333331">Type</th><th>Description</th></tr></thead><tbody><tr><td>name <mark style="color:red;">*required</mark></td><td><code>string</code></td><td>A human readable display name to describe the subscription.</td></tr><tr><td>billing_address1</td><td><code>string</code></td><td></td></tr><tr><td>billing_address2</td><td><code>string</code></td><td></td></tr><tr><td>billing_address3</td><td><code>string</code></td><td></td></tr><tr><td>billing_city</td><td><code>string</code></td><td></td></tr><tr><td>billing_state_or_province</td><td><code>string</code></td><td></td></tr><tr><td>billing_postal_code</td><td><code>string</code></td><td></td></tr><tr><td>billing_country_code</td><td><code>string</code></td><td></td></tr><tr><td>telephone_country_code</td><td><code>string</code></td><td></td></tr><tr><td><p>telephone</p><p></p></td><td><code>string</code></td><td></td></tr></tbody></table>

**Request**

Request JSON (`-d` command line parameter) must contain `account` key for account object. All parameters should be placed inside.

```url
curl -X PUT 'https://customers.triton.one/api/v1/accounts/c6b8c375-27ab-4531-94f4-d8d08250fcfa' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" -d '
{
    "account": {
        "name": "John Doe",
        "billing_address1": "1645 S Telegraph Rd",
        "billing_address2": "line 2",
        "billing_address3": "line 3",
        "billing_city": "Bloomfield Hills",
        "billing_state_or_province": "Michigan",
        "billing_postal_code": "48302",
        "billing_country_code": "US",
        "telephone_country_code": "US",
        "telephone": "(248) 858-2300"
    }
}'
```

**Response**

Returns a hash with the `account` key containing an account object. The response data for account object is the same as for <mark style="color:blue;">`GET /api/v1/accounts/:account-uuid`</mark> nad <mark style="color:blue;">`GET /api/v1/accounts`</mark>

```json
{
   "account": {
      "uuid": "c92a9cea-47cc-494b-b1b0-4230a2316ee5",
      "name": "John Doe",
      "billing_address1": "1645 S Telegraph Rd",
      "billing_address2": null,
      "billing_address3": null,
      "billing_city": "Bloomfield Hills",
      "billing_state_or_province": "Michigan",
      "billing_postal_code": "48302",
      "billing_country_code": "US",
      "telephone_country_code": "US",
      "telephone": "(248) 858-2300",
      ...
      "subscriptions": [
         { subscription_object_1 },
         { subscription_object_2 },
         { subscription_object_3 },
         ...
      ],
      "deactivation_reasons": [
         { deactivation_reason_object_1 },
         { deactivation_reason_object_2 },
         { deactivation_reason_object_3 },
         ...
      ]
   }
}
```


# Address Watch Lists

<mark style="color:red;">This feature is only limited to account management API tokens created with the operator or reseller role.</mark>

### Add watch list

<mark style="color:blue;">`POST /api/v1/subscriptions/:subscription-uuid/address_watch_lists`</mark>

**Parameters**

<table><thead><tr><th width="263.3333333333333">Name</th><th>Type</th><th>Description</th></tr></thead><tbody><tr><td><code>variant</code> <mark style="color:red;">*required</mark></td><td><code>string</code></td><td>Must be either <code>collection</code> or <code>tree</code></td></tr><tr><td><code>encoded_value</code> <mark style="color:red;">*required</mark></td><td><code>string</code></td><td></td></tr></tbody></table>

### List watch lists

<mark style="color:blue;">`GET /api/v1/address_watch_lists`</mark>

**Query parameters**

| Name                | Type     | Description |
| ------------------- | -------- | ----------- |
| `variant`           | `string` |             |
| `subscription_uuid` | `string` |             |
| `subscription_type` | `string` |             |

### Delete watch list

<mark style="color:blue;">`DELETE /api/v1/address_watch_lists/:uuid`</mark>


# Subscriptions

### **Overview**

A Subscription is the primary resource, and it encapsulates all things related to the endpoints and tokens you define. This also includes a name, a start and end timestamp, and other metadata. This is one of the first resources that you should create to get started using Triton and making RPC requests. You'll need to have an account and obtain an  `account_uuid` to create a subscription.

### **List Subscriptions**

<mark style="color:blue;">`GET /api/v1/subscriptions`</mark>

Returns subscriptions that the current authentication token has access to.&#x20;

**Parameters**

All parameters are optional.

| Name               | Type      | Description                                                   |
| ------------------ | --------- | ------------------------------------------------------------- |
| subscription\_type | `string`  | Will filter the results by subscription\_type.                |
| account\_uuid      | `string`  | Will filter the results by account\_uuid.                     |
| user\_uuid         | `string`  | Will filter the results by user\_uuid.                        |
| per                | `integer` | Will limit the results to NN entries per page, defaults to 50 |
| page               | `integer` | Will return the results from passed page, defaults to 1       |

**Request**

Example requests with page filtering, number of subscriptions per page and filtering by subscription type, account uuid or user uuid.

```url
curl 'https://customers.triton.one/api/v1/subscriptions' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json"
```

```url
curl 'https://customers.triton.one/api/v1/subscriptions?subscription_type=mainnet-shared' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

```
curl 'https://customers.triton.one/api/v1/subscriptions?account_uuid=c92a9cea-47cc-494b-b1b0-4230a2316ee5' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

```
curl 'https://customers.triton.one/api/v1/subscriptions?per=10&page=2' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

#### Response

Returns a hash with the `subscriptions` key containing an array of subscriptions objects and the `meta` containing pagination data.

<pre class="language-json"><code class="lang-json">{
   "subscriptions": [
      { subscription_object_1 },
      { subscription_object_2 },
      { subscription_object_3 },
      ...
   ],
<strong>   "meta": {
</strong>      "current_page": 1,
      "next_page": null,
      "per_page": 50,
      "prev_page": null,
      "total_pages": 1,
      "total_count": 3
   }
}
</code></pre>

### Get Subscription

<mark style="color:blue;">`GET /api/v1/subscriptions/:subscription-uuid`</mark>

Get Subscription that the current authentication token has access to.

**Parameters**

`subscription-uuid` is the only parameter that needs to be provided.

**Request**

Example request containing `subscription-uuid`

```
curl 'https://customers.triton.one/api/v1/subscriptions/c92a9cea-47cc-494b-b1b0-4230a2316ee5' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

**Response**

Returns a hash with the `subscription` key containing a subscription object. The response data for subscription object is the same as for <mark style="color:blue;">`GET /api/v1/subscriptions`</mark>. Below is the sample response.

| Name                   | Type                                       | Description                                                                     |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| uuid                   | `string`                                   | The generated primary key to reference this subscription.                       |
| endpoints              | `array[{endpoint_object}, ...]`            | An array of Endpoint objects, documented in the Endpoints section.              |
| tokens                 | `array[{token_object}, ...]`               | An array of Token objects, documented in the Tokens section.                    |
| supported\_rate\_tiers | `array[{supported_rate_tier_object}, ...]` | An array of Supported Rate Tiers objects, documented in the Rate Tiers section. |
| deactivation\_reasons  | `array[{deactivation_reason_object}, ...]` | An array of Deactivation Reasons objects.                                       |

```json
{
   "subscription": {
      "uuid": "5d8d4591-12cc-424a-8f39-32de0ba6acc3",
      "name": "Example App",
      "account_uuid": "4ad26b8a-a9a1-4f9b-b0fa-c13a682d64b1",
      "subscription_type": "mainnet-shared",
      "starts_at": null,
      "ends_at": null,
      "is_active": false,
      "account": { // An account that is assigned to a given subscription
         "uuid": "4ad26b8a-a9a1-4f9b-b0fa-c13a682d64b1",
         "name": "Tyler-qt65u8xzj2",
         "billing_address1": "420 Effertz Estates",
         "billing_address2": null,
         "billing_address3": null,
         "billing_city": "Padbergville",
         "billing_state_or_province": "Alabama",
         "billing_postal_code": "78007",
         "billing_country_code": "US",
         "telephone_country_code": "+61-8",
         "telephone": "870-800-5877",
         "last_time_activated": "02/05/2023",
         "is_active": true,
         "created_at": "2023-05-02T16:32:46Z",
         "updated_at": "2023-05-02T16:32:46Z",
         "users_count": 1,
         "tokens_count": 0,
         "endpoints_count": 1,
         "subscriptions_count": 2,
         "is_helio_pay_stream_active": false,
         "pay_stream_id": "639cbc90a989eacb2574a055",
         "metrics_enabled": false,
         "payment_method": "manual",
         "maximum_tokens": -1,
         "address_watch_lists": false,
         "allow_ip_ranges": false
      },
      "supported_rate_tiers": [ // A roll-up of related supported rate tiers
         {
            "uuid": "ca141949-a46f-446a-abee-a031e501fea0",
            "name": "developer",
            "active_tokens_count": 5,
            "active_endpoints_count": 4,
            "supported_subscription_type_uuids": [
               "413defdd-b011-4dda-8145-fa782524284c"
            ]
         }
      ],
      "endpoints": [ // A roll-up of related endpoints
         {
            "uuid": "23ab660b-cb09-4ca5-b49a-518b422a8d81",
            "name": "Jacobson LLC cbp4i3u71m",
            "value": null,
            "slug": "academy-strict-fnalfmab4l",
            "rate_tier": "developer",
            "is_active": true,
            "value_override": null,
            "values": [
               "academy-strict-fnalfmab4l.TEST 1",
               "academy-strict-fnalfmab4l.TWST 2"
            ],
            "default_values": [
               "academy-strict-fnalfmab4l.TEST 1",
               "academy-strict-fnalfmab4l.TWST 2"
            ],
            "allowed_origins": [
               {
                  "id": 1,
                  "uuid": "b4d5ec62-410d-45f8-8b45-44fe6641cf1f",
                  "value": "vonrueden-haag.co",
                  "endpoint_id": 1,
                  "created_at": "2023-05-02T16:32:46Z",
                  "updated_at": "2023-05-02T16:32:46Z",
                  "is_active": true
               }
            ]
         }
      ],
      "tokens": [ // A roll-up of tokens for related Subscription, Account, & Users
         {
            "uuid": "fa2fec9c-c3e6-4625-b11f-7906dff5f37c",
            "name": "Token name",
            "value": "8d43f8dc-8aa3-4fa2-b09e-361f6af8d972",
            "rate_tier": "tier1",
            "auth_username": "tylerqt-tylerwi-db8c",
            "is_active": false
         }
      ],
      "deactivation_reasons": [
         {
            "description": "Deactivation reason description",
            "created_at": "2023-07-03T12:00:22Z"
         }
      ]
   }
}
```

### **Create Subscription**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller role.</mark>

<mark style="color:blue;">`POST /api/v1/subscriptions`</mark>

**Parameters**

| Name                                                          | Type       | Description                                                                                                                          |
| ------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| account\_uuid <mark style="color:red;">\*required</mark>      | `string`   | Primary key of the account that the subscription should belong to.                                                                   |
| subscription\_type <mark style="color:red;">\*required</mark> | `string`   | Name of the subscription type. Obtained from \<link>Subscription Types                                                               |
| name <mark style="color:red;">\*required</mark>               | `string`   | A human readable display name to describe the subscription.                                                                          |
| starts\_at                                                    | `datetime` | The scheduled timestamp for the subscription to become active. Defaults to null, which means the subscription is immediately active. |
| ends\_at                                                      | `datetime` | The timestamp for which the subscription becomes inactive. Defaults to null, which means the subscription never becomes inactive.    |

**Request**

Request JSON (`-d` command line parameter) must contain `subscription` key for a subscription object. All parameters should be placed inside.

```url
curl -X POST 'https://customers.triton.one/api/v1/subscriptions' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept: application/json" -d '
{
    "subscription": {
        "account_uuid": "c92a9cea-47cc-494b-b1b0-4230a2316ee5", // obtain from UI
        "subscription_type": "mainnet-shared",
        "name": "Example App",
        "starts_at": "2023-07-10T10:25:30Z",
        "ends_at": "2023-07-30T05:00:00Z"
    }
}'
```

**Response**

Returns a hash with the `subscription` key containing a subscription object. Note that `endpoints`, `tokens` and `deactivation_reasons` arrays are empty because this is newly created subscription. Below is the sample response.&#x20;

```json
 {
   "subscription": {
      "uuid": "5d8d4591-12cc-424a-8f39-32de0ba6acc3",
      "name":"Example App",
      "account_uuid": "4ad26b8a-a9a1-4f9b-b0fa-c13a682d64b1",
      "subscription_type": "mainnet-shared",
      "starts_at": null,
      "ends_at": null,
      "is_active": false,
      "account": {
         "uuid": "4ad26b8a-a9a1-4f9b-b0fa-c13a682d64b1",
         "name": "Tyler-qt65u8xzj2",
         "billing_address1": "420 Effertz Estates",
         "billing_address2": null,
         "billing_address3": null,
         "billing_city": "Padbergville",
         "billing_state_or_province": "Alabama",
         "billing_postal_code": "78007",
         "billing_country_code": "US",
         "telephone_country_code": "+61-8",
         "telephone": "870-800-5877",
         "last_time_activated": "02/05/2023",
         "is_active": true,
         "created_at": "2023-05-02T16:32:46Z",
         "updated_at": "2023-05-02T16:32:46Z",
         "users_count": 1,
         "tokens_count": 0,
         "endpoints_count": 1,
         "subscriptions_count": 2,
         "is_helio_pay_stream_active": false,
         "pay_stream_id": "639cbc90a989eacb2574a055",
         "metrics_enabled": false,
         "payment_method": "manual",
         "maximum_tokens": -1,
         "address_watch_lists": false,
         "allow_ip_ranges": false
      },
      "supported_rate_tiers": [
         {
            "uuid": "ca141949-a46f-446a-abee-a031e501fea0",
            "name": "developer",
            "active_tokens_count": 5,
            "active_endpoints_count": 4,
            "supported_subscription_type_uuids": [
               "413defdd-b011-4dda-8145-fa782524284c"
            ]
         }
      ],
      "endpoints_count": 0,
      "tokens_count": 0,
      "endpoints": [],
      "tokens": [],
      "deactivation_reasons": []
   }
}
 
```

### **Update Subscription**

<mark style="color:blue;">`PUT /api/v1/subscriptions/:subscription_uuid`</mark>

Update attributes like `name` on an existing Subscription that the current authentication token has access to. Any other updatable attributes for a Subscription like Endpoints and Tokens should be updated via their distinct account management APIs.

**Parameters**

| Name | Type     | Description                                                 |
| ---- | -------- | ----------------------------------------------------------- |
| name | `string` | A human readable display name to describe the subscription. |

**Request**

Request JSON (`-d` command line parameter) must contain `subscription` key for a subscription object. All parameters should be placed inside.

```url
curl -X PUT 'https://customers.triton.one/api/v1/subscriptions/c92a9cea-47cc-494b-b1b0-4230a2316ee5' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept: application/json" -d '
{
    "subscription": {
        "name": "Example App"
    }
}'
```

**Response**

Returns a hash with the `subscription` key containing a subscription object. The response data for subscription object is the same as for <mark style="color:blue;">`GET /api/v1/subscriptions/:subscription-uuid`</mark> nad <mark style="color:blue;">`GET /api/v1/subscription`</mark>

```json
{
   "subscription": {
      "name": "Example App" // subscription attributes are the same as for GET and POST 
      ...
      "supported_rate_tiers": [ // A roll-up of related supported rate tiers
         { supported_rate_tier_object_1 },
         { supported_rate_tier_object_2 },
         { supported_rate_tier_object_3 },
         ...
      ],
      "endpoints": [ // A roll-up of related endpoints
         { endpoint_object_1 },
         { endpoint_object_2 },
         { endpoint_object_3 },
         ...
      ],
      "tokens": [ // A roll-up of tokens for related Subscription, Account, & Users
         { token_object_1 },
         { token_object_2 },
         { token_object_3 },
         ...
      ],
      "deactivation_reasons": [
         { deactivation_reason_object_1 },
         { deactivation_reason_object_2 },
         { deactivation_reason_object_3 },
         ...
      ]
   }
}
```

### **Activate Subscription**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller role.</mark>

<mark style="color:blue;">`PUT /api/v1/subscriptions/:subscription_uuid/activate`</mark>

Activate a subscription so that it can be used.

**Parameters**

<mark style="color:blue;">`subscription_uuid`</mark> is the only parameter that needs to be provided.

**Request**

```url
curl -X PUT 'https://customers.triton.one/api/v1/subscriptions/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/activate' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json"
```

**Response**

```json
204 No Content
```

### **Deactivate Subscription**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller role.</mark>

<mark style="color:blue;">`PUT /api/v1/subscriptions/:subscription_uuid/deactivate`</mark>

Deactivate a subscription so that it cannot be used.

**Parameters**

All parameters are optional.

| Name                 | Type     | Description                                                       |
| -------------------- | -------- | ----------------------------------------------------------------- |
| deactivation\_reason | `string` | A human readable description to describe the deactivation reason. |

**Request**

Example request with `deactivation_reason`.

```url
curl -X PUT 'https://customers.triton.one/api/v1/subscriptions/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/deactivate' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" -d '
{
    "deactivation_reason": "Deactivation reason description"
}' 
```

**Response**

```json
204 No Content
```


# Subscription Types

### **Overview**

A Subscription Type defines what kind of pool a subscription is for. This is how endpoints are distinguished between a dedicated pool and a shared pool. It also can determine which Solana RPC environment the subscription and endpoints target.

The developer subscription is used to encapsulate the devnet and testnet Solana environments. Any endpoints or tokens created under a developer Subscription will automatically be usable for both Solana environments, typically at no cost.

### **List Subscription Types**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller role.</mark>

<mark style="color:blue;">`GET /api/v1/subscription_types`</mark>

Returns all subscription types that the current authentication token has access to.

**Parameters**

Currently, there are no parameters that would be used.

**Request**

<pre><code><strong>curl 'https://customers.triton.one/api/v1/subscription_types' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
</strong></code></pre>

**Response**

Returns all subscription types that a Subscription can get created with.

```json
{
   "subscription_types": [
      {
         "uuid": "413defdd-b011-4dda-8145-fa782524284c",
         "name": "developer",
         "pool_name": "test pool name",
         "subscriptions_count": 10,
         "endpoint_default_suffixes": [
            "TEST 1",
            "TWST 2"
         ]
      },
      {
         "uuid": "8ddbdbc8-b513-4ba5-a833-2ce8402a9c50",
         "name": "mainnet-shared",
         "pool_name": "pool name",
         "subscriptions_count": 10,
         "endpoint_default_suffixes": [
            "endpoint suffix"
         ]
      },
      {
         "uuid": "b97a3264-2c0a-4af5-85ff-14dce864afc9",
         "name": "mainnet-dedicated",
         "pool_name": "pool name",
         "subscriptions_count": 5,
         "endpoint_default_suffixes": [
            "endpoint suffix"
         ]
      }
   ]
}
```

### **Create Subscription Type / Update Subscription Type**

<mark style="color:red;">This API is only limited to account management API tokens created with the admin role.</mark>


# Endpoints

### **Overview**

An Endpoint is what clients will call to consume the RPC. Endpoints belong to a Subscription, which holds its metadata. An endpoint's name is assigned to you when it's created and is randomly assigned.

### List Endpoints

<mark style="color:blue;">`GET /api/v1/endpoints`</mark>

Returns all endpoints to which the current authentication token has access.

**Parameters**

<table><thead><tr><th width="220">Name</th><th width="216.33333333333331">Type</th><th>Description</th></tr></thead><tbody><tr><td>account_uuid  <mark style="color:red;">*</mark></td><td><code>string</code></td><td>Will filter the results by account_uuid.</td></tr><tr><td>subscription_uuid <mark style="color:red;">*</mark></td><td><code>string</code></td><td>Will limit the results by subscription_uuid.</td></tr></tbody></table>

<mark style="color:red;">\* Either a</mark> <mark style="color:red;"></mark><mark style="color:red;">`subscription_uuid`</mark> <mark style="color:red;"></mark><mark style="color:red;">or</mark> <mark style="color:red;"></mark><mark style="color:red;">`account_uuid`</mark> <mark style="color:red;"></mark><mark style="color:red;">parameter is required</mark>

**Request**

Example requests with account\_uuid and subscription\_uuid filtering.

```url
curl 'https://customers.triton.one/api/v1/endpoints?account_uuid=c92a9cea-47cc-494b-b1b0-4230a2316ee5' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

```
curl 'https://customers.triton.one/api/v1/endpoints?subscription_uuid=74ea9d9a-4b2a-4f01-af47-1c175f8a2af6' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

#### Response

Returns a hash with the `endpoints` key containing an array of endpoints objects.

```json
{
   "endpoints": [
      {
         "uuid": "23ab660b-cb09-4ca5-b49a-518b422a8d81",
         "name": "Jacobson LLC cbp4i3u71m",
         "value": null,
         "slug": "academy-strict-fnalfmab4l",
         "rate_tier": "developer",
         "is_active": true,
         "value_override": null,
         "values": [
            "academy-strict-fnalfmab4l.TEST 1",
            "academy-strict-fnalfmab4l.TWST 2",
            "academy-strict-fnalfmab4l.value-3"
         ],
         "default_values": [
            "academy-strict-fnalfmab4l.TEST 1",
            "academy-strict-fnalfmab4l.TWST 2",
            "academy-strict-fnalfmab4l.value-3"
         ],
         "allowed_origins": [
            {
               "uuid": "b4d5ec62-410d-45f8-8b45-44fe6641cf1f",
               "value": "vonrueden-haag.co",
               "is_active": true
            }
         ],
         "deactivation_reasons": [
            {
               "description": "Deactivation reason description",
               "created_at": "2023-06-26T20:16:05Z"
            }
         ]
      },
      { endpoint_object_2 },
      { endpoint_object_3 },
      ...
   ]
}
```

### **Get Endpoint**

<mark style="color:red;">This API is not available.</mark>

### **Create Endpoint**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller role.</mark>

<mark style="color:blue;">`POST /api/v1/subscriptions/:subscription_uuid/endpoints`</mark>

**Parameters**

| Name                                                  | Type                                                | Description                                                                                                                                                |
| ----------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name <mark style="color:red;">\*required</mark>       | `string`                                            | A human-readable name to describe the endpoint.                                                                                                            |
| rate\_tier <mark style="color:red;">\*required</mark> | `string`                                            | The name of the Rate Tier for this endpoint, which defines rate limits on the Endpoint. Each endpoint incurs costs based on the Rate Tier defined for it.  |
| allowed\_origins                                      | `array[{ value: dns_cname }, { value: dns_cname }]` | An array of DNS CNAME records that define origins that can access the endpoint. This is commonly used by frontends that can't obscure an API access token. |

**Request**

Example requests with account\_uuid and subscription\_uuid filtering. All new allowed origins are automatically enabled.

```url
curl -X POST 'https://customers.triton.one/api/v1/subscriptions/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/endpoints' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" -d '
{
    "endpoint": {
        "name": "Endpoint 123",
        "rate_tier": "developer",
        "allowed_origins":  [{ value: "example.com" }, { value: "frontend.website.com" }]
    }
}' 
```

**Response**

All submitted keys, plus the following are returned:

| Name   | Type                             | Description                                                              |
| ------ | -------------------------------- | ------------------------------------------------------------------------ |
| uuid   | `string`                         | The generated primary key to reference this endpoint.                    |
| values | `array[string (DNS CNAME), ...]` | The endpoint values that should be called by clients to consume the RPC. |

```json
{
   "endpoint": {
      "uuid": "a5131884-1ce4-4415-98f8-d040901ecbd0",
      "name": "Endpoint 123",
      "slug": "tylerqt-example-3c6e",
      "rate_tier": "developer",
      "is_active": false,
      "value_override": null,
      "values": [
         "tylerqt-example-3c6e.TEST 1",
         "tylerqt-example-3c6e.TWST 2",
         "tylerqt-example-3c6e.value-3"
      ],
      "default_values": [
         "tylerqt-example-3c6e.TEST 1",
         "tylerqt-example-3c6e.TWST 2",
         "tylerqt-example-3c6e.value-3"
      ],
      "allowed_origins": [
         {
            "uuid": "4d63807d-84f2-491c-898e-9190fa334592",
            "value": "example.com",
            "is_active": true
         },
         {
            "uuid": "a21d362b-f488-4778-8e5c-d3c917efd764",
            "value": "frontend.website.com",
            "is_active": true
         }
      ],
      "deactivation_reasons": []
   }
}    
```

### **Update Endpoint**

<mark style="color:blue;">`PUT /api/v1/endpoints/:endpoint_uuid`</mark>

Update an endpoint. Only allowed\_origins can be updated. Accepts updates as full-updates, where the passed in list overwrites any existing allowed\_origins.

**Parameters**

| Name                                                                                                    | Type                                                                                        | Description                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name                                                                                                    | `string`                                                                                    | A human-readable name to describe the endpoint.                                                                                                                           |
| rate\_tier <mark style="color:red;">\*limited to REST API tokens created with the reseller role.</mark> | `string`                                                                                    | A Rate Tier name. It's assigned to an Endpoint in order to determine how much the endpoint costs                                                                          |
| allowed\_origins <mark style="color:red;">\*limited to one allowed origin for standard role.</mark>     | `array[{ value: dns_cname, is_active: boolean }, { value: dns_cname, is_active: boolean }]` | An array of DNS CNAME and is\_active records that define origins that can access the endpoint. This is commonly used by frontends that can't obscure an API access token. |

**Request**

Example requests with account\_uuid and subscription\_uuid filtering.

```url
curl -X PUT 'https://customers.triton.one/api/v1/endpoints/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" -d '
{
    "endpoint": {
        "name": "Endpoint 123",
        "rate_tier": "developer",
        "allowed_origins": [{ value: "example.com", is_active: true }, { value: "frontend.website.com", is_active: true }]
    }
}' 
```

**Response**

All submitted keys, plus the following are returned:

| Name   | Type                             | Description                                                              |
| ------ | -------------------------------- | ------------------------------------------------------------------------ |
| uuid   | `string`                         | The generated primary key to reference this endpoint.                    |
| values | `array[string (DNS CNAME), ...]` | The endpoint values that should be called by clients to consume the RPC. |

```json
{
   "endpoint": {
      "uuid": "6ec86e74-783b-4779-b626-937a5c1e2a89",
      "name": "New Endpoint Name",
      "value": null,
      "slug": "tylerqt-example-f988",
      "rate_tier": "developer",
      "is_active": false,
      "value_override": null,
      "values": [
         "tylerqt-example-f988.TEST 1",
         "tylerqt-example-f988.TWST 2",
         "tylerqt-example-f988.value-3"
      ],
      "default_values": [
         "tylerqt-example-f988.TEST 1",
         "tylerqt-example-f988.TWST 2",
         "tylerqt-example-f988.value-3"
      ],
      "allowed_origins": [
         {
            "uuid": "32d511f0-3fb0-4570-8922-f8bc988b41a1",
            "value": "example.com",
            "is_active": true
         }
      ],
      "deactivation_reasons": [
          {
            "description": "Deactivation reason description",
            "created_at": "2023-07-03T12:00:22Z"
         }
      ]
   }
}
```

### **Activate Endpoint**

<mark style="color:red;">This API is only limited to accoutn management API tokens created with the reseller role.</mark>

<mark style="color:blue;">`PUT /api/v1/endpoints/:endpoint_uuid/activate`</mark>

Activate an endpoint so that it can be used.

**Parameters**

<mark style="color:blue;">`endpoint_uuid`</mark> is the only parameter that needs to be provided.

**Request**

```url
curl -X PUT 'https://customers.triton.one/api/v1/endpoints/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/activate' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json"
```

**Response**

```json
204 No Content
```

### **Deactivate Endpoint**

<mark style="color:red;">This API is only limited to account managemrnt API tokens created with the reseller role.</mark>

<mark style="color:blue;">`PUT /api/v1/endpoints/:endpoint_uuid/deactivate`</mark>

Deactivate an endpoint so that it cannot be used.

**Parameters**

All parameters are optional.

| Name                 | Type     | Description                                                       |
| -------------------- | -------- | ----------------------------------------------------------------- |
| deactivation\_reason | `string` | A human readable description to describe the deactivation reason. |

**Request**

Example request with optional `deactivation_reason`.

```url
curl -X PUT 'https://customers.triton.one/api/v1/endpoints/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/deactivate' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" -d '
{
    "deactivation_reason": "Deactivation reason description"
}' 
```

**Response**

```json
204 No Content
```


# Tokens

### **Overview**

Create private access tokens to allow your backend services to make authenticated RPC requests to an Endpoint. This allows you to make requests from any backend origin.

<mark style="color:red;">This token is private information and should never be exposed on a front-end.</mark>

On the load balancers, we support "user:password" style basic authentication if you need to use that form of auth. In those cases, the password is the token. The token\_user is randomly generated, so every token has a unique user.

### List Tokens

<mark style="color:blue;">`GET /api/v1/tokens`</mark>

Returns all tokens that the current authentication token has access to.

**Parameters**

<table><thead><tr><th width="220">Name</th><th width="216.33333333333331">Type</th><th>Description</th></tr></thead><tbody><tr><td>account_uuid  <mark style="color:red;">*</mark></td><td><code>string</code></td><td>Will filter the results by account_uuid.</td></tr><tr><td>subscription_uuid <mark style="color:red;">*</mark></td><td><code>string</code></td><td>Will limit the results by subscription_uuid.</td></tr><tr><td>per</td><td><code>string</code></td><td></td></tr><tr><td>page</td><td><code>string</code></td><td></td></tr></tbody></table>

<mark style="color:red;">\* Either a</mark> <mark style="color:red;"></mark><mark style="color:red;">`subscription_uuid`</mark> <mark style="color:red;"></mark><mark style="color:red;">or</mark> <mark style="color:red;"></mark><mark style="color:red;">`account_uuid`</mark> <mark style="color:red;"></mark><mark style="color:red;">parameter is required</mark>

**Request**

Example requests with page filtering, number of tokens per page and filtering by account uuid and subscription uuid.

```url
curl 'https://customers.triton.one/api/v1/tokens?account_uuid=c92a9cea-47cc-494b-b1b0-4230a2316ee5' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

<pre><code><strong>curl 'https://customers.triton.one/api/v1/tokens?subscription_uuid=74ea9d9a-4b2a-4f01-af47-1c175f8a2af6' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
</strong></code></pre>

```
curl 'https://customers.triton.one/api/v1/tokens?per=10&page=2&subscription_uuid=74ea9d9a-4b2a-4f01-af47-1c175f8a2af6' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" 
```

#### Response

Returns a hash with the `tokens` key containing an array of tokens objects and the `meta` containing pagination data.

```json
{
   "tokens": [
      {
         "uuid": "fa2fec9c-c3e6-4625-b11f-7906dff5f37c",
         "name": "token-name",
         "value": "8d43f8dc-8aa3-4fa2-b09e-361f6af8d972",
         "rate_tier": "tier1",
         "auth_username": "tylerqt-tylerwi-db8c",
         "is_active": false,
         "deactivation_reasons": [      
         ]
      },
      { token_object_2 },
      { token_object_3 },
      ...
   ],
   "meta": {
      "current_page": 1,
      "next_page": null,
      "per_page": 10,
      "prev_page": null,
      "total_pages": 1,
      "total_count": 1
   }
}
```

### **Get Token**

<mark style="color:red;">This API is not available.</mark>

### **Create Token**

<mark style="color:blue;">`POST /api/v1/subscriptions/:subscription_uuid/tokens`</mark>

Add a new token that can be used to access the Subscription's Endpoints

**Parameters**

| Name                                                  | Type     | Description                                                                                                                                       |
| ----------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| name <mark style="color:red;">\*required</mark>       | `string` | A human readable name to describe the token.                                                                                                      |
| rate\_tier <mark style="color:red;">\*required</mark> | `string` | The name of the \<link>Rate Tier for this token, which defines rate limits for it. Each token incurs costs based on the Rate Tier defined for it. |

**Request**

Example requests with account\_uuid and subscription\_uuid filtering.

```url
curl -X POST 'https://customers.triton.one/api/v1/subscriptions/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/tokens' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" -d '
{
    "token": {
        "name": "Token 123",
        "rate_tier": "developer" 
    }
}' 
```

**Response**

All submitted keys, plus the following are returned:

| Name           | Type     | Description                                                                |
| -------------- | -------- | -------------------------------------------------------------------------- |
| uuid           | `string` | The generated primary key to reference this token.                         |
| auth\_username | `string` | A randomly generated value that can be for basic authentication if needed. |
| value          | `string` | The value used for authentication.                                         |

```json
{
   "token":  {
      "uuid": "b51e9812-ece9-4cb0-81f1-0c4bbdc8a3b7",
      "name": "Token 123",
      "value": "b4274ebd-e2f5-46fd-8e99-8aff8f9f4a85",
      "rate_tier": "developer",
      "auth_username": "tylerqt-example-73d1",
      "is_active": false,
      "deactivation_reasons": []
   }
}
```

### **Activate Token**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller and operator role.</mark>

<mark style="color:blue;">`PUT /api/v1/tokens/:token_uuid/activate`</mark>

Activate a token so that it can be used.

**Parameters**

<mark style="color:blue;">`token_uuid`</mark> is the only parameter that needs to be provided.

**Request**

```url
curl -X PUT 'https://customers.triton.one/api/v1/tokens/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/activate' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json"
```

**Response**

```json
204 No Content
```

### **Deactivate Token**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller and operator role.</mark>

<mark style="color:blue;">`PUT /api/v1/tokens/:token_uuid/deactivate`</mark>

Deactivate a token so that it cannot be used.

**Parameters**

All parameters are optional.

| Name                 | Type     | Description                                                       |
| -------------------- | -------- | ----------------------------------------------------------------- |
| deactivation\_reason | `string` | A human readable description to describe the deactivation reason. |

**Request**

Example request with `deactivation_reason`.

```url
curl -X PUT 'https://customers.triton.one/api/v1/tokens/74ea9d9a-4b2a-4f01-af47-1c175f8a2af6/deactivate' -H "Authorization: secret-api-token" -H "Content-Type: application/json" -H "Accept:application/json" -d '
{
    "deactivation_reason": "Deactivation reason description"
}' 
```

**Response**

```json
204 No Content
```


# Rate limits

### **Overview**

A rate limit caps how many requests per second an endpoint accepts. Triton enforces it per IP across all nodes to keep endpoints stable and protect against abusive traffic&#x20;

Our goal is to allow legitimate application traffic to flow smoothly while mitigating the impact of aggressive bots.

Endpoints authenticated with a token get a more favourable rate limit than endpoints restricted by allowed origins, since tokens are typically used by backend servers (many users per IP) and allowed origins by browsers (one user per IP).

Rate limits do not affect pricing. Our products are billed by usage (per million requests plus per GB of bandwidth).

### **Get rate limits**

<mark style="color:red;">This API is only limited to account management API tokens created with the reseller role.</mark>

<mark style="color:blue;">`GET /api/v1/rate_tiers`</mark>

Returns all Rate Tier types that an Endpoint and Token can get created with.

```json
{
  "rate_tiers": [
    { "name": "free" },
    { "name": "tier1" },
    { "name": "tier2" },
    { "name": "tier3" },
    { "name": "dedi" }
  ]
} 
```


# Introduction

Our Pro Trading Centers (PTC) in Amsterdam and Tokyo allow you to trade on Solana with the lowest possible read & write latency. All RPC servers in our Pro Trading Centers receive incoming shred streams from well-staked validators. Also, transactions are routed through the validators for full access to QUIC ports on the Solana cluster.

With Yellowstone gRPC Geyser streams, you can build trading software that reacts to blockchain events up to 400 milliseconds faster than standard RPC services. The fastest traders in the ecosystem are using Geyser.

We also offer, via our partners, bare-metal servers for you to run your trading software. Your trading server will be directly connected to the same rack as the RPC nodes. When you co-locate your trading server in our PTCs, you never need to make a network request outside the data center until you send your transaction to the validators.


# Shred streaming

RPC nodes in the trading centers have shred streaming enabled, meaning they receive incoming shreds faster than typical RPC nodes.

Unstaked nodes (RPC nodes) are generally last in Solana's fanout schedule for block data. We can use shred streams to ensure that the RPC node receives the data as soon as any of the other nodes in our data centers.&#x20;

This is enabled by having highly staked validators that can forward shreds. These staked validators typically end up in the first round in the fanout schedule.&#x20;


# Transaction prioritisation

The new QUIC protocol for Solana transactions introduces a limited number of connection slots and rate limits for anonymous and un-staked RPC nodes. This means that an un-staked node might see slower transaction propagation during periods of high contention.

On the network layer, we can forward your transactions via staked nodes to increase the bandwidth to all QUICports, ensuring your transaction reaches the validator. With access to all QUIC bandwidth, your RPC node will not be rate-limited.

We also recommend adding TX prioritization fees or utilizing systems like Jito for your transaction forwarding; these work together with our TX prioritization to improve your transaction speed during network contention.


# Introduction

We provide multiple APIs that support traders. These APIs operate on different chains and provide facilities to make trading in the DeFI space easier.


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


# Bundle simulation with Jito

Triton offers support for **Jito RPC for all plans**. This primarily gives access to the improved simulation support that Jito offers and allows you to simulate bundles of transactions.

> 🔧 Note: Triton One provides the Jito-enabled RPC node only. It is the customer's responsibility to have their IP whitelisted with Jito’s Block Engine in order to use certain features.

The `sendBundle` method is a Jito-exclusive RPC call and requires an active connection to the Jito Block Engine.

<br>

### Resources

* 🔍 [Jito Searcher Examples](https://github.com/jito-labs/searcher-examples)
* 📄 [Jito Documentation – Low Latency Transactions](https://docs.jito.wtf/lowlatencytxnsend)

<br>

### simulateBundle

<mark style="color:green;">`POST`</mark> `https://xyz.mainnet.rpcpool.com/`

Simulates a transaction bundle.

#### Request Body

| Name                                           | Type   | Description                                                                                                                                       |
| ---------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| transactions<mark style="color:red;">\*</mark> | Vector | List of transactions to simulate.                                                                                                                 |
| config                                         | Object | (optional) Object of type RpcSimulateBundleConfig, provide configuration for the transaction simulation. See description of this parameter below. |

{% tabs %}
{% tab title="200: OK JSON RPC response body (RpcSimulateBundleResult)" %}
Returns a JSON RPC response corresponding to the following Rust struct:

```
pub struct RpcSimulateBundleResult {
    pub summary: RpcBundleSimulationSummary,
    pub transaction_results: Vec<RpcSimulateBundleTransactionResult>,
}

pub enum RpcBundleSimulationSummary {
    /// error and offending transaction signature if applicable
    Failed {
        error: RpcBundleExecutionError,
        tx_signature: Option<String>,
    },
    Succeeded,
}

pub enum RpcBundleExecutionError {
    #[error("The bank has hit the max allotted time for processing transactions")]
    BankProcessingTimeLimitReached,

    #[error("Error locking bundle because a transaction is malformed")]
    BundleLockError,

    #[error("Bundle execution timed out")]
    BundleExecutionTimeout,

    #[error("The bundle exceeds the cost model")]
    ExceedsCostModel,

    #[error("Invalid pre or post accounts")]
    InvalidPreOrPostAccounts,

    #[error("PoH record error: {0}")]
    PohRecordError(String),

    #[error("Tip payment error: {0}")]
    TipError(String),

    #[error("A transaction in the bundle failed to execute: [signature={0}, error={1}]")]
    TransactionFailure(Signature, String),
}

pub struct RpcSimulateBundleTransactionResult {
    pub err: Option<TransactionError>,
    pub logs: Option<Vec<String>>,
    pub pre_execution_accounts: Option<Vec<UiAccount>>,
    pub post_execution_accounts: Option<Vec<UiAccount>>,
    pub units_consumed: Option<u64>,
    pub return_data: Option<UiTransactionReturnData>,
}
```

{% endtab %}
{% endtabs %}

<details>

<summary>RpcSimulateBundleConfig: Bundle configuration</summary>

You can pass an optional configuration parameter when simulating bundle. The optional configuration takes the following format:

```
pub struct RpcSimulateBundleConfig {
    /// Gives the state of accounts pre/post transaction execution.
    /// The length of each of these must be equal to the number transactions.   
    pub pre_execution_accounts_configs: Vec<Option<RpcSimulateTransactionAccountsConfig>>,
    pub post_execution_accounts_configs: Vec<Option<RpcSimulateTransactionAccountsConfig>>,

    /// Specifies the encoding scheme of the contained transactions.
    pub transaction_encoding: Option<UiTransactionEncoding>,

    /// Specifies the bank to run simulation against.
    pub simulation_bank: Option<SimulationSlotConfig>,

    /// Opt to skip sig-verify for faster performance.
    #[serde(default)]
    pub skip_sig_verify: bool,

    /// Replace recent blockhash to simulate old transactions without resigning.
    #[serde(default)]
    pub replace_recent_blockhash: bool,
}

pub struct RpcSimulateTransactionAccountsConfig {
    pub encoding: Option<UiAccountEncoding>,
    pub addresses: Vec<String>,
}

pub enum SimulationSlotConfig {
    /// Simulate on top of bank with the provided commitment.
    Commitment(CommitmentConfig),

    /// Simulate on the provided slot's bank.
    Slot(Slot),

    /// Simulates on top of the RPC's highest slot's bank i.e. the working bank.
    Tip,
}
```

</details>


# Metis Swap API

The Metis Swap API (formerly known as Jupiter Swap API) is available for all customers with an active Solana Subscription.

To utilise Triton One's self-hosted Metis Swap API Binary, you do not need to have any $JUP tokens staked; Triton One has got you covered.

### What is Metis?

Metis is Jupiter's routing and quote engine that brings the power of Jupiter's routing directly to your infrastructure. It scans 20+ DEXes and AMMs across Solana's DeFi ecosystem, calculates optimal routes, splits trades when beneficial, and builds ready-to-sign swap transactions.

#### Key Features

* **Liquidity aggregation**: Combines liquidity from multiple AMMs and DEXes into a single route
* **Platform fees**: Support for platform fees directly in the quote API - set your fee wallet and pass a platform fee parameter
* **ExactOut mode**: Perfect for payment flows where you need to receive an exact output amount (e.g., accepting many tokens but settling in USDC)
* **Circular arbitrage:** Triton enables circular arbitrage routes (e.g. USDC → token → USDC), which are disabled on Jupiter's public API by default

#### Use Cases

Metis API on Triton can power:

* Wallets with simple swap functionality
* Payment gateways that accept many tokens and settle in a single asset
* Trading bots and arbitrage systems (incl. circular arbitrage strategies)
* DEX frontends with clean swap flows

### Getting Started

To start using the Metis Swap API, use the following pathing in your code:

```bash
curl 'https://<endpoint>.rpcpool.com/<private_token>/metis/quote?
```

#### Example Request

```bash
curl 'https://endpoint.rpcpool.com/private_token/metis/quote?\
inputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&\
outputMint=So11111111111111111111111111111111111111112&\
amount=1000000&\
slippageBps=50'
```

### Pricing

The self-hosted Metis Swap API uses metered billing and is not rate-limited.

The price per million Metis queries is $80. There are no rate limits to using this API; therefore, it is recommended to monitor your usage to prevent unexpected costs.

### Availability

Metis Swap API is available for all customers with an active Solana Subscription, on both shared RPC pools and dedicated nodes.

### Executing a Swap

After getting a quote from the <mark style="color:$success;">`/quote`</mark> endpoint, you can execute the swap:

1. **Get a Quote**: Use the <mark style="color:$success;">`/quote`</mark> endpoint (as shown in the example above)
2. **Get Swap Instructions**: Use the response to build your swap transaction
3. **Sign and Send**: Sign the transaction with your wallet and submit to the network

The Metis API builds ready-to-sign swap transactions for you.

#### Example Flow

```bash
# Step 1: Get a quote
curl 'https://endpoint.rpcpool.com/private_token/metis/quote?inputMint=...&outputMint=...&amount=...'

# Step 2: Use the quote response to execute the swap
# (See full documentation for swap endpoint details)
```

For complete details on executing swaps, including the <mark style="color:$success;">`/swap`</mark> and <mark style="color:$success;">`/swap-instructions`</mark> endpoints, refer to the Metis documentation.

### API Documentation

To understand how to use the binary, please refer to the Metis docs at <https://metis.builders/docs/get-quote>.

Read more: <https://blog.triton.one/metis-api-for-solana-swaps-is-live-on-triton/>

<br>


# Titan Swap API

The Titan Swap API is available for all customers with an active Solana Subscription.

### What is Titan?

The Titan Swap API allows you to stream price updates in real-time. The Argos routing engine serves as a meta-aggregator, sourcing data from multiple DEX aggregators and RFQ sources.

Titan Prime offers a unique websocket implementation that streams quote information. This significantly lowers latency and allows front-ends to update prices in real-time without overwhelming the server with HTTP requests.

#### Key Features

* **Real-time** **Streaming**: WebSocket implementation for continuous live price updates
* **Meta-Aggregator**: Sources from multiple DEX aggregators and RFQ sources to minimize slippage
* **Low Latency**: Stream quotes faster than REST polling
* **Dynamically Allocated Real Time Routing:** [DART](https://titan-exchange.gitbook.io/titan/developer-doc/dart-swap-api/overview) dynamically re-optimizes trades at the exact moment of execution, not just at quote time — guaranteeing best execution when it matters most.

#### Use Cases

Titan Swap API is ideal for:

* Trading interfaces requiring real-time price updates
* Price monitoring dashboards
* Trading bots that need low-latency price feeds
* Wallets with live swap pricing

### Getting Started

To access the Titan Swap API through Triton One, use the following pathing:

```
wss://<your-endpoint>.rpcpool.com/<your-token>/titan/api/v1/ws
```

Please make sure you use <mark style="color:$success;">`wss://`</mark> and not <mark style="color:$success;">`https://`</mark> as this is a websocket-based service.

#### Example Connection

```javascript
const ws = new WebSocket('wss://your-endpoint.rpcpool.com/your-token/titan/api/v1/ws');
ws.onopen = () => {
  console.log('Connected to Titan Swap API');
};
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Price update:', data);
};
```

### Executing a Swap

When you receive quote updates via the WebSocket stream, each quote contains swap route information:

1. **Connect to WebSocke**t: Establish connection (as shown above)
2. **Request Swap Quotes**: Send a <mark style="color:$success;">`NewSwapQuoteStream`</mark> request with your swap parameters
3. **Receive Quote Stream**: Get continuous updates with the best routes from multiple providers
4. **Select a Quote**: Choose the best quote based on your criteria (price, provider, etc.)
5. **Execute**: The quote contains either:

* **Instructions**: Build and sign a transaction with the provided instructions
* **Transaction**: A ready-to-sign transaction that you can directly sign and submit

Each <mark style="color:$success;">`SwapRoute`</mark> in the stream includes all the data needed to execute the swap.

For complete details on the request/response format and executing swaps from streaming quotes, refer to the official documentation.

### Pricing

The cost for using streaming services with Triton One is $0.05 per GB.

### Availability

Titan Swap API is available for all customers with an active Solana Subscription, on both shared RPC pools and dedicated nodes.

### API Documentation

To learn about how to use the Titan Swap API, please refer to the Titan Swap API docs here: <https://titan-exchange.gitbook.io/titan/titan-developer-docs/apis/swap-api#websocket-connections>

A TypeScript SDK is also available: <https://www.npmjs.com/package/@titanexchange/sdk-ts>

Read more: <https://blog.triton.one/titan-prime-api-for-solana-swaps-is-live-on-triton/>

<br>

<br>


# Introduction

Running a validator helps protect and decentralize the Solana network and earns continued rewards through the stake you can attract to your validator.

Our hosted validators utilize the infrastructure we have built over time as a top RPC provider and running validators on the Solana network.

On the validators we run, we ensure:

* Access by a limited team.
* Node identity keys in-memory only.
* 24/7 monitoring to ensure consistent voting.

Triton One owns the validator identity key. You or your team control the vote account withdrawal authority. Control over the withdrawal authority means you have complete control over the vote account.

Before you commit to running a validator, you should make sure that:

1. You are willing to fund vote fees until you have attracted enough stake to break even; this is approximately 1 SOL/day.
2. You can attract enough delegations to break even (TX fees - voting expenses) and make a profit eventually. Currently, this is in the range of 375 000 delegated SOL.

If you merely wish to access staking rewards, you can also stake with existing validators without running your own; see [https://validators.app](https://validators.app/) for details about existing validators and stake pools.

Validators deployed through Triton are compatible with all current Solana validator clients that adhere to protocol specifications. The choice of client is left entirely to the validator owner. Triton monitors compatibility and vote performance across supported clients, which include:

* Agave – the official reference implementation of the Solana validator, maintained by (Anza)(<https://anza.xyz/>) . Agave is feature-complete and receives all protocol updates first, serving as the baseline for all other clients.
* Jito-Solana – a fork of Agave maintained by (Jito Labs)(<https://jito.network/>), integrating an MEV auction system. This client allows validators to receive transaction bundles from a private relay and earn additional rewards through MEV tips, with minimal configuration overhead.
* Paladin – a fork of Jito-Solana maintained by the (Paladin)(<https://www.paladin.one/>) team. It offers stricter bundle filtering and supports a protected transaction pathway that mitigates frontrunning and sandwich attacks. It is designed to improve fairness in MEV distribution while remaining fully compatible with Solana’s consensus.
* Frankendancer – a hybrid validator client maintained by (Jump Crypto)(<https://jumpcrypto.com/firedancer/>), combining a Firedancer networking and block ingestion stack with consensus execution provided by Agave. It is engineered for high performance and low-latency block processing and is already in production on mainnet with active participation.

Each of these clients is capable of full validator participation. Triton validates client behavior continuously to ensure correct protocol operation.

To participate in the Triton SWQoS – Cascade Routing Layer, which provides a prioritized stream of transactions and the opportunity to generate additional revenue, non-triton validators must configure their infrastructure to accept authenticated traffic from Triton’s transaction distribution layer. This system is opt-in and compatible with supported clients. For configuration and operational details, see: (Providing Transaction Bandwidth)(<https://docs.triton.one/chains/solana/cascade/providing-transaction-bandwidth>)


# Vote account setup

NOTE: Should we host your validator, we will set up the vote account for you. The information below is for transparency and educational purposes.

To set up a validator, three kinds of keys need to be present:

* Node identity key pair.
* Vote key/account (public key only).
* Withdrawal key pair.

### Node Identity Key Pair

The node identity key pair is owned and held by Triton. Clients guarantee a minimum balance of 10 SOL to keep the validator running. If the balance drops below 10 SOL, the client must send SOL directly to the validator. Contact our support to receive the validator public key if you are creating your vote account.

### Withdrawal Key Pair

The withdrawal key pair is the one that can be used to modify the vote account; it must be kept safe! You use this key pair to withdraw rewards from the vote account. We recommend you keep this in a hardware wallet or cold storage. This should never be a hotkey or used with online/web wallets. Losing the keys to this account may result in significant losses.

To create a withdrawal key pair, you can run the following:

```
solana-keygen new -o ~/authorized-withdrawer-keypair.json
```

### Vote account

The final step involves setting up the vote account. You will generate a keypair for the vote account, but once it is configured, only the public key of the vote account matters. The withdrawal keypair is the one that will be used to control the vote account:

```
$ solana-keygen new -o ~/vote-account-keypair.json
$ solana create-vote-account ~/vote-account-keypair.json <pubkey for node identity> ~/authorized-withdrawer-keypair.json
```

### Further reading

For more documentation about vote account management, we strongly encourage you to read through the documents on Solana's website here:

{% embed url="<https://docs.solana.com/running-validator/vote-accounts>" %}


# Node identity protection

The public-private key pair of the node identity enables the node to vote on behalf of your vote account. We hold this key pair and deploy it to the node.&#x20;

This key pairs account must have a sufficient balance to pay voting fees. This key also accrues rewards that help to offset vote fees (or entirely cover them, depending on stake). Therefore, the balance of the node identity may need to be maintained and topped up regularly.

The node identity must be kept safe and secure. Anyone possessing the node identity could set up a second validator that creates issues for your primary validator (and, in the future, potentially slashing). Malicious parties could also receive the rewards the key accrues or empty its balance.

To protect the node identity, we adopt a setup that ensures in-memory-only keys. When our validators boot, they use a temporary node identity that cannot vote for your vote account. This means that once the validator has started up and caught up with the network, it will be in voting-disabled mode.&#x20;

One of our node operators will then authenticate with our secured, encrypted secret storage and enable the validator node to perform a one-time fetch of the real node identity, which is then activated in the Solana validator's memory.&#x20;

This ensures that the node identity is never stored in an unencrypted form anywhere. It is also never transferred anywhere between the validator node and our encrypted storage. This transit of the node key happens over an entirely authenticated and encrypted stream.

Without access to the validator memory space, you would be unable to retrieve the node identity, and there is no durable storage of the identity on the node itself.


# NGINX proxy

For your pythd to communicate with our servers over an encrypted channel, it is recommended that you set up an NGINX proxy. This also allows for token authentication, meaning we do not need to manually maintain IP whitelists for your nodes. Sample NGINX configurations have been provided by the Pyth team:

```nginx
# replace YOUR_NODE and YOUR_AUTH_TOKEN_HERE
# docker run -v /path/to/nginx-triton1.conf:/etc/nginx/nginx.conf:ro -p 7899:7899 -p 7900:7900 -d docker.io/nginx

worker_processes 1;

events {}

http {
  include /etc/nginx/mime.types;

  rewrite_log on;

  keepalive_requests 2147483647; # int32 max

  client_max_body_size 0;

  # Pythnet, listening on ports 7799:7800
  upstream pythnet_backend {
    server YOUR_PYTHNET_NODE.rpcpool.com:443;
    keepalive 4;
  }
  server {
    listen 7800;
    location / {
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "Upgrade";
      proxy_pass https://pythnet_backend/YOUR_PYTHNET_AUTH_TOKEN_HERE/;
      proxy_set_header Host YOUR_PYTHNET_NODE.rpcpool.com;
    }
  }
  server {
    listen 7799;
    location / {
      proxy_http_version 1.1;
      proxy_set_header Connection "";
      proxy_pass https://pythnet_backend/YOUR_PYTHNET_AUTH_TOKEN_HERE/;
      proxy_set_header Host YOUR_PYTHNET_NODE.rpcpool.com;
    }
  }

  # Solana Mainnet, listening on ports 7899:7900
  upstream mainnet_backend {
    server YOUR_MAINNET_NODE.rpcpool.com:443;
    keepalive 4;
  }
  server {
    listen 7900;
    location / {
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "Upgrade";
      proxy_pass https://mainnet_backend/YOUR_MAINNET_AUTH_TOKEN_HERE/;
      proxy_set_header Host YOUR_MAINNET_NODE.rpcpool.com;
    }
  }
  server {
    listen 7899;
    location / {
      proxy_http_version 1.1;
      proxy_set_header Connection "";
      proxy_pass https://mainnet_backend/YOUR_MAINNET_AUTH_TOKEN_HERE/;
      proxy_set_header Host YOUR_MAINNET_NODE.rpcpool.com;
    }
  }
}

```

Source: \
<https://github.com/pyth-network/pyth-client/blob/main/doc/example-nginx-triton1.conf>


# Testnet, Devnet and Pythnet

{% hint style="danger" %}
Pyth DAO has announced the deprecation of Pyth Core on July 31st, 2026. As of July 30th, 2026, Triton One Pythnet and Hermes endpoints will stop serving data — see [Pyth price feeds](https://www.pyth.network/price-feeds) for direct integration.
{% endhint %}

On Pyth publisher nodes, we provide particular ports that you can use to connect to Testnet, Devnet, and Pythnet.

These ports are as follows:

* 30080/30443: Devnet
* 40080/40443: Testnet
* 50080/50443: Pythnet

Currently, these lead to shared services. If you need dedicated services for any of these networks, please contact our support team, and we can discuss the different options.


