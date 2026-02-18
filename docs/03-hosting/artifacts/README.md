# Latency Artifacts

Store generated latency benchmark JSON artifacts in this directory.

## Naming

- DB benchmark: `db-latency-<ISO timestamp>.json`

## Source Script

- `pnpm perf:db-latency` (`tools/benchmark-db-latency.ts`)

## Commit Policy

- Commit baseline and decision-support artifacts that inform hosting ADR/decision updates.
- Do not commit artifacts containing secrets.
