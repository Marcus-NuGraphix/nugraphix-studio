# Dashboard Navigation and Shell

Last updated: 2026-02-18
Status: Draft

## Goal

Deliver a clean, role-driven admin shell with workspace switching and predictable navigation.

## Required UI Patterns

- Workspace switcher in top-level admin shell.
- Role-driven menu groups.
- Workspace-local side navigation.
- Consistent breadcrumbs and page headers.
- Clear empty states for restricted/no-data pages.

## Implementation Targets

- `src/routes/admin/route.tsx`
- `src/components/layout/*`
- `src/components/navigation/*`

## Verification

- [ ] Navigation correctness by role.
- [ ] Mobile navigation parity.
- [ ] Keyboard accessibility for workspace switcher and menus.