# Architecture Review

Last updated: 2026-02-19
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
| Admin workspace URL model | Admin IA should provide clear scalable workspace path model | Resolved: operations/content/platform deep routes now have canonical ownership under `/admin/workspaces/*`, with legacy redirects preserving compatibility and canonical nav/breadcrumb targets. Manual parity smoke evidence and nav contracts are now captured. | Migration risk reduced with parity evidence for desktop/mobile nav and role visibility. | Keep nav contracts and parity artifact updated when route ownership changes (`docs/05-dashboard/artifacts/2026-02-19-workspace-parity-smoke.md`). |

## Outputs

- ADR required: Yes. Published ADRs for this hardening wave:
  - `docs/adr/0031-local-environment-bootstrap-and-migration-reconciliation.md`
  - `docs/adr/0034-dashboard-workspace-routing-rollout.md`
  - `docs/adr/0035-workspace-canonical-route-ownership-and-legacy-compatibility.md`
  - `docs/adr/0036-auth-runtime-origin-security-and-canonical-admin-landing.md`
- Follow-up implementation tasks linked in `docs/08-implementation/02-task-board.md`.
