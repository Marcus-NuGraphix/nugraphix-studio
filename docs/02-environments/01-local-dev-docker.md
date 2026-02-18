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
- `pnpm db:push` (temporary local bootstrap fallback until migration chain is reconciled)
- `pnpm db:seed`
- `pnpm dev`

## Verified Command Sequence (PowerShell)

```powershell
$env:DATABASE_URL='postgresql://username:password@localhost:5432/mydb'
docker compose up -d postgres minio minio-create-bucket mailpit redis
pnpm db:migrate
pnpm db:push
pnpm db:seed
```

## Current Verification (2026-02-18)

- `docker --version` - pass.
- `docker info` - pass.
- `docker compose config` - pass.
- `docker compose up -d` - pass (`postgres`, `redis`, `mailpit`, `minio` running).
- `pnpm db:migrate` with local `DATABASE_URL` - pass.
- `pnpm db:seed` after migrate-only path - fails (`relation "user" does not exist`).
- `pnpm db:push` with local `DATABASE_URL` - pass.
- `pnpm db:seed` after push path - pass (`8` demo posts upserted).

## Verification Checklist

- [x] Docker engine starts and `docker compose up -d` succeeds.
- [ ] Fresh machine setup works in <= 15 minutes.
- [ ] App can log in with seeded account.
- [ ] Admin routes and core public routes load.
- [ ] No manual database interventions required.

## Troubleshooting

- `db:migrate` succeeds but seed fails if schema drift exists (workaround: `db:push`).
- If `db:push` prompts about renaming `users` -> `account`, remove legacy local
  `users` table and rerun push against a clean local DB.

```powershell
docker exec nugraphixstudiolocal-postgres-1 psql -U username -d mydb -c "DROP TABLE IF EXISTS users CASCADE;"
```

- Port conflicts (`5432`, `6379`, `9000`, `9001`, `1025`, `8025`).
- Missing env vars.
- Migration drift.
- Seed idempotency failures.
