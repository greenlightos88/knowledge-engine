# Context Assembly Contract

## Purpose

Define how GreenLit converts a task envelope into the smallest sufficient context packet for any supported model.

The context assembler exists to improve decision quality while preventing dilution, contradiction, unnecessary token use and accidental authority flattening.

## Inputs

A context assembly request requires:

- a valid task envelope;
- selected model adapter;
- project manifest;
- creator intent;
- available canon sources;
- `llm/routing-index.yaml`;
- doctrine dependency metadata;
- output and validation requirements.

## Output

The assembler returns one ordered packet containing:

1. execution instruction;
2. authority map;
3. task envelope;
4. current user instruction;
5. creator intent and success profile;
6. relevant canon excerpts;
7. primary doctrine;
8. justified secondary doctrine;
9. gates and output contract;
10. synchronization obligations;
11. unresolved authority or evidence gaps.

## Authority order

Context must be ordered by authority, not by retrieval score.

```text
current explicit instruction
→ approved project canon
→ creator intent and project manifest
→ approved project decisions
→ GreenLit doctrine
→ supporting research
→ model inference
```

Lower-authority material may not silently override higher-authority material.

## Relevance test

Every included document or excerpt must answer at least one of these questions:

- Does it define the requested outcome?
- Does it constrain what may change?
- Does it provide authoritative project truth?
- Does it diagnose the likely failure?
- Does it provide a repair mechanism?
- Does it define validation?
- Does it identify downstream consequences?

If none apply, exclude it.

## Size limits

Default packet limits:

- always-load foundation: maximum five documents;
- project canon: excerpted, with no arbitrary document-count limit when authority requires it;
- primary doctrine: maximum four documents;
- secondary doctrine: maximum four documents;
- dependency traversal: one hop;
- duplicate concept coverage: prohibited unless perspectives materially differ;
- full repository load: prohibited by default.

A limit may be exceeded only when the task envelope declares a repository-wide audit, full-document transformation, canon synchronization or continuity pass.

## Excerpting rules

Use excerpts when:

- only one section establishes relevant canon;
- a long file contains unrelated material;
- repeated boilerplate adds no decision value;
- the model needs a specific scene, character or rule rather than the full artifact.

Every excerpt must retain:

- source path;
- authority classification;
- heading or location marker;
- enough surrounding context to prevent distortion;
- version or commit reference when available.

Never excerpt in a way that removes a qualification, exception or contradiction relevant to the task.

## Conflict handling

When retrieved sources conflict:

1. preserve both sources in the packet;
2. label their authority;
3. identify the conflict explicitly;
4. apply the authority hierarchy when possible;
5. mark unresolved conflicts when authority is equal or unclear;
6. prohibit invention as a conflict-resolution method.

## Doctrine selection

Select doctrine by route first, then dependencies.

Doctrine may be added outside the route only when:

- the diagnosis reveals a second-order problem;
- a declared dependency is necessary to apply the primary doctrine;
- a required gate depends on it;
- the task spans multiple valid routes.

The packet must record the reason for every doctrine file included.

## Model adaptation

The shared packet content remains stable across models.

The selected adapter may change:

- instruction formatting;
- section ordering after authority-critical content;
- output serialization;
- chunk boundaries;
- tool-use instructions;
- verbosity controls.

The adapter may not change:

- authority;
- selected canon;
- doctrine meaning;
- acceptance gates;
- output obligations;
- synchronization scope.

## Assembly record

Every packet should expose:

```yaml
assembly_record:
  model:
  route:
  included_sources:
    - path:
      authority:
      reason:
      full_or_excerpt:
  excluded_candidates:
    - path:
      reason:
  conflicts:
  unresolved_gaps:
  estimated_context_size:
```

## Failure conditions

Context assembly fails when:

- no task envelope exists;
- creator intent is required but unavailable;
- a canon conflict is hidden;
- doctrine is selected without relevance;
- context exceeds limits without justification;
- source authority is erased;
- the model adapter changes project truth;
- validation or synchronization obligations are omitted.

## Acceptance test

A packet passes when another compliant model can inspect the assembly record and understand:

- why each source was included;
- which source has authority;
- what the model must produce;
- what it may not invent;
- how success will be judged;
- what downstream systems may need updating.