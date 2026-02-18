# Dashboard Navigation and Shell

Last updated: 2026-02-18
Status: Active

## Goal

Deliver a clean, role-driven admin shell with workspace switching and predictable navigation.

## Shell Direction

- Keep existing admin shell layout (`SidebarProvider` + header + breadcrumbs).
- Add workspace switcher in header before quick links.
- Keep sidebar grouped by workspace domain.
- Keep workspace context in breadcrumbs and page headers.

## Workspace Switcher UX Contract

- Control location: admin header, left of quick links.
- Options:
  - `Operations`
  - `Content`
  - `Platform`
- Selecting workspace navigates to workspace landing path.
- Switcher options are role-filtered (currently all options for admin only).
- Must be keyboard accessible and screen-reader labeled.

## Navigation Group Mapping

| Workspace | Primary Nav Group | Representative Routes |
| --- | --- | --- |
| operations | Workspace + Operations | dashboard, users, contacts, email, account, settings |
| content | Content | content hub, posts, media, kb |
| platform | Documentation + Components | docs and component governance routes |

## Redirect and Visibility Rules

- Legacy route links remain valid during migration; redirect coverage is being
  added incrementally.
- Quick links should move to canonical workspace URLs after route cutover.
- Hidden workspace items must still be denied server-side.

## Implementation Targets (Phase 5)

- `src/routes/admin/route.tsx`
- `src/components/layout/*`
- `src/components/navigation/*`

## Implementation Status

- Phase 5A completed (2026-02-18):
  - workspace switcher added in admin header (`Operations`, `Content`,
    `Platform`)
  - `/admin` now routes to operations workspace entry
  - sidebar/workflow links remain legacy-path for controlled staged cutover
- Phase 5B operations batch completed (2026-02-18):
  - operations sidebar and quick-link targets now point to canonical
    `/admin/workspaces/operations/*` routes
  - operations legacy URLs remain backward compatible via redirect shims
- Phase 5B content/platform batch completed (2026-02-18):
  - content/docs/components sidebar and quick-link targets now point to
    canonical `/admin/workspaces/content/*` and `/admin/workspaces/platform/*`
    routes
  - legacy content/platform URLs remain backward compatible via redirect shims
  - breadcrumb and section-card targets now resolve to canonical workspace paths

## Verification

- [ ] Navigation correctness by role/workspace.
- [ ] Mobile parity for workspace switching and grouped navigation.
- [ ] Keyboard accessibility for workspace switcher and sidebar traversal.
- [x] Breadcrumb parity between legacy and canonical workspace URLs.
