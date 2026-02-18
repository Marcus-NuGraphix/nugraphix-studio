# ADR-0020: Shared Component Composition Layer

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0001, ADR-0012, ADR-0014, Phase 02 UI Architecture

## Context

The project already has a large primitive UI library in `src/components/ui`,
but route and feature code was still composing repetitive layout and form
patterns directly. This creates drift risk, slower delivery, and inconsistent
UX rhythm across marketing/admin surfaces.

Nu Graphix Studio requires a shared component layer that:

1. Reuses existing tokenized primitives,
2. Keeps business/domain logic out of shared view components, and
3. Matches feature-first architecture boundaries.

## Decision

We adopt a three-layer component strategy:

1. **Primitive layer**: `src/components/ui/*` remains the base set.
2. **Composition layer**: new shared sets in `src/components/*` for reusable
   page-level composition patterns.
3. **Feature layer**: route/feature-specific UI remains in
   `src/features/<feature>/ui/*`.

### Initial Composition Sets (Required)

- `src/components/layout/*`
  - `AppShell`, `TopBar`, `PageHeader`
- `src/components/metrics/*`
  - `StatCard`
- `src/components/forms/*`
  - `SearchInput`, `TagPicker`
- `src/components/editor/*`
  - `EditorShell`

### Shared Infrastructure Usage Rules

- Shared components must leverage existing helpers from `src/lib` (for example:
  `cn`, `generateSlug`) instead of duplicating utility logic.
- Responsive behavior must use shared hooks from `src/hooks` (currently:
  `useIsMobile`) where applicable.
- Color/states must follow ADR-0014 token strategy.

## Consequences

### Positive

- Faster route/feature implementation through reusable, standardized shells.
- Better consistency between admin and marketing interfaces.
- Reduced primitive misuse by routing most usage through composition-layer APIs.
- Cleaner separation between display composition and domain behavior.

### Trade-offs

- Additional maintenance surface in `src/components/*`.
- Composition API quality must be reviewed to avoid reintroducing one-off variants.

## Follow-ups

- Integrate these sets into `/admin/*` and feature screens in staged order.
- Run a dedicated lint remediation pass for legacy `src/components/ui/*` issues.
