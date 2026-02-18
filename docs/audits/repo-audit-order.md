# Repo Audit Order (Outside-In)

Use this order for full audits so controls and contracts are validated before deep feature checks.

## 1. Repo Governance and Guardrails

- `README.md`, `AI.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`
- Tooling contracts: `.editorconfig`, `.gitignore`, `.npmrc`, `.nvmrc`
- Confirm docs and operational rules match current implementation.

## 2. Toolchain and Quality Gates

- `package.json`, lockfile, workspace settings
- `eslint.config.js`, `prettier.config.js`, `tsconfig.json`, `vite.config.ts`
- Verify commands:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`

## 3. Environment and Secret Boundaries

- `.env.example`
- `src/lib/env/*`
- Validate required keys, secure defaults, and server/client separation.

## 4. Architecture and Decision Contracts

- `docs/00-index.md`
- `docs/adr/README.md`
- `docs/adr/ADR-SUMMARY-0001-0022.md`
- `docs/plans/*`
- `docs/08-implementation/*`
- Confirm implementation still respects accepted ADR decisions.

## 5. Routing, Layout Shells, and Access Control

- `src/routes/__root.tsx`
- Public/auth/legal/admin route groups
- Route guards and redirect safety
- Error and not-found boundaries

## 6. Cross-Cutting Infrastructure (`src/lib`)

- `db`, `env`, `errors`, `observability`, `rateLimit`, `search`, `server`, `utils`
- Validate contracts, boundaries, and logging discipline.

## 7. Shared UI and Composition System

- `src/components/ui/*`
- `src/components/{brand,empties,errors,layout,marketing,navigation,tables,theme}`
- Confirm token compliance and accessibility baseline.

## 8. Feature Modules

- `src/features/auth`
- `src/features/users`
- `src/features/contact`
- `src/features/email`
- Confirm validation, authorization, server/client boundaries, and route integration.

## 9. Production-Readiness Program Pass (Current Priority)

- Environment reliability artifacts (`docs/02-environments/*`).
- Hosting/latency decision artifacts (`docs/03-hosting/*`).
- Dashboard workspace and permissions artifacts (`docs/05-dashboard/*`).
- Auth hardening and security controls (`docs/06-security/*`).

## 10. Data and Migration Discipline

- `src/lib/db/schema/**`
- `drizzle/**`
- `drizzle.config.ts`
- Validate migration parity, indexes, and constraints.

## 11. Security Hardening Sweep

- OWASP checks: authz/authn, validation, XSS, injection, CSRF, secret handling.
- Rate limiting and bot protection coverage for public write paths.

## 12. Audit Output

- Findings by severity in descending order.
- Explicit file/path references.
- Ordered remediation plan.
- Follow-up verification command list.
