# Changelog

Last updated: 2026-02-19
Status: Active

## 2026-02-19

- Completed Phase 5 parity smoke task (`T-021`) with evidence captured in:
  - `docs/05-dashboard/artifacts/2026-02-19-workspace-parity-smoke.md`
  - `src/components/navigation/admin/navigation.contracts.test.ts`
- Fixed workspace inference parity regression in
  `src/components/navigation/admin/navigation.ts` where legacy
  `/admin/content/*` routes could resolve to the operations workspace context.
- Started Phase 6 auth hardening task (`T-005`) with first production-safety
  slice:
  - `src/features/auth/server/auth-config.ts`
    - normalize trusted origins to URL origins
    - fail startup in production if auth base URL is non-HTTPS
    - fail startup in production if any trusted origin is non-HTTPS
  - `src/features/auth/server/auth.ts`
    - wire production origin-security assertions
    - enforce secure cookie flag via hardened runtime resolver
  - `src/features/auth/model/post-auth.ts`
    - canonical admin landing moved to
      `/admin/workspaces/operations/dashboard`
- Added/updated regression coverage for auth and workspace contracts:
  - `src/features/auth/tests/auth-config.test.ts`
  - `src/features/auth/tests/entry-redirect.test.ts`
  - `src/features/auth/tests/post-auth.test.ts`
  - `src/components/navigation/admin/navigation.contracts.test.ts`
- Revalidated quality gates for this slice:
  - `pnpm vitest run ...` (targeted auth/workspace suites) - pass
  - `pnpm lint` - pass (existing warning-only baseline unchanged)
  - `pnpm typecheck` - pass
  - `pnpm build` - pass

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
- Replaced `/admin/docs/phases` placeholder route with active docs links and
  phase status visibility (`src/routes/admin/docs/phases/index.tsx`), wired to
  current system-of-record documents in `docs/`.
- Completed Phase 4 design-system baseline documentation set:
  - activated `docs/04-design-system/*` with concrete inventory, conventions,
    token/a11y baseline findings, and remediation queue
  - added evidence artifact:
    `docs/04-design-system/artifacts/component-audit-2026-02-18.md`
- Updated implementation governance for Phase 4 execution:
  - task board entries `T-012` through `T-016`
  - risk register additions `R-012` through `R-014`
  - decisions log updates for controlled exception policy and audit-gate workflow
- Published ADR-0033 (`docs/adr/0033-design-system-boundary-and-token-exception-governance.md`)
  and updated ADR indexes (`docs/adr/README.md`, `ARCHITECTURE.md`) to remove stale references.
- Added Phase 4 `src/lib` boundary/expansion map:
  - `docs/04-design-system/06-lib-foundation-boundaries.md`
  - task progression moved `T-016` to done and opened implementation step `T-017`
- Implemented Phase 4B `src/lib` expansion skeletons:
  - new shared modules: `src/lib/config`, `src/lib/constants`, `src/lib/flags`
  - updated shared barrel exports in `src/lib/index.ts`
  - added unit tests for each new module contract
  - updated library and architecture docs to include new domains
- Completed navigation boundary decoupling (Phase 4 `T-013`):
  - removed direct feature imports from shared navigation components:
    - `src/components/navigation/site-header.tsx`
    - `src/components/navigation/site-footer.tsx`
    - `src/components/navigation/admin/admin-sidebar.tsx`
  - moved auth/email behavior wiring to route-level adapters:
    - `src/routes/_public/route.tsx`
    - `src/routes/_legal/route.tsx`
- Completed token-governance cleanup (Phase 4 `T-014`):
  - removed hardcoded color literal matching in shared chart overrides
    (`src/components/ui/chart.tsx`)
  - centralized email template palette in
    `src/features/email/server/template-tokens.ts` and consumed it from
    `src/features/email/server/templates.server.tsx`
  - added token contract coverage in
    `src/features/email/tests/template-tokens.test.ts`
- Completed accessibility regression gate setup (Phase 4 `T-015`):
  - added `src/components/tests/accessibility-contracts.test.ts`
  - enforces dialog/sheet title semantics across app usage
  - enforces shared navigation ARIA/sr-only labels
  - enforces shared form-control labeling/alert patterns
- Completed Phase 5A workspace routing shell rollout (`T-018`):
  - added canonical workspace landing routes:
    - `src/routes/admin/workspaces/index.tsx`
    - `src/routes/admin/workspaces/operations/index.tsx`
    - `src/routes/admin/workspaces/content/index.tsx`
    - `src/routes/admin/workspaces/platform/index.tsx`
  - redirected `/admin` to `/admin/workspaces/operations`
    (`src/routes/admin/index.tsx`)
  - added header workspace switcher and workspace path resolution helpers:
    - `src/routes/admin/route.tsx`
    - `src/components/navigation/admin/navigation.ts`
  - preserved legacy deep routes for staged redirect migration in `T-019`.
- Published ADR-0034:
  - `docs/adr/0034-dashboard-workspace-routing-rollout.md`
  - updated ADR indexes in `docs/adr/README.md` and `ARCHITECTURE.md`.
- Completed Phase 5B operations deep-route migration batch (`T-019`):
  - moved operations route ownership to canonical workspace paths:
    - `src/routes/admin/workspaces/operations/dashboard/index.tsx`
    - `src/routes/admin/workspaces/operations/users/index.tsx`
    - `src/routes/admin/workspaces/operations/users/$userId.tsx`
    - `src/routes/admin/workspaces/operations/contacts/index.tsx`
    - `src/routes/admin/workspaces/operations/email/index.tsx`
    - `src/routes/admin/workspaces/operations/account/index.tsx`
    - `src/routes/admin/workspaces/operations/settings/index.tsx`
  - added legacy compatibility redirects preserving params/search:
    - `src/routes/admin/dashboard/index.tsx`
    - `src/routes/admin/users/index.tsx`
    - `src/routes/admin/users/$userId.tsx`
    - `src/routes/admin/contacts/index.tsx`
    - `src/routes/admin/email/index.tsx`
    - `src/routes/admin/account/index.tsx`
    - `src/routes/admin/settings/index.tsx`
  - switched operations navigation/quick links and breadcrumb fallbacks to
    canonical workspace operation paths in
    `src/components/navigation/admin/navigation.ts`.
- Completed Phase 5B content/platform route migration and nav cutover (`T-020`):
  - moved content and platform route ownership to canonical workspace paths:
    - `src/routes/admin/workspaces/content/*`
    - `src/routes/admin/workspaces/platform/*`
  - added legacy compatibility redirects for:
    - `src/routes/admin/content/posts/*`, `src/routes/admin/media/*`, `src/routes/admin/kb/*`
    - `src/routes/admin/docs/*`, `src/routes/admin/components/*`
  - switched admin sidebar/quick links/section cards/breadcrumb contracts to
    canonical workspace targets in `src/components/navigation/admin/navigation.ts`
  - updated remaining in-app media/editor links to canonical workspace paths:
    - `src/features/blog/ui/admin/post-editor-form.tsx`
    - `src/features/media/ui/admin/media-table.tsx`
    - `src/features/media/ui/admin/media-grid-view.tsx`
  - updated shared docs-route constant to canonical platform workspace base:
    - `src/lib/constants/app.ts`
- Published ADR-0035 for Phase 5B endpoint contract:
  - `docs/adr/0035-workspace-canonical-route-ownership-and-legacy-compatibility.md`
  - updated ADR index pointers in `docs/adr/README.md` and `ARCHITECTURE.md`
