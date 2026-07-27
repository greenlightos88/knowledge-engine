import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { z } from "zod";

const ProjectRegistrySchema = z.object({
  version: z.union([z.string(), z.number()]),
  projects: z.record(
    z.string(),
    z.object({
      aliases: z.array(z.string()).default([]),
      repository: z.string().min(3),
      default_branch: z.string().min(1),
      manifest: z.string().min(1),
      manifest_ref: z.string().min(1).optional(),
      status: z.string().min(1),
    }),
  ),
});

export type ProjectRegistry = z.infer<typeof ProjectRegistrySchema>;

const ROUTES = [
  { id: "canon_or_mythology_refactor", priority: 100, terms: ["canon", "mythology", "cosmology", "covenant", "lore"] },
  { id: "continuity_audit", priority: 90, terms: ["continuity", "contradiction", "inconsistent", "audit"] },
  { id: "production_feasibility", priority: 80, terms: ["budget", "produce", "production", "location", "stunt"] },
  { id: "weak_reveal_or_twist", priority: 70, terms: ["reveal", "twist", "payoff", "surprise"] },
  { id: "dialogue_revision", priority: 60, terms: ["dialogue", "line", "subtext", "voice"] },
  { id: "character_psychology", priority: 50, terms: ["character", "motivation", "psychology", "arc"] },
  { id: "studio_bible", priority: 40, terms: ["bible", "producer", "actor-ready", "dossier"] },
  { id: "scene_revision", priority: 10, terms: ["scene", "rewrite", "revise", "generic"] },
] as const;

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export async function loadProjectRegistry(path = "projects/project-registry.yaml") {
  const raw = await readFile(resolve(path), "utf8");
  return ProjectRegistrySchema.parse(parseYaml(raw));
}

export function resolveProject(request: string, registry: ProjectRegistry) {
  const normalized = normalize(request);
  const matches = Object.entries(registry.projects).filter(([id, project]) =>
    [id, ...project.aliases].some((alias) => normalized.includes(normalize(alias))),
  );

  if (matches.length === 0) throw new Error("No registered project was identified in the request.");
  if (matches.length > 1) throw new Error(`Ambiguous project reference: ${matches.map(([id]) => id).join(", ")}`);
  const match = matches[0];
  if (!match) throw new Error("Project resolution failed unexpectedly.");
  const [id, project] = match;
  return { id, ...project };
}

export function classifyRoute(request: string): string {
  const normalized = normalize(request);
  const ranked = ROUTES.map((route) => ({
    id: route.id,
    priority: route.priority,
    score: route.terms.reduce((score, term) => score + (normalized.includes(term) ? 1 : 0), 0),
  })).sort((a, b) => b.score - a.score || b.priority - a.priority);

  const best = ranked[0];
  if (!best || best.score === 0) return "general_creative_diagnostic";
  return best.id;
}

function inferAction(route: string) {
  if (route.includes("audit")) return { type: "audit", scope: "project", mode: "diagnostic" };
  if (route.includes("refactor")) return { type: "refactor", scope: "project", mode: "architectural" };
  if (route === "studio_bible") return { type: "compose", scope: "document", mode: "creative" };
  return { type: "revise", scope: "artifact", mode: "creative" };
}

export async function generateTaskEnvelope(request: string, model = "chatgpt") {
  const registry = await loadProjectRegistry();
  const project = resolveProject(request, registry);
  const route = classifyRoute(request);
  const action = inferAction(route);
  const manifestRef = project.manifest_ref ?? project.default_branch;

  const task = {
    task_id: `${project.id}-${route}-${Date.now()}`,
    request: {
      raw: request,
      normalized_goal: request.trim(),
      explicit_constraints: ["Preserve approved canon.", "Preserve creator intent.", "Do not invent unsupported project facts."],
      prohibited_outcomes: ["Silent canon mutation.", "Generic AI prose.", "Unreported downstream impact."],
      urgency: "normal",
    },
    action,
    project: {
      id: project.id,
      repository: project.repository,
      branch: manifestRef,
      target_branch: project.default_branch,
      manifest_path: project.manifest,
      canon_sources: [],
      decision_ledger: "resolve-from-manifest",
      genre_contract: "resolve-from-manifest",
      production_mode: "resolve-from-manifest",
    },
    artifact: {
      kind: "resolve-from-request",
      source_paths: [project.manifest],
      target_paths: [],
      current_state: "unknown",
    },
    authority: {
      order: ["current-user-instruction", "locked-project-decisions", "approved-canon", "creator-intent", "operating-protocol", "domain-doctrine", "inference"],
      locked_decisions: [],
      unresolved_conflicts: [],
      permitted_inference: "conservative",
    },
    retrieval: {
      route,
      primary_documents: [],
      secondary_documents: [],
      gates: ["quality/intent-alignment-gate.md", "quality/acceptance-gates.md"],
      dependency_hops: 1,
      context_budget: model === "claude" ? 24000 : 16000,
    },
    output: {
      deliverable: "Completed artifact plus diagnosis, validation, and synchronization report.",
      format: "artifact-and-structured-report",
      audience: "creator",
      completion_definition: ["Requested work is complete.", "Canon is preserved.", "Required gates pass.", "Downstream impacts are reported."],
      include_reasoning_summary: true,
      include_dependency_report: true,
    },
    validation: {
      required_gates: ["intent-alignment", "canon-integrity", "human-writing"],
      repair_passes: 1,
      fail_closed_on_canon_conflict: true,
    },
    execution_state: {
      status: "created",
      assumptions: [],
      risks: project.status === "integration_pending" ? ["Project manifest integration is not yet confirmed."] : [],
      affected_dependencies: [],
    },
  };

  return { model, project_status: project.status, manifest_ref: manifestRef, route, task, yaml: stringifyYaml(task) };
}
