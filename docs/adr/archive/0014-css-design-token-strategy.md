# ADR-0014: CSS Design Token Strategy

**Status:** Accepted
**Date:** 2026-02-17

## Context

The project uses Tailwind CSS v4 with shadcn/ui. As components were added (some copied from external sources), hardcoded Tailwind color scales (e.g., `bg-blue-500`, `text-rose-700`, `border-amber-200`) appeared in the codebase. These break dark mode because they don't respond to the `.dark` class toggle, and they create visual inconsistency by stepping outside the design system.

## Decision

### All colors must use CSS variable tokens

Components must exclusively use the design system tokens defined in `src/styles.css`:

**Semantic tokens (light + dark variants):**
- `background`, `foreground`
- `card`, `card-foreground`
- `popover`, `popover-foreground`
- `primary`, `primary-foreground`
- `secondary`, `secondary-foreground`
- `muted`, `muted-foreground`
- `accent`, `accent-foreground`
- `destructive`
- `border`, `input`, `ring`
- `sidebar-*` variants
- `chart-1` through `chart-5`

**Usage in Tailwind classes:**
```
bg-background    text-foreground      border-border
bg-card          text-card-foreground border-input
bg-primary       text-primary-foreground
bg-secondary     text-secondary-foreground
bg-muted         text-muted-foreground
bg-accent        text-accent-foreground
bg-destructive   text-destructive
```

### Status color mapping

For semantic states (success, error, warning), map to design system tokens:

| State | Background | Text | Border |
|-------|-----------|------|--------|
| Error/failure | `bg-destructive/10` | `text-destructive` | `border-destructive/30` |
| Success | `bg-accent/10` | `text-accent` | `border-accent/30` |
| Warning/neutral | `bg-muted` | `text-muted-foreground` | `border-ring/30` |
| Info/default | `bg-secondary` | `text-muted-foreground` | `border-border` |

### Opacity modifiers are acceptable

Using opacity modifiers on token colors is fine: `bg-primary/90`, `border-destructive/30`, `text-muted-foreground/80`. These still reference the design system and respond to dark mode.

### Prohibited patterns

- `bg-blue-500`, `text-rose-700`, etc. (raw Tailwind color scales)
- `bg-[#hex]`, `text-[#hex]` (arbitrary hex values)
- `bg-white`, `bg-black` (use `bg-background`/`bg-foreground` or `bg-card`)
- Custom color names not defined in styles.css (e.g., `brand-blue-*`)

### Color system

Colors use the OKLCH color space for perceptually uniform scales. Dark mode overrides are defined in the `.dark` selector. The Tailwind v4 custom variant `@custom-variant dark (&:is(.dark *))` applies dark mode styles when the `dark` class is present on an ancestor element.

## Consequences

- All components automatically support dark mode without per-component dark: prefixes for color.
- Design consistency is enforced at the token level — changing a token updates all uses.
- Copied components must be audited and converted before committing.
- The restricted set of semantic tokens encourages consistent visual language across features.
