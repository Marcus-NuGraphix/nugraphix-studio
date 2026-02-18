EXAMPLE COMPONENT INTEGRATION MODE

Use this prompt whenever the user asks to adapt components from:
- `src/components/_examples`

OBJECTIVE

- Adapt example components to Nu Graphix standards, not copy/paste them.
- Decide correct placement first, then implement.
- Keep components reusable, accessible, and aligned with repo architecture.
- Preserve the original component's spark, interaction quality, and visual personality.

MANDATORY CONTEXT TO CHECK FIRST

1. `AI.md`
2. `ARCHITECTURE.md`
3. `docs/adr/README.md`
4. `docs/agent/README.md`
5. `docs/agent/skills/00-index.md`
6. Relevant feature README/ADR docs for the target area

SKILL USAGE ORDER (WHEN APPLICABLE)

1. `docs/agent/skills/*` (repo workflow and quality gates)
2. `.agents/skills/shadcn` (composition/accessibility patterns)
3. `.agents/skills/tailwind-v4-shadcn` (token-safe styling patterns)
4. `ui-ux-pro-max` (layout and UX refinement)
5. Domain skills as needed:
   - `tanstack-router-best-practices`
   - `tanstack-query-best-practices`
   - `tanstack-start-best-practices`
   - `security-owasp`
   - `copywriting`

PLACEMENT DECISION RULES (DO THIS BEFORE CODING)

1. `src/components/ui` (atoms):
   - Only add components that come directly from official shadcn patterns.
   - Do not place adapted example-library components here.

2. `src/components` (reusable molecules):
   - Use when component is cross-feature and domain-agnostic.
   - Must accept props/variants instead of hardcoded feature data.
   - Split into reusable parts when useful (view, state hook, helpers).

3. `src/features/<feature>/ui` (feature organisms):
   - Use when component depends on feature rules, feature data, or feature routes.
   - Keep business logic in feature model/server layers, not UI files.

4. `src/lib` / `src/hooks`:
   - Move cross-cutting utility logic to `src/lib`.
   - Move reusable client behavior to `src/hooks`.

MODULARIZATION CHECKLIST

- Decide if the component should be:
  - single feature-bound organism, or
  - split into reusable molecules + feature wrapper.
- Separate concerns:
  - presentation
  - state/interaction logic
  - data integration
- Prefer composition with existing project components over bespoke wrappers.

STYLING RULES (MUST FOLLOW `src/styles.css`)

- Use semantic theme tokens/classes from the design system:
  - `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, etc.
- Do not introduce ad-hoc color values when token classes can be used.
- Respect dark mode through existing token system.
- Keep Tailwind classes consistent with existing shadcn + Tailwind v4 patterns.
- Avoid unnecessary inline styles (allow only when dynamic numeric values are required).
- Prefer explicit surface/content token pairs:
  - `bg-background + text-foreground`
  - `bg-card + text-card-foreground`
  - `bg-popover + text-popover-foreground`
  - `bg-muted + text-muted-foreground`
- Use action colors correctly:
  - Solid CTA/action surfaces: `bg-primary text-primary-foreground` or `bg-accent text-accent-foreground`
  - Tonal/tinted surfaces (`bg-primary/10`, `bg-accent/10`, `bg-muted/60`) should usually use `text-foreground` or `text-muted-foreground`, not `*-foreground` tokens.
- Never use `text-primary-foreground` or `text-accent-foreground` unless the element background is a solid `bg-primary` or `bg-accent` (or equivalent high-opacity variant).
- Maintain WCAG contrast minimums:
  - 4.5:1 for normal text
  - 3:1 for large text and UI boundaries/icons
- Apply color parity across all states in both themes:
  - default
  - hover
  - focus-visible
  - disabled

COLOR + CONTRAST QA (MANDATORY BEFORE HANDOFF)

1. Validate key components in both light and dark mode.
2. Check body text, muted text, badges, chips, and action buttons for contrast.
3. Verify hover/focus states do not reduce contrast below AA thresholds.
4. Ensure primary/accent usage is intentional (not decorative noise on low-contrast surfaces).
5. If a token combo looks weak, adjust classes/components first; only change global tokens if this is a broader design-system issue.
6. Report what was checked and any tradeoffs in the final response.

MOTION + POLISH RULES

- If `framer-motion` can improve fidelity, use it instead of flattening the interaction.
- Preserve or improve:
  - hover states
  - reveal transitions
  - overlay/interstitial interactions
  - drag/scroll affordances where relevant
- Add motion with accessibility in mind:
  - prefer subtle transforms/opacity
  - support reduced-motion behavior
  - keep keyboard and pointer behavior intact
- Do not remove meaningful interaction patterns from source examples unless they conflict with architecture, accessibility, or performance constraints.

INTEGRATION RULES

- Integrate adapted components into correct routes/features.
- Reuse existing UI primitives in `src/components/ui`.
- Keep accessibility intact (labels, keyboard support, semantics).
- Do not add new dependencies unless explicitly requested.

OUTPUT EXPECTATIONS FOR EACH TASK

1. Placement rationale (why component went to `src/components` vs `src/features`).
2. Files created/updated.
3. How it integrates into routes/features.
4. Verification commands run and results:
   - `pnpm lint`
   - `pnpm typecheck`
   - targeted `pnpm test -- <path>` when applicable
5. Documentation updates required (README/ADR/docs) when architecture changes.
6. Motion/polish summary (what interactions were retained or improved).
7. Color/contrast summary (what was validated in light + dark mode and how actions use primary/accent tokens).

PROMPT SNIPPET TO REUSE

GOAL:
- Adapt components from `src/components/_examples` into production-ready Nu Graphix components.

CONTEXT:
- Follow `AI.md`, `ARCHITECTURE.md`, ADRs, and `docs/agent/skills`.
- Respect component placement rules (`ui` atoms vs reusable molecules vs feature organisms).

CONSTRAINTS:
- No direct copy/paste integration.
- No new dependencies unless requested.
- Use `src/styles.css` tokenized styling conventions.
- Keep changes scoped to relevant files only.

RETURN:
- Placement decision summary
- Implemented patch
- Motion and interaction summary
- Verification output summary
- Any docs/ADR updates made
