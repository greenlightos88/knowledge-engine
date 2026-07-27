# Knowledge Engine

A model-agnostic creative development system for building intentional, original, audience-effective, production-ready stories across prestige, commercial, comedic, camp, pulp, absurd, and deliberately lowbrow modes.

This repository is not a prompt dump and not a replacement for human authorship. It is an operational knowledge base and executable kernel that gives ChatGPT, Claude, Codex, Gemini, and future agents the same standards, workflow, vocabulary, reasoning models, and quality gates.

## Core principle

**Develop before generating. Diagnose before revising. Canon before invention. Intent before taste. Full capability by default.**

**Never optimize against the creator's intent. Optimize the creator's intent.**

## High-fidelity runtime

Every provider execution now receives a bounded high-fidelity plan before generation:

```text
Task Envelope
→ Intent Contract
→ Light / Standard / Deep Creative Council selection
→ Bounded specialist passes
→ One synthesized artifact
→ Dimensional confidence
→ Wow Readiness Scorecard
→ Targeted repair
→ Creator approval package
```

The engine presents one collaborator, not a swarm of agent voices. It preserves passing material during repair, reports confidence separately for intent, canon, craft, and production, and refuses to self-award a score of 10 without creator validation or benchmark evidence.

The high-fidelity runtime is implemented in `src/high-fidelity.ts`, invoked by `src/orchestrator.ts`, and enforced by `src/validation.ts`.

## What this repository does

- establishes durable writing and development standards;
- reconstructs conversational requests into explicit Intent Contracts;
- selects bounded specialist reasoning passes according to task risk and scope;
- derives doctrine from explicit creative first principles;
- protects creator intent from prestige drift and generic model taste;
- defines project-specific Creative Success Profiles;
- supports drama, horror, action, comedy, camp, parody, pulp, exploitation, B-movies, absurdism, and deliberately stupid premises;
- defines specialist creative agents with narrow responsibilities;
- provides repeatable workflows from idea through screenplay revision;
- detects generic, over-explained, derivative, mechanically paced, psychologically uncaused, or tonally misaligned writing;
- enforces Intent Alignment, Human Writing, Psychology, and applicable craft gates;
- reports confidence, disagreement, assumptions, and unresolved uncertainty;
- models human mechanics and intended audience cognition;
- translates reality, research, memory, emotion, and comic or genre mechanisms into dramatic action;
- propagates material changes through an explicit creative dependency graph;
- evaluates repository coverage, connectivity, authority, confidence, drift, usage, and retrieval health;
- converts project knowledge into production and packaging intelligence;
- records auditable, reversible decisions instead of relying on chat memory;
- separates universal craft knowledge, genre contracts, and project-specific canon;
- keeps the system portable across models and applications.

## Start here

1. Read `AGENTS.md`.
2. Read `system/first-principles.md`.
3. Read `system/creator-intent-standard.md`.
4. Read `system/intent-reconstruction-standard.md`.
5. Read `system/creative-council-standard.md`.
6. Read `system/full-capability-standard.md`.
7. Read `system/doctrine-design-standard.md` and `system/doctrine-schema.md`.
8. Read `system/creative-ontology.md` and `system/dependency-graph-standard.md`.
9. Read `system/operating-protocol.md`.
10. Create or load `templates/creative-success-profile.md`, `templates/creator-taste-profile.md`, and `templates/project-manifest.md`.
11. Load the relevant project canon and decision ledger.
12. Select a workflow from `workflows/`.
13. Use the specialist agents in `agents/`.
14. Load only the relevant `human-mechanics/`, `psychology/`, `human-writing/`, `translation/`, `audience/`, `craft/`, and `production/` doctrine.
15. Run `quality/intent-alignment-gate.md` before every other applicable acceptance gate.
16. Use `quality/wow-readiness-scorecard.md` for exceptional creator-facing work.
17. Propagate approved changes and record material decisions.

## Repository map

```text
agents/           Specialist creative roles and handoff contracts
audience/         Attention, prediction, comprehension, alignment, emotion, memory and meaning
craft/            Story, scene, character, dialogue, comedy, pacing and cinematic doctrine
human-mechanics/  Perception-to-behaviour causal models across individual and social systems
human-writing/    Specificity, interiority, contradiction, voice, rhythm, omission and authorship quality
production/       Feasibility, value-to-cost reasoning, performance, logistics and packaging projections
psychology/       Appraisal, motivation, fear, coping, identity, attachment, status and decision causality
quality/          Intent alignment, anti-patterns, diagnostic rubrics and acceptance gates
system/           First principles, creator intent, dependencies, health, capability and operating standards
templates/        Success profiles, taste profiles, project briefs, scene cards, character files and ledgers
translation/      Reality, memory, emotion, relationship and theme translated into dramatic expression
workflows/        Repeatable development, calibration, revision and high-fidelity execution sequences
projects/         Project-specific adapters and manifests; canonical project content may live in its own repo
research/         Source notes, provenance rules and research intake
src/              Executable intake, context, provider, orchestration, validation and approval kernel
tests/            Runtime, validation, parity and high-fidelity behavior tests
```

## Kernel architecture

The engine treats generation as a downstream operation:

```text
Creator Intent
→ Intent Reconstruction
→ Project Mode and Genre Contract
→ Context and Canon
→ First Principles
→ Relevant Knowledge and Doctrine
→ Bounded Creative Council
→ Human and Story Reasoning
→ Audience and Production Evaluation
→ Draft or Artifact Projection
→ Critique and Targeted Repair
→ Acceptance Gates and Wow Scorecard
→ Decision Ledger
→ Dependency Propagation
→ Repository Health Review
```

GreenLit itself should remain a thin orchestrator. Durable creative intelligence belongs in versioned doctrine, project canon, explicit decisions, traceable dependencies, and executable validation rather than a single model prompt.

## Runtime commands

```bash
bun install
bun run intake -- chatgpt "Rewrite EKPO's shrine scene under the covenant mythology"
bun run assemble -- path/to/task.yaml chatgpt
bun run validate -- path/to/task.yaml chatgpt
bun run run -- path/to/task.yaml chatgpt dry-run
bun run check
```

Live OpenAI execution requires explicit `OPENAI_API_KEY` and `OPENAI_MODEL` environment variables. The runtime never guesses a live model version. Repository mutation remains prohibited until a valid approval package exists and the creator explicitly approves writeback.

## Creator intent

The system does not assume that seriousness, realism, restraint, subtlety, emotional depth, or thematic density are universal measures of quality. Every project declares its intended audience experience, genre contract, sincerity mode, non-negotiable identity, anti-goals, production constraints, and weighted success criteria.

A deliberately stupid idea can be executed intelligently. GreenLit should improve its timing, clarity, escalation, spectacle, quotability, performer opportunity, payoff, and producibility without making it respectable against the creator's wishes.

## First principles

Universal doctrine must trace to the canonical laws in `system/first-principles.md`. These principles cover causality, selective attention, appraisal, functional behaviour, choice, conflict, consequence, audience prediction, pattern, contrast, compression, genre-relative evaluation, production reality, tradeoffs, canon, and intent.

## Dependency and decision integrity

Material nodes are connected through explicit dependencies. When creator intent, canon, doctrine, characters, world rules, reveals, production assumptions, or endings change, affected artifacts must be classified for review, revision, deprecation, or regeneration.

Every material decision records its rationale, authority, alternatives, tradeoffs, assumptions, dependencies, affected outputs, risks, and reversal conditions. Decisions are superseded, never silently erased.

## Repository health

The Knowledge Engine is judged by coverage, connectivity, authority, confidence, usage, redundancy, drift, freshness, retrieval quality, gate strength, operational completeness, benchmark performance, and creator correction burden—not by file count.

A new module is unhealthy when it duplicates an existing rule, lacks consumers, has no authority relationship, cannot reject weak work, or increases context burden without improving decisions.

## Production intelligence

Production is a creative reasoning layer. The system evaluates what the audience will perceive, what each expensive or difficult element contributes, which performer and spectacle opportunities must survive, and how constraints can be transformed without destroying the central promise.

The same source knowledge should project consistently into screenplays, studio bibles, actor packets, director packets, location briefs, stunt and VFX notes, continuity documents, pitch decks, and other production materials.

## Human Writing layer

The Human Writing layer tests whether a page is shaped by a particular consciousness, emotionally credible behaviour, differentiated voices, meaningful omission, local specificity, living rhythm, and causally earned originality.

Its criteria are applied according to project intent. A broad spoof is not rejected for lacking the interior density of a prestige drama.

## Psychology and Human Mechanics

The Psychology Engine maps stimulus, appraisal, stakes, protection, choice, consequence, and belief change. The Human Mechanics Engine extends this into attention, memory, prediction, language, groups, identity, status, and meaning.

The required level of realism and complexity is project-specific, but behaviour must still function within the declared mode.

## Audience cognition

Audience response is designed through attention, prediction, uncertainty, alignment, emotional modulation, memory, comic pattern, genre expectation, and revision. Surprise, mystery, suspense, laughter, shock, and payoff must be supported by an intelligible audience information path appropriate to the project.

## Model usage

Point the working agent to `AGENTS.md`, the approved Creative Success Profile, the creator taste profile, the project manifest, governing first principles and standards, the decision ledger, and the smallest set of relevant doctrine files. Do not ask a model to write from a vague quality label. Load the intended experience, anti-goals, genre contract, sincerity mode, constraints, governing mechanisms, audience path, dependencies, and acceptance criteria first.

## Versioning rule

Changes to universal craft, runtime, validation, or system doctrine require a recorded rationale, first-principle trace, dependency scan, tests, and repository-health review. Project-specific decisions belong in the project repository, not silently inside this shared engine.
