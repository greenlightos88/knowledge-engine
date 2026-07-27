# Model Adapter Layer

## Purpose

Translate the shared GreenLit kernel into model-specific operating instructions without duplicating or changing creative doctrine.

The adapter layer exists because models differ in context handling, tool use, structured output reliability, planning behaviour and repository access. Those differences should affect interface instructions, never the underlying truth of the system.

## Governing rule

Doctrine is model-independent.

Adapters may define:

- context assembly preferences;
- tool-use conventions;
- output formatting;
- uncertainty reporting;
- validation behaviour;
- repository write protocol;
- model-specific failure prevention.

Adapters may not redefine:

- creator intent;
- canon;
- project authority;
- creative standards;
- acceptance gates;
- genre contracts;
- doctrine conclusions.

## Required adapter interface

Every adapter must define:

1. model identity and operating assumptions;
2. authority loading order;
3. context-window strategy;
4. task decomposition policy;
5. tool and repository behaviour;
6. structured output contract;
7. self-evaluation protocol;
8. uncertainty and limitation reporting;
9. synchronization responsibilities;
10. known model-specific failure modes.

## Adapter selection

The runtime selects one adapter after the task envelope is created and before the context packet is assembled.

```text
request
→ task envelope
→ model adapter
→ context packet
→ execution pipeline
→ validation
→ synchronization report
```

## Current adapters

- `chatgpt/adapter.md`

Future adapters should be added only when they improve real execution. Empty compatibility folders are prohibited.
