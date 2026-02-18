# Risk Register

Last updated: 2026-02-18
Status: Draft

## Severity Model

- `P0` - release blocker/security-critical.
- `P1` - major reliability/performance risk.
- `P2` - important but non-blocking.
- `P3` - backlog/improvement.

## Risk Table

| ID | Severity | Area | Risk | Evidence | Mitigation | Owner | Target Phase | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | P0 | Docs Governance | Active plan/docs index drift across docs folders | `docs/README.md`, `docs/plans/README.md`, `docs/08-implementation/01-phased-plan.md` | Normalize to single active hardening plan and keep legacy docs as historical | Eng | Phase 0 | Closed |
| R-002 | P1 | Latency | DB region distance from South Africa may increase TTFB and query latency | Neon region currently Singapore | Measure route + DB p95 and run hosting options comparison | Eng | Phase 3 | Open |
| R-003 | P1 | Environments | Local and prod-dev runtime setup may drift due env/config inconsistency | Current env and Docker docs split across files | Centralize environment contract + runbooks | Eng | Phase 1-2 | Open |
| R-004 | P2 | Build Pipeline | Production build emits large dependency warning volume that can hide real regressions | `pnpm build` output (`use client` warnings, wasm fallback) | Triage and document expected warnings; suppress/noise-reduce where safe | Eng | Phase 7 | Open |
| R-005 | P2 | Test Stability | Vitest reports shutdown timeout warning despite passing tests | `pnpm test` output (`hanging-process` hint) | Investigate hanging resource and harden test teardown | Eng | Phase 7 | Open |
| R-006 | P0 | Dependencies | High vulnerability (`fast-xml-parser`) in production dependency chain via AWS SDK | `pnpm audit --prod`, GHSA-jmr7-xgp7-cmfj; mitigated by `pnpm` override with installed graph resolving to `fast-xml-parser@5.3.6` | Keep override in place until AWS SDK publishes patched downstream metadata; recheck on dependency bumps | Eng | Phase 0 | Closed |
| R-007 | P1 | Local Runtime | Docker engine not running blocks Phase 1 local environment verification | `docker compose up -d` pipe error (`dockerDesktopLinuxEngine`) | Added explicit Docker engine preflight check and re-ran local startup validation successfully | Eng | Phase 1 | Closed |
| R-008 | P1 | Seed Workflow | Generic `db:seed` command missing caused docs/runtime mismatch | `pnpm run` script list vs environment docs | Added `db:seed` alias; add admin/bootstrap seed path follow-up | Eng | Phase 1 | Mitigated |
| R-009 | P2 | Env Contract | `.env.example` previously advertised unsupported `sendgrid` provider | `.env.example` vs `src/lib/env/server.ts` | Remove stale provider guidance and keep schema-driven env docs | Eng | Phase 0 | Closed |
| R-010 | P1 | DB Migrations | Migration artifacts were incomplete for current schema (`db:migrate` previously did not create auth tables like `user`) causing seed failure on clean local DB | Resolved via `drizzle/0002_schema_reconciliation.sql`; clean bootstrap now verified with `pnpm db:migrate` + `pnpm db:seed` | Keep migration artifacts synchronized and retain migrate-first bootstrap checks | Eng | Phase 1 | Closed |
| R-011 | P2 | Dependencies | Moderate `esbuild` advisory remains in transitive toolchain path (`better-auth` -> `drizzle-kit` -> `@esbuild-kit/*`) | `pnpm audit --prod` (GHSA-67mh-4wv8-2f99) | Track upstream releases and remove via dependency updates when available; document local-dev exposure boundaries | Eng | Phase 0-1 | Open |

## Top 10 Production Blockers

1. [ ] R-002: Capture ZA latency baseline and hosting candidate comparisons.
2. [ ] R-003: Finalize env/runtime runbooks and deterministic setup flow.
3. [ ] R-008: Add admin/bootstrap seed flow beyond blog demo data.
4. [ ] R-011: Resolve transitive `esbuild` advisory via upstream dependency updates.
5. [ ] R-005: Investigate and fix Vitest hanging-process timeout.
6. [ ] R-004: Reduce build warning noise to preserve signal quality.
7. [ ] Review admin docs route placeholders for current system-of-record links.
8. [ ] Validate auth/cookie/origin/rate-limit hardening checklist outcomes.
9. [ ] Lock CI quality gates with clear release blocking policy.
10. [ ] Track framework patch/minor updates after Phase 1 stabilization.
