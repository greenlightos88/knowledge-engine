import { createHash } from "node:crypto";
import type { ProviderRequest, ProviderResponse } from "./providers";
import type { CreativeResult, GateResult } from "./validation";

export type ApprovalPackage = {
  package_version: "1.0";
  execution_id: string;
  project: {
    id: string | undefined;
    repository: string | undefined;
    source_ref: string | undefined;
    target_branch: string | undefined;
  };
  request_hash: string;
  source_provenance: Array<{
    repository: string | undefined;
    ref: string | undefined;
    path: string;
    sha: string | undefined;
  }>;
  proposed_changes: Array<{ path: string; operation: "update" | "create"; content: string; reason: string }>;
  validation: { passed: boolean; gates: GateResult[]; failures: string[] };
  approval: { required: true; status: "pending"; writeback_performed: false };
};

export function buildApprovalPackage(args: {
  request: ProviderRequest;
  response: ProviderResponse;
  result: CreativeResult;
  gates: GateResult[];
  failures: string[];
}): ApprovalPackage {
  const task = args.request.task as {
    project?: { id?: string; repository?: string; branch?: string; target_branch?: string };
    artifact?: { target_paths?: string[] };
  };
  const targetPaths = task.artifact?.target_paths ?? [];
  const files = args.result.synchronization.files_to_update.length > 0
    ? args.result.synchronization.files_to_update
    : targetPaths;

  const proposedChanges = files.map((path, index) => ({
    path,
    operation: "update" as const,
    content: index === 0 ? args.result.artifact.content : "",
    reason: index === 0
      ? args.result.diagnosis.primary_failure
      : "Downstream synchronization required; content must be generated or reviewed before writeback.",
  }));

  return {
    package_version: "1.0",
    execution_id: args.request.execution_id,
    project: {
      id: task.project?.id,
      repository: task.project?.repository,
      source_ref: task.project?.branch,
      target_branch: task.project?.target_branch,
    },
    request_hash: createHash("sha256").update(JSON.stringify(args.request)).digest("hex"),
    source_provenance: args.request.context.map((item) => ({
      repository: item.repository,
      ref: item.ref,
      path: item.path,
      sha: item.sha,
    })),
    proposed_changes: proposedChanges,
    validation: {
      passed: args.failures.length === 0,
      gates: args.gates,
      failures: args.failures,
    },
    approval: {
      required: true,
      status: "pending",
      writeback_performed: false,
    },
  };
}
