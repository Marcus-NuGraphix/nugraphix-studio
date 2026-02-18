# Feature Flags Layer

Shared feature-flag primitives for incremental rollout controls.

## Rules

1. Keep defaults deterministic and typed.
2. Parse raw env/source values through shared helpers before use.
3. Keep feature-specific rollout decisions in feature modules.
