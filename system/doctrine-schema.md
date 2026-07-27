# Executable Doctrine Schema

Every universal doctrine in Knowledge Engine must be written as operational knowledge, not as an essay.

## Required metadata

```yaml
id: <stable-domain-id>
title: <precise doctrine name>
domain: <system layer>
status: canon | validated | working-theory | experimental
confidence: <0-100>
version: <semantic version>
owner: <responsible system or agent>
depends_on: []
used_by: []
quality_gates: []
last_reviewed: <YYYY-MM-DD>
```

## Required sections

1. **Purpose** — the exact failure this doctrine prevents or capability it enables.
2. **Core claim** — the shortest accurate statement of the governing principle.
3. **Mechanism** — how and why the principle operates.
4. **Observable evidence** — what can be seen in behaviour, scene construction, dialogue, image, sound or audience response.
5. **Failure modes** — predictable ways the principle is misunderstood, omitted or misapplied.
6. **Diagnostic questions** — questions that identify whether the mechanism is functioning.
7. **Repair strategies** — ordered interventions that address causes rather than symptoms.
8. **Tradeoffs and boundary conditions** — where the doctrine weakens, conflicts or should not be over-applied.
9. **Dependencies** — doctrines that must already be understood or updated.
10. **Downstream effects** — files, agents, workflows and gates affected by this doctrine.
11. **Acceptance tests** — objective or evidence-based conditions for approval.
12. **Counterexamples** — cases that appear to violate the doctrine but succeed for a specific reason.
13. **Research status** — provenance, uncertainty and unresolved questions.
14. **Change history** — why the doctrine changed and what must be revalidated.

## Concision rule

Complete does not mean long. Include every material mechanism and dependency, remove repetition, and prefer precise distinctions over broad explanation.

## Enforcement

A doctrine is not approved when it:

- states principles without diagnostics;
- offers diagnostics without repair methods;
- has no defined downstream use;
- duplicates another doctrine without establishing a distinction;
- hides uncertainty behind authoritative language;
- contains examples that cannot be generalized into a mechanism;
- lacks acceptance tests;
- is too vague for another model or specialist to apply consistently.

## Change protocol

Any architectural doctrine change requires:

1. rationale;
2. dependency scan;
3. affected-gate review;
4. version increment;
5. migration note when prior project decisions may be invalidated.
