# Nu Graphix Studio — Agent Operating System

This folder defines how any AI agent (Copilot, Claude, Codex, etc.) must work inside this repo.

## Read order (mandatory)

1. `AI.md` (repo root)
2. `docs/adr/*`
3. `docs/phases/phase-03.md` (Engineering)
4. `docs/phases/phase-04.md` (Security)
5. `docs/agent/skills/00-index.md`

## Core enforcement rules

- No unrelated edits.
- One step at a time (schema → server fn → UI shell → wiring → errors).
- Zod validation for mutations.
- Better Auth role checks server-side.
- ServerResult contract for all server calls.
- Run verification commands before proposing a PR.
