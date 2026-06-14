import { solToLamports } from "../money/lamports.js";
import type { TipFloor } from "./types.js";

const TIP_FLOOR_REST = "https://bundles.jito.wtf/api/v1/bundles/tip_floor";
const TIP_STREAM_WS = "wss://bundles.jito.wtf/api/v1/bundles/tip_stream";

interface RawTipFloor {
  time: string;
  landed_tips_25th_percentile: number;
  landed_tips_50th_percentile: number;
  landed_tips_75th_percentile: number;
  landed_tips_95th_percentile: number;
  landed_tips_99th_percentile: number;
  ema_landed_tips_50th_percentile: number;
}

/**
 * Parse a tip_floor payload (REST and WS share the shape: a single-element
 * array wrapping the object). SOL floats → integer lamports here, once, at the
 * boundary — `ceil` so a tip target never rounds below the observed floor.
 */
export function parseTipFloor(payload: unknown): TipFloor {
  const obj = Array.isArray(payload) ? payload[0] : payload;
  if (obj === null || typeof obj !== "object") {
    throw new Error("tip_floor: unexpected payload shape");
  }
  const r = obj as RawTipFloor;
  return {
    time: r.time,
    p25: solToLamports(r.landed_tips_25th_percentile),
    p50: solToLamports(r.landed_tips_50th_percentile),
    p75: solToLamports(r.landed_tips_75th_percentile),
    p95: solToLamports(r.landed_tips_95th_percentile),
    p99: solToLamports(r.landed_tips_99th_percentile),
    emaP50: solToLamports(r.ema_landed_tips_50th_percentile),
  };
}

export async function fetchTipFloor(fetchImpl: typeof fetch = fetch): Promise<TipFloor> {
  const response = await fetchImpl(TIP_FLOOR_REST);
  if (!response.ok) {
    throw new Error(`tip_floor REST: HTTP ${response.status}`);
  }
  return parseTipFloor(await response.json());
}

export interface TipStreamOptions {
  url?: string;
  onUpdate: (floor: TipFloor) => void;
  onError?: (error: unknown) => void;
  log?: (line: string) => void;
}

/**
 * Live tip-floor feed over the WebSocket, with auto-reconnect. Keeps the most
 * recent TipFloor so the tip strategy always reads current market conditions.
 * Uses the Node 22+/24 global WebSocket — no dependency.
 */
export class TipStream {
  private ws: WebSocket | undefined;
  private latest: TipFloor | undefined;
  private stopped = false;
  private reconnectAttempt = 0;

  constructor(private readonly options: TipStreamOptions) {}

  start(): void {
    this.stopped = false;
    this.connect();
  }

  stop(): void {
    this.stopped = true;
    this.ws?.close();
    this.ws = undefined;
  }

  getLatest(): TipFloor | undefined {
    return this.latest;
  }

  private connect(): void {
    const url = this.options.url ?? TIP_STREAM_WS;
    const ws = new WebSocket(url);
    this.ws = ws;

    ws.addEventListener("open", () => {
      this.reconnectAttempt = 0;
      this.options.log?.(`[tips] tip_stream connected`);
    });
    ws.addEventListener("message", (ev: MessageEvent) => {
      try {
        const floor = parseTipFloor(JSON.parse(String(ev.data)));
        this.latest = floor;
        this.options.onUpdate(floor);
      } catch (error) {
        this.options.onError?.(error);
      }
    });
    ws.addEventListener("error", () => {
      this.options.onError?.(new Error("tip_stream socket error"));
    });
    ws.addEventListener("close", () => {
      if (this.stopped) return;
      const delay = Math.min(1_000 * 2 ** this.reconnectAttempt, 30_000);
      this.reconnectAttempt += 1;
      this.options.log?.(`[tips] tip_stream closed — reconnecting in ${delay}ms`);
      setTimeout(() => {
        if (!this.stopped) this.connect();
      }, delay);
    });
  }
}
