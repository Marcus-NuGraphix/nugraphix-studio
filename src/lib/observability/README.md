# Observability Layer

This directory owns shared, cross-feature observability primitives.

## Responsibilities

1. Structured logging with stable event payload shape.
2. Redaction of common sensitive fields before emission.
3. Mutation log helpers aligned with Phase 4 and Phase 5 contracts.

## File map

1. `logger.ts`: logger implementation with child-context composition.
2. `mutation-log.ts`: helper for mutation log records
   (`feature`, `action`, `userId`, `result`, `errorCode`, `executionTimeMs`).
3. `incident-log.ts`: typed incident event logging with S1/S2/S3 severity and
   incident lifecycle status (`detected`, `investigating`, `resolved`).
4. `failure-escalation.ts`: process-local 3-failure escalation tracker to emit
   deterministic escalation events.
5. `index.ts`: public export surface.

## Usage Rules

1. Use `logger.child({ domain: '...' })` per feature module.
2. Never log raw passwords, tokens, secrets, or full bodies.
3. Mutation handlers should emit `mutation.result` style logs with explicit
   result and timing fields.
4. Incident-prone workflows should emit `incident.event` and use the
   three-failure escalation helper before broad rewrites.
