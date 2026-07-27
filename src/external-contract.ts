import { z } from "zod";
import type { CreativeResult } from "./validation";

export const EXTERNAL_CONTRACT_VERSION = "1.0" as const;

const SourceReferenceSchema = z.object({
  source_id: z.string().min(1),
  kind: z.enum(["fragment", "canon", "decision", "artifact", "reference", "instruction"]),
  locator: z.string().min(1),
  revision: z.string().optional(),
  content: z.string().optional(),
  authority: z.enum(["creator", "canon", "approved-decision", "reference", "inference"]),
});

const ConfidenceDimensionSchema = z.object({
  level: z.enum(["low", "medium", "high"]),
  evidence: z.array(z.string()).default([]),
  uncertainty: z.array(z.string()).default([]),
});

export const ExternalIntelligenceRequestSchema = z.object({
  contract_version: z.literal(EXTERNAL_CONTRACT_VERSION),
  request_id: z.string().min(1),
  project: z.object({
    project_id: z.string().min(1),
    snapshot_id: z.string().optional(),
    repository: z.string().optional(),
    revision: z.string().optional(),
  }),
  actor: z.object({
    actor_id: z.string().min(1),
    role: z.enum(["creator", "collaborator", "system"]),
  }),
  mode: z.enum(["deterministic", "knowledge-engine", "hybrid"]),
  objective: z.object({
    raw_request: z.string().min(1),
    normalized_goal: z.string().min(1),
    artifact_target: z.string().min(1),
    audience: z.string().optional(),
    success_conditions: z.array(z.string()).min(1),
  }),
  constraints: z.object({
    preserve: z.array(z.string()).default([]),
    prohibited_outcomes: z.array(z.string()).default([]),
    production: z.array(z.string()).default([]),
  }),
  authority: z.object({
    locked_decisions: z.array(z.string()).default([]),
    unresolved_conflicts: z.array(z.string()).default([]),
    permitted_inference: z.string().min(1),
  }),
  sources: z.array(SourceReferenceSchema).min(1),
  response_requirements: z.object({
    candidate_types: z.array(z.string()).default([]),
    include_artifact: z.boolean().default(true),
    include_dependencies: z.boolean().default(true),
    include_diagnostics: z.boolean().default(true),
  }),
});

export type ExternalIntelligenceRequest = z.infer<typeof ExternalIntelligenceRequestSchema>;

const EvidenceSchema = z.object({
  evidence_id: z.string().min(1),
  source_id: z.string().min(1),
  claim: z.string().min(1),
  strength: z.enum(["supporting", "strong", "authoritative"]),
});

const CandidateSchema = z.object({
  candidate_id: z.string().min(1),
  candidate_type: z.string().min(1),
  title: z.string().min(1),
  proposal: z.string().min(1),
  rationale: z.string().min(1),
  evidence_ids: z.array(z.string()).default([]),
  source_ids: z.array(z.string()).default([]),
  assumptions: z.array(z.string()).default([]),
  uncertainty: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  contradictions: z.array(z.string()).default([]),
  review_status: z.literal("proposed"),
  canon_effect: z.literal("none_until_creator_approval"),
});

export const ExternalIntelligenceResponseSchema = z.object({
  contract_version: z.literal(EXTERNAL_CONTRACT_VERSION),
  request_id: z.string().min(1),
  status: z.enum(["completed", "blocked", "failed"]),
  engine: z.object({
    provider: z.string().min(1),
    model: z.string().min(1),
    engine_version: z.string().min(1),
    executed_at: z.string().datetime(),
  }),
  intent: z.object({
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
  candidates: z.array(CandidateSchema).default([]),
  evidence: z.array(EvidenceSchema).default([]),
  confidence: z.object({
    intent: ConfidenceDimensionSchema,
    canon: ConfidenceDimensionSchema,
    craft: ConfidenceDimensionSchema,
    production: ConfidenceDimensionSchema,
  }),
  contradictions: z.array(z.string()).default([]),
  dependencies: z.array(z.string()).default([]),
  diagnostics: z.object({
    primary_failure: z.string().min(1),
    supporting_failures: z.array(z.string()).default([]),
    validation_failures: z.array(z.string()).default([]),
  }),
  review: z.object({
    creator_approval_required: z.literal(true),
    canon_mutated: z.literal(false),
    recommended_actions: z.array(z.enum(["accept", "reject", "revise", "defer"])).min(1),
  }),
});

export type ExternalIntelligenceResponse = z.infer<typeof ExternalIntelligenceResponseSchema>;

export type ExternalResponseMetadata = {
  provider: string;
  model: string;
  engineVersion: string;
  executedAt?: string;
  validationFailures?: string[];
};

export function toExternalIntelligenceResponse(
  request: ExternalIntelligenceRequest,
  result: CreativeResult,
  metadata: ExternalResponseMetadata,
): ExternalIntelligenceResponse {
  ExternalIntelligenceRequestSchema.parse(request);

  const primarySource = request.sources[0];
  if (!primarySource) throw new Error("External intelligence requests require at least one source.");

  const evidence = result.intent_contract.success_conditions.map((claim, index) => ({
    evidence_id: `${request.request_id}:evidence:${index + 1}`,
    source_id: primarySource.source_id,
    claim,
    strength: primarySource.authority === "creator" || primarySource.authority === "canon"
      ? "authoritative" as const
      : "supporting" as const,
  }));

  const candidate = {
    candidate_id: `${request.request_id}:candidate:1`,
    candidate_type: request.response_requirements.candidate_types[0] ?? result.artifact.format,
    title: result.intent_contract.artifact_target,
    proposal: result.artifact.content,
    rationale: result.diagnosis.primary_failure,
    evidence_ids: evidence.map((item) => item.evidence_id),
    source_ids: request.sources.map((source) => source.source_id),
    assumptions: result.intent_contract.assumptions,
    uncertainty: result.intent_contract.open_uncertainties,
    dependencies: result.synchronization.downstream_impacts,
    contradictions: result.canon_report.conflicts,
    review_status: "proposed" as const,
    canon_effect: "none_until_creator_approval" as const,
  };

  return ExternalIntelligenceResponseSchema.parse({
    contract_version: EXTERNAL_CONTRACT_VERSION,
    request_id: request.request_id,
    status: result.canon_report.conflicts.length > 0 || result.synchronization.unresolved_questions.length > 0
      ? "blocked"
      : "completed",
    engine: {
      provider: metadata.provider,
      model: metadata.model,
      engine_version: metadata.engineVersion,
      executed_at: metadata.executedAt ?? new Date().toISOString(),
    },
    intent: result.intent_contract,
    candidates: [candidate],
    evidence,
    confidence: result.confidence,
    contradictions: result.canon_report.conflicts,
    dependencies: result.synchronization.downstream_impacts,
    diagnostics: {
      primary_failure: result.diagnosis.primary_failure,
      supporting_failures: result.diagnosis.supporting_failures,
      validation_failures: metadata.validationFailures ?? [],
    },
    review: {
      creator_approval_required: true,
      canon_mutated: false,
      recommended_actions: ["accept", "reject", "revise", "defer"],
    },
  });
}
