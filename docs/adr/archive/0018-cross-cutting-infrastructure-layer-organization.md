# ADR-0018: Cross-Cutting Infrastructure Layer Organization

**Status:** Accepted  
**Date:** 2026-02-17

## Context

`src/lib/server` previously mixed runtime queue orchestration with unrelated
cross-cutting concerns (logging and rate limiting), while
`src/lib/observability`, `src/lib/rateLimit`, and `src/lib/search` existed but
were not actively structured.

Phase 3 and Phase 4 contracts call for clear integration boundaries:

1. observability in `lib/observability`,
2. rate limiting in `lib/rateLimit`,
3. search primitives in `lib/search`,
4. server runtime orchestration in `lib/server`.

## Decision

Reorganize infrastructure boundaries as follows:

1. **`src/lib/observability/*`**
   - owns structured logging and mutation logging helpers.
2. **`src/lib/rateLimit/*`**
   - owns durable limiter logic and key helpers.
3. **`src/lib/search/*`**
   - owns generic Postgres full-text-search helpers.
4. **`src/lib/server/*`**
   - owns background task runtime orchestration only.

Supporting standards:

1. each directory has an explicit barrel export (`index.ts`),
2. each directory has local docs (`README.md`),
3. shared logic includes focused tests,
4. feature modules import from the specialized layer directly.

## Consequences

### Positive

- Clearer ownership of infrastructure concerns.
- Lower coupling between unrelated runtime primitives.
- Better alignment with Phase 3/4 architectural constraints.
- Easier long-term migration/replacement of integrations.

### Trade-offs

- Import paths must be updated to the new canonical locations.
- More explicit module boundaries increase file count.
