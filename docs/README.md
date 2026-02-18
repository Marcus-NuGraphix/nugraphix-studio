# Nu Graphix Studio Documentation

Last updated: 2026-02-18

## Canonical Order

1. `docs/adr/README.md`
2. `docs/adr/ADR-SUMMARY-0001-0022.md`
3. `docs/plans/ROADMAP-2026-BLOG-MVP.md`
4. `docs/phases/README.md`
5. `docs/reference/README.md`
6. `docs/audits/README.md`
7. `docs/agent/README.md`

## Architecture Decisions

- Active index: `docs/adr/README.md`
- Consolidated summary: `docs/adr/ADR-SUMMARY-0001-0022.md`
- Immutable records: `docs/adr/archive/0001-*.md` through `0022-*.md`

## Roadmap and Execution

- Active roadmap: `docs/plans/ROADMAP-2026-BLOG-MVP.md`
- Archived legacy plans: `docs/plans/archive/`
- Phase execution board: `docs/phases/README.md`

## Operational Docs

- Agent operating system: `docs/agent/README.md`
- Audit workflow and snapshots: `docs/audits/README.md`
- AI failure log: `docs/ai-mistakes.md`

## Reference Library

- Reference index: `docs/reference/README.md`
- Core infra references: `docs/reference/lib-env.md`, `docs/reference/lib-utils.md`, `docs/reference/lib-errors.md`
- Feature references: `docs/reference/feature-auth.md`, `docs/reference/feature-users.md`, `docs/reference/feature-contact-email.md`
- UI and composition references: `docs/reference/ui-component-inventory.md`, `docs/reference/component-composition-sets.md`
- Blog MVP contracts: `docs/reference/blog-editor-mvp.md`, `docs/reference/routing-surface-map.md`

## Documentation Rules

- Do not edit archived ADR files.
- Create new ADRs in `docs/adr/` using the next number from `docs/adr/README.md`.
- If implementation changes architecture, add a new ADR instead of rewriting old decisions.
- Update roadmap, phases, and reference docs in the same PR as the implementation change.
