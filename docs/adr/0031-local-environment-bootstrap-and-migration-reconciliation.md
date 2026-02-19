# ADR-0031: Local Environment Bootstrap and Migration Reconciliation

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0015, ADR-0030

## Context

Phase 1 validation confirmed Docker Desktop local runtime now starts reliably,
but clean local database bootstrap is not deterministic with migration files
alone. On a fresh local Postgres instance:

1. `pnpm db:migrate` succeeds.
2. `pnpm db:seed` fails because required auth table `user` is missing.
3. `pnpm db:push` followed by `pnpm db:seed` succeeds.

This indicates migration artifact drift from the active schema contract. We
need a documented operational path that is safe now, while preserving migration
files as release authority.

## Decision

Adopt the following temporary-and-target workflow:

1. Canonical local runtime target for Phase 1 is Docker Compose Postgres at
   `postgresql://username:password@localhost:5432/mydb`.
2. Local verification commands must explicitly set `DATABASE_URL` to the local
   target to prevent accidental remote DB mutation.
3. `db:push` is allowed only as a temporary local fallback for bootstrap while
   migration artifacts are reconciled.
4. Migration artifacts must be backfilled/normalized so `db:migrate` alone can
   provision schema required by seed workflows on clean databases.
5. Phase 1 exit is blocked until migration reconciliation is complete.

## Consequences

### Positive

1. Local environment validation can proceed immediately and reproducibly.
2. Teams avoid accidental migration/seed execution on remote databases.
3. The migration drift is explicit, tracked, and prioritized instead of hidden.

### Trade-offs

1. Temporary dual-path bootstrap (`migrate` vs `push`) adds complexity.
2. A reconciliation work item is mandatory before Phase 1 can close.

## References

- `docs/02-environments/01-local-dev-docker.md`
- `docs/02-environments/04-migrations-and-seeding.md`
- `docs/01-audit/02-risk-register.md`
- `docs/audits/2026-02-18-phase-1-local-env-validation.md`
