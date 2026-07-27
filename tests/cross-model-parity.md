# Cross-Model Parity Standard

## Purpose

Verify that GreenLit produces stable creative decisions across supported models while allowing model-specific strengths in execution.

Parity does not mean identical wording. It means equivalent obedience to authority, diagnosis, constraints, gates and synchronization duties.

## Models under test

- ChatGPT
- Claude
- any future model marked `first_class` in `adapters/model-registry.yaml`

## Required invariants

For the same task envelope and source set, compliant models must agree on:

- the authority hierarchy;
- the active creator intent;
- established canon facts;
- unresolved canon conflicts;
- the primary diagnosis;
- constraints that may not be violated;
- mandatory acceptance gates;
- downstream files or systems affected.

Models may differ in:

- prose rhythm;
- organization of explanation;
- number of repair alternatives;
- degree of compression;
- model-specific tool strategy;
- stylistic execution when multiple outputs satisfy the same intent.

## Disallowed divergence

Parity fails when one model:

- invents canon another model correctly leaves unresolved;
- selects lower-authority material over approved canon;
- changes project mode or tone without instruction;
- skips diagnosis and performs generic rewriting;
- ignores a required gate;
- omits material synchronization consequences;
- expands scope without cause;
- produces only analysis when an artifact was requested.

## Test procedure

1. Use one frozen task envelope.
2. Use identical project and doctrine sources.
3. Assemble packets through `kernel/context-assembly-contract.md`.
4. Apply the appropriate model adapter.
5. Collect outputs using the same output contract.
6. Compare invariant fields before comparing prose.
7. Record justified and unjustified divergence.
8. repair the adapter, router, doctrine or task envelope responsible.

## Comparison record

```yaml
parity_test:
  fixture:
  models:
  authority_match: pass | fail
  canon_match: pass | fail
  diagnosis_match: pass | fail | partial
  constraint_match: pass | fail
  gate_match: pass | fail
  synchronization_match: pass | fail | partial
  artifact_equivalence: pass | fail | subjective_review
  justified_differences:
  failures:
  likely_layer:
    - task_envelope
    - routing
    - context_assembly
    - adapter
    - doctrine
    - validation
```

## Acceptance rule

A first-class adapter is not production-ready until it passes representative fixtures for:

- scene revision;
- character development;
- canon refactor;
- continuity audit;
- full-document synthesis;
- production-aware redesign;
- repository synchronization.

## Governing principle

GreenLit owns the reasoning standard.

The model supplies capability.

Changing the model must not change the project's truth.