# ADR-0019: Auth Feature Hardening and `src/lib` Integration

**Status:** Accepted  
**Date:** 2026-02-17

## Context

`src/features/auth` was functionally complete but had several production gaps:

1. reset-password links were shaped to `/reset-password/<token>` while route
   handling depended on `token` search params,
2. auth security helpers used generic `Error` paths and ad hoc rate-limit keys,
3. auth behavior contracts were not documented in feature-level docs,
4. auth config tests depended on full auth runtime boot, causing DB runtime
   coupling in unit tests.

These issues reduced resilience and observability despite existing ADR
contracts for auth, routing, and server standards.

## Decision

Harden auth as follows:

1. Introduce pure auth config utilities in
   `src/features/auth/server/auth-config.ts` for:
   - trusted origin shaping,
   - secure cookie derivation,
   - reset URL shaping,
   - auth secret-strength policy.
2. Standardize password reset link contract to:
   - `/reset-password/?token=<token>&callbackURL=<safe-local-path>`.
3. Integrate shared `lib` infrastructure deeper in auth:
   - `lib/errors` for typed authorization/security failures,
   - `lib/rateLimit` key builder for auth-scoped keys,
   - `lib/observability` mutation logging for auth security actions.
4. Add request-context helpers for IP/user-agent extraction and stable
   auth-scoped rate-limit keying.
5. Add a feature-owned admin API wrapper for Better Auth admin plugin endpoints
   (for example `createUser`) to prevent endpoint typing drift at call sites.
6. Move auth config tests to pure contract tests to remove DB runtime coupling.
7. Add feature + reference documentation for auth operational contracts.

## Consequences

### Positive

1. Reset-password flow matches route contract and reduces broken-link risk.
2. Auth security actions have stronger validation and safer failure contracts.
3. Rate-limit keys are namespaced and consistent with shared infra standards.
4. Unit tests become more deterministic by testing pure auth config surfaces.
5. Auth domain documentation is explicit for future development and audits.

### Trade-offs

1. Slightly more files in auth server layer (`auth-config`, `request-context`).
2. Additional contract surface requires keeping docs and tests in sync.
