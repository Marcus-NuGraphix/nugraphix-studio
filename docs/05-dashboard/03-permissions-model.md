# Dashboard Permissions Model

Last updated: 2026-02-18
Status: Draft

## Goal

Enforce workspace and page access with explicit permission contracts.

## Model

- Roles remain mapped to permissions in auth model.
- Workspace access checks happen server-side.
- UI navigation only renders routes user can access.

## Permission Matrix Template

| Permission | Workspace | Routes | Roles | Enforcement Point |
| --- | --- | --- | --- | --- |
| `workspace.dev.read` | dev | `/admin/workspaces/dev/*` | admin | route guard + server fn |
| `workspace.content.manage` | content | `/admin/workspaces/content/*` | admin, editor | server fn |

## Validation

- [ ] Direct URL access denied for unauthorized users.
- [ ] Server functions reject unauthorized calls even if UI is bypassed.
- [ ] Audit logs capture authorization denials where appropriate.