# Shared Library Layer

`src/lib` contains cross-feature infrastructure for Nu Graphix Studio.

## Principles

1. Keep integration and infrastructure code out of UI and route shells.
2. Prefer typed, testable, reusable modules with narrow responsibilities.
3. Follow Phase architecture constraints for security, observability, and stability.

## Directory Guide

1. `config/`: shared runtime-safe application config composition.
2. `constants/`: shared cross-feature constants.
3. `db/`: Drizzle schema, DB client, and migration/test contracts.
4. `env/`: runtime environment parsing and validation.
5. `errors/`: error taxonomy and `ServerResult` conversion helpers.
6. `flags/`: typed feature-flag defaults and parsing helpers.
7. `observability/`: structured logging and mutation log helpers.
8. `rateLimit/`: shared rate limiting primitives.
9. `search/`: full-text search helpers.
10. `server/`: server-only runtime orchestration (background tasks).
11. `utils/`: generic, framework-agnostic utility functions.
