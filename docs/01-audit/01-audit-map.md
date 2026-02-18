# Audit Map

Last updated: 2026-02-18
Status: Draft

## Goal

Create a measurement-first baseline before hardening or refactor work.

## Scope Order (Outside-In)

1. Repo governance and guardrails.
2. Toolchain and quality gates.
3. Environment and secret boundaries.
4. Architecture and ADR contract alignment.
5. Routing/access control surfaces.
6. Shared infrastructure (`src/lib`).
7. Shared UI/component system.
8. Feature modules and integration boundaries.
9. Performance and latency baseline.
10. Security hardening sweep.

## Required Outputs

- Baseline snapshot doc in `docs/audits/`.
- Top risk list in `docs/01-audit/02-risk-register.md`.
- Contract drift list (expected vs observed behavior).
- Priority-ordered remediation backlog.

## Evidence to Capture

- Command outputs for `lint`, `typecheck`, `test`, `build`.
- Key route timings (home, login, admin dashboard, blog list/detail).
- DB operation timings from South Africa test location.
- Current Docker/local startup reliability issues.

## Initial Baseline (2026-02-18)

- `pnpm lint` - pass with 10 warnings (`no-shadow` in shared UI files).
- `pnpm typecheck` - pass.
- `pnpm test` - pass (`37` files, `225` tests) with Vitest shutdown warning
  suggesting hanging-process reporter for deeper diagnosis.
- `pnpm build` - pass with dependency-level bundler warnings (`use client`
  directives ignored in node_modules and `shiki` wasm fallback warning).
