# Workspace Parity Smoke (T-021)

- Date: 2026-02-19
- Scope: Admin workspace parity for desktop/mobile navigation and role visibility
- Phase: 5
- Task: T-021

## Goal

Confirm workspace routing migration parity after canonical `/admin/workspaces/*`
cutover.

## Verification Method

1. Contract-test canonical nav targets and workspace inference logic.
2. Validate breadcrumb parent parity between legacy and canonical deep links.
3. Validate admin role boundary behavior for `/admin` route protection.
4. Review admin shell breakpoints for desktop/mobile navigation behavior:
   - workspace switcher visible at `lg+`
   - quick links visible at `xl+`
   - sidebar trigger available for smaller breakpoints

## Commands

```bash
pnpm vitest run src/components/navigation/admin/navigation.contracts.test.ts src/features/auth/tests/session.server.test.ts src/features/auth/tests/entry-redirect.test.ts
```

## Results

- PASS: All active admin nav surfaces resolve to canonical workspace URLs.
- PASS: Legacy path workspace inference and breadcrumb ancestry align with
  canonical routes.
- PASS: Non-admin sessions remain blocked by `/admin` route guard.
- PASS: Desktop/mobile nav behavior is consistent with shell breakpoint design.

## Evidence

- `src/components/navigation/admin/navigation.contracts.test.ts`
- `src/components/navigation/admin/navigation.ts`
- `src/routes/admin/route.tsx`
- `src/features/auth/tests/session.server.test.ts`
- `src/features/auth/tests/entry-redirect.test.ts`
