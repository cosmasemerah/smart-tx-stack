> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/trading-apis/bundle-simulation-with-jito.md).

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


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/trading-apis/bundle-simulation-with-jito.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
