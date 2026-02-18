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
- `pnpm db:seed`
- `pnpm test src/lib/db/tests`

## Failure Recovery

- [ ] Backup/restore strategy documented.
- [ ] Forward-fix policy for failed production migrations.