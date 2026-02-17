# Skill 01 — Repo Navigation

## Where things live

- Routes: `src/routes/*`
- Feature modules: `src/features/<feature>/*`
- Shared infra: `src/lib/*`
- Shared UI: `src/components/ui/*` and `src/ui/*` (if added later)
- Docs: `docs/*`
- ADRs: `docs/adr/*`

## Rules

- Avoid “misc utils” dumping grounds.
- Place business logic in server functions, not UI components.
- Prefer feature-first structure for new work.
