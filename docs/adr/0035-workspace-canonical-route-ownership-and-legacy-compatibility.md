# ADR-0035: Workspace Canonical Route Ownership and Legacy Compatibility

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0034

## Context

ADR-0034 introduced staged workspace routing to reduce migration risk. After
Phase 5B, operations/content/platform pages now have canonical routes under
`/admin/workspaces/*`.

The remaining architecture question is ownership and compatibility policy:

1. Which routes are canonical sources of truth for implementation?
2. How should legacy `/admin/*` deep links behave during transition?
3. Which paths should navigation and shared config target by default?

## Decision

1. Canonical route ownership is fixed to:
   - `/admin/workspaces/operations/*`
   - `/admin/workspaces/content/*`
   - `/admin/workspaces/platform/*`
2. Legacy `/admin/*` deep routes are retained only as compatibility shims that
   immediately `redirect(...)` to canonical workspace routes.
3. Navigation, breadcrumbs, section cards, and shared route constants must
   target canonical workspace paths by default.
4. Legacy redirect shims remain until a dedicated deprecation task removes them
   with explicit release communication.

## Consequences

### Positive

1. Admin IA is stable and predictable with one canonical ownership model.
2. Existing bookmarks/incoming deep links continue to work without breakage.
3. Future refactors can focus on workspace trees without duplicating logic.

### Trade-offs

1. Temporary dual-path support increases route surface area.
2. Redirect shims require parity checks until deprecation is complete.

## References

- `docs/05-dashboard/01-ia-workspaces.md`
- `docs/05-dashboard/02-routing-plan.md`
- `docs/05-dashboard/04-navigation-and-shell.md`
- `docs/08-implementation/02-task-board.md`
