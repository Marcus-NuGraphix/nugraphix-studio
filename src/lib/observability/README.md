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
3. `index.ts`: public export surface.

## Usage Rules

1. Use `logger.child({ domain: '...' })` per feature module.
2. Never log raw passwords, tokens, secrets, or full bodies.
3. Mutation handlers should emit `mutation.result` style logs with explicit
   result and timing fields.
