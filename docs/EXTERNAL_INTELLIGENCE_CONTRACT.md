# External Intelligence Contract

## Purpose

The Knowledge Engine is an external creative-intelligence provider for GreenLit.

GreenLit must not depend on the Knowledge Engine's internal council passes, prompts, model routing, repository layout, or repair machinery. Those details may change without requiring a GreenLit migration.

The stable payload boundary is defined in `src/external-contract.ts` and versioned independently through `contract_version`.

The transport-neutral execution boundary is defined in `src/external-service.ts`. HTTP, Convex actions, queue workers, local commands and tests should call this service rather than importing internal orchestration modules.

## Authority Boundary

The Knowledge Engine may:

- reconstruct intent;
- produce evidence-linked Candidates;
- identify uncertainty;
- identify contradictions and dependencies;
- recommend creator review actions;
- produce proposed artifact content.

The Knowledge Engine may not:

- mutate GreenLit Canon;
- claim creator approval;
- create an approved snapshot;
- write directly into a GreenLit project;
- conceal unresolved Canon conflicts.

Every returned Candidate has:

```text
review_status = proposed
canon_effect = none_until_creator_approval
```

Every response declares:

```text
creator_approval_required = true
canon_mutated = false
```

GreenLit remains responsible for authentication, authorization, persistence, Candidate review, Canon events, snapshots, compilation, and delivery.

## Request Contract

A request contains:

- contract version;
- stable request identity;
- project and optional snapshot identity;
- actor identity and role;
- requested execution mode;
- raw and normalized objective;
- success conditions;
- preservation and production constraints;
- locked decisions and inference limits;
- at least one provenance-bearing source;
- requested Candidate and diagnostic capabilities.

Sources use stable source IDs so evidence can be linked back to GreenLit records without exposing database implementation details.

## Response Contract

A response contains:

- the matching request ID;
- engine provider, model and version metadata;
- reconstructed intent;
- zero or more proposed Candidates;
- evidence records linked to source IDs;
- dimensional confidence and uncertainty;
- contradictions;
- downstream dependencies;
- diagnostics;
- mandatory creator-review state.

Internal `council_report`, model prompts and validation passes are intentionally absent from the external response.

## Status Semantics

Response-body status:

- `completed`: the engine produced a reviewable result without unresolved Canon conflicts or unresolved synchronization questions.
- `blocked`: a result exists, but unresolved Canon or synchronization issues prevent safe acceptance.
- `failed`: the engine could not produce a valid contract response.

A `completed` response is still only a proposal. It does not mean approved.

Service-boundary result semantics:

- `200`: a valid versioned external response was produced;
- `400 invalid_request`: the request failed contract validation and execution did not begin;
- `409 authority_conflict`: supplied authority contains unresolved conflicts and execution did not begin;
- `502 execution_failed`: the underlying engine or provider failed; the caller may retry according to policy;
- `502 invalid_engine_result`: the engine returned data that failed its internal result contract and must not be persisted.

Every service error includes the same `contract_version`, the `request_id` when recoverable, a stable error code, a retryable flag and structured diagnostic details.

## Execution Boundary

`handleExternalIntelligenceRequest(rawRequest, executor)` owns the invariant boundary:

1. validate the external request;
2. reject unresolved authority conflicts before model execution;
3. invoke one internal engine executor;
4. validate the internal creative result;
5. translate only stable product concepts into the external response;
6. preserve creator approval and non-mutation guarantees.

The injected executor is the only part that knows how internal planning, council selection, provider routing and repair operate. Transport adapters must not duplicate those concerns.

## Versioning

The initial contract version is `1.0`.

Compatible additions should remain optional or receive safe defaults. Breaking field or semantic changes require a new contract version and an explicit adapter or migration path in GreenLit.

The package version and contract version are separate. Internal Knowledge Engine releases may change without changing the external contract.

## Integration Rule

GreenLit should parse every response with its own copy or generated representation of the versioned contract before persistence.

The expected application path is:

```text
GreenLit Fragment and project context
→ ExternalIntelligenceRequest 1.0
→ transport adapter
→ handleExternalIntelligenceRequest
→ internal executor
→ ExternalIntelligenceResponse 1.0
→ GreenLit Candidate persistence
→ creator review
→ explicit Canon event
```

No network transport is prescribed by this contract. Authentication, rate limiting, request persistence, retry policy and deployment remain responsibilities of the eventual transport adapter and hosting environment.