# ADR-0029: Example Component Motion and Functional Integration

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0012, ADR-0026, ADR-0027, ADR-0028

## Context

Example-derived UI components were integrated into production routes, but visual
fidelity and interaction depth regressed from their source implementations.

Observed gaps:

1. Footer and newsletter adaptations lost meaningful motion and interaction
   polish.
2. Some adapted interactions were present visually but not always wired to
   legitimate feature data flows.
3. Admin media thumbnails lacked gallery-style browsing behavior expected from
   the original gallery component patterns.
4. Repeated integration iterations increased risk of style-only changes without
   functional completion.

## Decision

Adopt a stricter integration contract for example-derived components: preserve
interaction quality while requiring production data wiring and correct module
placement.

1. **Motion fidelity is required when adapting examples**
   - Preserve meaningful hover, reveal, and overlay behavior from source
     examples where compatible with repo standards.
   - Require reduced-motion support for non-essential animations.

2. **Functional wiring over static demos**
   - Public subscription surfaces must use existing server-function workflows
     (`subscribeToEmailTopicFn`) rather than local/demo-only handlers.
   - Admin media gallery behavior must operate on persisted media assets from
     existing feature contracts.

3. **Placement and boundary enforcement**
   - Shared site-level UI remains in `src/components/*`.
   - Feature-bound interaction surfaces remain in `src/features/<feature>/ui/*`.
   - No new dependency introduction for example parity without explicit approval.

4. **Accessibility and interaction parity**
   - Keyboard and pointer support must be retained for modal/gallery interactions
     (`Escape`, previous/next controls, focus-safe controls, and screen-reader
     labels).

## Consequences

### Positive

1. Adapted components maintain the intended visual personality and perceived
   quality.
2. Public and admin surfaces align with legitimate persisted data flows.
3. Feature boundaries remain clear and consistent with architecture contracts.
4. User-facing interactions become more complete without introducing new
   libraries.

### Trade-offs

1. Higher implementation effort than static adaptation.
2. Additional validation is needed to ensure motion, accessibility, and
   data-wiring quality simultaneously.

## References

- Footer integration: `src/components/navigation/site-footer.tsx`
- Newsletter integration: `src/features/email/ui/public/newsletter-signup-panel.tsx`
- Media admin gallery integration: `src/features/media/ui/admin/media-grid-view.tsx`
- Public route usage: `src/routes/_public/route.tsx`
- Admin media route usage: `src/routes/admin/media/index.tsx`
- Prompt contract: `docs/agent/prompts/example-component-integration.md`
