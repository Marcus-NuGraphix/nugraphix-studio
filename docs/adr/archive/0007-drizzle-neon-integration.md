# ADR-0007: Drizzle + Neon Integration

- Status: Accepted
- Date: 2026-02-17
- Decision Owners: Nu Graphix (Marcus)
- Related: ADR-0002, Phase 3 Engineering System

## Context

ADR-0002 selected Drizzle ORM with Neon PostgreSQL as the database stack. This ADR records the concrete implementation decisions made when integrating these tools into the TanStack Start codebase.

Key constraints:

- TanStack Start server functions run in a serverless-like environment (Nitro)
- Neon provides both HTTP and WebSocket connection modes
- The schema must support modular growth across bounded-context domains (auth, cms, kb, etc.)
- drizzle-kit must discover all schema modules automatically

## Decision

### Connection Driver

- **Neon HTTP** (`drizzle-orm/neon-http` + `@neondatabase/serverless`)
- HTTP is the fastest mode for single, non-interactive queries — the primary pattern for TanStack Start server functions
- No WebSocket setup required for MVP
- If interactive transactions are needed in future, `drizzle-orm/neon-serverless` (WebSocket mode) can be added alongside without replacing the HTTP client

### Client Configuration

- Single client instance exported from `src/lib/db/client.ts`
- Schema object passed to `drizzle()` to enable the relational query API (`db.query.*`)
- `DATABASE_URL` validated at startup — throws if missing

### Modular Schema Architecture

```
src/lib/db/
  client.ts              → Neon HTTP client, exports `db`
  schema.ts              → stable import surface, re-exports schema/index.ts
  schema/
    index.ts             → composes all domain barrel exports
    auth/
      auth.ts            → table definitions
      index.ts           → domain barrel
    <future-domain>/
      <domain>.ts
      index.ts
```

- Each domain gets a folder under `schema/` with its own table definitions and barrel export
- `schema/index.ts` re-exports all domains, keeping `import * as schema from '@/lib/db/schema'` stable
- Adding a new domain requires: (1) create folder + files, (2) add one re-export line in `schema/index.ts`

### drizzle-kit Configuration

- Uses `defineConfig()` from `drizzle-kit` for type safety
- Schema discovery via glob: `./src/lib/db/schema/**/index.ts`
- Migrations output to `./drizzle/`
- Environment variables loaded via `dotenv` with fallback chain: `.env.local` then `.env`

## Alternatives Considered

1) **postgres.js driver (`postgres` package)**
   - Rejected: designed for long-lived server connections, not serverless. Neon HTTP is purpose-built for serverless query patterns.

2) **Single schema file**
   - Rejected: does not scale to multiple bounded contexts. Modular barrel pattern keeps domain boundaries clean.

3) **Glob matching all `*.ts` in schema directory**
   - Rejected in favor of `**/index.ts`: barrel files prevent drizzle-kit from processing internal helpers or type files that aren't table definitions.

## Consequences

### Positive

- Fastest connection mode for serverless (no WebSocket overhead)
- Relational query API (`db.query.users.findMany()`) available via schema passthrough
- New domains auto-discovered by drizzle-kit without config changes
- Stable import path for all consumers (`@/lib/db/schema`)

### Trade-offs

- HTTP mode does not support interactive transactions — if needed, add WebSocket driver later
- `dotenv` added as dev dependency solely for drizzle-kit CLI (Vite handles env loading at runtime)

## Follow-ups

- Auth schema integration with Better Auth (ADR-0003 implementation)
- CMS and KB schemas will follow the same modular pattern
- Migration discipline per Phase 6
