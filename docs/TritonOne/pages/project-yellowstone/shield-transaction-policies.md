> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/project-yellowstone/shield-transaction-policies.md).

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


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/project-yellowstone/shield-transaction-policies.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
