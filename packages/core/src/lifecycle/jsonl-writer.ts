import { appendFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

/** Safety net for any bigint that reaches serialization un-stringified. */
export function bigintReplacer(_key: string, value: unknown): unknown {
  return typeof value === "bigint" ? value.toString() : value;
}

/** Append-only JSONL sink. Synchronous on purpose: lifecycle records are
 * low-volume and must survive a crash mid-run. */
export class JsonlWriter {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = resolve(filePath);
    mkdirSync(dirname(this.filePath), { recursive: true });
  }

  append(record: unknown): void {
    appendFileSync(this.filePath, `${JSON.stringify(record, bigintReplacer)}\n`);
  }
}
