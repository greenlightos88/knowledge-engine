# Curiosity, Questions and Information Gaps

## Purpose

Design questions that pull the audience forward without replacing comprehension with vagueness.

## Core mechanism

Curiosity emerges when the audience recognizes a meaningful gap between what they know and what they want or need to know.

```text
perceived gap
→ value assigned to answer
→ plausible path toward answer
→ continued attention
```

A gap that is invisible creates no curiosity. A gap that feels irrelevant creates no urgency. A gap with no believable route to resolution creates frustration.

## Question classes

- **causal:** Why did this happen?
- **intentional:** What does this person want?
- **predictive:** What will happen next?
- **identity:** Who or what is this?
- **relational:** What happened between them?
- **procedural:** How can this be done?
- **moral:** What choice should be made?
- **interpretive:** What does this event mean?

## Decision rules

- Every major sequence should activate at least one question appropriate to its intended pleasure.
- The audience must understand the subject of the question even when the answer remains hidden.
- Questions gain force when the answer changes stakes, identity, prediction or relationship.
- Partial answers should usually create a sharper question rather than merely delay closure.
- Do not maintain curiosity by withholding information every relevant character would naturally communicate.
- Curiosity should be paid off, transformed or consciously abandoned; forgotten questions become trust debt.

## Diagnostics

Symptoms of weak curiosity:

- the audience understands events but feels no need to continue;
- scenes answer their own questions immediately;
- mysteries depend on undefined objects or unexplained terminology;
- every question has equal weight;
- the withheld answer would not alter anything important;
- characters behave unnaturally to preserve concealment;
- a reveal closes a question without opening consequence.

## Repair strategies

- convert abstract uncertainty into a precise audience question;
- attach the answer to a character cost or imminent decision;
- reveal enough context for the audience to recognize the gap;
- create an observable route toward discovery;
- answer one layer while exposing a deeper causal layer;
- remove low-value questions competing with the dominant one;
- make delayed information actively affect present behaviour.

## Tradeoffs

- More open questions can increase propulsion but reduce emotional focus.
- Faster answers improve clarity but can weaken anticipation.
- Strategic withholding can create mystery; excessive withholding damages character credibility.
- A powerful central question may simplify the narrative but also make secondary material feel subordinate.

## Dependencies

Requires:

- `cognition/attention-salience-and-selection.md`
- `cognition/cognitive-load-and-chunking.md`

Influences:

- `craft/pacing-tension-and-revelation.md`
- `craft/scene-mechanics.md`
- `cognition/prediction-expectation-and-surprise.md`
- `cognition/memory-encoding-and-recall.md`

## LLM retrieval metadata

```yaml
id: cognition.curiosity_information_gaps
task_signals:
  - no reason to keep watching
  - weak mystery
  - flat scene propulsion
  - unanswered questions
  - artificial withholding
outputs:
  - active_question_map
  - gap_value_diagnosis
  - payoff_plan
  - repair_options
```
