# `src/features/users` Reference

Last updated: 2026-02-18

## Purpose

`src/features/users` owns user account self-service and admin user governance.

## Responsibilities

1. Account operations for authenticated users:
   - profile updates
   - password changes
   - session visibility and session revocation
2. Admin user operations:
   - list/filter/detail
   - role updates
   - suspend/reactivate
   - delete and forced session revocation
3. Security and audit event surfaces for account/admin workflows.

## Module Map

- `model/*`: filter and display contracts.
- `schemas/*`: account/admin mutation schemas.
- `server/repository.ts`: data-access abstraction.
- `server/users.ts`: route-facing server function contracts.
- `ui/account/*`: user account center components.
- `ui/admin/*`: admin management console components.
- `lib/query-keys.ts`: query key contracts.

## Shared Infrastructure Usage

- `@/lib/db` + `@/lib/db/schema`: persistence.
- `@/lib/errors`: canonical server failure conversion.
- `@/lib/observability`: structured event logging.
- `@/lib/utils`: shared deterministic helpers.

## Route Integration

- User account center:
  - `src/routes/_auth/account/index.tsx`
- Admin account and user management:
  - `src/routes/admin/account/index.tsx`
  - `src/routes/admin/users/index.tsx`
  - `src/routes/admin/users/$userId.tsx`

## Contract Rules

- Permission checks happen server-side for every admin mutation.
- Security-sensitive actions emit audit/security events.
- UI role gating is advisory only; server remains authoritative.
- Filters and paging use validated contracts, not ad hoc query parsing.
