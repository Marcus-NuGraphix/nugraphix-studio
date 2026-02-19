# Agent Audit Entry Point

Use the canonical audit workflow in:

- `docs/audits/repo-audit-order.md`

Agent-specific rule:

- Start every repo audit from outer controls first (root docs, toolchain,
  env contract), then move inward to routing, shared infrastructure, and feature
  behavior.
- When findings are produced, add a dated snapshot under `docs/audits/`.
