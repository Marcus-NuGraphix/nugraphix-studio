# Threat Model (Lite)

Last updated: 2026-02-18
Status: Draft

## Goal

Capture practical threat assumptions and mitigations for current architecture.

## Assets

- User accounts and sessions.
- Admin content-management capabilities.
- DB integrity and availability.
- Secrets and external service credentials.

## Entry Points

- Public routes and forms.
- `/api/auth/*` endpoints.
- Admin routes and server functions.
- Docker runtime environment and deployment paths.

## Top Threats

| Threat | Impact | Existing Controls | Gaps | Planned Fix |
| --- | --- | --- | --- | --- |
| Privilege escalation via route/function mismatch | High | admin route guard + server checks | TBD | permissions matrix audit |
| Session abuse/bruteforce | High | rate limiting helpers | TBD | auth hardening phase |
| Secret exposure in logs | High | structured logger redaction | TBD | log review + tests |
| Latency-driven timeout/failure under region mismatch | Medium | none explicit | TBD | hosting decision + cutover |

## Assumptions

- Single-team controlled deployment.
- No multi-tenant isolation yet.
- Production traffic expected to grow after hardening.