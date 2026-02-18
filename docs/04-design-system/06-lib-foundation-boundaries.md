# Lib Foundation Boundaries and Expansion Plan

Last updated: 2026-02-18
Status: Active

## Goal

Expand `src/lib` into a complete shared foundation while preserving feature
ownership and existing architectural contracts.

## Current Coverage Snapshot

| Domain | Current Path | Status |
| --- | --- | --- |
| Environment | `src/lib/env` | Implemented |
| Errors / ServerResult | `src/lib/errors` | Implemented |
| Observability / Logging | `src/lib/observability` | Implemented |
| Rate limiting | `src/lib/rateLimit` | Implemented |
| Database + schema | `src/lib/db` | Implemented |
| Server runtime utilities | `src/lib/server` | Implemented |
| Search helpers | `src/lib/search` | Implemented |
| Generic utilities | `src/lib/utils` | Implemented |

## Gap Matrix (Target Domains)

| Target Domain | Current State | Planned Path | Notes |
| --- | --- | --- | --- |
| Config | Missing dedicated layer | `src/lib/config` | Runtime non-secret config shaping and defaults |
| Constants | Scattered by feature | `src/lib/constants` | Shared, non-feature constants only |
| Validation | Feature-local only | `src/lib/validation` | Cross-feature reusable schemas/helpers only |
| Permissions | Feature-local auth mapping | `src/lib/permissions` | Shared permission primitives; feature roles remain in feature/auth |
| API clients | Mixed feature-local clients | `src/lib/api` | Cross-cutting client wrappers (retry, headers, tracing) |
| Feature flags | Missing | `src/lib/flags` | Typed flag contract + env wiring |
| Caching helpers | Missing dedicated layer | `src/lib/cache` | Generic cache keys/TTL helpers, no feature ownership |

## Ownership Rules

- Put code in `src/lib` only if it is cross-feature and reusable.
- Keep business workflows and feature policies in `src/features/*`.
- Keep server-only behavior inside server-only modules (or `src/lib/server`).
- Do not move code into `src/lib` solely for organization aesthetics.

## Boundary Rules: Lib vs Feature

Use `src/lib` when all are true:

1. Two or more features need the module now or in near-term roadmap.
2. The module has no feature-specific domain semantics.
3. The module can expose a stable, typed contract.

Keep in feature when any are true:

1. Logic is tied to one domain workflow.
2. Schema/validation is specific to one feature entity lifecycle.
3. Permissions are coupled to feature-only role behavior.

## Phased Rollout Plan

1. Phase 4A (done): baseline matrix and ownership rules documented.
2. Phase 4B (done): `config`, `constants`, and `flags` skeletons added with
   typed tests and shared barrel exports.
3. Phase 4C: extract reusable validation and permission primitives with
   narrowly scoped call-site migration.
4. Phase 4D: introduce `api` and `cache` helpers only where duplication is
   proven by current feature call-sites.

## Verification Per Increment

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test` (targeted module tests + affected feature tests)
- Import-path review for boundary compliance in touched files

## Exit Criteria

- `src/lib` contains explicit boundaries for all target domains.
- No feature ownership leakage into shared layers.
- Migration is incremental, reversible, and fully documented in task/risk logs.
