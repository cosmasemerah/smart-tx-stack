> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/chains/solana/agave-accountsdb-storage-files-shrinking-process.md).

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


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/chains/solana/agave-accountsdb-storage-files-shrinking-process.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
