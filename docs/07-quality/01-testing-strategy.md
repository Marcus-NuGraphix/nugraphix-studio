# Testing Strategy

Last updated: 2026-02-18
Status: Draft

## Goal

Define minimum reliable testing standards for production readiness.

## Test Layers

- Unit tests for pure domain logic and utilities.
- Integration tests for server functions and data access contracts.
- Route-level smoke tests for critical user journeys.

## Priority Areas

- Auth session and permission checks.
- Dashboard workspace access behavior.
- Content-management mutation and publication flow.
- Environment startup and migration safety scripts.

## Required Commands

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Coverage Guidance

- Prefer behavior-critical assertions over broad shallow coverage.
- Add regression tests for every P0/P1 bug fixed.