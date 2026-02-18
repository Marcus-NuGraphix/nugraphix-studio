# ADR-0003: Authentication & Authorization Model

- Status: Accepted
- Date: 2026-02-17
- Decision Owners: Nu Graphix (Marcus)
- Related: ADR-0001, Phase 3 Engineering System, Phase 4 Security

## Context

Nu Graphix Studio requires:

- Admin-only internal access (MVP)
- Secure session management
- Server-side role enforcement
- SaaS extensibility in the future

Authentication must integrate cleanly with Drizzle and PostgreSQL.

## Decision

We will adopt:

### Auth Provider
- Better Auth

### Role Model (MVP)
- guest
- admin

### Enforcement Rules
- All role checks occur inside server functions
- No client-side trust for permissions
- Admin-only routes must validate session server-side

### Session Handling
- Cookie-based sessions
- SameSite enforcement
- Secure cookies in production

### Authorization Strategy
- RBAC (role-based access control)
- Resource-level validation inside server functions

## Alternatives Considered

1) NextAuth/Auth.js
- Rejected: not aligned with TanStack Start stack.

2) Custom auth implementation
- Rejected: unnecessary security risk.

## Consequences

### Positive
- Clean Drizzle integration
- Strong server-side role enforcement
- SaaS-ready structure

### Trade-offs / Risks
- Requires careful session handling in SSR context
- Must not rely on UI-based access control

## Follow-ups

- requireUser()
- requireAdmin()
- Future: requireOrgMembership()
