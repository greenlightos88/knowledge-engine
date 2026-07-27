# Project Manifest Template

Copy this file into a project's own repository and complete it. The manifest tells any connected model what to load, what is binding and what workflow to use.

```yaml
project:
  title: ""
  repository: ""
  format: "feature | short | vertical-series | series | prose | other"
  stage: "discovery | architecture | drafting | revision | packaging"
  authority: "exploratory | proposed | approved | locked"

creative_mandate:
  audience: ""
  intended_effect: ""
  genre_promise: ""
  tonal_boundaries: []
  non_negotiables: []
  prohibited_defaults: []

production:
  target_length: ""
  budget_band: ""
  cast_constraints: ""
  location_constraints: ""
  stunt_vfx_constraints: ""
  delivery_format: ""

source_hierarchy:
  constitution: "path/to/constitution.md"
  canon: "path/to/canon/"
  decisions: "path/to/decision-log.md"
  continuity: "path/to/continuity/"
  current_outline: "path/to/current-outline.md"
  current_draft: "path/to/current-draft.fountain"
  research: "path/to/research/"

knowledge_engine:
  version_or_commit: ""
  required_modules:
    - craft/story-architecture.md
    - craft/character-and-psychology.md
    - craft/scene-mechanics.md
    - craft/dialogue-and-subtext.md
    - quality/acceptance-gates.md

open_questions: []
deprecated_assumptions: []
current_priority: ""
definition_of_done: []
```

## Loading instruction

The working agent must:

1. read the manifest;
2. load higher-authority project sources before universal craft modules;
3. report contradictions instead of resolving them silently;
4. use Knowledge Engine standards as evaluation doctrine, not project canon;
5. record binding new decisions in the project repository.
