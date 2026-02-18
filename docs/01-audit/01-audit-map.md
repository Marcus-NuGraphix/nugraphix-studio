# Audit Map

Last updated: 2026-02-18
Status: Draft

## Goal

Create a measurement-first baseline before hardening or refactor work.

## Scope Order (Outside-In)

1. Repo governance and guardrails.
2. Toolchain and quality gates.
3. Environment and secret boundaries.
4. Architecture and ADR contract alignment.
5. Routing/access control surfaces.
6. Shared infrastructure (`src/lib`).
7. Shared UI/component system.
8. Feature modules and integration boundaries.
9. Performance and latency baseline.
10. Security hardening sweep.

## Required Outputs

- Baseline snapshot doc in `docs/audits/`.
- Top risk list in `docs/01-audit/02-risk-register.md`.
- Contract drift list (expected vs observed behavior).
- Priority-ordered remediation backlog.

## Evidence to Capture

- Command outputs for `lint`, `typecheck`, `test`, `build`.
- Key route timings (home, login, admin dashboard, blog list/detail).
- DB operation timings from South Africa test location.
- Current Docker/local startup reliability issues.

## Initial Baseline (2026-02-18)

- `pnpm lint` - pass with 10 warnings (`no-shadow` in shared UI files).
- `pnpm typecheck` - pass.
- `pnpm test` - pass (`37` files, `225` tests) with Vitest shutdown warning
  suggesting hanging-process reporter for deeper diagnosis.
- `pnpm build` - pass with dependency-level bundler warnings (`use client`
  directives ignored in node_modules and `shiki` wasm fallback warning).

## Phase 0 Audit Findings (2026-02-18)

- `pnpm audit --prod` reported:
  - High: `fast-xml-parser` DoS advisory via `@aws-sdk/client-s3` chain.
  - Moderate: `esbuild` advisory in transitive `drizzle-kit`/`better-auth` dev chain.
- `pnpm outdated` shows patch/minor updates available for core TanStack packages.
- Docker CLI is installed, but Docker engine was not running, blocking local
  compose startup verification.
- Environment contract drift found and corrected:
  - `.env.example` email provider guidance now matches runtime schema.
  - `db:seed` script alias added to standardize local setup workflow.

## Phase 1 Validation Follow-up (2026-02-18)

- `docker info` - pass (engine running).
- `docker compose up -d` - pass (`postgres`, `redis`, `minio`, `mailpit` healthy).
- `pnpm db:migrate` against local Postgres - pass.
- Added migration reconciliation artifacts:
  - `drizzle/0002_schema_reconciliation.sql`
  - `drizzle/meta/0002_snapshot.json`
  - `drizzle/meta/_journal.json` entry for `0002_schema_reconciliation`
- `pnpm db:seed` after migrate-only path - pass.
- Conclusion: local Docker runtime and migrate-first bootstrap are both validated.

## Dependency Hotfix Follow-up (2026-02-18)

- Added `pnpm.overrides.fast-xml-parser=5.3.6` in `package.json` to patch AWS SDK transitive chain.
- `pnpm list fast-xml-parser --depth 12` confirms resolved runtime graph now uses `5.3.6`.
- `pnpm audit --prod` now reports no high vulnerabilities; only moderate `esbuild` advisory remains.
