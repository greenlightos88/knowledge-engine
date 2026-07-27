import { parse as parseYaml } from "yaml";
import { z } from "zod";
import { fetchGitHubSource } from "./github-source";
import type { TaskEnvelope } from "./runtime";

const ManifestSchema = z.object({
  project: z.object({ id: z.string(), title: z.string() }),
  source_hierarchy: z.array(
    z.object({
      rank: z.number(),
      authority: z.string(),
      paths: z.array(z.string()).optional(),
      rule: z.string().optional(),
    }),
  ),
  canonical_sources: z.record(z.string(), z.unknown()),
  locked_project_laws: z.array(z.string()).default([]),
  artifact_registry: z.record(
    z.string(),
    z.object({
      path: z.string(),
      writable: z.boolean(),
      synchronization_targets: z.array(z.string()).optional(),
      generated_from: z.string().optional(),
    }),
  ),
  routing_overrides: z.record(
    z.string(),
    z.object({
      route: z.string(),
      required_sources: z.array(z.string()),
      required_gates: z.array(z.string()),
    }),
  ),
  write_policy: z.object({
    default_mode: z.string(),
    direct_write: z.boolean(),
    approval_required: z.boolean(),
    branch_required: z.boolean(),
  }),
  completion_contract: z.array(z.string()),
});

export type ProjectManifest = z.infer<typeof ManifestSchema>;

function flattenStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenStrings);
  return [];
}

export async function loadRemoteProjectManifest(task: TaskEnvelope) {
  const repository = task.project.repository;
  const ref = task.project.branch;
  if (!repository || !ref) throw new Error("Task does not contain a remote project repository and ref.");

  const source = await fetchGitHubSource(repository, task.project.manifest_path, ref);
  const manifest = ManifestSchema.parse(parseYaml(source.content));
  if (manifest.project.id !== task.project.id) {
    throw new Error(`Project manifest identity mismatch: expected ${task.project.id}, received ${manifest.project.id}.`);
  }
  return { source, manifest };
}

export function resolveManifestRoute(manifest: ProjectManifest, route: string) {
  const exact = Object.values(manifest.routing_overrides).find((entry) => entry.route === route);
  if (exact) return exact;

  const sources = [
    ...manifest.source_hierarchy.flatMap((entry) => entry.paths ?? []),
    ...flattenStrings(manifest.canonical_sources),
  ];
  return {
    route,
    required_sources: [...new Set(sources)],
    required_gates: ["canon-integrity", "intent-alignment", "human-writing"],
  };
}

export function resolveSynchronizationTargets(manifest: ProjectManifest, paths: string[]) {
  const targets = new Set<string>();
  for (const artifact of Object.values(manifest.artifact_registry)) {
    if (paths.includes(artifact.path)) {
      for (const target of artifact.synchronization_targets ?? []) targets.add(target);
    }
  }
  return [...targets];
}
