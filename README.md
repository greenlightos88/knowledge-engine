# Knowledge Engine

A model-agnostic creative development system for building original, emotionally credible, production-ready stories.

This repository is not a prompt dump and not a replacement for human authorship. It is an operational knowledge base that gives ChatGPT, Claude, Codex, Gemini, and future agents the same standards, workflow, vocabulary, reasoning models, and quality gates.

## Core principle

**Develop before generating. Diagnose before revising. Canon before invention. Specificity before polish. Full capability by default.**

## What this repository does

- establishes durable writing and development standards;
- defines specialist creative agents with narrow responsibilities;
- provides repeatable workflows from idea through screenplay revision;
- detects generic, over-explained, derivative, mechanically paced, or psychologically uncaused writing;
- enforces dedicated Human Writing and Psychology gates;
- requires full-capability, dependency-aware execution across the repository;
- separates universal craft knowledge from project-specific canon;
- creates auditable decisions instead of relying on chat memory;
- keeps the system portable across models and applications.

## Start here

1. Read `AGENTS.md`.
2. Read `system/full-capability-standard.md`.
3. Read `system/doctrine-design-standard.md`.
4. Read `system/operating-protocol.md`.
5. Load the relevant project brief and canon.
6. Select a workflow from `workflows/`.
7. Use the specialist agents in `agents/`.
8. For narrative work, load `human-writing/README.md` and `psychology/README.md`.
9. Run the output through all relevant quality, Human Writing, and Psychology gates before approval.

## Repository map

```text
agents/          Specialist creative roles and handoff contracts
craft/           Story, scene, character, dialogue, pacing and cinematic doctrine
human-writing/   Perception, specificity, interiority, contradiction, voice, rhythm, omission and authorship quality
psychology/      Appraisal, motivation, fear, coping, identity, attachment, status and decision causality
quality/         Anti-patterns, diagnostic rubrics and acceptance gates
system/          Full-capability standards, operating rules, source hierarchy and doctrine design
              
templates/       Project briefs, scene cards, character files and decision logs
workflows/       Repeatable development and revision sequences
projects/        Project-specific adapters and manifests; canonical project content may live in its own repo
research/        Source notes, provenance rules and research intake
```

## Full-capability standard

The system must use the strongest relevant reasoning available, preserve established user expectations, anticipate foreseeable needs, apply specialist perspectives, update dependencies, and leave the repository more coherent after every change.

The user should not have to repeatedly raise the quality threshold or restate standards that are already canonical.

## Human Writing layer

The Human Writing layer tests whether a page is shaped by a particular consciousness, emotionally credible behaviour, differentiated voices, meaningful omission, local specificity, living rhythm, and causally earned originality.

A fluent page that fails the Human Writing Gate is not approved.

## Psychology Engine

The Psychology Engine maps stimulus, appraisal, stakes, protection, choice, consequence, and belief change. It rejects behaviour that exists only for plot movement and requires major decisions to be psychologically constrained, relationship-specific, and dramatically consequential.

A dramatic page that fails the Psychology Gate is not approved.

## Model usage

Point the working agent to `AGENTS.md`, the project manifest, the governing system standards, and the relevant doctrine files. Do not ask a model to "write something cinematic" without first loading the dramatic objective, character pressure, scene function, constraints, viewpoint consciousness, psychological mechanism, dependencies, and acceptance criteria.

## Versioning rule

Changes to universal craft or system doctrine require a recorded rationale and dependency scan. Project-specific decisions belong in the project repository, not silently inside this shared engine.