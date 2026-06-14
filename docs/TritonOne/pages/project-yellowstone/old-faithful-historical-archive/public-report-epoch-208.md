> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/project-yellowstone/old-faithful-historical-archive/public-report-epoch-208.md).

# Old Faithful Public Report

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


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/project-yellowstone/old-faithful-historical-archive/public-report-epoch-208.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
