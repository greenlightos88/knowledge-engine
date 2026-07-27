# LLM Integration Standard

## Purpose

Make the Knowledge Engine easy to use with ChatGPT, Claude, Codex, Gemini and future models without requiring the entire repository in context.

## Governing rule

**Load the smallest complete context that can support the decision.**

More context is not automatically better. Irrelevant doctrine increases cost, latency, contradiction risk and generic averaging.

## Integration contract

Every model integration must provide, in order:

1. creator intent;
2. project mode and genre contract;
3. canonical project facts;
4. the current task;
5. the relevant doctrine packet;
6. required output schema;
7. acceptance gates.

## Context tiers

### Tier 0 — Identity

Always load:

- `AGENTS.md`;
- creator-approved success profile;
- project manifest;
- current task.

### Tier 1 — Governing doctrine

Load only standards directly controlling the task, such as scene mechanics, psychology, audience information or production constraints.

### Tier 2 — Diagnostic doctrine

Load when the task is diagnosis, critique or repair. Include relevant failure patterns and gates.

### Tier 3 — Deep reference

Load only when the task genuinely requires research, specialized mechanisms or cross-domain reasoning.

## Retrieval sequence

1. classify the task;
2. identify governing concepts;
3. retrieve their doctrine cards;
4. follow declared dependencies one hop outward;
5. remove redundant or conflicting context;
6. assemble a bounded context packet;
7. run the task;
8. evaluate against the declared gates.

## Required metadata for doctrine

Every retrievable doctrine unit should expose:

- `id`;
- `domain`;
- `task_types`;
- `concepts`;
- `prerequisites`;
- `affects`;
- `diagnoses`;
- `repairs`;
- `conflicts_with`;
- `authority`;
- `version`;
- `token_priority`.

## Model-agnostic instruction pattern

Use this structure regardless of vendor:

```text
ROLE
Operate as the named specialist, under creator intent and repository authority.

TASK
State the exact decision or artifact required.

CANON
List binding facts only.

CONTEXT
Provide the smallest relevant doctrine packet.

CONSTRAINTS
State production, format, tone and scope limits.

OUTPUT CONTRACT
Require a defined structure.

EVALUATION
Name the gates that must pass.
```

## Output discipline

Models must distinguish:

- evidence;
- inference;
- recommendation;
- decision;
- uncertainty;
- downstream updates.

A model may propose canon but cannot silently create canon.

## Maximum-return rules

- Prefer structured Markdown or JSON over freeform explanation when another agent will consume the result.
- Keep stable doctrine outside prompts and retrieve it by reference.
- Cache project identity, canon and success-profile context.
- Re-retrieve volatile project state before material decisions.
- Use specialized agents only where specialization changes the result.
- Do not send screenplay pages to agents that only need scene metadata.
- Do not send the complete bible when a bounded canon extract is sufficient.

## Failure conditions

Integration fails when:

- the model receives conflicting authority without precedence;
- creator intent is omitted;
- project-specific canon is mixed with universal doctrine;
- no output contract exists;
- context is broad but not task-relevant;
- recommendations are presented as approved decisions;
- downstream effects are not reported.

## Acceptance test

An integration is acceptable when a new supported LLM can:

1. identify its authority and task;
2. retrieve a bounded doctrine packet;
3. produce the required structured output;
4. distinguish fact from proposal;
5. run the named gates;
6. expose uncertainty and dependencies;
7. do so without loading the full repository.
