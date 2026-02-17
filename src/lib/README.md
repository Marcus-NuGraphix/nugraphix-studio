# Shared Library Layer

`src/lib` contains cross-feature infrastructure for Nu Graphix Studio.

## Principles

1. Keep integration and infrastructure code out of UI and route shells.
2. Prefer typed, testable, reusable modules with narrow responsibilities.
3. Follow Phase architecture constraints for security, observability, and stability.

## Directory Guide

1. `db/`: Drizzle schema, DB client, and migration/test contracts.
2. `env/`: runtime environment parsing and validation.
3. `errors/`: error taxonomy and `ServerResult` conversion helpers.
4. `observability/`: structured logging and mutation log helpers.
5. `rateLimit/`: shared rate limiting primitives.
6. `search/`: full-text search helpers.
7. `server/`: server-only runtime orchestration (background tasks).
8. `utils/`: generic, framework-agnostic utility functions.
