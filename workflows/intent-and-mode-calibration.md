# Intent and Mode Calibration Workflow

## Purpose

Establish how a project intends to function before architecture, drafting, critique, or revision begins.

## Required inputs

- creator statement;
- intended audience;
- format and platform;
- comparable experiences described as attributes rather than imitation targets;
- production constraints;
- rating or content boundary;
- commercial, artistic, personal, or experimental objective;
- known anti-goals.

## Workflow

### 1. Capture the raw desire

Record what the creator actually wants without translating it into professionalized language too early.

Preserve words such as stupid, trashy, fun, nasty, cheap, loud, cute, boring, slow, confusing, gross, sincere, ridiculous, or pointless. These may contain essential intent.

### 2. Convert desire into audience experience

Define what the audience should:

- anticipate;
- feel;
- understand;
- tolerate;
- laugh at;
- fear;
- admire;
- repeat;
- remember;
- receive at the ending.

### 3. Select project mode

Apply `system/project-mode-router.md`.

Choose:

- one primary mode;
- optional secondary modes;
- a hierarchy rule;
- an ending contract.

### 4. Define genre contracts

Apply `system/genre-contract-standard.md`.

Mark major conventions as accepted, heightened, bent, delayed, inverted, rejected, or unresolved.

### 5. Calibrate tone

Apply `system/tone-calibration-standard.md`.

Translate the tone into operational choices across writing, performance, image, sound, pacing, and consequence.

### 6. Build the Creative Success Profile

Complete `templates/creative-success-profile.md`.

Assign weights only to qualities relevant to the project. A criterion may receive zero weight.

### 7. Define protected qualities and anti-goals

State what critique must not sanitize, remove, solemnize, over-explain, or professionalize away.

### 8. Resolve contradictions

Examples:

- wants extreme gore but a young-child audience;
- wants unpredictable storytelling but strict formula delivery;
- wants cheap production but location-heavy spectacle;
- wants sincere emotion and constant self-aware interruption;
- wants broad comedy without embarrassment, exaggeration, conflict, or consequence.

Do not silently choose. Identify the collision and design a hierarchy or controlled compromise.

### 9. Produce the routing packet

```yaml
intent_packet:
  creator_mandate: ""
  target_audience: ""
  target_experience: []
  primary_mode: ""
  secondary_modes: []
  genre_contracts: []
  sincerity_rule: ""
  tone_profile: {}
  protected_qualities: []
  anti_goals: []
  constraints: []
  weighted_success_criteria: {}
  required_modules: []
  required_gates: []
  disabled_defaults: []
  conflict_rules: []
  ending_contract: ""
  unresolved_questions: []
```

### 10. Gate before development

Run `quality/intent-alignment-gate.md`.

When applicable, also run `quality/anti-prestige-drift-gate.md`.

## Revision use

Before accepting a revision, compare it to the routing packet. If the change improves generic craft while weakening protected qualities or target experience, reject it or redesign it within the project's mode.

## Definition of done

Calibration is complete when another specialist can make project-compatible decisions without guessing whether the work is sincere, comic, heightened, prestigious, camp, vulgar, realistic, absurd, commercial, experimental, or intentionally simple.