# Phase 6 Auth Hardening Kickoff Audit

- Date: 2026-02-19
- Scope: Initial `T-005` implementation slice (`auth` runtime origin/cookie hardening + redirect parity alignment)
- Phase: 6

## Findings by Severity

### High

1. Production auth runtime previously allowed insecure origin configuration
   (`http://`) for `BETTER_AUTH_BASE_URL` and trusted origin values.
   - Fix: startup now fails in production when insecure auth origin config is
     detected.
   - Evidence:
     - `src/features/auth/server/auth-config.ts`
     - `src/features/auth/server/auth.ts`
     - `src/features/auth/tests/auth-config.test.ts`

### Medium

1. Post-auth admin fallback redirect still pointed to legacy admin path model.
   - Fix: canonicalized fallback to
     `/admin/workspaces/operations/dashboard`.
   - Evidence:
     - `src/features/auth/model/post-auth.ts`
     - `src/features/auth/tests/post-auth.test.ts`
     - `src/features/auth/tests/entry-redirect.test.ts`

2. Workspace parity lacked a pinned contract for canonical nav path ownership.
   - Fix: added nav parity contract tests and corrected workspace inference
     mapping for legacy content routes.
   - Evidence:
     - `src/components/navigation/admin/navigation.contracts.test.ts`
     - `src/components/navigation/admin/navigation.ts`

## External References Used

- Better Auth options reference:
  `https://better-auth.com/docs/reference/options`
- Better Auth security reference:
  `https://better-auth.com/docs/reference/security`
- OWASP Top 10:
  `https://owasp.org/www-project-top-ten/`

## Verification Commands

```bash
pnpm vitest run src/components/navigation/admin/navigation.contracts.test.ts src/features/auth/tests/session.server.test.ts src/features/auth/tests/authorize.test.ts src/features/auth/tests/security.test.ts src/features/auth/tests/auth-config.test.ts src/features/auth/tests/entry-redirect.test.ts src/features/auth/tests/post-auth.test.ts
pnpm lint
pnpm typecheck
pnpm build
```

## Remaining Phase 6 Gaps

1. Add endpoint-specific throttling rules for login/reset flows.
2. Add resource-ownership authorization checks (IDOR focus) across admin data
   surfaces.
3. Validate explicit cookie `sameSite`/`httpOnly` contract and session
   invalidation semantics with targeted integration tests.
4. Add authz-denial observability checks in dashboard-facing security telemetry.
