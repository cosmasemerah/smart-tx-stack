> For the complete documentation index, see [llms.txt](https://docs.triton.one/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://docs.triton.one/project-yellowstone/fumarole/fumarole-cluster-failover-guide.md).

# Fumarole Cluster Failover Guide

{% hint style="info" %}
This guide shows how to implement cross-region failover for Fumarole from the subscriber side. For an overview of regional clusters and the redundancy model, see [Fumarole Reliable Streams.](/project-yellowstone/fumarole.md)
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


---

# Agent Instructions
This documentation is published with GitBook. GitBook is the documentation platform designed so that both humans and AI agents can read, navigate, and reason over technical content effectively. Learn more at gitbook.com.

## Querying This Documentation
If you need additional information that is not directly available in this page, you can query the documentation dynamically by asking a question.

Perform an HTTP GET request on the current page URL with the `ask` query parameter:

```
GET https://docs.triton.one/project-yellowstone/fumarole/fumarole-cluster-failover-guide.md?ask=<question>
```

The question should be specific, self-contained, and written in natural language.
The response will contain a direct answer to the question and relevant excerpts and sources from the documentation.

Use this mechanism when the answer is not explicitly present in the current page, you need clarification or additional context, or you want to retrieve related documentation sections.
