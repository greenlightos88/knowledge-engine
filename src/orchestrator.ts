import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fetchGitHubSource } from "./github-source";
import { loadRemoteProjectManifest, resolveManifestRoute, resolveSynchronizationTargets } from "./project-loader";
import { assembleContext, loadTask } from "./runtime";
import { ProviderRequestSchema, resolveProvider } from "./providers";

function authorityFor(path: string, task: Awaited<ReturnType<typeof loadTask>>): string {
  if (path === task.project.manifest_path) return "project-manifest";
  if (task.project.canon_sources.includes(path)) return "approved-canon";
  if (path === task.project.decision_ledger) return "locked-project-decisions";
  if (path === task.project.genre_contract) return "genre-contract";
  if (task.artifact.source_paths.includes(path)) return "source-artifact";
  if (task.retrieval.gates.includes(path)) return "validation-gate";
  return "domain-doctrine";
}

function isLocalKernelPath(path: string): boolean {
  return ["adapters/", "kernel/", "llm/", "quality/", "human-writing/", "psychology/", "craft/", "cognition/", "production/", "system/", "workflows/", "translation/"].some((prefix) => path.startsWith(prefix));
}

export async function buildProviderRequest(taskPath: string, model: string) {
  const [task, kernelManifest] = await Promise.all([loadTask(taskPath), assembleContext(taskPath, model)]);
  const context: Array<{ path: string; authority: string; content: string; repository?: string; ref?: string; sha?: string }> = [];
  let consumedCharacters = 0;
  const maxCharacters = kernelManifest.context_budget * 4;

  const localDocuments = kernelManifest.documents.filter(isLocalKernelPath);
  for (const path of localDocuments) {
    const content = await readFile(resolve(path), "utf8");
    if (consumedCharacters + content.length > maxCharacters) break;
    context.push({ path, authority: authorityFor(path, task), content });
    consumedCharacters += content.length;
  }

  if (task.project.repository && task.project.branch) {
    const { source: manifestSource, manifest } = await loadRemoteProjectManifest(task);
    const route = resolveManifestRoute(manifest, task.retrieval.route);
    const projectPaths = [...new Set([task.project.manifest_path, ...route.required_sources])];

    for (const path of projectPaths) {
      const source = path === task.project.manifest_path
        ? manifestSource
        : await fetchGitHubSource(task.project.repository, path, task.project.branch);
      const remaining = Math.max(0, maxCharacters - consumedCharacters);
      if (remaining === 0) break;
      const content = source.content.slice(0, remaining);
      context.push({
        path,
        authority: path === task.project.manifest_path ? "project-manifest" : "project-authority",
        content,
        repository: source.repository,
        ref: source.ref,
        sha: source.sha,
      });
      consumedCharacters += content.length;
    }

    task.authority.locked_decisions = [...new Set([...task.authority.locked_decisions, ...manifest.locked_project_laws])];
    task.validation.required_gates = [...new Set([...task.validation.required_gates, ...route.required_gates])];
    task.execution_state.affected_dependencies = resolveSynchronizationTargets(manifest, route.required_sources);
    task.output.completion_definition = [...new Set([...task.output.completion_definition, ...manifest.completion_contract])];
  }

  const adapter = context.find((item) => item.path === kernelManifest.adapter)?.content;
  if (!adapter) throw new Error(`Adapter content was not assembled: ${kernelManifest.adapter}`);

  return ProviderRequestSchema.parse({
    execution_id: randomUUID(),
    model,
    system_instructions: adapter,
    context,
    task,
    output_contract: {
      format: task.output.format,
      completion_definition: task.output.completion_definition,
    },
  });
}

export async function runTask(taskPath: string, model: string, providerId = "dry-run") {
  const request = await buildProviderRequest(taskPath, model);
  const provider = resolveProvider(providerId);
  const response = await provider.execute(request);

  return {
    execution_id: request.execution_id,
    status: response.finish_reason === "dry_run" ? "planned" : "executed",
    provider: provider.id,
    model,
    context_count: request.context.length,
    remote_context_count: request.context.filter((item) => "repository" in item).length,
    response,
    writeback: {
      performed: false,
      reason: "GreenLit requires validation and explicit approval before repository mutation.",
    },
  };
}
