import { z } from "zod";
import {
  EXTERNAL_CONTRACT_VERSION,
  ExternalIntelligenceRequestSchema,
  ExternalIntelligenceResponseSchema,
  toExternalIntelligenceResponse,
  type ExternalIntelligenceRequest,
  type ExternalIntelligenceResponse,
  type ExternalResponseMetadata,
} from "./external-contract";
import { CreativeResultSchema, type CreativeResult } from "./validation";

export const ExternalServiceErrorSchema = z.object({
  contract_version: z.literal(EXTERNAL_CONTRACT_VERSION),
  request_id: z.string().min(1).optional(),
  error: z.object({
    code: z.enum([
      "invalid_request",
      "authority_conflict",
      "execution_failed",
      "invalid_engine_result",
    ]),
    message: z.string().min(1),
    retryable: z.boolean(),
    details: z.array(z.string()).default([]),
  }),
});

export type ExternalServiceError = z.infer<typeof ExternalServiceErrorSchema>;

export type ExternalServiceResult =
  | { ok: true; status: 200; body: ExternalIntelligenceResponse }
  | { ok: false; status: 400 | 409 | 502; body: ExternalServiceError };

export type ExternalEngineExecution = {
  result: CreativeResult;
  metadata: ExternalResponseMetadata;
};

/**
 * Internal execution dependency used by the transport-neutral service boundary.
 * HTTP, Convex, a queue worker, or a local command may all call the same service
 * while the Knowledge Engine remains free to change its councils and providers.
 */
export interface ExternalEngineExecutor {
  execute(request: ExternalIntelligenceRequest): Promise<ExternalEngineExecution>;
}

function validationDetails(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? issue.path.join(".") : "request";
    return `${path}: ${issue.message}`;
  });
}

function errorResult(
  status: 400 | 409 | 502,
  code: ExternalServiceError["error"]["code"],
  message: string,
  retryable: boolean,
  requestId?: string,
  details: string[] = [],
): ExternalServiceResult {
  return {
    ok: false,
    status,
    body: ExternalServiceErrorSchema.parse({
      contract_version: EXTERNAL_CONTRACT_VERSION,
      request_id: requestId,
      error: { code, message, retryable, details },
    }),
  };
}

/**
 * Validate, authorize at the contract boundary, execute, and normalize one
 * external intelligence request. This function performs no Canon mutation and
 * exposes no internal council, prompt, or provider implementation details.
 */
export async function handleExternalIntelligenceRequest(
  rawRequest: unknown,
  executor: ExternalEngineExecutor,
): Promise<ExternalServiceResult> {
  const parsedRequest = ExternalIntelligenceRequestSchema.safeParse(rawRequest);
  if (!parsedRequest.success) {
    const possibleRequestId = typeof rawRequest === "object" && rawRequest !== null && "request_id" in rawRequest
      ? String((rawRequest as { request_id?: unknown }).request_id ?? "") || undefined
      : undefined;
    return errorResult(
      400,
      "invalid_request",
      "The external intelligence request does not satisfy contract version 1.0.",
      false,
      possibleRequestId,
      validationDetails(parsedRequest.error),
    );
  }

  const request = parsedRequest.data;
  if (request.authority.unresolved_conflicts.length > 0) {
    return errorResult(
      409,
      "authority_conflict",
      "Execution is blocked until authority conflicts are resolved.",
      false,
      request.request_id,
      request.authority.unresolved_conflicts,
    );
  }

  let execution: ExternalEngineExecution;
  try {
    execution = await executor.execute(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown engine execution failure.";
    return errorResult(
      502,
      "execution_failed",
      "The Knowledge Engine could not complete the request.",
      true,
      request.request_id,
      [message],
    );
  }

  const parsedResult = CreativeResultSchema.safeParse(execution.result);
  if (!parsedResult.success) {
    return errorResult(
      502,
      "invalid_engine_result",
      "The Knowledge Engine returned a result that failed its internal contract.",
      false,
      request.request_id,
      validationDetails(parsedResult.error),
    );
  }

  const response = toExternalIntelligenceResponse(
    request,
    parsedResult.data,
    execution.metadata,
  );

  return {
    ok: true,
    status: 200,
    body: ExternalIntelligenceResponseSchema.parse(response),
  };
}
