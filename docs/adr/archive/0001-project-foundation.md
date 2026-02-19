# ADR-0001: Nu Graphix Studio Project Foundation

- Status: Accepted
- Date: 2026-02-17
- Decision Owners: Nu Graphix (Marcus)
- Related: Phase 1–7 Master Plan, Build Roadmap Week 0

## Context

Nu Graphix Studio will serve as:
1) the public marketing platform for Nu Graphix (consultancy authority + lead gen), and
2) the internal operating system for solo-dev execution (CMS, KB, architecture docs),
with a path to future vertical SaaS.

A stable foundation is required before implementing application features.

## Decision

We will adopt the following project foundation:

### Framework & Routing
- TanStack Start (Vite-based)
- File-based routing under `src/routes`
- Server Functions used as the primary backend API layer

### UI & Design System
- Tailwind CSS + shadcn/ui (Radix primitives)
- Theme: cyan accent with gray neutrals
- Icons: lucide-react
- Font: Inter
- Dark mode supported from day one

### Package Management
- pnpm is the standard package manager

### Repo Structure
- Feature-first architecture (`src/features/<feature>`)
- Cross-cutting infrastructure in `src/lib/*`
- Shared UI in `src/components/ui/*` and/or `src/ui/*`
- Documentation in `docs/*`, decisions in `docs/adr/*`

### Environments
- local, staging, production environments are isolated by env variables and separate provider configs

### Security Baseline
- Server-side validation required for all mutations
- Strict role enforcement server-side (no client trust)
- CSP strategy will be formalized before adding analytics/external scripts

## Alternatives Considered

1) Next.js App Router
- Rejected: project is intentionally centered on TanStack Start ecosystem and server functions.

2) Self-hosted services from day one
- Rejected: currently not operationally feasible; prefer managed/free-tier services first.

3) Monolithic folder structure (components/pages/services)
- Rejected: feature-first structure supports scalability and future productization.

## Consequences

### Positive
- Clear architecture boundaries reduce drift
- Faster implementation because conventions are pre-decided
- Easier to onboard collaborators later
- Safer evolution into SaaS without rewrite

### Trade-offs / Risks
- Some TanStack Start ecosystem patterns will be learned during implementation
- CSP must be revisited when analytics or third-party scripts are added
- Feature-first architecture requires discipline to avoid duplication

## Follow-ups

- ADR-0002: Persistence + database provider and ORM (Neon + Drizzle)
- ADR-0003: Authentication strategy (Better Auth + roles)
- ADR-0004: Content model (ProseKit + ProseMirror JSON + extracted text)
- ADR-0005: Observability (Sentry + structured logs)
