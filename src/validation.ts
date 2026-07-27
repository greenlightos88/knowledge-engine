import { z } from "zod";
import type { ProviderRequest, ProviderResponse } from "./providers";

const ClaimSchema = z.object({
  passed: z.boolean(),
  evidence: z.array(z.string()).default([]),
  failures: z.array(z.string()).default([]),
});

const ConfidenceSchema = z.object({
  level: z.enum(["low", "medium", "high"]),
  evidence: z.array(z.string()).default([]),
  uncertainty: z.array(z.string()).default([]),
});

const ScoreSchema = z.number().int().min(0).max(10);
type Claim = z.infer<typeof ClaimSchema>;

export const CreativeResultSchema = z.object({
  intent_contract: z.object({
    surface_request: z.string().min(1),
    deeper_objective: z.string().min(1),
    audience_effect: z.array(z.string()).default([]),
    artifact_target: z.string().min(1),
    preserve: z.array(z.string()).default([]),
    constraints: z.array(z.string()).default([]),
    anti_goals: z.array(z.string()).default([]),
    success_conditions: z.array(z.string()).default([]),
    assumptions: z.array(z.string()).default([]),
    open_uncertainties: z.array(z.string()).default([]),
  }),
  council_report: z.object({
    mode: z.enum(["light", "standard", "deep"]),
    passes_run: z.array(z.string()).min(1),
    findings_applied: z.array(z.string()).default([]),
    findings_rejected: z.array(z.object({ finding: z.string(), reason: z.string() })).default([]),
    remaining_disagreements: z.array(z.string()).default([]),
  }),
  diagnosis: z.object({
    primary_failure: z.string().min(1),
    supporting_failures: z.array(z.string()).default([]),
  }),
  artifact: z.object({
    format: z.string().min(1),
    content: z.string().min(1),
  }),
  canon_report: z.object({
    preserved: z.array(z.string()).default([]),
    conflicts: z.array(z.string()).default([]),
    new_inferences: z.array(z.string()).default([]),
  }),
  confidence: z.object({
    intent: ConfidenceSchema,
    canon: ConfidenceSchema,
    craft: ConfidenceSchema,
    production: ConfidenceSchema,
  }),
  wow_scorecard: z.object({
    intent_fidelity: ScoreSchema,
    canon_integrity: ScoreSchema,
    creative_causality: ScoreSchema,
    human_writing: ScoreSchema,
    audience_design: ScoreSchema,
    production_usefulness: ScoreSchema,
    long_horizon_coherence: ScoreSchema,
    taste_fit: ScoreSchema,
    trust_transparency: ScoreSchema,
    usability_momentum: ScoreSchema,
    creator_validation_required_for_ten: z.literal(true),
  }),
  validation_claims: z.object({
    intent_alignment: ClaimSchema,
    canon_integrity: ClaimSchema,
    human_writing: ClaimSchema,
    scene_function: ClaimSchema.optional(),
    cultural_restraint: ClaimSchema.optional(),
    supernatural_causality: ClaimSchema.optional(),
  }),
  synchronization: z.object({
    files_to_update: z.array(z.string()).default([]),
    downstream_impacts: z.array(z.string()).default([]),
    unresolved_questions: z.array(z.string()).default([]),
  }),
});

export type CreativeResult = z.infer<typeof CreativeResultSchema>;

export type GateResult = {
  gate: string;
  passed: boolean;
  failures: string[];
};

export type ValidationResult = {
  status: "not_run" | "failed" | "passed";
  valid: boolean;
  parsed: CreativeResult | null;
  gates: GateResult[];
  failures: string[];
};

function extractJson(content: string): unknown {
  const trimmed = content.trim();
  if (trimmed.startsWith("{")) return JSON.parse(trimmed);
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (!fenced?.[1]) throw new Error("Provider response did not contain a JSON result object.");
  return JSON.parse(fenced[1]);
}

function gateClaim(result: CreativeResult, gate: string): Claim | undefined {
  const claims = result.validation_claims;
  if (gate === "intent-alignment") return claims.intent_alignment;
  if (gate === "canon-integrity") return claims.canon_integrity;
  if (gate === "human-writing") return claims.human_writing;
  if (gate === "scene-function") return claims.scene_function;
  if (gate === "cultural-restraint") return claims.cultural_restraint;
  if (gate === "supernatural-causality") return claims.supernatural_causality;
  return undefined;
}

export function validateCreativeResponse(request: ProviderRequest, response: ProviderResponse): ValidationResult {
  if (response.finish_reason === "dry_run") {
    return { status: "not_run", valid: false, parsed: null, gates: [], failures: ["Dry-run responses cannot be approved."] };
  }

  let parsed: CreativeResult;
  try {
    parsed = CreativeResultSchema.parse(extractJson(response.content));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { status: "failed", valid: false, parsed: null, gates: [], failures: [`Invalid response contract: ${message}`] };
  }

  const task = request.task as { validation?: { required_gates?: string[] }; high_fidelity?: { council?: { passes?: string[] } } };
  const requiredGates = task.validation?.required_gates ?? [];
  const gates: GateResult[] = requiredGates.map((gate) => {
    const claim = gateClaim(parsed, gate);
    if (!claim) return { gate, passed: false, failures: [`Required gate '${gate}' was not reported.`] };
    return { gate, passed: claim.passed && claim.failures.length === 0, failures: claim.failures };
  });

  const failures = gates.flatMap((gate) => gate.passed ? [] : gate.failures.map((failure) => `${gate}: ${failure}`));
  if (parsed.canon_report.conflicts.length > 0) failures.push(...parsed.canon_report.conflicts.map((item) => `canon conflict: ${item}`));
  if (parsed.synchronization.unresolved_questions.length > 0) failures.push(...parsed.synchronization.unresolved_questions.map((item) => `unresolved: ${item}`));
  if (parsed.council_report.remaining_disagreements.length > 0) failures.push(...parsed.council_report.remaining_disagreements.map((item) => `council disagreement: ${item}`));

  const plannedPasses = task.high_fidelity?.council?.passes ?? [];
  const missingPasses = plannedPasses.filter((pass) => !parsed.council_report.passes_run.includes(pass));
  if (missingPasses.length > 0) failures.push(`Council passes not reported: ${missingPasses.join(", ")}`);

  const scores = Object.entries(parsed.wow_scorecard).filter(([key]) => key !== "creator_validation_required_for_ten") as Array<[string, number]>;
  const unsupportedTens = scores.filter(([, score]) => score === 10);
  if (unsupportedTens.length > 0) failures.push(`Score of 10 requires external creator or benchmark evidence: ${unsupportedTens.map(([key]) => key).join(", ")}`);

  return {
    status: failures.length === 0 ? "passed" : "failed",
    valid: failures.length === 0,
    parsed,
    gates,
    failures,
  };
}

export function buildRepairInstruction(validation: Pick<ValidationResult, "valid" | "failures">): string {
  if (validation.valid) return "No repair required.";
  return [
    "Repair only the failed requirements below.",
    "Preserve every element that already passed.",
    "Return the complete result using the same strict JSON contract.",
    ...validation.failures.map((failure) => `- ${failure}`),
  ].join("\n");
}
