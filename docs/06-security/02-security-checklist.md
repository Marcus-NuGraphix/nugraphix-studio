# Security Checklist

Last updated: 2026-02-18
Status: Draft

## Goal

Track OWASP-aligned security checks across the stack.

## Checklist

### A01 Broken Access Control

- [ ] Route and server-function authorization parity.
- [ ] Resource ownership checks for param-based lookups.
- [ ] Admin-only tools inaccessible to non-admins.

### A02 Cryptographic Failures

- [ ] Secret strength and rotation policy documented.
- [ ] TLS-only cookie behavior in production.
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

- [ ] Brute-force controls present.
- [ ] Session invalidation and concurrent session expectations tested.
- [ ] Safe account recovery flows.

### A09 Logging and Monitoring Failures

- [ ] Security events logged with redaction.
- [ ] Auth failures and privilege denials observable.

## Tracking Table

| Control | Status | Evidence | Fix Owner | Phase |
| --- | --- | --- | --- | --- |
| TBD |  |  |  |  |