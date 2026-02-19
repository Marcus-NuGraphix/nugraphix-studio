# Dashboard Workspaces IA

Last updated: 2026-02-18
Status: Active

## Goal

Define scalable workspace separation inside `/admin` for discoverability and access control.

## Canonical Workspaces

- `operations` - platform operations, user governance, support channels, account/settings.
- `content` - editorial and asset workflows (posts, media, knowledge base).
- `platform` - internal docs, architecture/ADR references, component governance.

## IA Rules

- Each workspace has a dedicated landing route and predictable child routes.
- Workspace switcher is visible in global admin shell header.
- Breadcrumbs include workspace context first, then local page context.
- Hidden menu entries are always backed by server-side guard checks.

## Route Inventory Baseline (Current)

- Shared admin boundary: `/admin/*`
- Operations-like paths:
  - `/admin/dashboard`
  - `/admin/users`, `/admin/users/:userId`
  - `/admin/contacts`
  - `/admin/email`
  - `/admin/account`
  - `/admin/settings`
- Content-like paths:
  - `/admin/content`
  - `/admin/content/posts`, `/admin/content/posts/new`, `/admin/content/posts/:id`
  - `/admin/media`, `/admin/media/:assetId`
  - `/admin/kb`, `/admin/kb/:slug`
- Platform-like paths:
  - `/admin/docs`, `/admin/docs/architecture`, `/admin/docs/adr`, `/admin/docs/phases`
  - `/admin/components`, `/admin/components/ui`, `/admin/components/navigation`, `/admin/components/marketing`

## Workspace Landing Rules

- `operations` landing: dashboard view.
- `content` landing: content hub.
- `platform` landing: docs hub.

## Role Defaults (Current Contract)

- `admin`: default workspace is `operations`.
- `user`: no admin workspace access (existing `/admin` guard behavior remains).

## Deferred Decisions

- Additional non-admin workspace roles (e.g. editor/ops) are deferred until auth role model expansion.
- Final visual workspace switcher interaction can iterate after route migration lands.

## Implementation Status

- Phase 5A completed (2026-02-18): canonical workspace landing routes and
  header switcher are now live under `/admin/workspaces/*`.
- Phase 5B completed (2026-02-18): operations, content, and platform deep
  routes now use canonical workspace ownership with legacy redirect shims for
  backward compatibility.
