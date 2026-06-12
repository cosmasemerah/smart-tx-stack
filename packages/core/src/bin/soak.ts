// Phase 1 verification runner: consumes slots + blockMeta from the configured
// Yellowstone endpoint, prints per-minute stats, and (optionally) forces a
// mid-run disconnect to prove the reconnect path. Usage:
//   pnpm --filter @smart-tx-stack/core soak -- --minutes 30 --chaos-at 10
import { parseArgs } from "node:util";
import { loadConfig, loadDotEnv } from "../config.js";
import { YellowstoneConsumer } from "../stream/consumer.js";
import type { SlotCommitment } from "../stream/events.js";

const { values: args } = parseArgs({
  options: {
    minutes: { type: "string", default: "30" },
    "chaos-at": { type: "string" },
  },
});

const minutes = Number(args.minutes);
const chaosAtMinute = args["chaos-at"] !== undefined ? Number(args["chaos-at"]) : undefined;
if (!Number.isFinite(minutes) || minutes <= 0) {
  console.error(`invalid --minutes: ${args.minutes}`);
  process.exit(2);
}

loadDotEnv();
const config = loadConfig();

interface StageTimes {
  processed?: number;
  confirmed?: number;
  finalized?: number;
}

const stages = new Map<number, StageTimes>();
const totals: Record<SlotCommitment | "blockMeta", number> = {
  processed: 0,
  confirmed: 0,
  finalized: 0,
  dead: 0,
  blockMeta: 0,
};
let minuteCounts = { ...totals };
let minuteDeltasPC: number[] = [];
let minuteDeltasCF: number[] = [];
const allDeltasPC: number[] = [];
const allDeltasCF: number[] = [];
let lastBlockHeight: number | undefined;

function percentile(sorted: number[], p: number): number | undefined {
  if (sorted.length === 0) return undefined;
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[Math.max(0, idx)];
}

function summarize(values: number[]): string {
  if (values.length === 0) return "n/a";
  const sorted = [...values].sort((a, b) => a - b);
  return `p50=${percentile(sorted, 50)}ms p95=${percentile(sorted, 95)}ms n=${sorted.length}`;
}

const consumer = new YellowstoneConsumer({
  endpoint: config.grpcEndpoint,
  xToken: config.grpcXToken,
  log: (line) => console.log(`${new Date().toISOString()} ${line}`),
});

consumer.on({
  onSlot(event) {
    totals[event.status] += 1;
    minuteCounts[event.status] += 1;

    let st = stages.get(event.slot);
    if (st === undefined) {
      st = {};
      stages.set(event.slot, st);
      if (stages.size > 4000) {
        const cutoff = event.slot - 3000;
        for (const s of stages.keys()) if (s < cutoff) stages.delete(s);
      }
    }
    if (event.status === "processed") st.processed = event.receivedAt;
    if (event.status === "confirmed") {
      st.confirmed = event.receivedAt;
      if (st.processed !== undefined) {
        const d = st.confirmed - st.processed;
        minuteDeltasPC.push(d);
        allDeltasPC.push(d);
      }
    }
    if (event.status === "finalized") {
      st.finalized = event.receivedAt;
      if (st.confirmed !== undefined) {
        const d = st.finalized - st.confirmed;
        minuteDeltasCF.push(d);
        allDeltasCF.push(d);
      }
    }
  },
  onBlockMeta(event) {
    totals.blockMeta += 1;
    minuteCounts.blockMeta += 1;
    if (event.blockHeight !== undefined) lastBlockHeight = event.blockHeight;
  },
});

let minute = 0;
const minuteTimer = setInterval(() => {
  minute += 1;
  const health = consumer.getHealth();
  const queue = consumer.getQueueMetrics();
  console.log(
    `${new Date().toISOString()} [soak] min=${minute}/${minutes} ` +
      `slots(p/c/f/dead)=${minuteCounts.processed}/${minuteCounts.confirmed}/${minuteCounts.finalized}/${minuteCounts.dead} ` +
      `meta=${minuteCounts.blockMeta} lastSlot=${health.lastSlot ?? "-"} height=${lastBlockHeight ?? "-"} | ` +
      `p→c ${summarize(minuteDeltasPC)} | c→f ${summarize(minuteDeltasCF)} | ` +
      `queue depth=${queue.depth} max=${queue.maxDepth} dropped=${queue.dropped} collapsed=${queue.collapsed} | ` +
      `ping=${health.pingsSent}/${health.pongsReceived} reconnects=${health.reconnects} ` +
      `discont=${health.slotDiscontinuities} dedup=${health.duplicatesDeduped} paused=${health.streamPaused}`,
  );
  minuteCounts = { processed: 0, confirmed: 0, finalized: 0, dead: 0, blockMeta: 0 };
  minuteDeltasPC = [];
  minuteDeltasCF = [];

  if (chaosAtMinute !== undefined && minute === chaosAtMinute) {
    consumer.forceDisconnect();
  }
}, 60_000);
minuteTimer.unref();

async function finish(code: number): Promise<never> {
  clearInterval(minuteTimer);
  await consumer.stop();
  const health = consumer.getHealth();
  const queue = consumer.getQueueMetrics();
  const summary = {
    minutes,
    chaosAtMinute: chaosAtMinute ?? null,
    endpoint: config.grpcEndpoint,
    totals,
    deltas: {
      processedToConfirmed: summarize(allDeltasPC),
      confirmedToFinalized: summarize(allDeltasCF),
    },
    lastSlot: health.lastSlot ?? null,
    lastBlockHeight: lastBlockHeight ?? null,
    health,
    queue,
  };
  console.log(`SOAK_SUMMARY ${JSON.stringify(summary)}`);
  const failed =
    totals.processed === 0 ||
    totals.confirmed === 0 ||
    totals.finalized === 0 ||
    (chaosAtMinute !== undefined && health.reconnects === 0);
  process.exit(failed ? 1 : code);
}

process.on("SIGINT", () => void finish(130));
setTimeout(() => void finish(0), minutes * 60_000).unref();

console.log(
  `${new Date().toISOString()} [soak] starting: endpoint=${config.grpcEndpoint} minutes=${minutes} chaosAt=${chaosAtMinute ?? "off"}`,
);
await consumer.start();
