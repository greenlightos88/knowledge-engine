# Repository Health Standard

## Status
Canonical, repository-wide.

## Purpose
Measure whether the Knowledge Engine is usable, connected, current, auditable, and capable of rejecting weak work—not merely large.

## Health dimensions

### Coverage
Do the required disciplines, project modes, workflows, and output types have sufficient doctrine?

Coverage is not file count. A topic is covered only when the system can teach, diagnose, repair, integrate, and test it.

### Connectivity
Are doctrines connected to first principles, workflows, gates, templates, agents, and downstream artifacts?

### Authority
Can the system identify which source controls when documents disagree?

### Confidence
Are research-backed claims, working models, hypotheses, and project canon clearly distinguished?

### Usage
Are doctrines actually loaded or referenced by active workflows and gates?

### Redundancy
Do multiple files repeat the same rule without a clear hierarchy or specialization?

### Drift
Have project canon, templates, workflows, or outputs diverged from governing doctrine or declared intent?

### Freshness
Are volatile research, platform, legal, production, and market assumptions reviewed at an appropriate cadence?

### Stability
Which nodes change frequently, and are their dependents designed to absorb those changes safely?

### Retrieval quality
Can a working agent load the smallest sufficient set of files without receiving contradictory, bloated, or irrelevant context?

### Gate strength
Can acceptance tests reject fluent but inadequate work, including work that is polished yet off-intent?

### Operational completeness
Can the documented process actually be executed without hidden steps or reliance on the original author?

## Health statuses

- `healthy` — complete, connected, current, and actively used
- `watch` — usable but has a known weakness
- `degraded` — creates material risk of wrong or inconsistent execution
- `blocked` — cannot be safely used until repaired
- `deprecated` — retained only for history or migration

## Required audit outputs

A health audit must produce:

```yaml
scope: ""
date: ""
overall_status: ""
coverage_gaps: []
orphan_nodes: []
redundant_nodes: []
authority_conflicts: []
stale_assumptions: []
broken_dependencies: []
unused_doctrine: []
weak_gates: []
retrieval_risks: []
priority_repairs: []
```

## Priority model
Repair order should consider:

1. probability of causing wrong creative decisions;
2. severity of downstream impact;
3. number of dependent projects or artifacts;
4. likelihood of repeated manual work;
5. cost and reversibility of repair.

## Anti-bloat rule
Repository growth is not automatically progress. New doctrine must close a real coverage gap, improve retrieval, strengthen diagnosis, or replace weaker architecture.

## Health gate
A new module fails repository health when it duplicates an existing rule, has no consumers, lacks an authority relationship, cannot be tested, or increases context burden without increasing decision quality.

## Review cadence

- review governing system files after any architectural change;
- review project adapters after material canon changes;
- review volatile external claims according to source volatility;
- perform a full repository health audit before major version releases.

## Acceptance test
The repository is healthy when an unfamiliar competent agent can locate the governing truth, choose the correct workflow, retrieve the necessary doctrine, execute the task, detect failure, propagate changes, and explain its decisions without relying on undocumented memory.