# Creative Dependency Graph Standard

## Status
Canonical, repository-wide.

## Purpose
Make story, canon, doctrine, workflows, and production artifacts behave as connected systems rather than isolated documents.

## Node classes

- first principle
- universal doctrine
- workflow
- quality gate
- project intent
- project canon
- character
- relationship
- location
- object or prop
- rule or system
- scene
- sequence
- reveal
- theme or motif
- production constraint
- output artifact
- decision
- research source

## Required edge types

- `depends_on`
- `defines`
- `constrains`
- `contradicts`
- `supersedes`
- `supports`
- `reveals`
- `foreshadows`
- `pays_off`
- `appears_in`
- `changes`
- `projects_into`
- `requires_review_when_changed`

## Minimum metadata

Every material node should expose:

```yaml
id: ""
type: ""
title: ""
status: "exploratory | proposed | approved | locked | deprecated"
source: ""
confidence: "verified | supported | working | speculative"
dependencies: []
dependents: []
affected_artifacts: []
last_reviewed: ""
owner_or_authority: ""
```

## Change propagation protocol

When a node changes:

1. identify the exact old and new claims;
2. locate all direct dependents;
3. locate second-order dependents where the change alters meaning, not merely wording;
4. classify each dependent as unaffected, verify, revise, deprecate, or regenerate;
5. update the decision ledger;
6. run relevant continuity, intent, genre, psychology, audience, and production gates;
7. do not mark the change complete while required reviews remain unresolved.

## Example

```text
Covenant purpose
  defines -> Shrine function
  constrains -> Solomon history
  supports -> Entity interpretation
  foreshadows -> Ending reveal
  projects_into -> Studio Bible
  projects_into -> Actor packet
  projects_into -> Pitch deck
```

Changing the covenant purpose therefore triggers review of every listed dependent. It does not justify blind text replacement because each artifact expresses the knowledge for a different audience and purpose.

## One-source-of-truth rule
A canonical fact should have one authoritative node. Other files reference, interpret, summarize, or project that node; they must not become independent competing sources.

## Projection rule
A screenplay, studio bible, actor packet, director packet, and marketing synopsis may describe the same node differently. Variation in expression is allowed. Variation in underlying fact is not, unless deliberately marked as viewpoint, concealment, unreliable narration, or marketing simplification.

## Circularity
Circular dependencies are allowed only when the relationship is genuinely reciprocal, such as character and relationship development. Accidental circular authority is prohibited.

## Orphan detection
A node is unhealthy when it has no clear authority, no consumer, no workflow use, or no reason to exist. Orphans must be integrated, archived, or removed.

## Acceptance test
The graph passes when a material change can be traced to all affected creative and production outputs without relying on chat memory or manual recollection.