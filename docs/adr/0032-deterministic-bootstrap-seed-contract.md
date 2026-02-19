# ADR-0032: Deterministic Bootstrap Seed Contract

- Status: Accepted
- Date: 2026-02-18
- Related: ADR-0015, ADR-0030, ADR-0031

## Context

Phase 1 local runtime validation reached migrate-first reliability, but seed
coverage remained too narrow for local admin and content verification.
`db:seed` only populated blog demo posts and a single direct DB author user.

That left three operational gaps:

1. No deterministic login-ready baseline account for local admin checks.
2. No seeded content baseline in `content_entry`/`content_revision`/`content_publication`.
3. No single bootstrap seed contract mapping to Phase 1 runbooks.

## Decision

Adopt deterministic bootstrap seeding as the default local seed contract.

1. `pnpm db:seed` points to `tools/seed-bootstrap.ts`.
2. Bootstrap seed must upsert:
   - local auth users (`admin` + `user`) with credential accounts/passwords
   - published content baseline entries for core public routes
   - blog demo dataset via `tools/seed-blog-demo.ts`
3. `pnpm db:seed:blog-demo` remains available for scoped blog-only reseeding.
4. Seed variables (`SEED_*`) remain tooling-only env inputs and are not part of
   runtime `src/lib/env/server.ts` validation contract.
5. Seed scripts must stay idempotent and safe to rerun against local
   migrate-first databases.

## Consequences

### Positive

1. Local bootstrap now provisions auth, content, and blog baselines in one
   command.
2. Developers can validate admin/auth flows without manual account setup.
3. Environment docs and script contracts stay aligned.

### Trade-offs

1. Seed script complexity increases (auth + content + blog orchestration).
2. Seed credential defaults require local secret hygiene even in dev.

## References

- `tools/seed-bootstrap.ts`
- `tools/seed-blog-demo.ts`
- `package.json`
- `docs/02-environments/01-local-dev-docker.md`
- `docs/02-environments/04-migrations-and-seeding.md`
