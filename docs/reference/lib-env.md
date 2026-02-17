# `src/lib/env` Reference

## Purpose

`src/lib/env` is the canonical runtime contract for server environment variables.
It validates configuration at access time, applies safe defaults, and enforces
cross-field constraints required for production operation.

## Files

- `src/lib/env/server.ts`: Zod schema, parser, cache, and `env` proxy.
- `src/lib/env/index.ts`: public barrel export.

## Public API

- `parseServerEnv(source?)`
Parses a provided env source object (defaults to `process.env`) and returns a
typed env object or throws with formatted validation output.

- `getServerEnv()`
Returns cached parsed env values. First call performs schema validation.

- `env`
Lazy proxy for direct property access (`env.DATABASE_URL`).

- `resetServerEnvCacheForTests()`
Clears cache for deterministic test runs.

## Validation Rules

- Required infrastructure credentials are always enforced.
- `EMAIL_PROVIDER="resend"` requires `RESEND_API_KEY`.
- reCAPTCHA keys must be configured as a pair:
  - `VITE_RECAPTCHA_SITE_KEY`
  - `RECAPTCHA_SECRET_KEY`
- In production, either `BACKGROUND_TASKS_DRAIN_SECRET` or `CRON_SECRET` must
  be present.
- `RECAPTCHA_MIN_SCORE` is constrained to `0..1`.

## Operational Notes

- Secrets are never included in thrown error payloads.
- Validation is fail-fast on first env access to avoid partial startup states.
- All server modules should import from `@/lib/env/server` or `@/lib/env`.
