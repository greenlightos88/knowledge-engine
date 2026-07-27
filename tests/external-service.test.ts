import { describe, expect, test } from "bun:test";
import { EXTERNAL_CONTRACT_VERSION, ExternalIntelligenceRequestSchema } from "../src/external-contract";
import { handleExternalIntelligenceRequest, type ExternalEngineExecutor } from "../src/external-service";
import { CreativeResultSchema } from "../src/validation";

const request = ExternalIntelligenceRequestSchema.parse({
  contract_version: EXTERNAL_CONTRACT_VERSION,
  request_id: "request-1",
  project: { project_id: "project-1", snapshot_id: "snapshot-7" },
  actor: { actor_id: "creator-1", role: "creator" },
  mode: "knowledge-engine",
  objective: {
    raw_request: "Strengthen the scene without breaking Canon.",
    normalized_goal: "Revise the scene around relational consequence.",
    artifact_target: "screenplay-scene",
    success_conditions: ["The choice changes the relationship."],
  },
  constraints: {
    preserve: ["The shrine remains a regulator."],
    prohibited_outcomes: ["Do not turn the shrine into a prison."],
    production: ["Keep the scene contained."],
  },
  authority: {
    locked_decisions: ["The Entity is not the central evil."],
    unresolved_conflicts: [],
    permitted_inference: "Label all inference and require creator review.",
  },
  sources: [{
    source_id: "fragment-1",
    kind: "fragment",
    locator: "greenlit://projects/project-1/fragments/fragment-1",
    content: "The brothers enter the shrine.",
    authority: "creator",
  }],
  response_requirements: {
    candidate_types: ["screenplay-scene"],
    include_artifact: true,
    include_dependencies: true,
    include_diagnostics: true,
  },
});

const creativeResult = CreativeResultSchema.parse({
  intent_contract: {
    surface_request: "Strengthen the scene without breaking Canon.",
    deeper_objective: "Make the inherited duty alter the brothers' relationship.",
    audience_effect: ["Dread becomes personal."],
    artifact_target: "screenplay-scene",
    preserve: ["The shrine remains a regulator."],
    constraints: ["Keep the scene contained."],
    anti_goals: ["Generic prestige dialogue."],
    success_conditions: ["The choice changes the relationship."],
    assumptions: [],
    open_uncertainties: [],
  },
  council_report: {
    mode: "standard",
    passes_run: ["intent-custodian", "story-architect", "human-writing-editor"],
    findings_applied: ["Make the choice cost trust."],
    findings_rejected: [],
    remaining_disagreements: [],
  },
  diagnosis: { primary_failure: "The scene lacks relational consequence.", supporting_failures: [] },
  artifact: { format: "fountain", content: "INT. SHRINE - NIGHT\n\nKai stops." },
  canon_report: { preserved: ["The shrine remains a regulator."], conflicts: [], new_inferences: [] },
  confidence: {
    intent: { level: "high", evidence: ["The objective is explicit."], uncertainty: [] },
    canon: { level: "high", evidence: ["Locked decisions were supplied."], uncertainty: [] },
    craft: { level: "medium", evidence: ["The revision creates a choice."], uncertainty: ["Creator has not reviewed the scene."] },
    production: { level: "medium", evidence: ["The scene remains contained."], uncertainty: [] },
  },
  wow_scorecard: {
    intent_fidelity: 9,
    canon_integrity: 9,
    creative_causality: 8,
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
    intent_alignment: { passed: true, evidence: ["The relationship is now causal."], failures: [] },
    canon_integrity: { passed: true, evidence: ["No locked decision changed."], failures: [] },
    human_writing: { passed: true, evidence: ["Behavior precedes explanation."], failures: [] },
  },
  synchronization: { files_to_update: [], downstream_impacts: ["character relationship ledger"], unresolved_questions: [] },
});

function executor(overrides: Partial<ExternalEngineExecutor> = {}): ExternalEngineExecutor {
  return {
    execute: async () => ({
      result: creativeResult,
      metadata: {
        provider: "test-provider",
        model: "test-model",
        engineVersion: "0.4.0",
        executedAt: "2026-07-27T18:00:00.000Z",
      },
    }),
    ...overrides,
  };
}

describe("external intelligence service boundary", () => {
  test("returns a versioned proposed Candidate without mutating Canon", async () => {
    const result = await handleExternalIntelligenceRequest(request, executor());
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected successful service result");
    expect(result.status).toBe(200);
    expect(result.body.contract_version).toBe(EXTERNAL_CONTRACT_VERSION);
    expect(result.body.request_id).toBe(request.request_id);
    expect(result.body.candidates[0]?.review_status).toBe("proposed");
    expect(result.body.candidates[0]?.canon_effect).toBe("none_until_creator_approval");
    expect(result.body.review.creator_approval_required).toBe(true);
    expect(result.body.review.canon_mutated).toBe(false);
  });

  test("rejects malformed requests before engine execution", async () => {
    let calls = 0;
    const result = await handleExternalIntelligenceRequest(
      { ...request, contract_version: "2.0" },
      executor({ execute: async () => { calls += 1; throw new Error("must not execute"); } }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected failed service result");
    expect(result.status).toBe(400);
    expect(result.body.error.code).toBe("invalid_request");
    expect(calls).toBe(0);
  });

  test("blocks unresolved authority conflicts before engine execution", async () => {
    let calls = 0;
    const conflicted = {
      ...request,
      authority: { ...request.authority, unresolved_conflicts: ["Two approved shrine definitions conflict."] },
    };
    const result = await handleExternalIntelligenceRequest(
      conflicted,
      executor({ execute: async () => { calls += 1; throw new Error("must not execute"); } }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected failed service result");
    expect(result.status).toBe(409);
    expect(result.body.error.code).toBe("authority_conflict");
    expect(result.body.error.retryable).toBe(false);
    expect(calls).toBe(0);
  });

  test("normalizes engine failures into a retryable transport-safe error", async () => {
    const result = await handleExternalIntelligenceRequest(
      request,
      executor({ execute: async () => { throw new Error("provider timeout"); } }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected failed service result");
    expect(result.status).toBe(502);
    expect(result.body.error.code).toBe("execution_failed");
    expect(result.body.error.retryable).toBe(true);
    expect(result.body.error.details).toContain("provider timeout");
  });

  test("rejects invalid internal engine output instead of leaking it", async () => {
    const invalid = { ...creativeResult, artifact: { format: "fountain", content: "" } };
    const result = await handleExternalIntelligenceRequest(
      request,
      executor({
        execute: async () => ({
          result: invalid as typeof creativeResult,
          metadata: { provider: "test", model: "test", engineVersion: "0.4.0" },
        }),
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected failed service result");
    expect(result.status).toBe(502);
    expect(result.body.error.code).toBe("invalid_engine_result");
    expect(result.body.error.retryable).toBe(false);
  });
});
