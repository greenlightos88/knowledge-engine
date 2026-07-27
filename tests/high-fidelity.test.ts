import { describe, expect, test } from "bun:test";
import { buildExecutionPlan, reconstructIntent, selectCouncil } from "../src/high-fidelity";
import { loadTask } from "../src/runtime";

const fixture = "tests/fixtures/scene-revision.task.yaml";

describe("high-fidelity runtime planning", () => {
  test("reconstructs an explicit intent contract from the task envelope", async () => {
    const task = await loadTask(fixture);
    const contract = reconstructIntent(task);
    expect(contract.surface_request).toContain("Rewrite this scene");
    expect(contract.preserve).toContain("Approved canon and creator intent.");
    expect(contract.success_conditions.length).toBeGreaterThan(0);
    expect(contract.anti_goals).toContain("Generic prestige dialogue.");
  });

  test("selects a bounded council rather than every specialist", async () => {
    const task = await loadTask(fixture);
    const council = selectCouncil(task);
    expect(council.mode).toBe("standard");
    expect(council.passes).toContain("intent-custodian");
    expect(council.passes).toContain("story-architect");
    expect(council.passes).toContain("human-writing-editor");
    expect(council.passes.length).toBeLessThan(10);
  });

  test("builds a targeted-repair execution plan", async () => {
    const task = await loadTask(fixture);
    const plan = buildExecutionPlan(task);
    expect(plan.repair_policy.strategy).toBe("targeted");
    expect(plan.repair_policy.preserve_passing_material).toBe(true);
    expect(plan.repair_policy.maximum_passes).toBe(1);
  });
});
