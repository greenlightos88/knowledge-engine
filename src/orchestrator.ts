import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
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

export async function buildProviderRequest(taskPath: string, model: string) {
  const [task, manifest] = await Promise.all([loadTask(taskPath), assembleContext(taskPath, model)]);
  const context = [];
  let consumedCharacters = 0;
  const maxCharacters = manifest.context_budget * 4;

  for (const path of manifest.documents) {
    const content = await readFile(resolve(path), "utf8");
    if (consumedCharacters + content.length > maxCharacters) {
      const remaining = Math.max(0, maxCharacters - consumedCharacters);
      if (remaining > 0) context.push({ path, authority: authorityFor(path, task), content: content.slice(0, remaining) });
      break;
    }
    context.push({ path, authority: authorityFor(path, task), content });
    consumedCharacters += content.length;
  }

  const adapter = context.find((item) => item.path === manifest.adapter)?.content;
  if (!adapter) throw new Error(`Adapter content was not assembled: ${manifest.adapter}`);

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
    response,
    writeback: {
      performed: false,
      reason: "GreenLit requires validation and explicit approval before repository mutation.",
    },
  };
}
