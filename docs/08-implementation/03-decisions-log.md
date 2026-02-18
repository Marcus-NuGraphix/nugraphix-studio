# Decisions Log

Last updated: 2026-02-18
Status: Active

## Entries

| Date | Decision | Context | Owner | Follow-up |
| --- | --- | --- | --- | --- |
| 2026-02-18 | Adopt numbered docs tracks (`00`-`08`) as production-hardening system of record | Existing docs were optimized for Blog MVP and needed a dedicated hardening execution surface | Eng | Keep cross-links updated in `docs/README.md` and `docs/plans/README.md` |
| 2026-02-18 | Archive legacy roadmap and phase docs under `docs/archive/*` | Two parallel active planning sets increased maintenance risk and pointer drift | Eng | Keep `docs/00-index.md` as single active execution entry point |
| 2026-02-18 | Standardize local seed command with `db:seed` alias | Phase 1 runbooks expected `db:seed`; scripts only exposed `db:seed:blog-demo` | Eng | Add broader bootstrap seed workflow for admin/user setup in Phase 1 |
| 2026-02-18 | Treat local Docker Postgres as canonical Phase 1 validation target, with explicit `DATABASE_URL` override during verification | `.env.local` may point to remote DB; local-compose validation must avoid mutating remote environments | Eng | Codify in env runbook and CI smoke checks |
| 2026-02-18 | Accept temporary local `db:push` fallback while migration chain is reconciled | `db:migrate` currently does not create full auth schema on clean local DB, causing seed failure | Eng | Publish ADR-0031 and prioritize migration backfill task (T-010) |
| 2026-02-18 | Retire `db:push` as canonical bootstrap step after migration reconciliation | Added `drizzle/0002_schema_reconciliation.sql` + snapshot/journal updates; clean local bootstrap now passes with `db:migrate` + `db:seed` | Eng | Add CI/phase smoke check to enforce migrate-first bootstrap |
| 2026-02-18 | Enforce `fast-xml-parser@5.3.6` via `pnpm` override until AWS SDK publishes patched downstream dependency metadata | `@aws-sdk/xml-builder` latest metadata still pins `fast-xml-parser@5.3.4`, while installed graph can be safely forced to patched version | Eng | Remove override once upstream chain no longer requires it |
