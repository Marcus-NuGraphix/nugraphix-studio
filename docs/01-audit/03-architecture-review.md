# Architecture Review

Last updated: 2026-02-18
Status: Draft

## Goal

Validate implementation against authoritative contracts in `ARCHITECTURE.md` and ADRs.

## Contract Checklist

- [ ] Server functions use `createServerFn` + Zod validator.
- [ ] Expected failures return `ServerResult<T>`.
- [ ] Catch blocks re-throw `Response` control signals.
- [ ] Authz enforced server-side for protected operations.
- [ ] Feature module boundaries (`client`, `model`, `schemas`, `server`, `ui`) are preserved.
- [ ] Shared infra belongs in `src/lib` only when cross-cutting.

## Drift Log

| Area | Expected | Observed | Impact | Action |
| --- | --- | --- | --- | --- |
| TBD |  |  |  |  |

## Outputs

- ADR required: Yes/No (with reasoning).
- Follow-up implementation tasks linked in `docs/08-implementation/02-task-board.md`.