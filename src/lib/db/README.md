# Database Layer

This directory owns Nu Graphix Studio's PostgreSQL contract through Drizzle:
typed schema, DB client setup, and migration artifact verification.

## Responsibilities

1. Provide a single DB client entrypoint via `src/lib/db/index.ts`.
2. Keep schema modular by bounded context under `src/lib/db/schema/*`.
3. Preserve deterministic Drizzle artifact integrity via verifier + tests.
4. Support safe local development with stable import surfaces.

## Directory Map

1. `index.ts`: Drizzle client + pooled connection setup + schema re-exports.
2. `schema.ts`: compatibility barrel to `schema/index.ts`.
3. `schema/index.ts`: root schema barrel across all domains.
4. `schema/auth/*`: Better Auth tables + user governance tables.
5. `schema/blog/*`: blog posts, categories, tags, press releases, relations.
6. `schema/content/*`: managed content entries and revisions.
7. `schema/email/*`: email lifecycle tables.
8. `schema/media/*`: media assets.
9. `schema/observability/*`: web-vitals telemetry and system notifications.
10. `schema/shared/*`: enums, timestamps, and shared relational primitives.
11. `migrations/verify-artifacts.ts`: Drizzle SQL/meta/journal consistency checks.
12. `tests/*`: schema/barrel/migration contract tests.

## Import Conventions

1. Import DB runtime client from `@/lib/db`.
2. Import schema from `@/lib/db` or `@/lib/db/schema`.
3. Keep feature repositories in `src/features/*/server` and avoid direct DB access from UI code.

## Development Workflow

1. Update schema in `src/lib/db/schema/*`.
2. Generate migrations with `pnpm db:generate`.
3. Run DB contracts with `pnpm exec vitest run src/lib/db/tests`.
4. Run lint/type checks (`pnpm lint`, `pnpm typecheck`).
5. Apply migrations with `pnpm db:migrate` (or `pnpm db:push` when appropriate).

## Current Guardrails

1. Timestamp columns use `timestampUtc(...)` from `schema/shared/timestamps.ts`.
2. Critical workflow checks are test-enforced (publish state, email state, auth rate limit contract).
3. Migration artifacts must remain internally consistent before merge.
