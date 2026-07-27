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
- separates universal craft knowledge from project-specific canon;
- creates auditable decisions instead of relying on chat memory;
- keeps the system portable across models and applications.

## Start here

1. Read `AGENTS.md`.
2. Read `system/operating-protocol.md`.
3. Load the relevant project brief and canon.
4. Select a workflow from `workflows/`.
5. Use the specialist agents in `agents/`.
6. Run the output through `quality/acceptance-gates.md` before approval.

## Repository map

```text
agents/       Specialist creative roles and handoff contracts
craft/        Reusable story, scene, character, dialogue, pacing, genre and cinematic knowledge
quality/      Anti-patterns, diagnostic rubrics and acceptance gates
system/       Operating rules, source hierarchy and decision protocol
templates/    Project briefs, scene cards, character files and decision logs
workflows/    Repeatable development and revision sequences
projects/     Project-specific adapters and manifests; canonical project content may live in its own repo
research/     Source notes, provenance rules and research intake
```

## Model usage

Paste or point the working agent to `AGENTS.md`, then provide the task and the project manifest. Do not ask a model to "write something cinematic" without first loading the dramatic objective, character pressure, scene function, constraints, and acceptance criteria.

## Versioning rule

Changes to universal craft doctrine require a recorded rationale. Project-specific decisions belong in the project repository, not silently inside this shared engine.
