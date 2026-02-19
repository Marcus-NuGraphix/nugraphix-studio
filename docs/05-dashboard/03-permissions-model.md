# Dashboard Permissions Model

Last updated: 2026-02-18
Status: Active

## Goal

Enforce workspace and page access with explicit permission contracts.

## Current Enforcement Baseline

- Admin route boundary (`/admin`) already enforces:
  - authenticated session required
  - `session.user.role === 'admin'`
- Server function authorization uses feature-level checks and shared helpers
  (`assertPermission`, `requireAdmin`, `requireSession`) where relevant.
- UI navigation visibility is convenience only, never the sole control.

## Workspace Permission Domains (Planned)

| Permission | Workspace | Canonical Route Scope | Current Roles | Enforcement Point |
| --- | --- | --- | --- | --- |
| `workspace.operations.read` | operations | `/admin/workspaces/operations/*` | admin | admin route guard + server functions |
| `workspace.operations.manage` | operations | operations mutations | admin | server functions |
| `workspace.content.read` | content | `/admin/workspaces/content/*` | admin | admin route guard + server functions |
| `workspace.content.manage` | content | content mutations | admin | server functions |
| `workspace.platform.read` | platform | `/admin/workspaces/platform/*` | admin | admin route guard + server functions |
| `workspace.platform.manage` | platform | docs/components admin tools | admin | server functions |

## Role Matrix (Current + Future-safe)

| Role | Operations | Content | Platform |
| --- | --- | --- | --- |
| `admin` | read/manage | read/manage | read/manage |
| `user` | none (no `/admin` access) | none | none |

Future roles (e.g. editor/operator) are deferred until auth model expansion.

## Validation

- [x] Direct URL access denied for unauthorized roles at `/admin` boundary.
- [x] Server functions reject unauthorized calls when UI is bypassed.
- [ ] Add explicit authorization-denial observability checks in Phase 6.

## Implementation Status

- Phase 5A preserved existing admin-only guard semantics while introducing
  workspace landing routes and shell switcher UX.
- Phase 5B completed canonical route ownership for operations/content/platform
  while retaining legacy redirect compatibility; guard and server-side
  authorization contracts remain unchanged.

## Implementation Guardrails

- Do not weaken current admin-only guard while introducing workspaces.
- Add workspace-level checks as additive controls, not replacements.
- Keep permission checks in server functions even when route-level guards exist.
