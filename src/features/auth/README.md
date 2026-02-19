# Auth Feature

This feature owns authentication, authorization, and account-security flows for
Nu Graphix Studio.

## Responsibilities

1. Better Auth runtime configuration and API handler integration.
2. Session boundary enforcement (`getOptionalSession`, `requireSession`, `requireAdmin`).
3. Permission policy and server-side authorization checks.
4. Auth-facing validation schemas for forms and redirect safety.
5. Account security operations (password change, session revoke).
6. Auth UI surfaces for login, signup, reset, and recovery.

## `src/lib` Integration

Auth integrates directly with shared infrastructure:

1. `@/lib/db` + `@/lib/db/schema` for Better Auth adapter schema/runtime DB.
2. `@/lib/env/server` for validated auth runtime configuration.
3. `@/lib/rateLimit` for auth-specific mutation throttling.
4. `@/lib/errors` for typed authorization and security failures.
5. `@/lib/observability` for structured auth/session/security logs.

## File Map

1. `client/auth-client.ts`: Better Auth client instance for UI calls.
2. `model/session.ts`: `AppSession` and `UserRole` domain contract.
3. `model/permissions.ts`: RBAC permission matrix.
4. `model/redirect.ts`: open-redirect guard for route/search values.
5. `model/safe-errors.ts`: user-safe auth error messaging.
6. `schemas/auth.ts`: auth form/search schemas.
7. `schemas/password.ts`: password policy schema.
8. `server/auth-config.ts`: pure auth config and URL-shaping utilities.
9. `server/admin-api.ts`: typed wrappers for Better Auth admin plugin endpoints.
10. `server/auth.ts`: Better Auth instance and plugin wiring.
11. `server/session.server.ts`: server-side auth/session guards.
12. `server/session.ts`: TanStack server function wrappers for sessions.
13. `server/entry-redirect.ts`: shared auth-page redirect guard for authenticated sessions.
14. `server/authorize.ts`: permission assertion boundary.
15. `server/request-context.ts`: IP/user-agent extraction and auth rate-limit key helpers.
16. `server/rate-limit.ts`: auth rate-limit wrappers over shared limiter.
17. `server/security.ts`: password/session security actions.
18. `ui/*`: auth route UI components and shared form shell.
19. `tests/*`: auth unit test suite.

## Operational Rules

1. Role checks are server-enforced; UI checks are convenience only.
2. Redirect targets must pass `toSafeRedirectPath(...)`.
3. Password reset links use query token contract:
   `/reset-password/?token=<token>`.
4. Security mutations must log structured success/failure events.
5. Auth secrets must meet minimum production strength requirements.
