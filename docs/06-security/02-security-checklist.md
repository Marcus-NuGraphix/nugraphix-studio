# Security Checklist

Last updated: 2026-02-19
Status: Active

## Goal

Track OWASP-aligned security checks across the stack.

## Checklist

### A01 Broken Access Control

- [x] Route and server-function authorization parity.
- [ ] Resource ownership checks for param-based lookups.
- [x] Admin-only tools inaccessible to non-admins.

### A02 Cryptographic Failures

- [ ] Secret strength and rotation policy documented.
- [x] TLS-only cookie behavior in production.
- [ ] Password reset and email verification tokens handled safely.

### A03 Injection

- [ ] Inputs validated with Zod on mutations.
- [ ] No raw SQL concatenation.
- [ ] URL/file/path inputs constrained.

### A05 Security Misconfiguration

- [ ] Secure headers strategy defined.
- [ ] CORS/origin config least privilege.
- [ ] Debug endpoints disabled or protected in production.

### A07 Identification and Authentication Failures

- [x] Brute-force controls present.
- [ ] Session invalidation and concurrent session expectations tested.
- [ ] Safe account recovery flows.

### A09 Logging and Monitoring Failures

- [ ] Security events logged with redaction.
- [ ] Auth failures and privilege denials observable.

## Tracking Table

| Control | Status | Evidence | Fix Owner | Phase |
| --- | --- | --- | --- | --- |
| Admin route + server-function authz parity | Pass | `src/routes/admin/route.tsx`, `src/features/auth/server/session.server.ts`, `src/features/auth/tests/session.server.test.ts` | Eng | 5-6 |
| Canonical workspace role visibility parity (desktop/mobile) | Pass | `docs/05-dashboard/artifacts/2026-02-19-workspace-parity-smoke.md`, `src/components/navigation/admin/navigation.contracts.test.ts` | Eng | 5 |
| Better Auth trusted origins + production HTTPS enforcement | Pass | `src/features/auth/server/auth-config.ts`, `src/features/auth/server/auth.ts`, `src/features/auth/tests/auth-config.test.ts` | Eng | 6 |
| Auth redirect safety and admin landing canonicalization | Pass | `src/features/auth/model/post-auth.ts`, `src/features/auth/tests/post-auth.test.ts`, `src/features/auth/tests/entry-redirect.test.ts` | Eng | 6 |
| Password-change abuse throttling | Pass | `src/features/auth/server/security.ts`, `src/features/auth/tests/security.test.ts` | Eng | 6 |
| Login/reset endpoint-specific throttling rules | Open | Better Auth global limiter is enabled; endpoint-specific custom rules still pending. | Eng | 6 |
| Resource ownership checks for ID-based reads/mutations (IDOR) | Open | Requires route-by-route review in `users`, `content`, `media`, `kb` server surfaces. | Eng | 6 |
| Security-event observability for authz denials | Open | Route denials logged; dashboard-facing denial metrics not yet added. | Eng | 6-7 |
