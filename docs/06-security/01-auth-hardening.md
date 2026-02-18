# Auth Hardening Plan

Last updated: 2026-02-18
Status: Draft

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

- [ ] Confirm secure cookie settings in production runtime (`secure`, `httpOnly`, `sameSite`).
- [ ] Validate session expiration and refresh behavior (`expiresIn`, `updateAge`).
- [ ] Verify logout invalidates active session(s) as expected.

### CSRF, CORS, and Origin Trust

- [ ] Validate Better Auth trusted origins.
- [ ] Confirm state-changing endpoints are protected by same-site cookie strategy and origin checks.
- [ ] Restrict CORS to explicit trusted origins where API exposure exists.

### Authorization and Route Guards

- [ ] Ensure admin route guard and server-function checks are both enforced.
- [ ] Validate resource-level checks (no IDOR by route param tampering).
- [ ] Confirm permission matrix maps to real route/server-function enforcement.

### Rate Limiting and Abuse Controls

- [ ] Verify login/reset/password-change throttling.
- [ ] Verify public write paths retain anti-abuse controls.
- [ ] Ensure rate-limit key strategy is stable behind proxies.

### Secret and Error Hygiene

- [ ] Confirm secrets/tokens are never logged.
- [ ] Validate safe error messages returned to clients.
- [ ] Confirm stack traces are not exposed in production responses.

## Verification

- [ ] Manual auth abuse scenarios executed.
- [ ] Unauthorized direct route and server-function calls rejected.
- [ ] Regression checks for login/signup/reset/account flows pass.

## References

- Better Auth docs: https://better-auth.com/docs
- OWASP ASVS/Top 10: https://owasp.org/www-project-top-ten/