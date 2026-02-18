# Architecture Decision Records

Last updated: 2026-02-18

## Canonical ADR Docs

- `docs/adr/ADR-SUMMARY-0001-0022.md` contains consolidated decision context.
- `docs/adr/archive/` contains immutable ADR source documents (`0001` through `0022`).
- `docs/adr/0023-blog-editor-workflow-with-prosekit.md` captures active blog editor architecture decisions.
- `docs/adr/0024-security-and-quality-gate-enforcement.md` captures Phase-04 security and quality enforcement controls.
- `docs/adr/0025-phase-05-incident-management-enforcement.md` captures Phase-05 incident and escalation enforcement controls.
- `docs/adr/0026-media-library-integration-and-admin-routing.md` captures media feature integration, admin routing, and shared contract alignment.
- `docs/adr/0027-example-component-integration-color-contrast-governance.md` captures prompt-level governance for token pairing, action color usage, and light/dark contrast QA in example component adaptations.
- `docs/adr/0028-observability-telemetry-and-admin-performance-integration.md` captures observability telemetry persistence and admin performance signal integration.

## ADR Rules

1. Archived ADR files are immutable.
2. New architectural changes require a new ADR in `docs/adr/` (not in `archive/`).
3. If a decision changes, publish a superseding ADR and reference prior ADR numbers.

## Next ADR Number

- `0029`

## Current Focus

- Post-MVP hardening and expansion should align with accepted ADR contracts,
  including `0023` (editorial workflow), `0024` (security quality gates),
  `0025` (incident escalation governance), `0026` (media library architecture
  integration), `0027` (component integration color/contrast governance), and
  `0028` (observability telemetry and admin performance integration).
