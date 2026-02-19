# Auth Hardening Plan

Last updated: 2026-02-19
Status: Active (In Progress)

## Goal

Harden authentication and authorization end-to-end without breaking current Better Auth integration.

## Scope

- `src/features/auth/*`
- `src/routes/admin/*`
- `src/routes/api/auth/$.ts`
- `src/lib/env/*`
- `src/lib/errors/*`
- `src/lib/rateLimit/*`

## Concrete Checks and Fixes

### Session and Cookie Security

- [x] Enforce secure-cookie runtime in production (`BETTER_AUTH_BASE_URL` must use HTTPS and `advanced.useSecureCookies` resolves true).
- [ ] Confirm explicit cookie attribute contract (`httpOnly`, `sameSite`) for auth/session cookies.
- [ ] Validate session expiration and refresh behavior (`expiresIn`, `updateAge`).
- [ ] Verify logout invalidates active session(s) as expected.

### CSRF, CORS, and Origin Trust

- [x] Validate Better Auth trusted origins (normalized and deduplicated origins list).
- [x] Fail startup in production when base URL or trusted origins use insecure HTTP.
- [ ] Confirm state-changing endpoints are protected by same-site cookie strategy and origin checks.
- [ ] Restrict CORS to explicit trusted origins where API exposure exists.

### Authorization and Route Guards

- [x] Ensure admin route guard and server-function checks are both enforced.
- [ ] Validate resource-level checks (no IDOR by route param tampering).
- [ ] Confirm permission matrix maps to real route/server-function enforcement.

### Rate Limiting and Abuse Controls

- [x] Verify password-change throttling and Better Auth baseline rate-limit config.
- [ ] Verify public write paths retain anti-abuse controls.
- [ ] Ensure rate-limit key strategy is stable behind proxies.

### Secret and Error Hygiene

- [ ] Confirm secrets/tokens are never logged.
- [x] Validate safe error messages returned to clients for auth security helpers.
- [ ] Confirm stack traces are not exposed in production responses.

## Progress Snapshot (2026-02-19)

- Completed Phase 6 kickoff hardening:
  - `src/features/auth/server/auth-config.ts`: trusted origin normalization,
    production HTTPS assertions, secure-cookie fail-fast.
  - `src/features/auth/server/auth.ts`: startup security assertions wired into
    Better Auth boot path.
  - `src/features/auth/model/post-auth.ts`: canonical admin landing path moved
    to `/admin/workspaces/operations/dashboard`.
- Added and updated regression coverage:
  - `src/features/auth/tests/auth-config.test.ts`
  - `src/features/auth/tests/entry-redirect.test.ts`
  - `src/features/auth/tests/post-auth.test.ts`
  - `src/features/auth/tests/session.server.test.ts`

## Verification

- [ ] Manual auth abuse scenarios executed.
- [x] Unauthorized direct route and server-function calls rejected.
- [ ] Regression checks for login/signup/reset/account flows pass.

### Commands Executed (2026-02-19)

```bash
pnpm vitest run src/features/auth/tests/session.server.test.ts src/features/auth/tests/authorize.test.ts src/features/auth/tests/security.test.ts src/features/auth/tests/auth-config.test.ts src/features/auth/tests/entry-redirect.test.ts src/features/auth/tests/post-auth.test.ts
pnpm lint
pnpm typecheck
pnpm build
```

## References

- Better Auth docs: https://better-auth.com/docs
- Better Auth options reference: https://better-auth.com/docs/reference/options
- Better Auth security reference: https://better-auth.com/docs/reference/security
- OWASP ASVS/Top 10: https://owasp.org/www-project-top-ten/
