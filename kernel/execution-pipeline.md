# GreenLit Execution Pipeline

## Purpose

Define the mandatory reasoning and execution sequence that converts a request into a validated, synchronized result.

## Pipeline

```text
INTAKE
→ NORMALIZE
→ RESOLVE AUTHORITY
→ ROUTE
→ ASSEMBLE CONTEXT
→ DIAGNOSE
→ EXECUTE
→ VALIDATE
→ REPAIR
→ SYNCHRONIZE
→ RENDER
```

## 1. Intake

Capture the user's actual request without silently broadening it.

Required outputs:

- raw request;
- intended deliverable;
- explicit constraints;
- urgency;
- referenced project and artifact.

## 2. Normalize

Create `GreenLitTaskEnvelope`.

Resolve:

- action type;
- scope;
- project mode;
- artifact state;
- completion definition.

Do not treat vague emotional feedback as unusable. Translate language such as "this does not hit" into a diagnostic task while preserving the user's stated dissatisfaction as evidence.

## 3. Resolve authority

Construct an authority stack before consulting doctrine.

Required order:

1. current user instruction;
2. locked project decisions;
3. approved canon;
4. creator intent and manifest;
5. operating protocol;
6. domain doctrine;
7. references and examples;
8. inference.

Conflicts must be surfaced, not averaged together.

## 4. Route

Select the closest route in `llm/routing-index.yaml`.

If no route is sufficient:

- compose a route from existing doctrine;
- record the missing route;
- do not create new doctrine during the execution unless repository development is itself the task.

## 5. Assemble context

Build the smallest sufficient context packet.

The packet must include:

- task envelope;
- authority summary;
- relevant canon;
- primary doctrine;
- secondary doctrine only when necessary;
- gates;
- output contract.

Every included document requires a one-line justification.

## 6. Diagnose

Diagnosis is mandatory for revision, evaluation and repair work.

Minimum diagnostic form:

```yaml
symptom: what is not working
cause: why it is happening
mechanism: which system explains the failure
intervention: what must change
preserve: what must not be lost
```

Do not rewrite the whole artifact when the failure is local.

## 7. Execute

Produce the requested decision, artifact or repository change.

Execution rules:

- preserve declared intent;
- make causally motivated choices;
- use doctrine as decision support, not visible formula;
- distinguish approved canon from proposed invention;
- satisfy the requested medium and audience;
- prefer specific, playable and producible choices.

## 8. Validate

Run every gate named by the route plus any gate triggered by material risk.

Validation must state:

- pass;
- fail;
- not applicable;
- evidence;
- required repair.

## 9. Repair

Perform one focused repair pass by default.

Repair the cause, not merely the symptom. Re-run failed gates after repair.

If repair would violate canon or creator intent, stop and report the conflict.

## 10. Synchronize

Determine downstream impact.

Check:

- canon;
- continuity;
- character files;
- world rules;
- chronology;
- production assumptions;
- dependencies;
- decision ledger;
- related deliverables.

No-change is a valid result, but it must be explicit.

## 11. Render

Present the result in the format most useful to the user while retaining the structured execution record.

The user should not be forced to read internal scaffolding unless it improves the decision.

## Completion gate

The pipeline is complete only when all are true:

- the requested artifact or answer exists;
- authority conflicts are resolved or reported;
- relevant doctrine changed a decision;
- applicable gates were run;
- failed gates were repaired or disclosed;
- dependency impact was assessed;
- assumptions and uncertainty are visible;
- repository writes, when requested, are confirmed.
