# Database Layer

This directory owns the Drizzle schema, migration integrity utilities, and the
typed DB client used by server repositories.

## Responsibilities

1. Define and export all PostgreSQL enums, tables, constraints, indexes, and relations.
2. Provide stable schema import surfaces (`@/db/schema`, `@/db/schema.ts`).
3. Keep migration artifacts internally consistent with Drizzle metadata.
4. Provide maintainable DB contract tests under `src/db/tests`.

## Directory Map

- `index.ts`: typed Drizzle client bootstrap (`db`).
- `schema.ts`: compatibility export of `schema/index.ts`.
- `schema/index.ts`: root barrel composed from bounded contexts.
- `schema/shared/*`: cross-domain primitives (`enums`, `timestamps`).
- `schema/auth/*`: Better Auth core tables and user governance tables.
- `schema/news/*`: news/press tables and relations.
- `schema/media/*`: media assets.
- `schema/email/*`: email preferences, subscriptions, messages, events.
- `schema/content/*`: managed content entry/revision/publication tables.
- `migrations/verify-artifacts.ts`: migration artifact verifier.
- `tests/*`: DB contract, barrel, and migration integrity tests.

## Schema Architecture

1. Domain folders export only local modules from `schema/<domain>/index.ts`.
2. `schema/index.ts` re-exports every domain index and is the single schema entrypoint.
3. Shared helpers live in `schema/shared/*` and are imported by domains through `../shared/*`.
4. All repository code should import schema from `@/db/schema` unless file-local testing requires relative imports.

## Migration Workflow

1. Update schema files in `src/db/schema/*`.
2. Run `pnpm db:generate`.
3. Run `pnpm db:verify:artifacts`.
4. Run `pnpm db:migrate` (or `pnpm db:push` for non-migration workflows).

`drizzle.config.ts` source of truth:

1. Schema entry: `./src/db/schema/index.ts`
2. Output: `./drizzle`
3. Dialect: `postgresql`

## Testing (`src/db/tests`)

Current DB suite:

1. `src/db/tests/schema-domain-barrels.test.ts`
   - verifies root schema barrel re-exports each domain contract.
2. `src/db/tests/schema-contracts.test.ts`
   - verifies enum stability, timestamp helper policy, critical constraint presence, and Better Auth rate-limit table contract.
3. `src/db/tests/migration-artifacts.test.ts`
   - verifies Drizzle SQL/meta/journal consistency using `verifyDrizzleArtifacts`.

Run commands:

1. `pnpm test:db`
2. `pnpm exec eslint src/db`

Verifier behavior note:

1. An empty `drizzle/meta/_journal.json` is accepted when there are no migration SQL/snapshot artifacts yet.
2. Empty journal with existing artifacts is treated as invalid.

## Current Contract Conventions

1. Timestamp columns must use `timestampUtc(...)` from `schema/shared/timestamps.ts`.
2. Raw `timestamp(...)` should not be used directly in schema modules.
3. Critical workflow checks are enforced for publish-state and email-state integrity.
4. Junction tables use composite primary keys and cascade semantics where appropriate.
5. `content_revision.payload` stores JSON object maps
   (`Record<string, {}>`) to preserve serializable app-layer contracts.

## Primary Consumers

1. `src/features/auth/server/*`
2. `src/features/users/server/*`
3. `src/features/news/server/*`
4. `src/features/news/press/server/*`
5. `src/features/media/server/*`
6. `src/features/email/server/*`
7. `src/features/dashboard/server/*`
8. `src/features/content/server/*`
