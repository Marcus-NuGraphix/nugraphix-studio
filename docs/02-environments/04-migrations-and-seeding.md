# Migrations and Seeding

Last updated: 2026-02-18
Status: Draft

## Goal

Make schema changes and seed data deterministic across environments.

## Rules

- [ ] Drizzle schema changes and migration files stay in sync.
- [ ] Migrations are idempotent where feasible.
- [ ] Seed data is deterministic and safe to rerun.
- [ ] Migration execution point is explicit in deploy flow.

## Workflow

1. Update schema under `src/lib/db/schema/*`.
2. Generate migration.
3. Review SQL for safety.
4. Apply migration in local/dev.
5. Run seed flow.
6. Validate app behavior.

## Verification Commands

- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:push` (local fallback only, not release migration authority)
- `pnpm db:seed`
- `pnpm test`

## Current Notes (2026-02-18)

- `db:seed` now maps to `tools/seed-blog-demo.ts`.
- Seed flow currently provides deterministic blog demo content; dedicated
  admin/user bootstrap seeding remains a follow-up task.
- Observed on clean local DB:
  - `db:migrate` succeeds but does not materialize current auth schema (`user` table missing).
  - `db:seed` fails after migrate-only path.
  - `db:push` then `db:seed` succeeds.
- Drizzle official guidance allows `push` for rapid local iteration, but repo
  release flow must still rely on migration artifacts as system of record.

## Immediate Remediation Track

- [ ] Backfill/normalize migration SQL so `db:migrate` alone can bootstrap a clean local DB.
- [ ] Keep `db:push` documented as temporary local fallback only until drift is resolved.
- [ ] Add migration integrity check to fail Phase 1 exit when seed cannot run after migrate-only path.

## Failure Recovery

- [ ] Backup/restore strategy documented.
- [ ] Forward-fix policy for failed production migrations.

## External References

- Drizzle migration workflow (`generate` + `migrate`): https://github.com/drizzle-team/drizzle-orm-docs/blob/main/src/content/docs/migrations.mdx
- Drizzle push guidance and cautions (`push` for local/prototyping): https://github.com/drizzle-team/drizzle-orm-docs/blob/main/src/content/docs/faq.mdx
