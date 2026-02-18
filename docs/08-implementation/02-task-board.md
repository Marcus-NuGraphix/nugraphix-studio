# Task Board

Last updated: 2026-02-18
Status: Active

## Backlog

| ID | Priority | Phase | Task | Owner | Status |
| --- | --- | --- | --- | --- | --- |
| T-001 | P0 | 0 | Capture baseline command outputs and current failures | Eng | Done |
| T-002 | P0 | 1 | Validate local Docker path from clean environment | Eng | Done |
| T-003 | P1 | 3 | Benchmark DB latency candidates for ZA traffic | Eng | In Progress |
| T-004 | P1 | 5 | Draft workspace route map and redirects | Eng | Done |
| T-005 | P0 | 6 | Complete auth hardening checks and fixes | Eng | Todo |
| T-006 | P0 | 0 | Consolidate duplicate docs systems into a single active docs base | Eng | Done |
| T-007 | P0 | 0 | Resolve high dependency vulnerability (`fast-xml-parser` chain) | Eng | Done |
| T-008 | P1 | 1 | Implement deterministic local bootstrap seed path (admin + content) | Eng | Done |
| T-009 | P1 | 4 | Replace admin docs phases placeholder with active docs links | Eng | Done |
| T-010 | P0 | 1 | Reconcile migration artifacts so `db:migrate` fully boots schema for seed flow | Eng | Done |
| T-011 | P0 | 1 | Enforce migrate+seed bootstrap smoke gate in CI | Eng | Done |
| T-012 | P1 | 4 | Convert design-system docs from draft templates to baseline audit artifacts + prioritized remediation queue | Eng | Done |
| T-013 | P1 | 4 | Remove feature-module imports from shared navigation components via adapter/view-model boundaries | Eng | Done |
| T-014 | P1 | 4 | Resolve token-governance exceptions (`chart` literals, email template color constants contract) | Eng | Done |
| T-015 | P1 | 4 | Add accessibility regression checks for navigation, dialog/sheet, and form control patterns | Eng | Done |
| T-016 | P1 | 4 | Define `src/lib` expansion boundary matrix and phased implementation map (`config`, `constants`, `validation`, `permissions`, `api`, `flags`, `cache`) | Eng | Done |
| T-017 | P1 | 4 | Implement first `src/lib` expansion increment (`config` + `constants` + `flags` skeletons) with strict ownership boundaries | Eng | Done |
| T-018 | P1 | 5 | Implement Phase 5A workspace skeleton (`/admin/workspaces/*`), `/admin` redirect, and header workspace switcher | Eng | Done |
| T-019 | P1 | 5 | Migrate legacy admin deep links (`/admin/*`) to canonical workspace paths with param-preserving redirects | Eng | Done |
| T-020 | P1 | 5 | Migrate content and platform deep routes to canonical workspace paths and complete nav link cutover | Eng | Done |
| T-021 | P1 | 5 | Execute manual workspace route parity smoke pass (desktop/mobile navigation and role visibility) | Eng | Todo |

## In Progress

| ID | Phase | Task | Notes |
| --- | --- | --- | --- |
| T-003 | 3 | Benchmark DB latency candidates for ZA traffic | Captured ZA DB baseline (`p95=526.62 ms`) and ZA route TTFB baseline artifacts; candidate A/B DB target URLs still required to finalize scoring/winner. |

## Done

| ID | Date | Notes |
| --- | --- | --- |
| T-001 | 2026-02-18 | Ran `lint`, `typecheck`, `test`, and `build`; captured baseline warnings and risks in `docs/01-audit/*`. |
| T-006 | 2026-02-18 | Archived legacy phases/roadmaps into `docs/archive/*` and updated authoritative pointers (`AI.md`, `ARCHITECTURE.md`, docs indexes). |
| Phase0-Audit | 2026-02-18 | Captured outside-in findings in `docs/audits/2026-02-18-phase-0-repo-audit.md`, including dependency and environment blockers. |
| T-002 | 2026-02-18 | Local Docker stack validated (`docker info`, `docker compose up -d`, services healthy); migration coverage drift moved to dedicated task T-010. |
| T-010 | 2026-02-18 | Added migration `drizzle/0002_schema_reconciliation.sql` + snapshot/journal updates; clean local bootstrap validated with `db:migrate` -> `db:seed` and seeded DB sanity checks. |
| T-007 | 2026-02-18 | Patched transitive `fast-xml-parser` via `pnpm` override to `5.3.6`; production audit no longer reports the high advisory. |
| T-008 | 2026-02-18 | Added deterministic bootstrap seed script (`tools/seed-bootstrap.ts`), switched `db:seed` to bootstrap flow, and verified local auth/content/blog seed outputs (`user_count=3`, `credential_accounts=2`, `post_count=8`, `content_entry_count=4`). |
| T-011 | 2026-02-18 | Added CI bootstrap smoke job in `.github/workflows/ci.yml` using Postgres service and enforced `pnpm db:migrate` + `pnpm db:seed` + idempotent rerun. |
| T-009 | 2026-02-18 | Replaced `/admin/docs/phases` placeholder with active phase status board and direct links to current system-of-record docs (`docs/00-index`, phased plan, task board, risk register, decisions log). |
| T-012 | 2026-02-18 | Replaced draft-only design-system docs with baseline audit evidence, conventions matrix, token/a11y findings, and prioritized remediation queue (`docs/04-design-system/*`, `docs/04-design-system/artifacts/component-audit-2026-02-18.md`). |
| T-013 | 2026-02-18 | Removed direct `@/features/*` imports from shared navigation components (`site-header`, `site-footer`, `admin-sidebar`) by introducing route-level adapter props for auth/email behavior. |
| T-014 | 2026-02-18 | Removed literal color matching in `src/components/ui/chart.tsx` and centralized email template palette into `src/features/email/server/template-tokens.ts` consumed by `templates.server.tsx`. |
| T-015 | 2026-02-18 | Added CI-enforced accessibility contract tests for dialog/sheet title semantics, shared navigation ARIA labels, and shared form-control labeling patterns (`src/components/tests/accessibility-contracts.test.ts`). |
| T-004 | 2026-02-18 | Finalized Phase 5 workspace IA/routing/redirect strategy across `docs/05-dashboard/*` with canonical workspace URLs, legacy redirect matrix, and shell/permission contracts. |
| T-016 | 2026-02-18 | Published `src/lib` expansion boundary matrix and phased implementation map in `docs/04-design-system/06-lib-foundation-boundaries.md`; staged rollout now scoped for incremental implementation. |
| T-017 | 2026-02-18 | Added first `src/lib` expansion increment (`config`, `constants`, `flags`) with typed exports/tests and updated shared library architecture/docs contracts. |
| T-018 | 2026-02-18 | Added Phase 5A workspace routing skeleton (`/admin/workspaces/{operations|content|platform}`), redirected `/admin` to operations workspace, and added role-aware workspace switcher in admin shell header while preserving legacy deep-route behavior. |
| T-019 | 2026-02-18 | Completed full deep-route cutover: legacy admin routes now redirect to canonical workspace ownership with search/param preservation across operations/content/platform surfaces. |
| T-020 | 2026-02-18 | Completed content/platform canonical route migration: moved docs/components/content/media/kb implementations under `/admin/workspaces/*`, added legacy compatibility redirects, and switched admin navigation/breadcrumb/link contracts to canonical workspace paths. |
