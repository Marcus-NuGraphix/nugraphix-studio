# Roadmap 2026 - Production Readiness Hardening

Last updated: 2026-02-18
Status: Active

## Objective

Move Nu Graphix Studio from MVP-complete baseline to production-ready operations
with a docs-first, measurement-first, phased execution model.

## Program Scope

- Environment reliability (local Docker and production-dev VM runtime).
- Performance and latency decision track (South Africa constraints).
- Design system and shared `lib` boundary hardening.
- Dashboard workspace IA/routing/permissions refactor.
- Auth and security hardening.
- CI/release readiness and operational polish.

## Source of Truth

- Master index: `docs/00-index.md`
- First 48 hours: `docs/08-implementation/00-first-48-hours.md`
- Phase plan: `docs/08-implementation/01-phased-plan.md`
- Task board: `docs/08-implementation/02-task-board.md`
- Decisions log: `docs/08-implementation/03-decisions-log.md`

## Relationship to Blog MVP Roadmap

`docs/archive/roadmaps/ROADMAP-2026-BLOG-MVP.md` remains the completed historical record
for MVP scope delivery. This production-readiness roadmap is the active plan.

## Success Criteria

- Local and production-dev environments are reproducible and documented.
- Latency decision is evidence-backed with rollback-ready migration plan.
- Dashboard workspaces and permissions are clean and enforceable.
- Security checklist critical/high items are resolved.
- CI/release gates are stable and repeatable.
