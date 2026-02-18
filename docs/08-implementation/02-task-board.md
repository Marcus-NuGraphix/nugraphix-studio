# Task Board

Last updated: 2026-02-18
Status: Active

## Backlog

| ID | Priority | Phase | Task | Owner | Status |
| --- | --- | --- | --- | --- | --- |
| T-001 | P0 | 0 | Capture baseline command outputs and current failures | Eng | Done |
| T-002 | P0 | 1 | Validate local Docker path from clean environment | Eng | Done |
| T-003 | P1 | 3 | Benchmark DB latency candidates for ZA traffic | Eng | In Progress |
| T-004 | P1 | 5 | Draft workspace route map and redirects | Eng | Todo |
| T-005 | P0 | 6 | Complete auth hardening checks and fixes | Eng | Todo |
| T-006 | P0 | 0 | Consolidate duplicate docs systems into a single active docs base | Eng | Done |
| T-007 | P0 | 0 | Resolve high dependency vulnerability (`fast-xml-parser` chain) | Eng | Done |
| T-008 | P1 | 1 | Implement deterministic local bootstrap seed path (admin + content) | Eng | Done |
| T-009 | P1 | 4 | Replace admin docs phases placeholder with active docs links | Eng | Todo |
| T-010 | P0 | 1 | Reconcile migration artifacts so `db:migrate` fully boots schema for seed flow | Eng | Done |
| T-011 | P0 | 1 | Enforce migrate+seed bootstrap smoke gate in CI | Eng | Done |

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
