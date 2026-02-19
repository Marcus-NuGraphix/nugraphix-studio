# Documentation Governance

Last updated: 2026-02-18
Status: Active

## Goal

Keep one active, maintainable documentation system and prevent stale parallel tracks.

## External Governance Basis

- Diataxis structure model (tutorials, how-to, reference, explanation) for
  content taxonomy and separation of concerns.
- Docs-as-code workflow conventions (version control, review, tests, and issue
  tracking) from Write the Docs guidance.

See `docs/08-implementation/05-external-references.md`.

## Canonical Active Sources

1. `docs/00-index.md`
2. `docs/plans/ROADMAP-2026-PRODUCTION-HARDENING.md`
3. `docs/08-implementation/01-phased-plan.md`
4. `docs/08-implementation/02-task-board.md`

## Historical Sources

- `docs/archive/roadmaps/*`
- `docs/archive/phases/*`

Historical sources are read-only context, not active planning authority.

## Update Protocol

- Update docs in the same change-set as code behavior changes.
- If architecture changes, add a new ADR before or with implementation.
- If execution plan changes, update roadmap + phased plan + task board together.
- If a doc is superseded, move it to archive and add replacement link.

## Quality Checks

- Run stale-reference sweep with `rg` for superseded paths.
- Keep `AI.md`, `ARCHITECTURE.md`, and `docs/README.md` aligned.
- Keep `docs/adr/README.md` next ADR number accurate.

## Review Cadence

- Weekly: active roadmap, phased plan, risk register alignment.
- Per phase exit: verify checklists, links, and evidence references.
- Release candidate: full outside-in docs audit.
