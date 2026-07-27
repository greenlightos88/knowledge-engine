import OpenAI from "openai";
import { z } from "zod";

export const ProviderRequestSchema = z.object({
  execution_id: z.string().min(1),
  model: z.string().min(1),
  system_instructions: z.string().min(1),
  context: z.array(z.object({
    path: z.string(),
    authority: z.string(),
    content: z.string(),
    repository: z.string().optional(),
    ref: z.string().optional(),
    sha: z.string().optional(),
  })),
  task: z.unknown(),
  output_contract: z.object({ format: z.string(), completion_definition: z.array(z.string()) }),
});

export type ProviderRequest = z.infer<typeof ProviderRequestSchema>;

export const ProviderResponseSchema = z.object({
  execution_id: z.string().min(1),
  provider: z.string().min(1),
  model: z.string().min(1),
  content: z.string(),
  structured: z.record(z.string(), z.unknown()).optional(),
  usage: z.object({ input_tokens: z.number().nonnegative(), output_tokens: z.number().nonnegative() }).optional(),
  finish_reason: z.string().optional(),
});

export type ProviderResponse = z.infer<typeof ProviderResponseSchema>;

export interface ModelProvider {
  readonly id: string;
  execute(request: ProviderRequest): Promise<ProviderResponse>;
}

function renderExecutionInput(request: ProviderRequest): string {
  const context = request.context.map((item, index) => {
    const provenance = item.repository
      ? `repository=${item.repository} ref=${item.ref ?? "unknown"} sha=${item.sha ?? "unknown"}`
      : "repository=knowledge-engine";
    return [
      `--- CONTEXT ${index + 1} ---`,
      `path: ${item.path}`,
      `authority: ${item.authority}`,
      provenance,
      item.content,
    ].join("\n");
  }).join("\n\n");

  return [
    "Execute the GreenLit task below.",
    "Return the completed artifact and a structured report containing diagnosis, canon impact, validation claims, synchronization impact, and unresolved questions.",
    "Do not claim that repository files were changed.",
    "",
    "TASK:",
    JSON.stringify(request.task, null, 2),
    "",
    "OUTPUT CONTRACT:",
    JSON.stringify(request.output_contract, null, 2),
    "",
    "AUTHORITATIVE CONTEXT:",
    context,
  ].join("\n");
}

export class DryRunProvider implements ModelProvider {
  readonly id = "dry-run";

  async execute(request: ProviderRequest): Promise<ProviderResponse> {
    ProviderRequestSchema.parse(request);
    return {
      execution_id: request.execution_id,
      provider: this.id,
      model: request.model,
      content: "",
      structured: {
        status: "planned",
        context_documents: request.context.map((item) => item.path),
        remote_sources: request.context
          .filter((item) => item.repository)
          .map((item) => ({ repository: item.repository, ref: item.ref, path: item.path, sha: item.sha })),
        completion_definition: request.output_contract.completion_definition,
      },
      finish_reason: "dry_run",
    };
  }
}

export class OpenAIProvider implements ModelProvider {
  readonly id = "openai";

  async execute(request: ProviderRequest): Promise<ProviderResponse> {
    ProviderRequestSchema.parse(request);
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL;
    if (!apiKey) throw new Error("OPENAI_API_KEY is required for OpenAI execution.");
    if (!model) throw new Error("OPENAI_MODEL is required for OpenAI execution; GreenLit never guesses a live model version.");

    const client = new OpenAI({
      apiKey,
      maxRetries: 2,
      timeout: 120_000,
    });

    const response = await client.responses.create({
      model,
      instructions: request.system_instructions,
      input: renderExecutionInput(request),
    });

    return ProviderResponseSchema.parse({
      execution_id: request.execution_id,
      provider: this.id,
      model,
      content: response.output_text,
      structured: {
        response_id: response.id,
        status: response.status,
        source_model_alias: request.model,
      },
      usage: response.usage ? {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      } : undefined,
      finish_reason: response.status,
    });
  }
}

export class AnthropicProvider implements ModelProvider {
  readonly id = "anthropic";

  async execute(_request: ProviderRequest): Promise<ProviderResponse> {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is required for Anthropic execution.");
    throw new Error("Anthropic transport is declared but not enabled until the official SDK integration is installed and tested.");
  }
}

export function resolveProvider(id: string): ModelProvider {
  if (id === "dry-run") return new DryRunProvider();
  if (id === "openai") return new OpenAIProvider();
  if (id === "anthropic") return new AnthropicProvider();
  throw new Error(`Unsupported provider: ${id}`);
}
