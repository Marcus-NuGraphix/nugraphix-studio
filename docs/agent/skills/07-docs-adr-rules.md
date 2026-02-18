# Skill 07 - Docs and ADR Rules

## ADR rules

- One decision per ADR.
- Accepted ADRs are immutable.
- New architectural changes require a new ADR.
- Supersede old decisions through a new ADR, never by rewriting archives.

## ADR structure

- Index and policy: `docs/adr/README.md`
- Consolidated summary: `docs/adr/ADR-SUMMARY-0001-0022.md`
- Immutable records: `docs/adr/archive/*`

## Docs placement

- Active roadmap: `docs/plans/`
- Legacy roadmap archive: `docs/archive/roadmaps/`
- Active execution board and phases: `docs/08-implementation/`
- Historical MVP phases: `docs/archive/phases/`
- Agent contracts: `docs/agent/`
- Audits and snapshots: `docs/audits/`
- Technical references: `docs/reference/`

## Update rule

If implementation behavior changes:

1. Update code.
2. Update affected reference docs.
3. Add ADR if architecture changed.
4. Update roadmap/phase status when milestone state changes.
