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

## Top 10 Production Blockers

- [ ] Confirmed and prioritized during Phase 0 baseline.
