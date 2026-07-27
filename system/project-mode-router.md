# Project Mode Router

## Status

Canonical, repository-wide.

## Purpose

Select the correct creative operating mode before development or evaluation begins. The router prevents a prestige drama rubric, broad comedy rubric, exploitation rubric, children's rubric, or experimental rubric from being applied to the wrong project.

## Governing principle

**The engine must identify how the work intends to function before deciding how the work should improve.**

## Required inputs

The router must resolve:

1. format and platform;
2. primary audience;
3. intended experience;
4. dominant genre contract;
5. sincerity position;
6. realism level;
7. tonal range;
8. content intensity;
9. production constraints;
10. commercial, artistic, social, or personal objective;
11. anti-goals;
12. weighted success criteria.

## Operating modes

A project may activate one dominant mode and several secondary modes.

### Dramatic realism

Prioritizes behavioural credibility, emotional causality, consequence, subtext, and sustained human observation.

### Heightened entertainment

Prioritizes momentum, legibility, iconic character function, spectacle, audience reward, and controlled exaggeration.

### Broad comedy

Prioritizes comic premise, setup-payoff efficiency, escalation, timing, contrast, embarrassment, surprise, performer opportunity, and joke consequence.

### Camp and cult

Prioritizes commitment, excess, stylization, quotability, ritual pleasure, tonal permission, and memorable artificiality.

### Pulp, exploitation, and B-movie

Prioritizes premise delivery, sensation, speed, danger, lurid clarity, transgression, set pieces, posterability, and efficient production value.

### Family and children's nonsense

Prioritizes clarity, play, wonder, repetition, visual invention, emotional safety boundaries, participation, and age-appropriate surprise.

### Satire, parody, and spoof

Prioritizes target legibility, structural recognition, comic transformation, escalation, specificity, and distinction between imitation and critique.

### Experimental and absurdist

Prioritizes formal intention, controlled disorientation, image logic, rhythm, conceptual integrity, and the audience's evolving method of interpretation.

### Horror

Prioritizes vulnerability, anticipation, uncertainty, threat logic, atmosphere, escalation, transgression, and release according to the selected horror subtype.

### Action

Prioritizes objective clarity, spatial causality, momentum, physical problem-solving, escalation, consequence, performer identity, and payoff.

### Hybrid mode

A hybrid must declare hierarchy. It may not use genre labels as a substitute for deciding which contract governs moments of conflict.

Example:

```yaml
mode:
  primary: broad-comedy
  secondary:
    - creature-feature
    - romantic-comedy
  conflict_rule: comedy outranks realism; romance outranks cruelty in the ending
```

## Routing decisions

The router produces:

```yaml
routing:
  primary_mode: ""
  secondary_modes: []
  governing_contracts: []
  required_doctrine: []
  required_gates: []
  disabled_defaults: []
  weighted_criteria: {}
  unresolved_conflicts: []
```

## Conflict handling

When two active modes demand incompatible choices, the engine must:

1. identify the exact collision;
2. consult project hierarchy and anti-goals;
3. state which mode governs the moment;
4. preserve the losing mode where possible without blurring the scene;
5. record a binding rule when the collision will recur.

## Prohibited behaviour

The router must not:

- infer seriousness from budget, violence, grief, or visual polish;
- infer comedy from incompetence alone;
- assume self-awareness is required for absurd material;
- equate realism with quality;
- equate simplicity with shallowness;
- equate complexity with intelligence;
- activate every available doctrine;
- average conflicting modes into tonal neutrality;
- allow secondary genre expectations to overwrite the primary audience promise.

## Acceptance test

Routing passes when another agent can determine what the work is trying to do, which doctrines and gates apply, which defaults are disabled, and how conflicts between active modes should be resolved.