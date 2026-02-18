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
| DB round-trip p95 (local control run) | 1.51 ms (`localhost`) | TBD | TBD | TBD |
| DB round-trip p95 (ZA run) | TBD | TBD | TBD | TBD |
| `/` TTFB p95 (ZA run) | TBD | TBD | TBD | TBD |
| `/admin/dashboard` TTFB p95 (ZA run) | TBD | TBD | TBD | TBD |
| Session query p95 (ZA run) | TBD | TBD | TBD | TBD |

## Benchmark Harness

- Script: `tools/benchmark-db-latency.ts`
- Package command: `pnpm perf:db-latency`
- Artifact output: `docs/03-hosting/artifacts/db-latency-*.json`

### Config Inputs

- `BENCHMARK_DB_TARGETS`:
  - Format: `label=postgresql://...;label2=postgresql://...`
  - If omitted, defaults to `DATABASE_URL` as `default`.
- `BENCHMARK_LOCATION`: runner location label (`za-cpt`, `za-jnb`, `eu-west`, etc).
- `BENCHMARK_QUERY`: SQL probe query (default: `select 1`).
- `BENCHMARK_WARMUP`: warmup iterations (default: `5`).
- `BENCHMARK_ITERATIONS`: measured iterations (default: `30`).
- `BENCHMARK_WRITE_ARTIFACT`: `true|false` (default: `true`).

### Example (ZA Candidate Comparison)

```powershell
$env:BENCHMARK_LOCATION='za-cpt'
$env:BENCHMARK_DB_TARGETS='current=postgresql://...;candidate-a=postgresql://...;candidate-b=postgresql://...'
$env:BENCHMARK_ITERATIONS='40'
$env:BENCHMARK_WARMUP='5'
pnpm perf:db-latency
```

### Local Control Validation (2026-02-18)

- Location label: `local-control`
- Target: `postgresql://localhost:5432/mydb`
- Iterations: `20` (warmup `3`)
- Results:
  - `p50=1.09 ms`
  - `p95=1.51 ms`
  - `avg=1.17 ms`
  - `min=0.94 ms`, `max=1.58 ms`

## Method

- Use same test scripts, same payloads, same sample sizes.
- Capture UTC timestamp and environment metadata with each run.
- Record benchmark artifacts and summarize p50/p95 deltas in this document.
