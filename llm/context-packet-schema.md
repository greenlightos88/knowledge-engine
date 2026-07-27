# Context Packet Schema

A context packet is the bounded unit handed to an LLM for one task.

```yaml
packet_id: CTX-YYYYMMDD-001
packet_version: 1.0
project:
  id: project-slug
  title: Project Title
  mode: prestige | commercial | camp | pulp | absurd | hybrid
  stage: concept | outline | draft | revision | packaging | production

authority:
  creator_intent_source: path
  canon_source: path
  decision_ledger_source: path
  precedence:
    - creator-approved canon
    - approved project decisions
    - project manifest
    - universal doctrine
    - agent proposals

task:
  task_type: diagnose | develop | generate | revise | evaluate | synchronize
  objective: precise outcome
  artifact_target: path-or-description
  scope_in: []
  scope_out: []

constraints:
  format: screenplay | bible | actor-packet | memo | structured-data
  tone: []
  production: []
  non_negotiables: []
  anti_goals: []

canon:
  binding_facts: []
  open_questions: []
  prohibited_assumptions: []

doctrine:
  required:
    - id: doctrine-id
      path: repository/path.md
      reason: why it governs this task
  optional: []
  excluded: []

evidence:
  source_material: []
  observations: []
  unresolved_conflicts: []

output_contract:
  schema: path-or-inline-schema
  required_sections: []
  maximum_length: null
  preserve_formatting: true
  change_log_required: true

evaluation:
  gates: []
  success_criteria: []
  reject_when: []

handoff:
  downstream_artifacts: []
  decisions_requiring_creator_approval: []
  dependency_scan_required: true
```

## Packet assembly rules

- Use explicit paths and identifiers where possible.
- Include binding facts, not entire source documents, unless exact prose is required.
- Include unresolved contradictions rather than silently resolving them.
- Every included doctrine file must have a stated reason.
- Every excluded high-relevance doctrine file should have a reason when token limits force omission.
- Keep project facts separate from universal knowledge.

## Standard model response envelope

```yaml
response_id: RSP-001
status: complete | partial | blocked
summary: concise result

evidence: []
inferences: []
recommendations: []
proposed_decisions: []
uncertainties: []

artifact:
  type: null
  content: null

quality:
  gates_run: []
  failures: []
  repairs_applied: []

dependencies:
  affected: []
  verify: []
  revise: []
  regenerate: []

approval_required: []
```

The response envelope may be rendered as JSON, YAML or headings, but its semantic distinctions must remain intact.
