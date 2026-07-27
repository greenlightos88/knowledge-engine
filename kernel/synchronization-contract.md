# Repository Synchronization Contract

## Purpose

Prevent a successful local decision from creating project-wide contradiction.

Synchronization is not optional administrative cleanup. It is part of creative correctness.

## Trigger conditions

Run synchronization analysis when an execution changes or proposes changes to:

- character identity, history, desire, ability or relationship;
- mythology, cosmology or world rules;
- chronology, geography or continuity;
- story structure, setup or payoff;
- tone, genre contract or audience promise;
- production assumptions;
- approved terminology;
- project scope or format;
- a decision marked canonical, locked or governing.

## Impact classes

### Class 0 — Local

The change affects only the current artifact and creates no dependency update.

### Class 1 — Referenced

Other files mention the changed element but do not govern it.

### Class 2 — Structural

The change affects downstream scenes, character logic, setups, payoffs, rules or production design.

### Class 3 — Canonical

The change modifies an authoritative project truth and requires decision-ledger entry plus repository-wide review.

## Required report

```yaml
change_summary: string
impact_class: 0 | 1 | 2 | 3
canon_status: unchanged | proposed | modified | conflicted
affected_nodes:
  - path: string
    relationship: governs | depends_on | references | contradicts | implements
    required_action: none | review | update | deprecate | replace
decision_ledger:
  entry_required: boolean
  rationale: string
continuity_checks: []
production_checks: []
unresolved_impacts: []
```

## Synchronization sequence

1. Identify the exact changed claim or decision.
2. Classify its authority and impact level.
3. Traverse one dependency hop.
4. Expand traversal when a structural or canonical effect is found.
5. Separate files that govern the truth from files that merely repeat it.
6. Update governing sources first.
7. Update dependent artifacts second.
8. Record superseded assumptions.
9. Run contradiction and continuity checks.
10. Report unresolved impacts.

## Safety rules

- Never silently rewrite approved canon to accommodate a draft.
- Never update dependent files before establishing the new governing truth.
- Never treat repeated text as independent authority.
- Never declare synchronization complete when known affected files remain unreviewed.
- Preserve history through decision records instead of erasing why a change occurred.

## Completion definition

Synchronization is complete when:

- the governing source is unambiguous;
- every known dependency has a status;
- contradictions are removed or explicitly unresolved;
- continuity and production effects are checked;
- the decision ledger records material changes;
- future agents can determine which truth is current.
