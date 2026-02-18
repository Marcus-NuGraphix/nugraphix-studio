# Component Structure and Conventions

Last updated: 2026-02-18
Status: Active

## Goal

Standardize boundaries and naming so components scale without hidden coupling.

## Canonical Layers

- `src/components/ui/*`: low-level reusable primitives.
- `src/components/*`: cross-feature composition components.
- `src/features/<feature>/ui/*`: feature-owned UI with business semantics.

## Dependency Matrix

| From | Allowed Imports | Disallowed Imports |
| --- | --- | --- |
| `src/components/ui/*` | `react`, Radix/shadcn deps, `@/lib/utils` | `@/features/*`, server modules, DB/env modules |
| `src/components/*` | `src/components/ui/*`, `@/lib/utils`, `@/components/*` | direct data/auth business logic from `@/features/*` unless explicitly tracked |
| `src/features/*/ui/*` | feature-local modules, shared components, safe shared libs | direct DB access and server-only modules |
| `src/lib/*` | cross-cutting libs and infra | feature ownership logic (except explicit plugin adapters) |

## Naming and File Rules

- Use kebab-case filenames.
- Use explicit suffixes where meaningful (`-card`, `-table`, `-form`, `-panel`, `-dialog`).
- Reserve `index.ts` for barrels and simple module surfaces.
- Avoid `index.tsx` for complex UI except explicit route-entry composition.

## Component API Rules

- Prefer controlled props for reusable stateful composites.
- Use `variant` and `size` patterns consistently.
- Expose intent-driven callbacks (`onSubmit`, `onSelect`, `onDismiss`) instead of
  feature-specific handlers.
- Keep permissions and role checks outside generic components.

## Current Conventions Gaps

- Shared navigation feature-coupling gap is resolved (2026-02-18) via
  route-level adapters:
  - `src/routes/_public/route.tsx`
  - `src/routes/_legal/route.tsx`
  - `src/routes/admin/route.tsx`
- Legacy import style drift exists in primitives (`@/lib/utils/index` instead of
  `@/lib/utils`).

## Refactor Strategy (Phase 4)

- Step 1: Introduce adapter props/view-model contracts for shared navigation.
- Step 2: Migrate shared component call-sites to adapter contracts.
- Step 3: Standardize import paths and naming in touched scope only.
- Step 4: Add regression checks for boundary rules in docs/task board.
