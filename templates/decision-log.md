# Decision Ledger Template

Use this template for material creative, canonical, production, or architectural decisions. Follow `system/decision-ledger-standard.md`.

```yaml
id: "DEC-YYYY-NNN"
date: "YYYY-MM-DD"
status: "proposed | approved | locked | superseded | reversed"
scope: "universal | project | artifact"
authority: "creator | approved team | agent proposal"
title: ""

context:
  problem: ""
  trigger: ""
  prior_state: ""

decision: ""
reason: ""
creator_intent_served: ""

evidence_or_sources: []
governing_doctrine: []
first_principles: []

alternatives_considered:
  - option: ""
    strengths: []
    weaknesses: []

rejected_because: []

tradeoffs:
  gained: []
  lost: []

assumptions: []
dependencies_changed: []
artifacts_requiring_review: []
completed_reviews: []
unresolved_reviews: []
risks: []
reversal_conditions: []

approved_by: ""
supersedes: []
superseded_by: ""
notes: ""
```

## Completion rules

A decision is not complete until:

- its authority and status are explicit;
- its rationale is recorded without retrospective invention;
- rejected alternatives and tradeoffs are visible;
- affected dependencies and artifacts have been identified;
- required reviews are completed or marked unresolved;
- superseded decisions remain discoverable;
- project decisions are stored in the project repository rather than hidden in universal doctrine.

## Compact index

Projects may maintain a searchable index in addition to full entries:

| ID | Date | Status | Scope | Title | Authority | Supersedes |
|---|---|---|---|---|---|---|
| DEC-YYYY-NNN | YYYY-MM-DD | proposed | project |  | creator |  |
