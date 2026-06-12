import { describe, expect, it } from "vitest";
import { BoundedQueue } from "./bounded-queue.js";

describe("BoundedQueue", () => {
  it("delivers FIFO", async () => {
    const q = new BoundedQueue<number>(10);
    q.push(1);
    q.push(2);
    q.push(3);
    expect(await q.pop()).toBe(1);
    expect(await q.pop()).toBe(2);
    expect(await q.pop()).toBe(3);
  });

  it("collapses entries with the same key in place, keeping order", async () => {
    const q = new BoundedQueue<string>(10);
    q.push("slot100-v1", "slot:100");
    q.push("other");
    q.push("slot100-v2", "slot:100"); // supersedes v1, keeps position
    expect(await q.pop()).toBe("slot100-v2");
    expect(await q.pop()).toBe("other");
    const m = q.getMetrics();
    expect(m.collapsed).toBe(1);
    expect(m.enqueued).toBe(3);
    expect(m.dequeued).toBe(2);
  });

  it("drops the oldest entry at capacity and counts it", async () => {
    const q = new BoundedQueue<number>(3);
    q.push(1);
    q.push(2);
    q.push(3);
    q.push(4); // drops 1
    expect(q.getMetrics().dropped).toBe(1);
    expect(await q.pop()).toBe(2);
    expect(await q.pop()).toBe(3);
    expect(await q.pop()).toBe(4);
  });

  it("collapse key still resolves after its entry was dropped", async () => {
    const q = new BoundedQueue<string>(2);
    q.push("a", "key:a");
    q.push("b");
    q.push("c"); // drops "a" — key:a must be evicted from the index too
    q.push("a2", "key:a"); // drops "b"; must enqueue fresh, not collapse into a ghost
    expect(await q.pop()).toBe("c");
    expect(await q.pop()).toBe("a2");
  });

  it("pop waits for a future push", async () => {
    const q = new BoundedQueue<number>(2);
    const pending = q.pop();
    q.push(42);
    expect(await pending).toBe(42);
  });

  it("close() resolves pending and future pops with undefined", async () => {
    const q = new BoundedQueue<number>(2);
    const pending = q.pop();
    q.close();
    expect(await pending).toBeUndefined();
    expect(await q.pop()).toBeUndefined();
  });

  it("tracks depth and maxDepth", async () => {
    const q = new BoundedQueue<number>(10);
    q.push(1);
    q.push(2);
    expect(q.getMetrics().maxDepth).toBe(2);
    await q.pop();
    expect(q.getMetrics().depth).toBe(1);
    expect(q.getMetrics().maxDepth).toBe(2);
  });
});
