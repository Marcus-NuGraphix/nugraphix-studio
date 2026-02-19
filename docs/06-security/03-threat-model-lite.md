# Threat Model (Lite)

Last updated: 2026-02-19
Status: Active

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
| Privilege escalation via route/function mismatch | High | `/admin` role guard + server-side `requireAdmin`/permission checks + workspace parity contracts | Resource ownership checks still need route-by-route coverage | Execute IDOR checklist across `users`, `content`, `media`, and `kb` server paths |
| Session abuse/bruteforce | High | Better Auth global rate limiting + password-change throttle in security helpers | Endpoint-specific login/reset rate limits and abuse telemetry still incomplete | Add endpoint custom rules and denial observability in Phase 6 |
| Open redirect/unsafe callback abuse in auth flows | High | Better Auth trusted origins + safe redirect sanitizer + production HTTPS enforcement for auth origins | Need explicit test coverage for additional callback/cross-origin edge cases | Expand redirect/origin regression suite under `src/features/auth/tests` |
| Secret exposure in logs | High | structured logger redaction + safe auth error mapping | Full production log-surface audit not complete | Run targeted log review and add tests for sensitive key redaction |
| Latency-driven timeout/failure under region mismatch | Medium | none explicit | TBD | hosting decision + cutover |

## Assumptions

- Single-team controlled deployment.
- No multi-tenant isolation yet.
- Production traffic expected to grow after hardening.
