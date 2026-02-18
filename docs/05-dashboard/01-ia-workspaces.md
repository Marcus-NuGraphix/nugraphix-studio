# Dashboard Workspaces IA

Last updated: 2026-02-18
Status: Draft

## Goal

Define scalable workspace separation inside `/admin` for discoverability and access control.

## Proposed Workspaces

- `dev` - internal docs, diagnostics, and admin-only tools.
- `content` - blog/media/content management workflows.
- `operations` - users, email, observability, and governance.

## IA Rules

- Each workspace has a clear landing route.
- Workspace switcher is visible in global admin shell.
- Cross-workspace deep links preserve context breadcrumbs.
- Hidden items are also server-enforced, not just UI-hidden.

## Questions to Resolve

- [ ] Final workspace names.
- [ ] Default workspace by role.
- [ ] Whether URL includes explicit workspace segment or derived route grouping.