# Design System Principles

Last updated: 2026-02-18
Status: Draft

## Goal

Establish a modular, scalable design system without over-engineering.

## Core Principles

- Token-first styling (no hardcoded palette drift).
- Composition over duplication.
- Accessibility and responsiveness by default.
- Predictable component APIs and folder boundaries.
- Keep feature-specific UI inside features; keep shared primitives/components in shared layers.

## Non-Negotiables

- [ ] Follow ADR-0014 token strategy.
- [ ] Preserve shadcn/Radix accessibility contracts.
- [ ] Respect existing component/module architecture in `ARCHITECTURE.md`.