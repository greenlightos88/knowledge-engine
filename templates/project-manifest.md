# Project Manifest Template

Copy this file into a project's own repository and complete it. The manifest tells any connected model what to load, what is binding, how the work intends to function, and which workflow and evaluation gates apply.

```yaml
project:
  title: ""
  repository: ""
  format: "feature | short | vertical-series | series | prose | other"
  stage: "discovery | architecture | drafting | revision | packaging"
  authority: "exploratory | proposed | approved | locked"

creative_mandate:
  creator_statement: ""
  audience: ""
  intended_effects: []
  primary_mode: ""
  secondary_modes: []
  mode_hierarchy_rule: ""
  genre_contracts: []
  ending_contract: ""
  sincerity_rule: ""
  tonal_boundaries: []
  protected_qualities: []
  non_negotiables: []
  anti_goals: []
  prohibited_defaults: []

creative_success_profile:
  path: "path/to/creative-success-profile.md"
  weighted_criteria: {}
  failure_conditions: []

tone_calibration:
  sincerity: 0
  realism: 0
  emotional_intensity: 0
  comic_density: 0
  vulgarity: 0
  violence: 0
  grotesquerie: 0
  sentimentality: 0
  self_awareness: 0
  stylization: 0
  narrative_speed: 0
  consequence_severity: 0
  ambiguity: 0
  warmth: 0
  operational_notes: []

production:
  target_length: ""
  budget_band: ""
  cast_constraints: ""
  location_constraints: ""
  stunt_vfx_constraints: ""
  rating_or_content_boundary: ""
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
    - system/creator-intent-standard.md
    - system/project-mode-router.md
    - system/genre-contract-standard.md
    - system/tone-calibration-standard.md
    - quality/intent-alignment-gate.md
    - craft/story-architecture.md
    - craft/scene-mechanics.md
  conditional_modules: []
  required_gates: []
  disabled_defaults: []

conflict_rules: []
open_questions: []
deprecated_assumptions: []
current_priority: ""
definition_of_done: []
```

## Loading instruction

The working agent must:

1. read the manifest;
2. load higher-authority project sources before universal craft modules;
3. run `workflows/intent-and-mode-calibration.md` when the creative mode is missing, contradictory, or materially changed;
4. report contradictions instead of resolving them silently;
5. use Knowledge Engine standards as evaluation doctrine, not project canon;
6. apply only relevant modules and gates rather than loading every doctrine;
7. preserve declared protected qualities and anti-goals;
8. record binding new decisions in the project repository.

A project manifest is incomplete when it identifies genre but does not establish intended audience experience, sincerity, tonal operating range, protected qualities, weighted success criteria, and conflict hierarchy.