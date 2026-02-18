# Local Dev Docker Runbook

Last updated: 2026-02-18
Status: Draft

## Goal

Reliable local development startup with Docker Desktop and minimal prerequisites.

## Required Services (Current)

- [x] PostgreSQL (`postgres`)
- [x] Object storage for media (`minio` + `minio-create-bucket`)
- [x] Mail sandbox (`mailpit`)
- [x] Redis (`redis`) for background task/rate-limit support

## Local Startup Contract

1. Ensure Docker Desktop engine is running.
2. Copy `.env.example` to `.env.local` and set required values.
3. Start services with Docker Compose.
4. Run migrations against local Postgres.
5. Seed deterministic baseline data.
6. Start app in dev mode.

## Expected Commands

- `docker info`
- `docker compose up -d`
- `pnpm db:migrate`
- `pnpm db:seed`
- `pnpm dev`

## Verified Command Sequence (PowerShell)

```powershell
$env:DATABASE_URL='postgresql://username:password@localhost:5432/mydb'
docker compose up -d postgres minio minio-create-bucket mailpit redis
pnpm db:migrate
pnpm db:seed
```

## Current Verification (2026-02-18)

- `docker --version` - pass.
- `docker info` - pass.
- `docker compose config` - pass.
- `docker compose up -d` - pass (`postgres`, `redis`, `mailpit`, `minio` running).
- `pnpm db:migrate` with local `DATABASE_URL` - pass.
- `pnpm db:seed` after migrate path - pass (`8` demo posts upserted).
- Local DB sanity check - pass (`user_count=1`, `post_count=8`).

## Verification Checklist

- [x] Docker engine starts and `docker compose up -d` succeeds.
- [ ] Fresh machine setup works in <= 15 minutes.
- [ ] App can log in with seeded account.
- [ ] Admin routes and core public routes load.
- [ ] No manual database interventions required.

## Troubleshooting

- Migration artifacts were reconciled in `drizzle/0002_schema_reconciliation.sql`.
- Legacy local databases that still contain `users` can be normalized by rerunning
  `pnpm db:migrate` (migration `0002` migrates/drop-in replaces legacy table).

```powershell
$env:DATABASE_URL='postgresql://username:password@localhost:5432/mydb'
pnpm db:migrate
```

- Port conflicts (`5432`, `6379`, `9000`, `9001`, `1025`, `8025`).
- Missing env vars.
- Migration drift.
- Seed idempotency failures.
