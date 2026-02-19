# Rate Limit Layer

This directory owns shared application-level rate limiting infrastructure.

## Responsibilities

1. Durable rate-limiting via Postgres bucket table.
2. Memory fallback when DB limiter path is unavailable.
3. Stable result contract (`allowed`, `remaining`, `resetAt`).
4. Shared key building helpers for cross-feature consistency.

## File map

1. `limiter.ts`: limiter implementation + helper exports.
2. `index.ts`: public export surface.

## Usage Rules

1. Public write endpoints must call `checkRateLimit(...)`.
2. Prefer `buildRateLimitKey(...)` for predictable key namespacing.
3. Map denied outcomes to `RATE_LIMITED` in server result contracts.
