# DB Test Suite

Database-layer contract tests for `src/lib/db`.

## Files

1. `schema-domain-barrels.test.ts`: verifies root/domain schema barrel stability.
2. `schema-contracts.test.ts`: verifies enums, timestamp policy, and critical schema contracts.
3. `migration-artifacts.test.ts`: verifies Drizzle migration artifact consistency.

## Run

1. `pnpm exec vitest run src/lib/db/tests`
2. `pnpm exec eslint src/lib/db`
