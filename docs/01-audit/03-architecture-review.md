# Architecture Review

Last updated: 2026-02-18
Status: Active

## Goal

Validate implementation against authoritative contracts in `ARCHITECTURE.md` and ADRs.

## Contract Checklist

- [x] Server functions use `createServerFn` + Zod validator (sampled across `blog`, `media`, `observability`, `users`).
- [x] Expected failures return `ServerResult<T>` where business errors are expected.
- [x] Catch blocks re-throw `Response` control signals before conversion.
- [x] Authz enforced server-side for protected operations (admin session requirements in sampled server modules).
- [x] Feature module boundaries (`client`, `model`, `schemas`, `server`, `ui`) are preserved in sampled features.
- [x] Shared infra belongs in `src/lib` for cross-cutting concerns.

## Drift Log

| Area | Expected | Observed | Impact | Action |
| --- | --- | --- | --- | --- |
| Admin docs surface | Admin docs routes should reflect current active docs system | Resolved: `/admin/docs/phases` now points to active execution docs and phase status | Discoverability drift resolved | Keep links synced with `docs/08-implementation/*` as phases advance |
| DB migration authority | `db:migrate` should provision schema required by app/seed contracts on clean DB | Resolved via `drizzle/0002_schema_reconciliation.sql`; clean local `db:migrate` -> `db:seed` now passes | Reliability gap resolved | Keep migration artifacts synchronized with schema updates and verify migrate-first bootstrap in Phase 1 gate |
| Admin workspace URL model | Admin IA should provide clear scalable workspace path model | Resolved: operations/content/platform deep routes now have canonical ownership under `/admin/workspaces/*`, with legacy redirects preserving compatibility and canonical nav/breadcrumb targets | Migration risk materially reduced; remaining work is manual parity smoke coverage for mobile/role UX | Track parity pass under `T-021` and keep route contracts pinned in `docs/05-dashboard/*` |

## Outputs

- ADR required: Yes. Published `docs/adr/0031-local-environment-bootstrap-and-migration-reconciliation.md` and `docs/adr/0034-dashboard-workspace-routing-rollout.md`; workspace cutover completion is documented in `docs/08-implementation/*` and `docs/05-dashboard/*`.
- Follow-up implementation tasks linked in `docs/08-implementation/02-task-board.md`.
