# ADR-0036: Auth Runtime Origin Security and Canonical Admin Landing

- Status: Accepted
- Date: 2026-02-19
- Related: ADR-0003, ADR-0009, ADR-0035

## Context

Phase 6 auth hardening identified two immediate architecture-level gaps:

1. Auth runtime configuration could accept insecure (`http://`) origin inputs
   in production for `BETTER_AUTH_BASE_URL` and trusted origins.
2. Post-auth admin fallback still referenced legacy admin path shape instead of
   canonical workspace ownership introduced in ADR-0035.

Both issues affect security posture and route contract consistency.

## Decision

1. Auth runtime must fail fast in production when:
   - `BETTER_AUTH_BASE_URL` is non-HTTPS.
   - any trusted origin resolves to a non-HTTPS origin.
2. Trusted origin inputs are normalized to URL origins and deduplicated before
   being passed to Better Auth.
3. Secure cookie mode is resolved from hardened runtime checks (production must
   always run with secure auth cookies).
4. Admin post-auth fallback landing is standardized to canonical workspace path:
   - `/admin/workspaces/operations/dashboard`
5. These contracts are pinned with auth/nav regression tests.

## Consequences

### Positive

1. Production auth startup now rejects insecure origin/cookie configurations.
2. Open-redirect and CSRF exposure risk is reduced by stricter origin policy.
3. Admin auth redirects align with canonical workspace ownership model.
4. Route parity regressions are caught earlier through contract tests.

### Trade-offs

1. Misconfigured production environments now fail at startup (intentional,
   safer failure mode).
2. Local/non-production environments must keep explicit overrides for HTTP
   development scenarios.

## References

- `src/features/auth/server/auth-config.ts`
- `src/features/auth/server/auth.ts`
- `src/features/auth/model/post-auth.ts`
- `src/features/auth/tests/auth-config.test.ts`
- `src/features/auth/tests/entry-redirect.test.ts`
- `src/features/auth/tests/post-auth.test.ts`
- `src/components/navigation/admin/navigation.contracts.test.ts`
- Better Auth options/security docs:
  - `https://better-auth.com/docs/reference/options`
  - `https://better-auth.com/docs/reference/security`
