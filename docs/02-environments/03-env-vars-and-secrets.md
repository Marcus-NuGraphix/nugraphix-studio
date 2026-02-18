# Environment Variables and Secrets

Last updated: 2026-02-18
Status: Draft

## Goal

Enforce a single environment contract across local, CI, and VM runtime.

## Classification

- Public runtime vars (safe in browser builds).
- Server-only vars (must never leak to client bundle).
- Secret vars (credentials, tokens, API keys).

## Contract Checklist

- [x] `src/lib/env/server.ts` is source of truth.
- [x] `.env.example` includes required keys and safe placeholders.
- [ ] No secrets committed to repo.
- [ ] Secret rotation process documented.
- [x] Validation fails fast on startup when vars are missing/invalid.

## Environment Matrix

| Variable | Local | CI | Prod-Dev VM | Secret | Notes |
| --- | --- | --- | --- | --- | --- |
| `DATABASE_URL` | Required | Required | Required | Yes | Postgres connection string |
| `BETTER_AUTH_SECRET` | Required | Required | Required | Yes | Minimum entropy requirement |
| `BETTER_AUTH_URL` | Required | Required | Required | No | Must match runtime base URL |
| `BETTER_AUTH_BASE_URL` | Required | Required | Required | No | Required by runtime env schema |
| `EMAIL_PROVIDER` | Required | Required | Required | No | Allowed values: `noop`, `resend` |
| `RESEND_API_KEY` | Conditional | Conditional | Conditional | Yes | Required when `EMAIL_PROVIDER=resend` |

## Current Drift Notes (2026-02-18)

- Removed stale `sendgrid` guidance from `.env.example` to match
  `src/lib/env/server.ts` enum contract.
- Seed command comment in `.env.example` now points to existing scripts.
- Local Docker validation should explicitly target local Postgres URL
  (`postgresql://username:password@localhost:5432/mydb`) to avoid accidentally
  running migrations/seeds against remote databases.

## External References

- Better Auth options: https://better-auth.com/docs/reference/options
- Docker secrets guidance: https://docs.docker.com/engine/swarm/secrets/
