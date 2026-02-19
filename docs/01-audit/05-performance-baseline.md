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
| Route TTFB - `/` | Local | ZA | Pending | Pending | Pending | Local stack now running; measurement capture pending |
| Route TTFB - `/admin/dashboard` | Local | ZA | Pending | Pending | Pending | Local stack now running; measurement capture pending |
| DB query - session fetch | Current host | Singapore | Pending | Pending | Pending | Requires benchmark harness + ZA network sampling |

## Current Status (2026-02-18)

- Measurement plan is defined.
- Local runtime is now verified via Docker Compose; baseline measurements are
  not yet captured.
- Hosting decision track remains open pending ZA latency capture.

## Tooling

- Browser devtools performance panel.
- Server logs (`src/lib/observability/logger.ts`) with timing fields.
- SQL timing via Drizzle instrumentation/log output.

## Decision Inputs

- Hosting decision doc: `docs/03-hosting/01-db-hosting-options-za.md`
- Cutover plan: `docs/03-hosting/03-migration-plan-db-cutover.md`
