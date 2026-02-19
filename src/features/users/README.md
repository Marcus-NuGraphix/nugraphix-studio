# Users Feature

This feature owns user account management and admin user governance for Nu
Graphix Studio.

## Responsibilities

1. Account self-service operations (profile, password, session controls).
2. Admin user directory operations (read, role updates, suspend/reactivate,
   session revocation, delete).
3. User audit and security event surfacing.
4. User-facing and admin-facing UI composition for account/security workflows.

## `src/lib` Integration

Users integrates with shared infrastructure:

1. `@/lib/db` and `@/lib/db/schema` for user/session/audit/security persistence.
2. `@/lib/observability` for structured mutation and security logs.
3. `@/lib/errors` for server-safe error handling upstream in route/server flows.
4. `@/lib/utils` for cross-cutting helpers (`getInitials`, `cn`).

## Feature Surfaces

1. `model/*`: filter contracts, domain types, shared event label formatters.
2. `schemas/*`: account and admin validation schemas.
3. `server/users.ts`: canonical server functions for all account/admin actions.
4. `server/repository.ts`: Drizzle-backed user data access layer.
5. `ui/account/*`: account center composition and forms.
6. `ui/admin/*`: admin console components (table, filters, drawer, timeline).

## Route Integration

1. `/account`: user account center (`src/routes/_auth/account/index.tsx`).
2. `/admin/account`: admin self-account center.
3. `/admin/users`: full admin user management console.
4. `/admin/users/$userId`: dedicated user detail page.

## Operational Rules

1. Permission checks are enforced server-side before any admin/account action.
2. Self-destructive admin actions are blocked at UI and server boundaries.
3. Security-sensitive mutations (password/session lifecycle) emit audit/security
   events.
4. Filters and paging use validated search contracts to avoid ad hoc query
   parsing.
