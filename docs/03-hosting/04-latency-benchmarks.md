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
| DB round-trip p95 (ZA run) | 526.62 ms (`ap-southeast-1` Neon pooler) | TBD | TBD | TBD |
| `/` TTFB p95 (ZA run) | 28.63 ms (`status=307`) | TBD | TBD | TBD |
| `/admin/dashboard` TTFB p95 (ZA run) | 41.80 ms (`status=307`) | TBD | TBD | TBD |
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

- HTTP TTFB script: `tools/benchmark-http-ttfb.ts`
- Package command: `pnpm perf:http-ttfb`
- Artifact output: `docs/03-hosting/artifacts/http-ttfb-*.json`

### Local Control Validation (2026-02-18)

- Location label: `local-control`
- Target: `postgresql://localhost:5432/mydb`
- Iterations: `20` (warmup `3`)
- Results:
  - `p50=1.09 ms`
  - `p95=1.51 ms`
  - `avg=1.17 ms`
  - `min=0.94 ms`, `max=1.58 ms`

### ZA Baseline Validation (2026-02-18)

- Location label: `za-runner`
- Target: `postgresql://ep-steep-mode-a19wpce3-pooler.ap-southeast-1.aws.neon.tech:5432/neondb`
- Iterations: `40` (warmup `5`)
- Artifact: `docs/03-hosting/artifacts/db-latency-2026-02-18T12-44-55-119Z.json`
- Results:
  - `p50=506.40 ms`
  - `p95=526.62 ms`
  - `avg=522.21 ms`
  - `min=479.43 ms`, `max=1099.42 ms`

### ZA HTTP Route Baseline (2026-02-18)

- Origin: `https://nugraphix.co.za` (`redirect=manual`)
- Iterations: `40` (warmup `5`)
- Artifact: `docs/03-hosting/artifacts/http-ttfb-2026-02-18T12-50-57-626Z.json`
- Results:
  - `/`: `p50=24.92 ms`, `p95=28.63 ms`, `status=307`
  - `/admin/dashboard`: `p50=22.03 ms`, `p95=41.80 ms`, `status=307`
  - `/blog`: `p50=22.38 ms`, `p95=44.25 ms`, `status=307`
  - `/login`: `p50=21.96 ms`, `p95=28.63 ms`, `status=307`

## Candidate Scoring

Latency score bands for ZA DB round-trip p95:

- `<=100 ms`: Excellent (`5/5`)
- `101-180 ms`: Good (`4/5`)
- `181-260 ms`: Acceptable (`3/5`)
- `261-400 ms`: Weak (`2/5`)
- `>400 ms`: High risk (`1/5`)

Current baseline score:

- Current Neon `ap-southeast-1`: `526.62 ms` => `1/5` (high latency risk for ZA)

Candidate A/B scoring remains pending until candidate target endpoints are benchmarked from ZA using the same harness.

## Method

- Use same test scripts, same payloads, same sample sizes.
- Capture UTC timestamp and environment metadata with each run.
- Record benchmark artifacts and summarize p50/p95 deltas in this document.
