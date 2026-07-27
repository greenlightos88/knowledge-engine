import { describe, expect, test } from "bun:test";
import {
  EXTERNAL_CONTRACT_VERSION,
  ExternalIntelligenceRequestSchema,
  ExternalIntelligenceResponseSchema,
  toExternalIntelligenceResponse,
} from "../src/external-contract";
import { CreativeResultSchema } from "../src/validation";

const request = ExternalIntelligenceRequestSchema.parse({
  contract_version: EXTERNAL_CONTRACT_VERSION,
  request_id: "request-1",
  project: { project_id: "ekpo", snapshot_id: "snapshot-7" },
  actor: { actor_id: "creator-1", role: "creator" },
  mode: "knowledge-engine",
  objective: {
    raw_request: "Rewrite the shrine scene.",
    normalized_goal: "Strengthen relational consequence without changing canon.",
    artifact_target: "screenplay-scene",
    audience: "producer",
    success_conditions: ["The scene creates an irreversible choice."],
  },
  constraints: {
    preserve: ["Kai remains responsible."],
    prohibited_outcomes: ["Generic prestige dialogue."],
    production: ["Keep the scene contained."],
  },
  authority: {
    locked_decisions: ["The shrine is a regulator."],
    unresolved_conflicts: [],
    permitted_inference: "Mark every new inference explicitly.",
  },
  sources: [{
    source_id: "fragment-1",
    kind: "fragment",
    locator: "greenlit://projects/ekpo/fragments/1",
    content: "The scene needs more consequence.",
    authority: "creator",
  }],
  response_requirements: {
    candidate_types: ["screenplay-scene"],
    include_artifact: true,
    include_dependencies: true,
    include_diagnostics: true,
  },
});

const result = CreativeResultSchema.parse({
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
    passes_run: ["intent-custodian", "story-architect"],
    findings_applied: ["Make the reveal alter relationship leverage."],
    findings_rejected: [],
    remaining_disagreements: [],
  },
  diagnosis: { primary_failure: "The scene lacks relational consequence.", supporting_failures: [] },
  artifact: { format: "fountain", content: "INT. SHRINE - DAY\n\nKai stops." },
  canon_report: { preserved: ["Kai remains responsible."], conflicts: [], new_inferences: [] },
  confidence: {
    intent: { level: "high", evidence: ["The request states the outcome."], uncertainty: [] },
    canon: { level: "high", evidence: ["Canon was supplied."], uncertainty: [] },
    craft: { level: "high", evidence: ["The turn changes leverage."], uncertainty: [] },
    production: { level: "medium", evidence: ["The scene remains contained."], uncertainty: ["No budget supplied."] },
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
    intent_alignment: { passed: true, evidence: ["The objective is preserved."], failures: [] },
    canon_integrity: { passed: true, evidence: ["No locked decision changed."], failures: [] },
    human_writing: { passed: true, evidence: ["Behavior precedes explanation."], failures: [] },
  },
  synchronization: {
    files_to_update: ["01_SCREENPLAY.fountain"],
    downstream_impacts: ["Update the scene continuity record after approval."],
    unresolved_questions: [],
  },
});

describe("external intelligence contract", () => {
  test("translates an internal result without exposing council implementation", () => {
    const response = toExternalIntelligenceResponse(request, result, {
      provider: "openai",
      model: "configured-model",
      engineVersion: "0.4.0",
      executedAt: "2026-07-27T18:00:00.000Z",
    });

    expect(ExternalIntelligenceResponseSchema.parse(response)).toEqual(response);
    expect(response.request_id).toBe(request.request_id);
    expect(response.candidates[0]?.review_status).toBe("proposed");
    expect(response.candidates[0]?.canon_effect).toBe("none_until_creator_approval");
    expect(response.review.creator_approval_required).toBe(true);
    expect(response.review.canon_mutated).toBe(false);
    expect(response.dependencies).toContain("Update the scene continuity record after approval.");
    expect("council_report" in response).toBe(false);
  });

  test("blocks an externally consumable result when canon conflicts remain", () => {
    const conflicted = CreativeResultSchema.parse({
      ...result,
      canon_report: { ...result.canon_report, conflicts: ["The proposal contradicts an approved shrine rule."] },
    });

    const response = toExternalIntelligenceResponse(request, conflicted, {
      provider: "test",
      model: "test-model",
      engineVersion: "0.4.0",
    });

    expect(response.status).toBe("blocked");
    expect(response.contradictions).toContain("The proposal contradicts an approved shrine rule.");
    expect(response.review.canon_mutated).toBe(false);
  });

  test("rejects requests without source provenance", () => {
    expect(() => ExternalIntelligenceRequestSchema.parse({ ...request, sources: [] })).toThrow();
  });
});
