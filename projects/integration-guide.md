# Project Integration Guide

Knowledge Engine contains reusable doctrine. Story canon remains inside each story repository.

## Recommended project structure

```text
project-repo/
├── PROJECT_MANIFEST.md
├── constitution/
├── canon/
├── characters/
├── structure/
├── screenplay/
├── continuity/
├── research/
├── decisions/
└── exports/
```

## Integration sequence

1. Copy `templates/project-manifest.md` into the project root as `PROJECT_MANIFEST.md`.
2. Complete the source hierarchy with exact repository paths.
3. Pin the Knowledge Engine commit or release used by the project.
4. Load project canon before Knowledge Engine craft doctrine.
5. Select the narrowest applicable workflow and agents.
6. Store every project-specific binding decision in the project repository.
7. Update the manifest whenever the authoritative draft or outline changes.

## What belongs here

- universal craft standards;
- shared agent definitions;
- reusable diagnostic rubrics;
- workflow contracts;
- neutral templates;
- research and provenance rules.

## What does not belong here

- EKPO mythology;
- MANA character canon;
- project-specific plot decisions;
- confidential production material;
- current screenplay drafts;
- references licensed only for one project.

## Model invocation packet

Provide a working model with:

```text
1. Knowledge Engine AGENTS.md
2. Knowledge Engine system/operating-protocol.md
3. The project's PROJECT_MANIFEST.md
4. The exact project source files required for the task
5. The requested deliverable and authority level
6. The selected workflow and acceptance gates
```

## Example instruction

```text
Operate under Knowledge Engine AGENTS.md.
Load this project's PROJECT_MANIFEST.md and obey its source hierarchy.
Use the Story Architect and Character Psychologist roles to diagnose the current outline.
Do not draft screenplay pages.
Label all new material as PROPOSAL.
Return a ranked diagnosis, up to three solutions, a recommendation, canon impact and next handoff.
```

## Version drift

When Knowledge Engine changes, projects do not automatically inherit new doctrine. Review the change log, update the pinned version, then record any project impact. This protects active projects from silent workflow changes.
