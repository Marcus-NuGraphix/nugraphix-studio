# Tokens and Theming

Last updated: 2026-02-18
Status: Draft

## Goal

Maintain one coherent token system across light/dark and all component surfaces.

## Checklist

- [ ] All semantic colors map to CSS variables.
- [ ] No hardcoded Tailwind palette classes in component surfaces.
- [ ] Theme switching remains SSR-safe.
- [ ] Status colors use semantic tokens (`destructive`, `accent`, `muted`, `secondary`).

## Audit Targets

- `src/styles.css`
- `src/components/theme/*`
- `src/components/ui/*`
- `src/components/*`

## Drift Tracker

| Path | Drift Type | Fix | Phase |
| --- | --- | --- | --- |
| TBD |  |  |  |