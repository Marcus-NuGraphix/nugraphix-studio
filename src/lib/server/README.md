# Server Runtime Layer

This directory owns shared runtime orchestration code that remains server-side
only and does not belong to a feature module.

## Responsibilities

1. Background task queue persistence and execution lifecycle.
2. Durable retries and task handler registration.
3. Shared exports for server runtime utilities.

## File map

1. `background-tasks.ts`: queue schema bootstrap, enqueue, and drain logic.
2. `request-context.ts`: normalized server header helpers (IP, user-agent, typed headers, scoped rate-limit keys).
3. `index.ts`: server runtime export surface.

## Related Infrastructure

1. Observability logging: `src/lib/observability/*`
2. Rate limiting: `src/lib/rateLimit/*`
3. Search primitives: `src/lib/search/*`
