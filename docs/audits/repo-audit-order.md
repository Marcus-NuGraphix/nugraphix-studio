# Repo Audit Order (Outside-In)

## 1. Project Guardrails
- `package.json` scripts and dependency health
- `eslint.config.js`, `prettier.config.js`, `tsconfig.json`
- Environment contract files (`.env.example`, runtime env schemas)

## 2. Architecture Contracts
- `ARCHITECTURE.md`
- `docs/adr/*` (decision precedence)
- `docs/phases/*` and `docs/plans/*` alignment check

## 3. Routing and Layout Shells
- `src/routes/__root.tsx`
- Public/auth/legal/admin route groups
- Route tree generation and type safety (`src/routeTree.gen.ts`)

## 4. Public Marketing Surface
- Navigation + footer consistency
- Home/about/services/blog/portfolio/contact route quality
- Brand and copy consistency with `src/components/brand/brand.config.ts`

## 5. Auth and Session Security
- Login/signup/reset/forgot UX and copy
- Session guards, redirects, role checks
- Rate limiting, safe error handling, and token flows

## 6. Admin Workspace
- Admin shell, route protection, and navigation
- Content/KB/docs/settings scaffold completeness
- User-management flow integrity

## 7. Feature Module Contracts
- `src/features/*` barrel integrity (no missing exports)
- Server/client boundaries
- Schema validation + server function contracts

## 8. Data and Infrastructure
- Drizzle schema organization and migrations
- DB access patterns and repository contracts
- Email/workflow pipelines and background task wiring

## 9. Quality Gates
- `pnpm lint` / `pnpm lint:fix`
- `pnpm typecheck`
- `pnpm test` (or targeted suites where baseline issues exist)
- Build verification (`pnpm build`) before release

## 10. Audit Output Format
- Findings by severity (`critical`, `high`, `medium`, `low`)
- File reference for each finding
- Recommended fix + owner + follow-up test
