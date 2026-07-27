# Decision Ledger Standard

## Status
Canonical, repository-wide.

## Purpose
Record why material creative and architectural decisions were made so future agents can preserve intent, understand tradeoffs, reverse safely, and avoid reopening settled questions without evidence.

## What requires a ledger entry

- creator-intent changes
- canon additions, removals, or reinterpretations
- project-mode or tone changes
- character, relationship, mythology, world-rule, or ending changes
- structural changes affecting multiple scenes
- doctrine and workflow architecture changes
- production assumptions with downstream consequences
- deliberate exceptions to governing doctrine
- deprecations and migrations

Minor wording edits do not require entries unless they alter meaning.

## Required fields

```yaml
id: "DEC-YYYY-NNN"
date: "YYYY-MM-DD"
status: "proposed | approved | locked | superseded | reversed"
scope: "universal | project | artifact"
title: ""
decision: ""
reason: ""
creator_intent_served: ""
evidence_or_sources: []
governing_doctrine: []
alternatives_considered: []
rejected_because: []
tradeoffs:
  gained: []
  lost: []
assumptions: []
dependencies_changed: []
artifacts_requiring_review: []
risks: []
reversal_conditions: []
approved_by: ""
supersedes: []
superseded_by: ""
```

## Decision quality rules

A decision is incomplete when it records only what changed. It must explain why, what it protects, what it costs, and what must update.

A decision may remain a proposal when:

- creator approval is required;
- evidence is incomplete;
- affected canon is unresolved;
- production feasibility is unknown;
- alternatives have not been meaningfully evaluated.

## No retrospective fabrication
Do not invent rationale after the fact. When the original reason is unknown, mark it unknown and reconstruct only as an explicit inference.

## Reopening decisions
A locked decision may be reopened when:

- creator intent changes;
- new evidence invalidates a governing assumption;
- production reality makes execution impossible;
- downstream testing reveals a material failure;
- a higher-authority source conflicts with it.

Personal preference or model novelty is insufficient.

## Supersession
Never silently overwrite a material decision. Create a new entry that references the superseded entry and explains the changed conditions.

## Project versus universal decisions
Universal doctrine decisions belong in the Knowledge Engine. Project canon decisions belong in the project repository. The Knowledge Engine may record integration requirements but must not become a hidden source of project canon.

## Acceptance test
The ledger passes when a future agent can determine what is binding, why it is binding, what alternatives were rejected, what tradeoffs were accepted, and which dependencies must be reviewed if the decision changes.