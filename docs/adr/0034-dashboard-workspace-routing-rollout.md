# ADR-0034: Dashboard Workspace Routing Rollout

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0009, ADR-0012, ADR-0030

## Context

Phase 5 requires a scalable admin IA with workspace boundaries:

- `operations`
- `content`
- `platform`

The existing admin surface is flat under `/admin/*`, and immediate full-path
migration would create high deep-link regression risk. We need a reversible,
incremental rollout that introduces workspace structure without breaking
existing admin navigation and route contracts.

## Decision

Adopt a staged workspace routing rollout.

1. Introduce canonical workspace landing routes:
   - `/admin/workspaces/operations`
   - `/admin/workspaces/content`
   - `/admin/workspaces/platform`
2. Redirect `/admin` to `/admin/workspaces/operations` as the default admin
   entry point.
3. Add a workspace switcher in the admin shell header to establish discoverable
   workspace navigation.
4. Preserve existing legacy deep routes (`/admin/dashboard`, `/admin/users`,
   etc.) during Phase 5A to minimize breakage.
5. Complete legacy-to-canonical deep-route redirect rollout in a follow-up
   phase (`T-019`) with parameter preservation and nav/breadcrumb parity checks.

## Consequences

### Positive

1. Workspace IA is now visible and usable in production UI.
2. Migration risk is reduced by avoiding a big-bang path move.
3. Existing server-side admin guard and permission behavior remain unchanged.

### Trade-offs

1. Temporary dual-path admin model increases routing complexity until T-019 is
   complete.
2. Breadcrumb and active-nav parity must be carefully validated during
   subsequent redirect batches.

## References

- `docs/05-dashboard/01-ia-workspaces.md`
- `docs/05-dashboard/02-routing-plan.md`
- `docs/05-dashboard/04-navigation-and-shell.md`
- `docs/08-implementation/02-task-board.md`
