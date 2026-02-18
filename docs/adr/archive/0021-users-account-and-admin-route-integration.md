# ADR-0021: Users Account and Admin Route Integration

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0012, ADR-0019, ADR-0020

## Context

`src/features/users` already had core server functions and UI primitives, but
the route layer was still scaffolded:

1. `/admin/users` and `/admin/users/$userId` did not execute real user
   operations.
2. There was no dedicated routed account center for signed-in users.
3. Admin users had no routed self-account surface under the admin workspace.
4. Account/admin user UI patterns were not aligned with the shared composition
   layer (`PageHeader`, `StatCard`, table/navigation patterns).

This limited production readiness for account lifecycle and user governance.

## Decision

Adopt a route-integrated users implementation with two distinct surfaces:

1. **User account surface**
   - Add `/account` under `_auth` route grouping.
   - Add `AccountOverview` composition in `src/features/users/ui/account`.
   - Wire profile, password, and session actions to users server functions.

2. **Admin account surface**
   - Add `/admin/account` for admin self-account operations.
   - Include this route in admin navigation and breadcrumb map.

3. **Admin users governance surface**
   - Replace scaffolded `/admin/users` with a real management console:
     - validated filters/search/paging,
     - tabbed directory/sessions/audit views,
     - detail drawer, suspend flow, and CRUD/security actions.
   - Replace scaffolded `/admin/users/$userId` with a full lifecycle page:
     role/status/session controls, security panel, audit timeline, danger zone.

4. **Shared UI/system alignment**
   - Rewrite account/admin user UI to consume shared components and helpers:
     `PageHeader`, `StatCard`, `DataTable`, `SearchInput`, `Avatar`,
     `getInitials`, and shared event-label formatters.

## Consequences

### Positive

1. Users feature is now end-to-end usable in routes, not just feature-local.
2. Account and admin user workflows follow one consistent component system.
3. Admin navigation mirrors new operational capabilities (`/admin/account`).
4. User/security mutations are exposed through production-ready UI flows.

### Trade-offs

1. Larger users route/components surface area increases maintenance load.
2. Route-generated type artifacts (`routeTree.gen.ts`) must stay in sync when
   adding route files.
