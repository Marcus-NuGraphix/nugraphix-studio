# Changelog

Last updated: 2026-02-18
Status: Active

## 2026-02-18

- Added production-readiness docs scaffold under `docs/00-index.md` and `docs/01-*` through `docs/08-*` tracks.
- Added phased execution plan (`docs/08-implementation/01-phased-plan.md`).
- Added first 48 hours plan (`docs/08-implementation/00-first-48-hours.md`).
- Added auth hardening and security checklist docs.
- Added quality/CI/release readiness docs.
- Added external references map (`docs/08-implementation/05-external-references.md`).
- Added documentation governance controls (`docs/08-implementation/06-documentation-governance.md`).
- Ran baseline quality commands (`lint`, `typecheck`, `test`, `build`) and recorded outputs in audit docs.
- Consolidated legacy planning docs into archive paths (`docs/archive/roadmaps/*`, `docs/archive/phases/*`) and removed parallel active phase system.
- Executed Phase 0 outside-in repo audit and recorded findings in `docs/audits/2026-02-18-phase-0-repo-audit.md`.
- Started Phase 1 local environment validation; identified Docker engine runtime blocker and updated runbooks.
- Added `db:seed` script alias and aligned `.env.example` with runtime env schema.
- Completed local Docker stack validation (`docker info`, `docker compose up -d`, healthy services).
- Verified local DB bootstrap behavior and documented migration drift (`db:migrate` pass but seed fails without `user` table).
- Documented temporary local fallback (`db:push` then `db:seed`) and created explicit remediation task for migration-chain reconciliation.
- Updated risk register and phase/task boards to reflect resolved Docker runtime blocker and new migration coverage blocker.
- Added ADR-0031 for local environment bootstrap contract and migration reconciliation policy.
- Added migration reconciliation artifacts:
  - `drizzle/0002_schema_reconciliation.sql`
  - `drizzle/meta/0002_snapshot.json`
  - `drizzle/meta/_journal.json` entry for `0002_schema_reconciliation`
- Revalidated clean local bootstrap on wiped Docker volumes:
  - `pnpm db:migrate` (local `DATABASE_URL`) - pass
  - `pnpm db:seed` - pass
  - Seed sanity check - `user_count=1`, `post_count=8`
- Updated Phase 1 docs and risk/task tracking to retire `db:push` as canonical bootstrap step.
- Patched dependency high advisory (`GHSA-jmr7-xgp7-cmfj`) by enforcing
  `fast-xml-parser@5.3.6` with `pnpm.overrides` in `package.json`.
- Updated lockfile dependency graph and verified:
  - `pnpm list fast-xml-parser --depth 12` resolves AWS SDK chain to `5.3.6`
  - `pnpm audit --prod` no longer reports a high vulnerability.
- Added deterministic bootstrap seeding:
  - new `tools/seed-bootstrap.ts` for auth users + content baseline + blog demo orchestration
  - `db:seed` now points to bootstrap flow (`db:seed:bootstrap`)
  - `db:seed:blog-demo` kept for blog-only reseeding
- Updated `.env.example` with local seed user credential overrides
  (`SEED_USER_EMAIL`, `SEED_USER_NAME`, `SEED_USER_PASSWORD`).
- Revalidated local seed outputs:
  - `pnpm db:migrate` - pass
  - `pnpm db:seed` - pass
  - `pnpm db:seed` rerun (idempotence) - pass
  - auth credential verification via `auth.api.signInEmail` - pass
  - DB sanity checks: `user_count=3`, `credential_accounts=2`, `post_count=8`, `content_entry_count=4`
- Added CI bootstrap smoke gate in `.github/workflows/ci.yml`:
  - new `bootstrap-smoke` job with Postgres service
  - `build` job now depends on `bootstrap-smoke`
  - enforced `pnpm db:migrate`, `pnpm db:seed`, and seed rerun idempotence check
  - wired CI env placeholders required by runtime env schema for seed execution
- Hardened bootstrap seed user upsert logic to resolve by `id`/`email` before
  insert, preventing duplicate-key failures when local seed identity values
  drift between runs.
- Added DB latency benchmark tooling for Phase 3:
  - `tools/benchmark-db-latency.ts`
  - `pnpm perf:db-latency` script
  - artifact convention under `docs/03-hosting/artifacts/`
- Captured local-control benchmark validation (non-ZA baseline) and updated
  hosting benchmark runbook for ZA candidate comparison execution.
- Captured ZA baseline benchmark for current Neon endpoint and committed artifact:
  - `docs/03-hosting/artifacts/db-latency-2026-02-18T12-44-55-119Z.json`
  - Result summary: `p50=506.40 ms`, `p95=526.62 ms`, `avg=522.21 ms`
  - Candidate scoring baseline updated (`current=1/5`); candidate A/B pending endpoints.
- Added HTTP route TTFB benchmark harness and ZA baseline artifact:
  - `tools/benchmark-http-ttfb.ts` + `pnpm perf:http-ttfb`
  - `docs/03-hosting/artifacts/http-ttfb-2026-02-18T12-50-57-626Z.json`
  - ZA route p95 baselines recorded:
    - `/` => `28.63 ms`
    - `/admin/dashboard` => `41.80 ms`
- Updated `src/lib/db/index.ts` to instantiate and use an explicit `pg.Pool`
  (`dbPool`) for Drizzle runtime, preserving existing `db` import contract.
