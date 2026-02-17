# DB Test Suite

This directory centralizes database-layer contract tests.

## Files

1. `schema-domain-barrels.test.ts`: verifies root/domain schema re-export stability.
2. `schema-contracts.test.ts`: verifies enum, timestamp, constraint, and auth table contracts.
3. `migration-artifacts.test.ts`: verifies Drizzle migration artifact consistency.

## Run

1. `pnpm test:db`
2. `pnpm exec eslint src/db`
