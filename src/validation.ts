import { z } from "zod";
import type { ProviderRequest, ProviderResponse } from "./providers";

const ClaimSchema = z.object({
  passed: z.boolean(),
  evidence: z.array(z.string()).default([]),
  failures: z.array(z.string()).default([]),
});

export const CreativeResultSchema = z.object({
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

function extractJson(content: string): unknown {
  const trimmed = content.trim();
  if (trimmed.startsWith("{")) return JSON.parse(trimmed);
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (!fenced?.[1]) throw new Error("Provider response did not contain a JSON result object.");
  return JSON.parse(fenced[1]);
}

function gateClaim(result: CreativeResult, gate: string): ClaimSchema['_output'] | undefined {
  const claims = result.validation_claims;
  if (gate === "intent-alignment") return claims.intent_alignment;
  if (gate === "canon-integrity") return claims.canon_integrity;
  if (gate === "human-writing") return claims.human_writing;
  if (gate === "scene-function") return claims.scene_function;
  if (gate === "cultural-restraint") return claims.cultural_restraint;
  if (gate === "supernatural-causality") return claims.supernatural_causality;
  return undefined;
}

export function validateCreativeResponse(request: ProviderRequest, response: ProviderResponse) {
  if (response.finish_reason === "dry_run") {
    return { status: "not_run" as const, valid: false, parsed: null, gates: [], failures: ["Dry-run responses cannot be approved."] };
  }

  let parsed: CreativeResult;
  try {
    parsed = CreativeResultSchema.parse(extractJson(response.content));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { status: "failed" as const, valid: false, parsed: null, gates: [], failures: [`Invalid response contract: ${message}`] };
  }

  const task = request.task as { validation?: { required_gates?: string[] }; authority?: { locked_decisions?: string[] } };
  const requiredGates = task.validation?.required_gates ?? [];
  const gates: GateResult[] = requiredGates.map((gate) => {
    const claim = gateClaim(parsed, gate);
    if (!claim) return { gate, passed: false, failures: [`Required gate '${gate}' was not reported.`] };
    return { gate, passed: claim.passed && claim.failures.length === 0, failures: claim.failures };
  });

  const failures = gates.flatMap((gate) => gate.passed ? [] : gate.failures.map((failure) => `${gate}: ${failure}`));
  if (parsed.canon_report.conflicts.length > 0) failures.push(...parsed.canon_report.conflicts.map((item) => `canon conflict: ${item}`));
  if (parsed.synchronization.unresolved_questions.length > 0) failures.push(...parsed.synchronization.unresolved_questions.map((item) => `unresolved: ${item}`));

  return {
    status: failures.length === 0 ? "passed" as const : "failed" as const,
    valid: failures.length === 0,
    parsed,
    gates,
    failures,
  };
}

export function buildRepairInstruction(validation: ReturnType<typeof validateCreativeResponse>): string {
  if (validation.valid) return "No repair required.";
  return [
    "Repair only the failed requirements below.",
    "Preserve every element that already passed.",
    "Return the complete result using the same strict JSON contract.",
    ...validation.failures.map((failure) => `- ${failure}`),
  ].join("\n");
}
