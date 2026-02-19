# Environment Layer

This directory owns runtime environment validation for Nu Graphix Studio.

## Responsibilities

1. Parse and validate server environment variables with Zod.
2. Provide a stable typed env surface to server code.
3. Fail fast with actionable errors when required configuration is missing.

## Files

1. `server.ts`: server env schema, parser, cache, and typed proxy export.
2. `index.ts`: public barrel export.
3. `server.test.ts`: env parsing and validation tests.
