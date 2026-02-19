# ADR-0002: Database & ORM Strategy

- Status: Accepted
- Date: 2026-02-17
- Decision Owners: Nu Graphix (Marcus)
- Related: ADR-0001, Phase 3 Engineering System

## Context

Nu Graphix Studio requires:

- Structured content storage (blog, case studies, KB, docs)
- Strong type safety
- Migration discipline
- SaaS-readiness for future multi-tenant architecture
- Managed hosting with minimal operational overhead

The database must be production-grade but cost-effective.

## Decision

We will adopt:

### Database Provider
- Neon (managed PostgreSQL)

### ORM
- Drizzle ORM

### Migration Tooling
- drizzle-kit for schema generation and migrations

### Query Model
- All DB access occurs inside TanStack Start server functions
- No direct DB calls inside UI components

### Schema Philosophy
- Explicit schema definition in code
- Unique constraints enforced at DB level
- Indexed columns for:
  - slug
  - createdAt
  - foreign keys
  - future orgId

### Search Strategy (MVP)
- PostgreSQL Full-Text Search (tsvector)
- Maintain `content_text` alongside structured JSON content

## Alternatives Considered

1) Prisma
- Rejected: heavier abstraction, larger runtime, less control over SQL output.

2) Supabase
- Rejected for MVP: unnecessary service layer at current stage.

3) Self-hosted Postgres
- Rejected: operational overhead not justified.

## Consequences

### Positive
- Fully managed database
- Strong TypeScript alignment
- SQL visibility and control
- SaaS-ready relational model

### Trade-offs / Risks
- Neon free tier limitations must be monitored
- Must enforce migration discipline strictly
- RLS not activated initially (app-level enforcement first)

## Follow-ups

- Migration safety checklist defined in Phase 6
- orgId columns planned but not activated until SaaS phase
