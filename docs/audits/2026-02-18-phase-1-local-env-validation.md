# Phase 1 Local Environment Validation

Date: 2026-02-18  
Scope: Docker Desktop local runtime, database bootstrap, migration/seed workflow

## Summary

Local Docker runtime validation is now operational. Compose services start and
health checks pass. A migration coverage gap remains: `db:migrate` alone does
not materialize full schema required by seed scripts on a clean local database.

## Findings

### High

1. Migration chain drift blocks deterministic seed after migrate-only path.
   - Evidence:
     - `pnpm db:migrate` (local Postgres) succeeded.
     - `pnpm db:seed` failed with `relation "user" does not exist`.
     - `pnpm db:push` followed by `pnpm db:seed` succeeded.
   - Impact:
     - Phase 1 exit criteria are not fully met.
     - Clean local bootstrap relies on schema push fallback.

### Medium

1. Legacy migration artifact (`users` table) conflicts with current auth schema
   naming (`user`) during schema push prompts unless the legacy table is absent.
   - Impact:
     - Non-deterministic push behavior on existing local databases.

### Low

1. Local validation requires explicit `DATABASE_URL` override to avoid
   accidentally applying DB operations to remote environments.

## Verified Commands

- `docker info`
- `docker compose config`
- `docker compose up -d postgres minio minio-create-bucket mailpit redis`
- `docker compose ps -a`
- `pnpm db:migrate` (with local `DATABASE_URL`)
- `pnpm db:seed` (fails after migrate-only path)
- `docker exec ... DROP TABLE IF EXISTS users CASCADE` (clear legacy local table for push conflict)
- `pnpm db:push` (local fallback path)
- `pnpm db:seed` (passes after push path)
- `docker exec ... psql ...` sanity check:
  - `user_count = 1`
  - `post_count = 8`

## Recommended Fix Order

1. Backfill and normalize migration artifacts so `db:migrate` fully provisions
   current schema on clean local databases.
2. Keep `db:push` documented as temporary local fallback only.
3. Add migration/seed smoke check to Phase 1 verification gate.
