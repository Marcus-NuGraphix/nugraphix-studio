# CI Quality Gates

Last updated: 2026-02-18
Status: Draft

## Goal

Keep CI minimal but enforce release-critical quality checks.

## Minimum Pipeline

1. Install dependencies.
2. Lint.
3. Typecheck.
4. Test.
5. Build.
6. Database bootstrap smoke (`db:migrate`, `db:seed`, `db:seed` rerun).

## Optional Near-Term Gates

- Dependency audit report artifact.
- Migration diff check (schema/migration parity).
- Docker image build validation for prod-dev runtime.

## Current CI Baseline (2026-02-18)

- Workflow: `.github/workflows/ci.yml`
- Jobs:
  - `bootstrap-smoke`: Postgres-backed migrate+seed bootstrap verification.
  - `build` (depends on `bootstrap-smoke`): lint, typecheck, test, build.

## CI Contract

- Main and release branches require all gates green.
- No bypass for security-critical changes.
- Fail-fast on env contract violations.
- Fail when migrate-first seed bootstrap is broken or non-idempotent.
