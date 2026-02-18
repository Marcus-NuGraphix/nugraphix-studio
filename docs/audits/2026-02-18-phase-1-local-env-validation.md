# Phase 1 Local Environment Validation

Date: 2026-02-18  
Scope: Docker Desktop local runtime, database bootstrap, migration/seed workflow

## Summary

Local Docker runtime validation is now operational. Compose services start and
health checks pass. Migration coverage was reconciled with
`drizzle/0002_schema_reconciliation.sql`, and clean bootstrap now works with
`db:migrate` then `db:seed` (no `db:push` required). Seed coverage now includes
deterministic auth users and published content baseline, not only blog posts.

## Findings

### High (Resolved)

1. Migration chain drift previously blocked deterministic seed after
   migrate-only path.
   - Resolution:
     - Added migration `drizzle/0002_schema_reconciliation.sql`.
     - Added `drizzle/meta/0002_snapshot.json` and journal entry.
     - Revalidated on wiped local DB with migrate-only path.

### Medium (Resolved)

1. Legacy `users` table artifact is normalized during migration reconciliation.
   - Impact:
     - Fresh local bootstrap no longer depends on manual table cleanup.

2. Seed path coverage now includes auth/admin and content baseline datasets.
   - Resolution:
     - Added `tools/seed-bootstrap.ts` and switched `db:seed` to bootstrap.
     - Added seed credential account upserts and published content entry seeding.
     - Revalidated auth sign-in via `auth.api.signInEmail`.

### Low

1. Local validation requires explicit `DATABASE_URL` override to avoid
   accidentally applying DB operations to remote environments.

## Verified Commands

- `docker info`
- `docker compose config`
- `docker compose up -d postgres minio minio-create-bucket mailpit redis`
- `docker compose ps -a`
- `pnpm db:migrate` (with local `DATABASE_URL`)
- `pnpm db:seed` (passes after migrate-only path)
- seeded auth credential verification (`auth.api.signInEmail`)
- `docker exec ... psql ...` sanity check:
  - `user_count = 3`
  - `credential_accounts = 2`
  - `post_count = 8`
  - `content_entry_count = 4`

## Recommended Fix Order

1. Add migration/seed smoke check to Phase 1 verification gate.
2. Complete fresh-clone timed onboarding and route smoke validation.
