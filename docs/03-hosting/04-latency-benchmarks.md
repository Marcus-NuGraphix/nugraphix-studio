# Latency Benchmarks

Last updated: 2026-02-18
Status: Draft

## Goal

Track before/after latency metrics for hosting decisions.

## Benchmark Cases

- Public home route SSR TTFB.
- Authenticated admin dashboard TTFB.
- Session lookup query latency.
- Content list query latency.
- Mutation round trip (create/update flow).

## Data Table

| Case | Baseline (Current) | Candidate A | Candidate B | Winner |
| --- | --- | --- | --- | --- |
| `/` TTFB p95 | TBD | TBD | TBD | TBD |
| `/admin/dashboard` TTFB p95 | TBD | TBD | TBD | TBD |
| Session query p95 | TBD | TBD | TBD | TBD |

## Method

- Use same test scripts, same payloads, same sample sizes.
- Capture UTC timestamp and environment metadata with each run.