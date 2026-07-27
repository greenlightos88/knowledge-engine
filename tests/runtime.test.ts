import { describe, expect, test } from "bun:test";
import { writeFile, unlink } from "node:fs/promises";
import { assembleContext, loadTask, resolveAdapter, loadRegistry } from "../src/runtime";

const fixture = "tests/fixtures/scene-revision.task.yaml";

describe("knowledge engine runtime", () => {
  test("loads a valid task envelope", async () => {
    const task = await loadTask(fixture);
    expect(task.task_id).toBe("fixture-scene-revision-001");
    expect(task.retrieval.route).toBe("weak_reveal_or_twist");
  });

  test("resolves ChatGPT and Claude as first-class adapters", async () => {
    const registry = await loadRegistry();
    expect(resolveAdapter(registry, "chatgpt").status).toBe("first_class");
    expect(resolveAdapter(registry, "claude").status).toBe("first_class");
  });

  test("uses fallback policy for unknown models", async () => {
    const registry = await loadRegistry();
    const adapter = resolveAdapter(registry, "future-model");
    expect(adapter.status).toBe("fallback");
    expect(adapter.adapter).toBe("adapters/README.md");
  });

  test("preserves cross-model authority and gate parity", async () => {
    const chatgpt = await assembleContext(fixture, "chatgpt");
    const claude = await assembleContext(fixture, "claude");

    expect(chatgpt.authority_order).toEqual(claude.authority_order);
    expect(chatgpt.locked_decisions).toEqual(claude.locked_decisions);
    expect(chatgpt.required_gates).toEqual(claude.required_gates);
    expect(chatgpt.completion_definition).toEqual(claude.completion_definition);
    expect(chatgpt.route).toBe(claude.route);
    expect(chatgpt.adapter).not.toBe(claude.adapter);
  });

  test("deduplicates context documents", async () => {
    const manifest = await assembleContext(fixture, "chatgpt");
    expect(new Set(manifest.documents).size).toBe(manifest.documents.length);
  });

  test("fails closed when canon conflicts are unresolved", async () => {
    const source = await Bun.file(fixture).text();
    const conflicted = source.replace("unresolved_conflicts: []", "unresolved_conflicts:\n    - Canon source A contradicts canon source B.");
    const temporaryPath = "tests/fixtures/.temporary-conflict.task.yaml";
    await writeFile(temporaryPath, conflicted);

    try {
      await expect(assembleContext(temporaryPath, "claude")).rejects.toThrow("Canon conflict");
    } finally {
      await unlink(temporaryPath);
    }
  });
});
