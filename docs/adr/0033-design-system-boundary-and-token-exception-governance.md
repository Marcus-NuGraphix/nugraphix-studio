# ADR-0033: Design System Boundary and Token Exception Governance

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0014, ADR-0020, ADR-0030

## Context

Phase 4 baseline audit identified two recurring governance risks:

1. Shared composition components importing feature modules directly
   (notably shared navigation surfaces).
2. Token-governance exceptions that are not yet centralized
   (`chart` selector literals and email template inline colors).

Without explicit controls, these patterns can spread and increase refactor
blast radius, weaken reuse guarantees, and create inconsistent styling rules.

## Decision

Adopt explicit design-system governance controls for component boundaries and
token exceptions.

1. Component boundary matrix is now canonical for Phase 4 execution:
   - `src/components/ui/*` remains feature-agnostic.
   - `src/components/*` remains shared composition and should not own feature
     business logic.
   - Feature-specific behavior remains in `src/features/*/ui/*`.
2. Shared component imports of `@/features/*` must be treated as tracked debt
   with phased adapter/view-model extraction plans.
3. Literal color usage outside token system is treated as controlled exception
   only when tied to third-party rendering/runtime constraints.
4. Every exception must be documented in
   `docs/04-design-system/04-tokens-and-theming.md` with a planned removal
   task.
5. Phase changes must remain small and verifiable, with docs updated in the
   same patch set.

## Consequences

### Positive

1. Phase 4 refactors can target highest-risk coupling first without broad
   rewrites.
2. Token policy remains clear while allowing pragmatic short-term exceptions.
3. Design-system docs become enforceable implementation guidance, not templates.

### Trade-offs

1. Some shared components may need adapter layers before direct cleanup.
2. Exception tracking adds governance overhead that must be maintained.

## References

- `docs/04-design-system/01-design-system-principles.md`
- `docs/04-design-system/02-component-audit.md`
- `docs/04-design-system/03-component-structure-conventions.md`
- `docs/04-design-system/04-tokens-and-theming.md`
- `docs/08-implementation/02-task-board.md`
