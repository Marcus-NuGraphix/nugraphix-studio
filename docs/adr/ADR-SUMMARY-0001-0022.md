# ADR Summary (0001-0022)

Last updated: 2026-02-18

This summary consolidates accepted decisions from ADR `0001` through `0022`.
Immutable ADR records are stored in `docs/adr/archive/`.

## Decision Timeline

| ADR | Title | File | Summary | Status |
| --- | --- | --- | --- | --- |
| 0001 | Project Foundation | `docs/adr/archive/0001-project-foundation.md` | Defined Nu Graphix Studio as a dual-surface platform (public marketing + internal admin) with SaaS-ready boundaries. | Accepted |
| 0002 | Database and ORM Strategy | `docs/adr/archive/0002-database-orm-strategy.md` | Selected Neon Postgres + Drizzle ORM with schema-first typed data access. | Accepted |
| 0003 | Authentication and Authorization | `docs/adr/archive/0003-authentication-authorization.md` | Standardized Better Auth with strict server-side role enforcement. | Accepted |
| 0004 | Content Model and Rich Text | `docs/adr/archive/0004-content-model-rich-text.md` | Chose structured rich-text storage (`content_json` + `content_text`) over raw HTML persistence. | Accepted |
| 0005 | Observability and Logging | `docs/adr/archive/0005-observability-logging.md` | Established structured logging and observability baseline. | Accepted |
| 0006 | Brand System and Component Architecture | `docs/adr/archive/0006-branding-baseline.md` | Defined brand consistency and reusable component primitives. | Accepted |
| 0007 | Drizzle and Neon Integration | `docs/adr/archive/0007-drizzle-neon-integration.md` | Locked implementation details for Drizzle + Neon integration and schema layout. | Accepted |
| 0008 | Auth, Server Functions, Error Contract | `docs/adr/archive/0008-auth-server-functions-and-error-contract.md` | Introduced canonical server error contract and auth integration patterns. | Accepted (amended) |
| 0009 | Route Protection and Redirect Strategy | `docs/adr/archive/0009-route-protection-and-redirect-strategy.md` | Added route-level protection and safe redirect behavior. | Accepted |
| 0010 | Server Function Canonical Patterns | `docs/adr/archive/0010-server-function-canonical-patterns.md` | Standardized validator/auth/catch flow and throw-vs-return semantics. | Accepted |
| 0011 | Theme System and Dark Mode | `docs/adr/archive/0011-theme-system-and-dark-mode.md` | Implemented SSR-safe, token-driven theme system with persistent user preference. | Accepted |
| 0012 | Feature Module Architecture | `docs/adr/archive/0012-feature-module-architecture.md` | Locked feature-first module boundaries and barrel exports. | Accepted |
| 0013 | Email Infrastructure and Background Tasks | `docs/adr/archive/0013-email-infrastructure-and-background-tasks.md` | Adopted provider abstraction and Postgres-backed async email workflows. | Accepted |
| 0014 | CSS Design Token Strategy | `docs/adr/archive/0014-css-design-token-strategy.md` | Enforced token-first styling and prohibited hardcoded palette drift. | Accepted |
| 0015 | Environment Contract and Runtime Validation | `docs/adr/archive/0015-environment-contract-and-runtime-validation.md` | Centralized runtime env validation and production safety constraints. | Accepted |
| 0016 | Shared Utility Layer Standards | `docs/adr/archive/0016-shared-utility-layer-standards.md` | Defined deterministic shared utilities and blocked domain logic leakage into utils. | Accepted |
| 0017 | Error Taxonomy and ServerFail Conversion | `docs/adr/archive/0017-error-taxonomy-and-server-fail-conversion.md` | Formalized error-code taxonomy and safe unknown-error conversion. | Accepted |
| 0018 | Cross-Cutting Infrastructure Organization | `docs/adr/archive/0018-cross-cutting-infrastructure-layer-organization.md` | Consolidated shared infra under `src/lib` with stable import contracts. | Accepted |
| 0019 | Auth Hardening and Lib Integration | `docs/adr/archive/0019-auth-feature-hardening-and-lib-integration.md` | Hardened auth flows and aligned auth feature with shared infrastructure. | Accepted |
| 0020 | Shared Component Composition Layer | `docs/adr/archive/0020-shared-component-composition-layer.md` | Added composition-layer components (`layout`, `metrics`, `forms`, `editor`) over primitive UI. | Accepted |
| 0021 | Users Account and Admin Route Integration | `docs/adr/archive/0021-users-account-and-admin-route-integration.md` | Completed user account/admin feature integration into route surface. | Accepted |
| 0022 | Contact and Email Route Integration | `docs/adr/archive/0022-contact-email-route-integration-and-operations.md` | Completed contact and email feature route integration and operational flows. | Accepted |

## Consolidated Themes

1. Platform architecture and boundaries: `0001`, `0012`, `0018`.
2. Security and server contracts: `0003`, `0008`, `0009`, `0010`, `0017`, `0019`.
3. Design system and composition architecture: `0006`, `0011`, `0014`, `0020`.
4. Data and infrastructure standards: `0002`, `0007`, `0015`, `0016`.
5. Operational feature integrations: `0013`, `0021`, `0022`.

## Current Implication

The baseline architecture is stable. The next MVP target is the admin-managed
blog/editor pipeline: editorial authoring, publishing workflow, and public blog
rendering wired end-to-end with production safeguards.
