# Performance Baseline

Last updated: 2026-02-18
Status: Draft

## Goal

Establish latency and throughput baselines before optimization decisions.

## Measurement Plan

- Client route metrics: home, login, admin dashboard, blog list, blog detail.
- Server timings: auth/session lookup, critical list queries, write paths.
- DB timings: p50/p95 for representative queries from South Africa network.
- Cold start vs warm route behavior in local and prod-dev containers.

## Baseline Table

| Metric | Environment | Region | p50 | p95 | Sample Size | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Route TTFB - `/` | Local | ZA | TBD | TBD | TBD |  |
| Route TTFB - `/admin/dashboard` | Local | ZA | TBD | TBD | TBD |  |
| DB query - session fetch | Current host | Singapore | TBD | TBD | TBD |  |

## Tooling

- Browser devtools performance panel.
- Server logs (`src/lib/observability/logger.ts`) with timing fields.
- SQL timing via Drizzle instrumentation/log output.

## Decision Inputs

- Hosting decision doc: `docs/03-hosting/01-db-hosting-options-za.md`
- Cutover plan: `docs/03-hosting/03-migration-plan-db-cutover.md`