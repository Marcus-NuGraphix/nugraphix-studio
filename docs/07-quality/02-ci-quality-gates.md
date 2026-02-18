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

## Optional Near-Term Gates

- Dependency audit report artifact.
- Migration diff check (schema/migration parity).
- Docker image build validation for prod-dev runtime.

## CI Contract

- Main and release branches require all gates green.
- No bypass for security-critical changes.
- Fail-fast on env contract violations.