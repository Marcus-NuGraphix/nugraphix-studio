# Component Audit

Last updated: 2026-02-18
Status: Draft

## Goal

Inventory and grade all UI components for reuse quality, accessibility, and drift.

## Audit Dimensions

- Layer classification: primitive/composition/feature/page.
- API consistency and variant clarity.
- Token compliance and theme support.
- Accessibility checks (keyboard, labels, focus, contrast).
- Duplication and consolidation opportunities.

## Inventory Template

| Component | Path | Layer | Health | Issues | Action |
| --- | --- | --- | --- | --- | --- |
| TBD | `src/components/...` | Composition | TBD |  |  |

## Priority Buckets

- `High churn` first (frequently edited components).
- `High blast radius` second (layout/shell/navigation/table primitives).
- `Low churn` backlog.