# Nu Graphix Studio Documentation

Last updated: 2026-02-18

## Canonical Order

1. `docs/00-index.md`
2. `docs/adr/README.md`
3. `docs/adr/ADR-SUMMARY-0001-0022.md`
4. `docs/plans/ROADMAP-2026-PRODUCTION-HARDENING.md`
5. `docs/08-implementation/01-phased-plan.md`
6. `docs/reference/README.md`
7. `docs/audits/README.md`
8. `docs/agent/README.md`

## Production Hardening System of Record

- Master index: `docs/00-index.md`
- Audit track: `docs/01-audit/*`
- Environment track: `docs/02-environments/*`
- Hosting/latency track: `docs/03-hosting/*`
- Design system track: `docs/04-design-system/*`
- Dashboard workspaces track: `docs/05-dashboard/*`
- Security track: `docs/06-security/*`
- Quality/release track: `docs/07-quality/*`
- Phase execution + task board: `docs/08-implementation/*`

## Architecture Decisions

- Active index: `docs/adr/README.md`
- Consolidated summary: `docs/adr/ADR-SUMMARY-0001-0022.md`
- Active incremental ADRs:
  - `docs/adr/0023-blog-editor-workflow-with-prosekit.md`
  - `docs/adr/0024-security-and-quality-gate-enforcement.md`
  - `docs/adr/0025-phase-05-incident-management-enforcement.md`
  - `docs/adr/0026-media-library-integration-and-admin-routing.md`
  - `docs/adr/0027-example-component-integration-color-contrast-governance.md`
  - `docs/adr/0028-observability-telemetry-and-admin-performance-integration.md`
  - `docs/adr/0029-example-component-motion-and-functional-integration.md`
  - `docs/adr/0030-production-readiness-docs-first-hardening-program.md`
- Immutable records: `docs/adr/archive/0001-*.md` through `0022-*.md`

## Roadmap and Execution

- Active roadmap: `docs/plans/ROADMAP-2026-PRODUCTION-HARDENING.md`
- Active phase board: `docs/08-implementation/01-phased-plan.md`
- First 48 hours quick-start: `docs/08-implementation/00-first-48-hours.md`
- External references index: `docs/08-implementation/05-external-references.md`
- Docs governance rules: `docs/08-implementation/06-documentation-governance.md`
- Historical roadmaps: `docs/archive/roadmaps/*`
- Historical phase board: `docs/archive/phases/README.md`

## Operational Docs

- Agent operating system: `docs/agent/README.md`
- Audit workflow and snapshots: `docs/audits/README.md`
- AI failure log: `docs/ai-mistakes.md`

## Archive

- Archive index: `docs/archive/README.md`
- Roadmap archive: `docs/archive/roadmaps/*`
- Phase archive: `docs/archive/phases/*`

## Reference Library

- Reference index: `docs/reference/README.md`
- Core infra references: `docs/reference/lib-env.md`, `docs/reference/lib-utils.md`, `docs/reference/lib-errors.md`
- Feature references: `docs/reference/feature-auth.md`, `docs/reference/feature-users.md`, `docs/reference/feature-contact-email.md`, `docs/reference/feature-media.md`
- UI and composition references: `docs/reference/ui-component-inventory.md`, `docs/reference/component-composition-sets.md`
- Blog MVP contracts: `docs/reference/blog-editor-mvp.md`, `docs/reference/routing-surface-map.md`

## Documentation Rules

- Do not edit archived ADR files.
- Create new ADRs in `docs/adr/` using the next number from `docs/adr/README.md`.
- If implementation changes architecture, add a new ADR instead of rewriting old decisions.
- Keep one active execution system: `docs/00-index.md` + `docs/08-implementation/*`.
- Update roadmap, phase board, and reference docs in the same PR as the implementation change.
