import type { TaskEnvelope } from "./runtime";

export type CouncilMode = "light" | "standard" | "deep";

export type IntentContract = {
  surface_request: string;
  deeper_objective: string;
  audience_effect: string[];
  artifact_target: string;
  preserve: string[];
  constraints: string[];
  anti_goals: string[];
  success_conditions: string[];
  assumptions: string[];
  open_uncertainties: string[];
};

export type CouncilPlan = {
  mode: CouncilMode;
  passes: string[];
  rationale: string[];
};

const DEEP_SCOPE_SIGNALS = ["repository", "system", "project", "act", "ending", "mythology", "cosmology", "canon"];
const STANDARD_SCOPE_SIGNALS = ["scene", "sequence", "character", "bible", "package", "production"];
const DEEP_ARTIFACT_SIGNALS = ["screenplay", "repository", "system", "project", "bible", "mythology", "cosmology", "canon"];

function includesSignal(values: string[], signals: string[]): boolean {
  return values.some((value) => signals.some((signal) => value.toLowerCase().includes(signal)));
}

export function reconstructIntent(task: TaskEnvelope): IntentContract {
  return {
    surface_request: task.request.raw,
    deeper_objective: task.request.normalized_goal,
    audience_effect: [
      `Create a result suitable for ${task.output.audience}.`,
      ...task.output.completion_definition.filter((item) => /audience|feel|understand|remember|effect/i.test(item)),
    ],
    artifact_target: `${task.output.deliverable} (${task.output.format})`,
    preserve: [
      ...task.authority.locked_decisions,
      "Approved canon and creator intent.",
      "Existing material that already satisfies the task.",
    ],
    constraints: task.request.explicit_constraints,
    anti_goals: task.request.prohibited_outcomes,
    success_conditions: task.output.completion_definition,
    assumptions: task.execution_state.assumptions,
    open_uncertainties: [...task.authority.unresolved_conflicts, ...task.execution_state.risks],
  };
}

export function selectCouncil(task: TaskEnvelope): CouncilPlan {
  const scope = task.action.scope.toLowerCase();
  const artifact = task.artifact.kind.toLowerCase();
  const route = task.retrieval.route.toLowerCase();

  // Scope is authoritative. A scene-level task remains bounded even when the
  // artifact kind contains a broader word such as "screenplay-scene".
  const mode: CouncilMode = includesSignal([scope], STANDARD_SCOPE_SIGNALS)
    ? "standard"
    : includesSignal([scope], DEEP_SCOPE_SIGNALS)
      ? "deep"
      : includesSignal([artifact, route], DEEP_ARTIFACT_SIGNALS)
        ? "deep"
        : includesSignal([artifact, route], STANDARD_SCOPE_SIGNALS)
          ? "standard"
          : "light";

  const passes = new Set<string>(["intent-custodian", "artifact-specialist", "human-writing-editor"]);
  const rationale = [
    `Selected ${mode} mode from authoritative scope '${task.action.scope}', artifact '${task.artifact.kind}', and route '${task.retrieval.route}'.`,
  ];

  if (mode !== "light") {
    passes.add("canon-editor");
    passes.add("audience-simulator");
    passes.add("continuity-editor");
  }
  if (/character|psychology|relationship/i.test(route)) passes.add("character-psychologist");
  if (/scene|story|reveal|twist|canon|mythology/i.test(route)) passes.add("story-architect");
  if (/production|package|bible|screenplay/i.test([scope, artifact, route].join(" "))) passes.add("producer-pass");
  if (mode === "deep") passes.add("adversarial-critic");

  return { mode, passes: [...passes], rationale };
}

export function buildExecutionPlan(task: TaskEnvelope) {
  return {
    intent_contract: reconstructIntent(task),
    council: selectCouncil(task),
    repair_policy: {
      strategy: "targeted",
      maximum_passes: task.validation.repair_passes,
      preserve_passing_material: true,
    },
  };
}
