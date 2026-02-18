# Design System Principles

Last updated: 2026-02-18
Status: Active

## Goal

Establish a modular, scalable design system that is strict enough to prevent
drift and pragmatic enough to evolve without broad refactors.

## Baseline Snapshot (2026-02-18)

- Shared primitives: `55` files under `src/components/ui/*`.
- Shared composition: `59` files under `src/components/*` excluding `ui/*`.
- Feature-local UI: `55` files under `src/features/*/ui/*`.
- Highest churn components since 2025-12-01:
  - `src/components/navigation/site-header.tsx` (`7`)
  - `src/components/navigation/admin/navigation.ts` (`5`)
  - `src/features/auth/ui/signup-form.tsx` (`4`)
  - `src/features/auth/ui/login-form.tsx` (`4`)
  - `src/components/theme/theme-toggle.tsx` (`4`)

## Core Principles

1. Token-first styling
- Use semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`).
- Do not introduce raw Tailwind palette classes in shared surfaces.

2. Layered ownership
- `src/components/ui/*` is primitive-only and feature-agnostic.
- `src/components/*` composes primitives for cross-feature reuse.
- `src/features/*/ui/*` owns feature-specific behaviors and policies.

3. Accessibility by default
- Preserve Radix/shadcn accessibility contracts.
- Every icon-only control must expose a screen-reader name.
- Dialogs and sheets must include title semantics.

4. Stable component APIs
- Prefer `variant` and `size` props for visual state.
- Keep business logic out of generic shared components.
- Keep auth/permission decisions in route/server layers.

5. Small, verifiable migration steps
- Prioritize high-churn and high-blast-radius surfaces first.
- Land changes with verification evidence (`lint`, `typecheck`, targeted tests).

## Enforced Boundaries

- `src/components/ui/*` may depend on React, Radix/shadcn primitives, and
  shared utilities (`@/lib/utils`), but not `@/features/*`.
- `src/components/*` may compose `ui/*` and use non-business shared helpers;
  feature coupling requires explicit audit tracking and planned extraction.
- `src/features/*/ui/*` may import shared components and feature-local modules.
- `src/lib/*` remains cross-cutting infra and must not grow feature ownership.

## Internal and External References

- Internal: `ARCHITECTURE.md`, ADR-0014, ADR-0020.
- External: shadcn/ui docs, Tailwind CSS docs, WAI-ARIA APG.

## Phase 4 Success Criteria

- [x] Baseline inventory and risk hotspots documented.
- [x] High-churn shared component coupling reduced (navigation surfaces first).
- [x] Token/exception contract documented and enforced.
- [x] Accessibility regression checks added to prevent silent regressions.
