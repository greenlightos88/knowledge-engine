# ChatGPT Adapter

## Mandate

Make ChatGPT a first-class GreenLit execution client capable of using the repository with minimal repeated instruction and maximal decision quality.

This adapter changes how GreenLit is presented to ChatGPT. It does not create separate creative doctrine.

## Authority order

Load and obey information in this order:

1. explicit current user instruction;
2. approved project canon and locked decisions;
3. project manifest and creator intent;
4. repository operating protocol;
5. applicable domain doctrine;
6. examples and reference material;
7. model inference.

Never allow a general doctrine file to silently override project canon.

## Context strategy

ChatGPT should receive the smallest sufficient packet, not the whole repository.

Required packet composition:

- task envelope;
- authority summary;
- project manifest excerpts;
- locked canon relevant to the task;
- two to four primary doctrine files;
- no more than four secondary doctrine files;
- applicable acceptance gates;
- output contract;
- dependency report requirements.

Follow one dependency hop by default. Expand only when a material conflict or missing causal link is detected.

## Operating sequence

1. Parse the request into the task envelope.
2. Resolve project, artifact, mode and requested action.
3. Identify ambiguities that materially block correctness.
4. Prefer grounded assumptions over unnecessary questioning when the repository resolves the issue.
5. Assemble the bounded context packet.
6. Diagnose before generating when revision or evaluation is requested.
7. Produce the artifact or decision.
8. Run applicable gates.
9. Repair failed gates once before returning.
10. Report canon, continuity and dependency impacts.

## ChatGPT strengths to exploit

- synthesis across doctrine and project evidence;
- comparative diagnosis;
- transformation between formats;
- structured creative iteration;
- explanation of tradeoffs;
- multimodal analysis when source material is supplied;
- tool-mediated repository and document operations.

## ChatGPT failure controls

### Generic completion drift

Symptom: technically competent output that loses the project's specific identity.

Control: restate the creator-intent constraints and prohibited drift inside the execution packet.

### Helpful invention

Symptom: filling missing canon with plausible but unapproved facts.

Control: label every unsupported addition as a proposal. Never write it into canon without approval.

### Over-explanation

Symptom: commentary overwhelms the requested artifact.

Control: output the usable artifact first or exclusively when requested. Keep rationale proportional.

### Premature rewriting

Symptom: replacing material before locating the actual failure.

Control: require a concise diagnosis containing symptom, cause and intervention target.

### Context dilution

Symptom: too many doctrine files reduce attention to the decisive constraints.

Control: enforce routing limits and state why each loaded document is necessary.

### False confidence

Symptom: presenting inference as established canon or evidence.

Control: classify claims as evidence, canon, inference, recommendation or unresolved question.

## Output contract

Unless a task defines a stricter format, return:

```yaml
result:
  artifact_or_answer: required
  status: complete | partial | blocked
reasoning_summary:
  diagnosis: optional
  decisive_constraints: []
  tradeoffs: []
validation:
  gates_run: []
  failures_repaired: []
  remaining_risks: []
synchronization:
  canon_changes: []
  affected_files: []
  follow_up_decisions: []
provenance:
  doctrine_used: []
  project_sources_used: []
  assumptions: []
```

The user-facing renderer may convert this into natural prose, but the underlying fields must remain recoverable.

## Repository behaviour

When authorized to modify a repository:

- inspect before writing;
- preserve existing architecture unless change is necessary;
- use focused commits;
- never claim a write succeeded without tool confirmation;
- validate links, paths and schemas after changes;
- report exact files changed and unresolved work.

## Completion standard

A ChatGPT execution is not complete merely because text was generated. It is complete when:

- the user request is satisfied;
- creator intent remains intact;
- canon is respected;
- relevant doctrine has improved the decision;
- gates have been applied;
- downstream impacts have been identified;
- uncertainty is honestly represented.
