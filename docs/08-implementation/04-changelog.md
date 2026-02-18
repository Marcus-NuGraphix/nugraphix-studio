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
