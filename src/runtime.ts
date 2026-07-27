import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";
import { z } from "zod";

const TaskEnvelopeSchema = z.object({
  task_id: z.string().min(1),
  request: z.object({
    raw: z.string().min(1),
    normalized_goal: z.string().min(1),
    explicit_constraints: z.array(z.string()).default([]),
    prohibited_outcomes: z.array(z.string()).default([]),
    urgency: z.string().default("normal"),
  }),
  action: z.object({
    type: z.string().min(1),
    scope: z.string().min(1),
    mode: z.string().min(1),
  }),
  project: z.object({
    id: z.string().min(1),
    manifest_path: z.string().min(1),
    canon_sources: z.array(z.string()).default([]),
    decision_ledger: z.string().min(1),
    genre_contract: z.string().min(1),
    production_mode: z.string().min(1),
  }),
  artifact: z.object({
    kind: z.string().min(1),
    source_paths: z.array(z.string()).min(1),
    target_paths: z.array(z.string()).default([]),
    current_state: z.string().min(1),
  }),
  authority: z.object({
    order: z.array(z.string()).min(1),
    locked_decisions: z.array(z.string()).default([]),
    unresolved_conflicts: z.array(z.string()).default([]),
    permitted_inference: z.string().min(1),
  }),
  retrieval: z.object({
    route: z.string().min(1),
    primary_documents: z.array(z.string()).default([]),
    secondary_documents: z.array(z.string()).default([]),
    gates: z.array(z.string()).default([]),
    dependency_hops: z.number().int().min(0).max(3),
    context_budget: z.number().int().positive(),
  }),
  output: z.object({
    deliverable: z.string().min(1),
    format: z.string().min(1),
    audience: z.string().min(1),
    completion_definition: z.array(z.string()).min(1),
    include_reasoning_summary: z.boolean(),
    include_dependency_report: z.boolean(),
  }),
  validation: z.object({
    required_gates: z.array(z.string()).min(1),
    repair_passes: z.number().int().min(0).max(3),
    fail_closed_on_canon_conflict: z.boolean(),
  }),
  execution_state: z.object({
    status: z.string().min(1),
    assumptions: z.array(z.string()).default([]),
    risks: z.array(z.string()).default([]),
    affected_dependencies: z.array(z.string()).default([]),
  }),
});

export type TaskEnvelope = z.infer<typeof TaskEnvelopeSchema>;

const RegistrySchema = z.object({
  version: z.union([z.string(), z.number()]),
  shared_kernel: z.record(z.string(), z.string()),
  models: z.record(
    z.string(),
    z.object({
      adapter: z.string().min(1),
      status: z.string().min(1),
      preferred_for: z.array(z.string()).default([]),
      controls: z.record(z.string(), z.boolean()),
    }),
  ),
  fallback: z.object({ adapter: z.string().min(1), policy: z.array(z.string()) }),
});

export type ModelRegistry = z.infer<typeof RegistrySchema>;

async function readYaml(path: string): Promise<unknown> {
  return parseYaml(await readFile(resolve(path), "utf8"));
}

export async function loadTask(path: string): Promise<TaskEnvelope> {
  return TaskEnvelopeSchema.parse(await readYaml(path));
}

export async function loadRegistry(path = "adapters/model-registry.yaml"): Promise<ModelRegistry> {
  return RegistrySchema.parse(await readYaml(path));
}

export function resolveAdapter(registry: ModelRegistry, model: string) {
  const selected = registry.models[model];
  if (!selected) {
    return {
      model,
      adapter: registry.fallback.adapter,
      status: "fallback",
      controls: {},
      policy: registry.fallback.policy,
    };
  }
  return { model, ...selected };
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

export async function assembleContext(taskPath: string, model: string) {
  const [task, registry] = await Promise.all([loadTask(taskPath), loadRegistry()]);
  const adapter = resolveAdapter(registry, model);

  if (task.authority.unresolved_conflicts.length > 0 && task.validation.fail_closed_on_canon_conflict) {
    throw new Error(`Canon conflict: ${task.authority.unresolved_conflicts.join("; ")}`);
  }

  const authorityDocuments = [
    task.project.manifest_path,
    task.project.decision_ledger,
    ...task.project.canon_sources,
    task.project.genre_contract,
  ];

  const documents = unique([
    adapter.adapter,
    ...Object.values(registry.shared_kernel),
    ...authorityDocuments,
    ...task.artifact.source_paths,
    ...task.retrieval.primary_documents,
    ...task.retrieval.secondary_documents,
    ...task.retrieval.gates,
  ]);

  return {
    manifest_version: "1.0",
    task_id: task.task_id,
    model,
    adapter: adapter.adapter,
    adapter_status: adapter.status,
    route: task.retrieval.route,
    authority_order: task.authority.order,
    locked_decisions: task.authority.locked_decisions,
    constraints: task.request.explicit_constraints,
    prohibited_outcomes: task.request.prohibited_outcomes,
    context_budget: task.retrieval.context_budget,
    dependency_hops: task.retrieval.dependency_hops,
    documents,
    required_gates: task.validation.required_gates,
    completion_definition: task.output.completion_definition,
    synchronization_required: task.output.include_dependency_report,
    controls: "controls" in adapter ? adapter.controls : {},
  };
}

export async function validateRepositoryInputs(taskPath: string, model: string) {
  const manifest = await assembleContext(taskPath, model);
  const failures: string[] = [];

  for (const document of manifest.documents) {
    try {
      await readFile(resolve(document));
    } catch {
      failures.push(document);
    }
  }

  return { valid: failures.length === 0, missing_documents: failures, manifest };
}
