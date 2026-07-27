import { describe, expect, test } from "bun:test";
import { buildApprovalPackage } from "../src/approval-package";
import type { ProviderRequest, ProviderResponse } from "../src/providers";
import { buildRepairInstruction, validateCreativeResponse } from "../src/validation";

const plannedPasses = ["intent-custodian", "canon-editor", "story-architect", "audience-simulator", "artifact-specialist", "human-writing-editor", "continuity-editor"];

const request: ProviderRequest = {
  execution_id: "execution-1",
  model: "test-model",
  system_instructions: "Preserve canon.",
  context: [{ path: "00_CANON.md", authority: "approved-canon", content: "Canon", repository: "greenlightos88/ekpo", ref: "main", sha: "abc" }],
  task: {
    project: { id: "ekpo", repository: "greenlightos88/ekpo", branch: "main", target_branch: "main" },
    artifact: { target_paths: ["01_SCREENPLAY.fountain"] },
    validation: { required_gates: ["intent-alignment", "canon-integrity", "human-writing"] },
    high_fidelity: { council: { passes: plannedPasses } },
  },
  output_contract: { format: "strict-json-high-fidelity-creative-result", completion_definition: ["Complete"] },
};

function response(content: unknown): ProviderResponse {
  return {
    execution_id: "execution-1",
    provider: "test",
    model: "test-model",
    content: JSON.stringify(content),
    finish_reason: "completed",
  };
}

const validResult = {
  intent_contract: {
    surface_request: "Rewrite the shrine scene.",
    deeper_objective: "Strengthen relational consequence without breaking canon.",
    audience_effect: ["Dread becomes personal."],
    artifact_target: "Revised Fountain scene.",
    preserve: ["Kai remains responsible."],
    constraints: ["Preserve canon."],
    anti_goals: ["Generic prestige dialogue."],
    success_conditions: ["The scene creates an irreversible choice."],
    assumptions: [],
    open_uncertainties: [],
  },
  council_report: {
    mode: "standard",
    passes_run: plannedPasses,
    findings_applied: ["Make the reveal alter the brothers' relationship."],
    findings_rejected: [],
    remaining_disagreements: [],
  },
  diagnosis: { primary_failure: "The scene lacks relational consequence.", supporting_failures: [] },
  artifact: { format: "fountain", content: "INT. SHRINE - DAY\n\nKai stops." },
  canon_report: { preserved: ["Kai remains responsible."], conflicts: [], new_inferences: [] },
  confidence: {
    intent: { level: "high", evidence: ["The task states the intended outcome."], uncertainty: [] },
    canon: { level: "high", evidence: ["The supplied canon defines the shrine."], uncertainty: [] },
    craft: { level: "high", evidence: ["The turn now changes relationship leverage."], uncertainty: [] },
    production: { level: "medium", evidence: ["The scene remains contained."], uncertainty: ["No production budget supplied."] },
  },
  wow_scorecard: {
    intent_fidelity: 9,
    canon_integrity: 9,
    creative_causality: 9,
    human_writing: 8,
    audience_design: 8,
    production_usefulness: 8,
    long_horizon_coherence: 8,
    taste_fit: 8,
    trust_transparency: 9,
    usability_momentum: 9,
    creator_validation_required_for_ten: true,
  },
  validation_claims: {
    intent_alignment: { passed: true, evidence: ["Inheritance remains the engine."], failures: [] },
    canon_integrity: { passed: true, evidence: ["The shrine remains a regulator."], failures: [] },
    human_writing: { passed: true, evidence: ["Behavior precedes explanation."], failures: [] },
  },
  synchronization: { files_to_update: ["01_SCREENPLAY.fountain"], downstream_impacts: [], unresolved_questions: [] },
};

describe("creative response validation", () => {
  test("passes a complete high-fidelity result contract", () => {
    const result = validateCreativeResponse(request, response(validResult));
    expect(result.valid).toBe(true);
    expect(result.status).toBe("passed");
  });

  test("fails closed on missing required gate", () => {
    const incomplete = structuredClone(validResult);
    delete (incomplete.validation_claims as Record<string, unknown>).human_writing;
    const result = validateCreativeResponse(request, response(incomplete));
    expect(result.valid).toBe(false);
    expect(result.failures.join(" ")).toContain("human_writing");
  });

  test("fails when a planned council pass is not reported", () => {
    const incomplete = structuredClone(validResult);
    incomplete.council_report.passes_run = incomplete.council_report.passes_run.filter((pass) => pass !== "story-architect");
    const result = validateCreativeResponse(request, response(incomplete));
    expect(result.valid).toBe(false);
    expect(result.failures.join(" ")).toContain("story-architect");
  });

  test("rejects a self-awarded perfect score", () => {
    const inflated = structuredClone(validResult);
    inflated.wow_scorecard.intent_fidelity = 10;
    const result = validateCreativeResponse(request, response(inflated));
    expect(result.valid).toBe(false);
    expect(result.failures.join(" ")).toContain("requires external creator or benchmark evidence");
  });

  test("creates a targeted repair instruction", () => {
    const result = validateCreativeResponse(request, response({ ...validResult, canon_report: { preserved: [], conflicts: ["Invented shrine name."], new_inferences: [] } }));
    const repair = buildRepairInstruction(result);
    expect(repair).toContain("Invented shrine name");
    expect(repair).toContain("Preserve every element that already passed");
  });

  test("approval package never performs writeback", () => {
    const validation = validateCreativeResponse(request, response(validResult));
    if (!validation.parsed) throw new Error("Expected parsed result");
    const pkg = buildApprovalPackage({ request, response: response(validResult), result: validation.parsed, gates: validation.gates, failures: validation.failures });
    expect(pkg.approval.required).toBe(true);
    expect(pkg.approval.writeback_performed).toBe(false);
    expect(pkg.source_provenance[0]?.sha).toBe("abc");
  });
});
