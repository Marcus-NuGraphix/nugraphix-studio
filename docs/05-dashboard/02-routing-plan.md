# Dashboard Routing Plan

Last updated: 2026-02-18
Status: Draft

## Goal

Implement workspace-aware routing using TanStack Router without breaking existing admin contracts.

## URL Strategy (Draft)

- `/admin/workspaces/dev/*`
- `/admin/workspaces/content/*`
- `/admin/workspaces/operations/*`

Alternative (if minimal migration preferred): keep existing URLs and introduce pathless workspace layouts.

## TanStack Routing Rules

- Use file-based route groups and pathless layouts for shared workspace shell behavior.
- Keep `beforeLoad` guard at admin boundary.
- Keep workspace-specific authorization checks in loaders/server functions.

## Migration Steps

1. Create workspace route layouts.
2. Move existing routes in small batches.
3. Add redirects from legacy admin paths.
4. Validate role-based access and breadcrumbs.