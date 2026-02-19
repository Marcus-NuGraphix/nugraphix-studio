# Config Layer

Shared runtime-safe app configuration composed from stable constants and typed
feature flags.

## Rules

1. Keep config non-secret and safe for broad usage.
2. Build config from validated primitives (`constants`, `flags`, env adapters).
3. Do not place feature business rules directly in shared config.
