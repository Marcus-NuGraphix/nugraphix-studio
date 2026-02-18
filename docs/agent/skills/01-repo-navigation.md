# Skill 01 - Repo Navigation

## Where things live

- Routes: `src/routes/*`
- Feature modules: `src/features/<feature>/*`
- Shared infrastructure: `src/lib/*`
- Shared UI primitives: `src/components/ui/*`
- Shared composed components: `src/components/*`
- Hooks: `src/hooks/*`
- Documentation: `docs/*`
- ADR index and archive:
  - `docs/adr/README.md`
  - `docs/adr/ADR-SUMMARY-0001-0022.md`
  - `docs/adr/archive/*`

## Rules

- Avoid misc dumping grounds.
- Keep business logic in server modules and feature model layers, not UI.
- Preserve feature-first structure for new work.
- Prefer updating existing references before adding new top-level docs files.
