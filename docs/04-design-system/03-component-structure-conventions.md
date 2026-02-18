# Component Structure and Conventions

Last updated: 2026-02-18
Status: Draft

## Goal

Standardize folder boundaries and naming to scale the design system.

## Boundaries

- `src/components/ui/*`: low-level reusable UI primitives.
- `src/components/*`: cross-feature composition components.
- `src/features/<feature>/ui/*`: feature-specific UI that must stay local.

## Naming Rules

- kebab-case filenames.
- clear suffixes (`-card`, `-table`, `-form`, `-panel`) when helpful.
- avoid ambiguous `index.tsx` for complex multi-component modules unless route/layout driven.

## Component API Rules

- [ ] Prefer controlled props for stateful composites.
- [ ] Use `variant`/`size` patterns consistently.
- [ ] Avoid business logic in shared components.
- [ ] Keep feature permissions logic out of generic components.