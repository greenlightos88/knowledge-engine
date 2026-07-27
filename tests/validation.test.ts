import { describe, expect, test } from "bun:test";
import { buildApprovalPackage } from "../src/approval-package";
import type { ProviderRequest, ProviderResponse } from "../src/providers";
import { buildRepairInstruction, validateCreativeResponse } from "../src/validation";

const request: ProviderRequest = {
  execution_id: "execution-1",
  model: "test-model",
  system_instructions: "Preserve canon.",
  context: [{ path: "00_CANON.md", authority: "approved-canon", content: "Canon", repository: "greenlightos88/ekpo", ref: "main", sha: "abc" }],
  task: {
    project: { id: "ekpo", repository: "greenlightos88/ekpo", branch: "main", target_branch: "main" },
    artifact: { target_paths: ["01_SCREENPLAY.fountain"] },
    validation: { required_gates: ["intent-alignment", "canon-integrity", "human-writing"] },
  },
  output_contract: { format: "strict-json-creative-result", completion_definition: ["Complete"] },
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
  diagnosis: { primary_failure: "The scene lacks relational consequence.", supporting_failures: [] },
  artifact: { format: "fountain", content: "INT. SHRINE - DAY\n\nKai stops." },
  canon_report: { preserved: ["Kai remains responsible."], conflicts: [], new_inferences: [] },
  validation_claims: {
    intent_alignment: { passed: true, evidence: ["Inheritance remains the engine."], failures: [] },
    canon_integrity: { passed: true, evidence: ["The shrine remains a regulator."], failures: [] },
    human_writing: { passed: true, evidence: ["Behavior precedes explanation."], failures: [] },
  },
  synchronization: { files_to_update: ["01_SCREENPLAY.fountain"], downstream_impacts: [], unresolved_questions: [] },
};

describe("creative response validation", () => {
  test("passes a complete result contract", () => {
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
