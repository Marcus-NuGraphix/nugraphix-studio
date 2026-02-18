# Database Hosting Options (South Africa Latency Focus)

Last updated: 2026-02-18
Status: Draft

## Goal

Choose DB hosting with evidence-based latency and operational fit for South Africa users.

## Evaluation Criteria

- Network latency from South Africa (p50/p95).
- Region availability and failover options.
- Operational complexity and cost.
- Migration risk from current provider/region.
- Compatibility with Drizzle + current runtime model.

## Candidate Matrix

| Option | Region | ZA DB p95 | Score | Operational Notes | Decision |
| --- | --- | --- | --- | --- | --- |
| Current Neon region (Singapore) | ap-southeast-1 | 526.62 ms | 1/5 | Existing setup; high RTT from ZA | Baseline (re-evaluate) |
| Candidate A | TBD | TBD | TBD | TBD | Pending benchmark |
| Candidate B | TBD | TBD | TBD | TBD | Pending benchmark |

## Required Evidence

- [x] Synthetic local-control timings collected via `pnpm perf:db-latency`.
- [x] ZA current-region query benchmark sample captured:
  - `docs/03-hosting/artifacts/db-latency-2026-02-18T12-44-55-119Z.json`
- [x] ZA route-level TTFB baseline captured:
  - `docs/03-hosting/artifacts/http-ttfb-2026-02-18T12-50-57-626Z.json`
- [ ] ZA candidate-region query benchmark samples (candidate A/B).
- [ ] Route TTFB delta attributable to DB distance.

## Measurement Workflow

1. Run `pnpm perf:db-latency` from ZA runner/VM with
   `BENCHMARK_DB_TARGETS` configured for current and candidate DB endpoints.
2. Store generated artifact in `docs/03-hosting/artifacts/`.
3. Update `docs/03-hosting/04-latency-benchmarks.md` with p50/p95 summary.
4. Re-score candidate matrix and record decision in implementation log/ADR.
