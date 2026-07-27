# Knowledge Engine

A model-agnostic creative development system for building original, emotionally credible, production-ready stories.

This repository is not a prompt dump and not a replacement for human authorship. It is an operational knowledge base that gives ChatGPT, Claude, Codex, Gemini, and future agents the same standards, workflow, vocabulary, and quality gates.

## Core principle

**Develop before generating. Diagnose before revising. Canon before invention. Specificity before polish.**

## What this repository does

- establishes durable writing and development standards;
- defines specialist creative agents with narrow responsibilities;
- provides repeatable workflows from idea through screenplay revision;
- detects generic, over-explained, derivative, or mechanically paced writing;
- enforces a dedicated Human Writing Gate on finished narrative work;
- separates universal craft knowledge from project-specific canon;
- creates auditable decisions instead of relying on chat memory;
- keeps the system portable across models and applications.

## Start here

1. Read `AGENTS.md`.
2. Read `system/operating-protocol.md`.
3. Load the relevant project brief and canon.
4. Select a workflow from `workflows/`.
5. Use the specialist agents in `agents/`.
6. For narrative work, read `human-writing/README.md` before drafting.
7. Run the output through `quality/acceptance-gates.md` and `human-writing/human-writing-gate.md` before approval.

## Repository map

```text
agents/          Specialist creative roles and handoff contracts
craft/           Reusable story, scene, character, dialogue, pacing, genre and cinematic knowledge
human-writing/   Perception, specificity, interiority, contradiction, voice, rhythm, omission and authorship quality
quality/         Anti-patterns, diagnostic rubrics and acceptance gates
system/          Operating rules, source hierarchy and decision protocol
templates/       Project briefs, scene cards, character files and decision logs
workflows/       Repeatable development and revision sequences
projects/        Project-specific adapters and manifests; canonical project content may live in its own repo
research/        Source notes, provenance rules and research intake
```

## Human Writing layer

The Human Writing layer exists because clarity, grammar, screenplay formatting and cinematic vocabulary are not proof of authorship quality. It tests whether a page is shaped by a particular consciousness, emotionally credible behaviour, differentiated voices, meaningful omission, local specificity, living rhythm and causally earned originality.

A fluent page that fails the Human Writing Gate is not approved.

## Model usage

Point the working agent to `AGENTS.md`, the project manifest, and the relevant doctrine files. Do not ask a model to "write something cinematic" without first loading the dramatic objective, character pressure, scene function, constraints, viewpoint consciousness and acceptance criteria.

## Versioning rule

Changes to universal craft doctrine require a recorded rationale. Project-specific decisions belong in the project repository, not silently inside this shared engine.