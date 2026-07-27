import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildApprovalPackage } from "./approval-package";
import { fetchGitHubSource } from "./github-source";
import { loadRemoteProjectManifest, resolveManifestRoute, resolveSynchronizationTargets } from "./project-loader";
import { assembleContext, loadTask } from "./runtime";
import { ProviderRequestSchema, resolveProvider, type ProviderRequest } from "./providers";
import { buildRepairInstruction, validateCreativeResponse } from "./validation";

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

const STRICT_RESULT_CONTRACT = `Return only one valid JSON object with this shape:
{
  "diagnosis": { "primary_failure": "string", "supporting_failures": ["string"] },
  "artifact": { "format": "string", "content": "complete deliverable" },
  "canon_report": { "preserved": ["string"], "conflicts": ["string"], "new_inferences": ["string"] },
  "validation_claims": {
    "intent_alignment": { "passed": true, "evidence": ["string"], "failures": [] },
    "canon_integrity": { "passed": true, "evidence": ["string"], "failures": [] },
    "human_writing": { "passed": true, "evidence": ["string"], "failures": [] },
    "scene_function": { "passed": true, "evidence": ["string"], "failures": [] },
    "cultural_restraint": { "passed": true, "evidence": ["string"], "failures": [] },
    "supernatural_causality": { "passed": true, "evidence": ["string"], "failures": [] }
  },
  "synchronization": { "files_to_update": ["path"], "downstream_impacts": ["string"], "unresolved_questions": [] }
}
Do not use markdown fences. Do not claim a gate passed without evidence from the supplied sources.`;

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
    task.artifact.target_paths = [...new Set([...task.artifact.target_paths, ...task.execution_state.affected_dependencies])];
  }

  const adapter = context.find((item) => item.path === kernelManifest.adapter)?.content;
  if (!adapter) throw new Error(`Adapter content was not assembled: ${kernelManifest.adapter}`);

  return ProviderRequestSchema.parse({
    execution_id: randomUUID(),
    model,
    system_instructions: `${adapter}\n\n${STRICT_RESULT_CONTRACT}`,
    context,
    task,
    output_contract: {
      format: "strict-json-creative-result",
      completion_definition: task.output.completion_definition,
    },
  });
}

function repairRequest(request: ProviderRequest, failures: string[]): ProviderRequest {
  return ProviderRequestSchema.parse({
    ...request,
    execution_id: randomUUID(),
    system_instructions: `${request.system_instructions}\n\n${buildRepairInstruction({
      status: "failed",
      valid: false,
      parsed: null,
      gates: [],
      failures,
    })}`,
  });
}

export async function runTask(taskPath: string, model: string, providerId = "dry-run") {
  const request = await buildProviderRequest(taskPath, model);
  const provider = resolveProvider(providerId);
  let activeRequest = request;
  let response = await provider.execute(activeRequest);
  let validation = validateCreativeResponse(activeRequest, response);
  const task = activeRequest.task as { validation?: { repair_passes?: number } };
  const repairLimit = providerId === "dry-run" ? 0 : task.validation?.repair_passes ?? 0;
  let repairsAttempted = 0;

  while (!validation.valid && repairsAttempted < repairLimit) {
    activeRequest = repairRequest(activeRequest, validation.failures);
    response = await provider.execute(activeRequest);
    validation = validateCreativeResponse(activeRequest, response);
    repairsAttempted += 1;
  }

  const approvalPackage = validation.valid && validation.parsed
    ? buildApprovalPackage({
        request: activeRequest,
        response,
        result: validation.parsed,
        gates: validation.gates,
        failures: validation.failures,
      })
    : null;

  return {
    execution_id: activeRequest.execution_id,
    status: response.finish_reason === "dry_run"
      ? "planned"
      : validation.valid
        ? "awaiting_approval"
        : "validation_failed",
    provider: provider.id,
    model,
    context_count: activeRequest.context.length,
    remote_context_count: activeRequest.context.filter((item) => "repository" in item).length,
    repairs_attempted: repairsAttempted,
    response,
    validation,
    approval_package: approvalPackage,
    writeback: {
      performed: false,
      reason: validation.valid
        ? "A valid approval package exists, but explicit approval is still required before repository mutation."
        : "Validation did not pass; repository mutation is prohibited.",
    },
  };
}
