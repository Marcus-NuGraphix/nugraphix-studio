# Dashboard Routing Plan

Last updated: 2026-02-19
Status: Active

## Goal

Implement workspace-aware routing using TanStack Router without breaking existing admin contracts.

## Chosen URL Strategy

- Canonical workspace URLs:
  - `/admin/workspaces/operations/*`
  - `/admin/workspaces/content/*`
  - `/admin/workspaces/platform/*`
- Backward compatibility:
  - Legacy `/admin/*` URLs redirect to canonical workspace URLs during migration.
- Guard ownership:
  - keep authentication/role guard at `/admin` boundary (`beforeLoad`).

## Canonical Route Map

| Workspace | Canonical Path | Legacy Path (Redirect Source) |
| --- | --- | --- |
| operations | `/admin/workspaces/operations` | `/admin` |
| operations/dashboard | `/admin/workspaces/operations/dashboard` | `/admin/dashboard` |
| operations/users | `/admin/workspaces/operations/users` | `/admin/users` |
| operations/user detail | `/admin/workspaces/operations/users/:userId` | `/admin/users/:userId` |
| operations/contacts | `/admin/workspaces/operations/contacts` | `/admin/contacts` |
| operations/email | `/admin/workspaces/operations/email` | `/admin/email` |
| operations/account | `/admin/workspaces/operations/account` | `/admin/account` |
| operations/settings | `/admin/workspaces/operations/settings` | `/admin/settings` |
| content | `/admin/workspaces/content` | `/admin/content` |
| content/posts | `/admin/workspaces/content/posts` | `/admin/content/posts` |
| content/post new | `/admin/workspaces/content/posts/new` | `/admin/content/posts/new` |
| content/post detail | `/admin/workspaces/content/posts/:id` | `/admin/content/posts/:id` |
| content/media | `/admin/workspaces/content/media` | `/admin/media` |
| content/media detail | `/admin/workspaces/content/media/:assetId` | `/admin/media/:assetId` |
| content/kb | `/admin/workspaces/content/kb` | `/admin/kb` |
| content/kb detail | `/admin/workspaces/content/kb/:slug` | `/admin/kb/:slug` |
| platform | `/admin/workspaces/platform` | `/admin/docs` |
| platform/docs | `/admin/workspaces/platform/docs` | `/admin/docs` |
| platform/architecture | `/admin/workspaces/platform/docs/architecture` | `/admin/docs/architecture` |
| platform/adr | `/admin/workspaces/platform/docs/adr` | `/admin/docs/adr` |
| platform/phases | `/admin/workspaces/platform/docs/phases` | `/admin/docs/phases` |
| platform/components | `/admin/workspaces/platform/components` | `/admin/components` |
| platform/components ui | `/admin/workspaces/platform/components/ui` | `/admin/components/ui` |
| platform/components nav | `/admin/workspaces/platform/components/navigation` | `/admin/components/navigation` |
| platform/components marketing | `/admin/workspaces/platform/components/marketing` | `/admin/components/marketing` |

## Redirect Policy

- Use TanStack `throw redirect(...)` in route loaders for internal route migration.
- Redirects should preserve dynamic params and supported search params.
- For entry routes:
  - `/admin` -> `/admin/workspaces/operations`
  - `/admin/workspaces/platform` -> `/admin/workspaces/platform/docs`
- Keep legacy redirects in place until workspace URLs are fully adopted.

## TanStack Implementation Rules

- Use workspace route groups under `src/routes/admin/workspaces/*`.
- Keep shared admin shell in `src/routes/admin/route.tsx`.
- Keep server authorization checks in server functions even after route migration.
- Avoid broad route moves; migrate one workspace at a time.

## Migration Steps

- [x] Add workspace route skeletons and landing routes.
- [x] Implement legacy-to-canonical redirects for operations workspace first.
- [x] Move content workspace routes and preserve deep-link params.
- [x] Move platform workspace routes.
- [x] Switch admin navigation links to canonical workspace paths.
- [x] Verify permissions, breadcrumbs, and mobile navigation behavior.

## Implementation Status

- Phase 5A completed (2026-02-18):
  - Added `src/routes/admin/workspaces/*` landing routes.
  - Redirected `/admin` to `/admin/workspaces/operations`.
  - Added admin header workspace switcher in `src/routes/admin/route.tsx`.
- Phase 5B operations batch completed (2026-02-18):
  - Operations deep routes now canonical under
    `src/routes/admin/workspaces/operations/*`.
  - Legacy operations routes redirect to canonical with param/search
    preservation.
- Phase 5B content/platform batch completed (2026-02-18):
  - content and platform deep routes now have canonical ownership under
    `/admin/workspaces/content/*` and `/admin/workspaces/platform/*`
  - legacy `/admin/content|/media|/kb|/docs|/components*` routes now redirect
    to canonical workspace paths (including param/search preservation where needed)
  - admin sidebar, quick links, breadcrumbs, and section cards now target
    canonical workspace URLs
- Phase 5C manual parity smoke completed (2026-02-19):
  - desktop/mobile nav parity and role visibility checks passed
  - source-of-truth evidence:
    `docs/05-dashboard/artifacts/2026-02-19-workspace-parity-smoke.md`
  - regression contracts added:
    `src/components/navigation/admin/navigation.contracts.test.ts`

## Verification Checklist

- [x] Deep links from legacy URLs resolve to correct workspace canonical URLs.
- [x] Unauthorized access remains blocked at `/admin` guard and server function level.
- [x] Breadcrumbs and active nav state reflect workspace context.
- [x] No broken links across admin cards, quick links, and section navigation.
