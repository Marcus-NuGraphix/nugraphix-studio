# `src/features/auth` Reference

## Purpose

`src/features/auth` is the canonical auth and authorization domain for Nu
Graphix Studio. It integrates Better Auth with route-level protection and
server-side permission enforcement.

## Core Contracts

1. Session model:
   - `UserRole`: `user | admin`
   - `AppSession`: Better Auth session with normalized role typing
2. Permission model:
   - Admin: full permissions
   - User: account-only permissions
3. Route security:
   - Protected routes must enforce auth via `beforeLoad` + session helpers
4. Redirect safety:
   - All auth redirect/callback paths must pass `toSafeRedirectPath(...)`

## Shared Infrastructure Integration

Auth depends on `src/lib` infrastructure:

1. `@/lib/db` / `@/lib/db/schema` for Better Auth Drizzle adapter.
2. `@/lib/env/server` for runtime auth configuration.
3. `@/lib/errors` for typed security and authorization failures.
4. `@/lib/rateLimit` for password/session mutation throttling.
5. `@/lib/observability` for structured auth and mutation logging.
6. `@/features/auth/server/admin-api` wraps Better Auth admin plugin endpoints
   behind typed feature-level contracts.

## Reset Password URL Contract

Public reset links are shaped to:

- `/reset-password/?token=<token>&callbackURL=<safe-local-path>`

Notes:

1. `callbackURL` is optional.
2. unsafe callback values are dropped server-side.
3. UI blocks reset submit when token is missing/invalid.

## Production Hardening Notes

1. `BETTER_AUTH_SECRET` strength is enforced in production.
2. Auth config uses explicit trusted origins and secure-cookie derivation.
3. Password-change actions enforce auth-scoped rate limits by client IP.
4. Security mutation logs use structured `mutation.result` events.

## Validation and Test Coverage

Current auth tests cover:

1. permission contracts
2. redirect safety
3. safe error mapping
4. auth config utilities
5. security helpers
6. session guard behavior
7. auth schemas
