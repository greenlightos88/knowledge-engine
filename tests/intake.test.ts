import { describe, expect, test } from "bun:test";
import { classifyRoute, generateTaskEnvelope, loadProjectRegistry, resolveProject } from "../src/intake";
import { DryRunProvider, OpenAIProvider } from "../src/providers";

const providerRequest = {
  execution_id: "test-execution",
  model: "chatgpt",
  system_instructions: "Preserve canon.",
  context: [],
  task: {},
  output_contract: { format: "report", completion_definition: ["Complete"] },
};

describe("natural-language intake", () => {
  test("resolves EKPO and mythology refactor from main", async () => {
    const result = await generateTaskEnvelope(
      "Rewrite EKPO's shrine scene under the new covenant mythology without breaking canon.",
      "chatgpt",
    );
    expect(result.task.project.id).toBe("ekpo");
    expect(result.task.project.branch).toBe("main");
    expect(result.project_status).toBe("integrated");
    expect(result.route).toBe("canon_or_mythology_refactor");
    expect(result.task.validation.fail_closed_on_canon_conflict).toBe(true);
  });

  test("resolves MANA production request", async () => {
    const result = await generateTaskEnvelope(
      "Audit MANA for production feasibility in one contained location.",
      "claude",
    );
    expect(result.task.project.id).toBe("mana");
    expect(result.route).toBe("production_feasibility");
    expect(result.task.retrieval.context_budget).toBe(24000);
  });

  test("fails when no project is identified", async () => {
    const registry = await loadProjectRegistry();
    expect(() => resolveProject("Rewrite the scene", registry)).toThrow("No registered project");
  });

  test("falls back to a general diagnostic route", () => {
    expect(classifyRoute("Help EKPO feel more emotionally precise")).toBe("general_creative_diagnostic");
  });
});

describe("provider safety", () => {
  test("dry-run plans but does not execute or write", async () => {
    const provider = new DryRunProvider();
    const response = await provider.execute(providerRequest);
    expect(response.finish_reason).toBe("dry_run");
    expect(response.content).toBe("");
  });

  test("OpenAI execution fails closed without credentials", async () => {
    const previousKey = process.env.OPENAI_API_KEY;
    const previousModel = process.env.OPENAI_MODEL;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
    try {
      await expect(new OpenAIProvider().execute(providerRequest)).rejects.toThrow("OPENAI_API_KEY");
    } finally {
      if (previousKey) process.env.OPENAI_API_KEY = previousKey;
      if (previousModel) process.env.OPENAI_MODEL = previousModel;
    }
  });
});
