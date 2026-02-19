# Contributing

## Branches

- `main`: production
- `dev`: staging/integration
- `feature/*`, `hotfix/*`: scoped work branches

## Commit Messages

Use Conventional Commits:

- `feat:`
- `fix:`
- `refactor:`
- `chore:`
- `docs:`

## Pull Request Expectations

- Keep scope tight; avoid unrelated edits.
- Include validation steps run locally.
- Update docs in the same PR when behavior/contracts change.

## Definition of Done

- TypeScript clean
- Lint clean
- Build passes
- Mutation validation and role checks in place
- Structured logging added where relevant
- Documentation updated:
  - ADR (if architectural)
  - roadmap/phases (if milestone state changes)
  - reference docs (if implementation contracts change)
