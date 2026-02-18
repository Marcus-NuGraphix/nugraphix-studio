# Local Dev Docker Runbook

Last updated: 2026-02-18
Status: Draft

## Goal

Reliable local development startup with Docker Desktop and minimal prerequisites.

## Required Services (Minimal)

- [ ] PostgreSQL
- [ ] Optional: Redis (only if required by active features)
- [ ] Optional: Mail sandbox (if email workflows are being tested)

## Local Startup Contract

1. Copy `.env.example` to `.env.local` and set required values.
2. Start services with Docker Compose.
3. Run migrations.
4. Seed deterministic baseline data.
5. Start app in dev mode.

## Expected Commands

- `docker compose up -d`
- `pnpm db:migrate`
- `pnpm db:seed`
- `pnpm dev`

## Verification Checklist

- [ ] Fresh machine setup works in <= 15 minutes.
- [ ] App can log in with seeded account.
- [ ] Admin routes and core public routes load.
- [ ] No manual database interventions required.

## Troubleshooting

- Port conflicts
- Missing env vars
- Migration drift
- Seed idempotency failures