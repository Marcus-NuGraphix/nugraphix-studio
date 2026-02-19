# Production Hardening System of Record

Last updated: 2026-02-19
Status: Active
Owner: Engineering

## Purpose

This index is the entry point for the production-readiness audit and hardening
program. It is docs-first and phase-driven.

## Authoritative Read Order

1. `AI.md`
2. `ARCHITECTURE.md`
3. `docs/adr/README.md`
4. `docs/adr/ADR-SUMMARY-0001-0022.md`
5. `docs/08-implementation/01-phased-plan.md`
6. `docs/08-implementation/00-first-48-hours.md`

## Program Map

- `docs/01-audit/*` - baseline facts, risks, and architecture/dependency review.
- `docs/02-environments/*` - local Docker DX and production-dev VM runbook.
- `docs/03-hosting/*` - latency-first hosting decisions and migration/cutover.
- `docs/04-design-system/*` - component audit and scalable design-system rules.
- `docs/05-dashboard/*` - workspace IA, routing, permissions, and nav shell.
- `docs/06-security/*` - auth/security hardening and threat model.
- `docs/07-quality/*` - test/CI/release quality gates.
- `docs/08-implementation/*` - phased execution, task board, decisions, changelog.
- `docs/08-implementation/05-external-references.md` - official external docs used by this program.
- `docs/08-implementation/06-documentation-governance.md` - docs operations rules and anti-drift controls.

## Historical Records

- `docs/archive/roadmaps/*` - superseded and completed roadmaps.
- `docs/archive/phases/*` - completed MVP-era phase execution records.

## Working Rules

- Keep phases small, verifiable, and reversible.
- Keep a single active execution system (`docs/08-implementation/*`).
- Preserve current contracts (`ServerResult`, `Response` rethrowing, module boundaries).
- Do not refactor unrelated code.
- Do not add new libraries without explicit justification.
- Update docs in the same PR as implementation changes.

## Stale-Docs Policy

- If a doc is superseded, add a replacement link at top and move it to archive.
- Do not rewrite archived ADRs.
- Keep `docs/adr/README.md` next ADR number accurate.
