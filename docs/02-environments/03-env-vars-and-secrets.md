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

- [ ] `src/lib/env/server.ts` is source of truth.
- [ ] `.env.example` includes required keys and safe placeholders.
- [ ] No secrets committed to repo.
- [ ] Secret rotation process documented.
- [ ] Validation fails fast on startup when vars are missing/invalid.

## Environment Matrix

| Variable | Local | CI | Prod-Dev VM | Secret | Notes |
| --- | --- | --- | --- | --- | --- |
| `DATABASE_URL` | Required | Required | Required | Yes | Postgres connection string |
| `BETTER_AUTH_SECRET` | Required | Required | Required | Yes | Minimum entropy requirement |
| `BETTER_AUTH_URL` | Required | Required | Required | No | Must match runtime base URL |

## External References

- Better Auth options: https://better-auth.com/docs/reference/options
- Docker secrets guidance: https://docs.docker.com/engine/swarm/secrets/