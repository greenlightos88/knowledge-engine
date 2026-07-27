# Doctrine Design Standard

## Status

**CANON — repository-wide and non-optional.**

This standard applies to every doctrine, agent definition, workflow, template, diagnostic, quality gate, and integration document in Knowledge Engine.

## Governing requirement

Every system component must be designed to the highest useful level of completeness while remaining concise enough to operate under real production pressure.

The goal is not maximum word count. The goal is minimum ambiguity, maximum leverage, and no foreseeable structural omission.

## Required qualities

Every component must be:

- **complete:** covers the full mechanism needed for reliable use;
- **concise:** removes repetition, filler, and ornamental explanation;
- **operational:** tells an agent what to inspect, decide, do, and verify;
- **causal:** explains why the mechanism works and what produces failure;
- **diagnostic:** identifies observable defects and their likely causes;
- **repairable:** provides targeted correction methods rather than vague improvement language;
- **integrated:** names dependencies, downstream effects, and relevant gates;
- **auditable:** makes decisions, assumptions, and authority visible;
- **portable:** remains usable across capable models, projects, and interfaces;
- **extensible:** permits deeper modules without breaking its core logic.

## Mandatory doctrine structure

A mature doctrine should contain, where relevant:

1. **Purpose** — what problem this doctrine solves.
2. **Principle** — the governing creative or operational truth.
3. **Mechanism** — how the process works causally.
4. **Inputs** — what information must be known.
5. **Outputs** — what the doctrine should produce.
6. **Application** — how to use it during development, drafting, revision, or production.
7. **Failure modes** — common defects and why they occur.
8. **Diagnosis** — questions or evidence used to identify the defect.
9. **Repair** — ordered interventions that fix the mechanism.
10. **Acceptance test** — observable conditions for passage.
11. **Dependencies** — doctrines, canon, research, or systems required.
12. **Downstream effects** — what else must be checked after a change.

Sections may be combined when brevity improves use, but none of the underlying functions may be silently omitted.

## Foreseeable-gap rule

Before locking any component, perform a prospective failure scan:

- What could a capable agent misunderstand?
- What necessary input is unstated?
- What edge case could cause canon drift, shallow writing, or contradictory execution?
- What downstream document could become outdated?
- What quality failure could pass because the gate is too vague?
- What would force the user to repeat an instruction later?

Resolve foreseeable gaps now when they can be resolved without inventing project-specific canon.

## Concision rule

Concision means information density, not thinness.

Remove:

- repeated principles;
- motivational language without operational value;
- obvious filler;
- examples that do not teach a distinct mechanism;
- long explanations that can be replaced by a precise model, test, or sequence.

Retain:

- distinctions that change decisions;
- edge cases that prevent failure;
- causal explanation;
- diagnostic criteria;
- repair logic;
- integration requirements.

## Detail rule

A component is under-designed when a user or agent must guess at a material step.

A component is over-written when additional language no longer changes understanding, execution, diagnosis, or verification.

Stop only at the point of operational completeness.

## Dependency rule

No architectural doctrine exists in isolation.

When adding or changing a component:

1. identify prerequisites;
2. identify all workflows and gates that invoke it;
3. identify templates that need new fields;
4. identify existing doctrine that now conflicts or overlaps;
5. update navigation and indexes;
6. record architectural consequences.

## No-placeholder rule

Do not create empty folders, superficial stubs, aspirational headings, or files that merely announce future work. A file may be marked provisional only when it already provides usable doctrine and clearly identifies unresolved depth.

## Quality threshold

A component fails this standard when it is:

- generic enough to fit any subject without modification;
- descriptive but not actionable;
- actionable but unsupported by causal reasoning;
- detailed but structurally repetitive;
- isolated from relevant workflows and gates;
- unable to distinguish a strong result from a fluent weak one;
- likely to require the user to restate an already established standard.

## Lock condition

Before approval, confirm:

```text
COMPLETE ENOUGH TO EXECUTE:
CONCISE ENOUGH TO RETRIEVE:
FAILURES NAMED:
REPAIRS ORDERED:
DEPENDENCIES LINKED:
DOWNSTREAM EFFECTS CHECKED:
USER INSTRUCTIONS PRESERVED:
STATUS: PASS / REVISE / FAIL
```

This standard remains in force unless the user explicitly replaces it with a higher-authority instruction.