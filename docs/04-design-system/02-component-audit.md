# Component Audit

Last updated: 2026-02-18
Status: Baseline Complete

## Goal

Inventory and grade UI components for reuse quality, boundary correctness,
token compliance, and accessibility readiness.

## Audit Method

- File inventory and layer counts from `rg --files`.
- Churn ranking from `git log --since=2025-12-01`.
- Token drift scan via regex for raw Tailwind palette classes and color literals.
- Boundary scan for shared component imports of `@/features/*`.
- Accessibility heuristics (dialog/sheet title coverage and icon-label patterns).

Detailed evidence snapshot: `docs/04-design-system/artifacts/component-audit-2026-02-18.md`

## Inventory Snapshot

| Layer | Path Pattern | Count | Notes |
| --- | --- | --- | --- |
| Primitive | `src/components/ui/*` | 55 | shadcn/Radix base layer |
| Shared Composition | `src/components/*` excluding `ui/*` | 59 | includes layout, nav, forms, marketing, tables |
| Feature UI | `src/features/*/ui/*` | 55 | feature-owned screens and composites |

## High-Priority Findings

| Component/Module | Path | Layer | Health | Findings | Planned Action |
| --- | --- | --- | --- | --- | --- |
| Site header | `src/components/navigation/site-header.tsx` | Shared composition | B+ | High churn surface, now decoupled from direct feature imports via adapter props | Monitor API stability while workspaces/navigation IA evolves |
| Admin nav map | `src/components/navigation/admin/navigation.ts` | Shared composition | B- | High churn monolith; workspace growth risk for Phase 5 | Split nav metadata by workspace and permission concerns |
| Site footer | `src/components/navigation/site-footer.tsx` | Shared composition | B | Newsletter behavior now injected by route adapter; component boundary restored | Keep feature behavior in route adapters and avoid regressions |
| Admin sidebar | `src/components/navigation/admin/admin-sidebar.tsx` | Shared composition | B+ | Uses shared serializable user shape instead of feature session type import | Reassess once Phase 5 workspace grouping lands |
| Chart primitive wrapper | `src/components/ui/chart.tsx` | Primitive | B | Token-safe selector strategy now removes hardcoded color matching | Keep chart style overrides scoped and semantic |
| Auth signup form | `src/features/auth/ui/signup-form.tsx` | Feature UI | B | High churn; duplicated password visibility patterns | Consolidate password field behavior helpers locally |
| Auth login form | `src/features/auth/ui/login-form.tsx` | Feature UI | B | High churn; repeated loading/field boilerplate | Align with shared auth form composition pattern |
| Theme toggle | `src/components/theme/theme-toggle.tsx` | Shared composition | B | High reuse in critical nav contexts | Keep as stable primitive-composition boundary |
| Marketing card slider | `src/components/marketing/card-slider.tsx` | Shared composition | B | Motion-heavy and responsive behavior complexity | Add reduced-motion behavior checks in Phase 4 |
| Example components set | `src/components/_examples/*` | Non-production support | C | Duplicate patterns can drift from live components | Keep isolated as examples only, avoid production imports |

## Boundary Drift Hotspots

Resolved on 2026-02-18 for shared navigation surfaces:

- `src/components/navigation/site-header.tsx`
- `src/components/navigation/site-footer.tsx`
- `src/components/navigation/admin/admin-sidebar.tsx`

Auth/email dependencies now flow through route-level adapter props in:

- `src/routes/_public/route.tsx`
- `src/routes/_legal/route.tsx`
- `src/routes/admin/route.tsx`

## Priority Buckets

- High churn first: navigation and auth UI surfaces.
- High blast radius second: shared nav shell and chart primitive.
- Low churn backlog: examples and long-tail feature UI cleanup.

## Exit Signal for Audit Phase

- [x] Inventory completed with reproducible evidence.
- [x] High-priority targets identified.
- [x] First boundary-removal refactor completed (navigation coupling).
- [x] Token exception cleanup landed (chart/email contracts).
