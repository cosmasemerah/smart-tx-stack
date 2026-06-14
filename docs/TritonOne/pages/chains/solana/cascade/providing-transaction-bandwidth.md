> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/cascade/providing-transaction-bandwidth.md).

# Providing Transaction Bandwidth

As a validator, you can monetize your unused, stake-weighted transaction bandwidth by selling it on the Cascade Marketplace. This provides a new revenue stream for you and your delegators while helping to improve Solana's overall transaction delivery robustness.

#### The Validator's Opportunity in Transaction Delivery

One of the biggest challenges on a high-throughput network like Solana is managing network traffic to ensure a good user experience. Public validator endpoints are permissionless, making them a target for bot spam and congestion during periods of high demand.

To solve this, Solana provides multiple pathways for transaction delivery, making the entire system more robust. These routes include:

* **Public Ports:** Free to use, but subject to intense competition and network congestion.
* **Jito Auctions:** Allow searchers to bid for top-of-block priority inclusion.
* **Stake-Weighted Quality of Service (SWQoS):** A mechanism that grants staked validators a reserved, private bandwidth allocation, proportional to their stake weight.

This reserved SWQoS bandwidth is a valuable, often underutilized asset. The [**Cascade Marketplace**](/chains/solana/cascade.md) was created to connect validators who want to sell this capacity with applications and traders who need a reliable, priority pathway for their transactions, creating a fair market price for this bandwidth.

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


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/cascade/providing-transaction-bandwidth.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
