# ADR-0027: Example Component Integration Color and Contrast Governance

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0011, ADR-0014, ADR-0023

## Context

Example-driven component integrations (`src/components/_examples`) introduced
visual drift and repeated revision cycles, especially around light/dark token
contrast and action color usage.

The integration flow had strong architectural and motion guidance, but lacked
enforceable rules for:

1. Consistent foreground/background token pairing with `src/styles.css`.
2. Correct `primary` and `accent` usage between solid actions and tonal tints.
3. Explicit contrast verification across light and dark themes before handoff.

Without a contract-level rule, component adaptations can pass lint/type checks
while still shipping low-contrast UI.

## Decision

Adopt mandatory color-and-contrast governance in the example component
integration prompt.

1. **Token pairing enforcement**
   - Require semantic surface/content pairs (`background/foreground`,
     `card/card-foreground`, `popover/popover-foreground`,
     `muted/muted-foreground`) in adapted components.

2. **Action color contract**
   - Restrict `text-primary-foreground` and `text-accent-foreground` to solid
     action surfaces (`bg-primary`, `bg-accent`, or equivalent high-opacity).
   - Treat tinted surfaces (`bg-primary/10`, `bg-accent/10`, `bg-muted/*`) as
     content surfaces that default to `text-foreground` or
     `text-muted-foreground`.

3. **Mandatory light/dark QA**
   - Add a pre-handoff checklist covering default, hover, focus-visible, and
     disabled states in both themes.
   - Require WCAG AA thresholds in prompt guidance:
     - 4.5:1 for normal text
     - 3:1 for large text and UI boundaries/icons

4. **Delivery reporting requirement**
   - Require a "Color/contrast summary" in implementation responses to document
     what was validated.

## Consequences

### Positive

1. Example integrations become consistent with design tokens defined in
   `src/styles.css`.
2. Light/dark contrast regressions are reduced before code review.
3. Prompt-level enforcement improves first-pass quality and reduces iteration
   loops.

### Trade-offs

1. Integration tasks add a small validation overhead per component set.
2. Stronger rules limit visually aggressive color experiments that cannot meet
   contrast requirements.

## References

- Prompt contract:
  `docs/agent/prompts/example-component-integration.md`
- Theme tokens:
  `src/styles.css`
