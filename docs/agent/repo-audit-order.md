# Nu Graphix Studio Audit Order (Outside-In)

This is the recommended sequence for a full repo audit, starting from outer controls and moving inward to feature behavior.

1. **Repo Perimeter & Governance**
- Root files: `README.md`, `AI.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, `.gitignore`, `.editorconfig`, `.npmrc`, `.nvmrc`
- Confirm branch/release rules, coding standards, and ignored artifacts are aligned.

2. **Toolchain & Quality Gates**
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`
- `eslint.config.js`, `prettier.config.js`, `tsconfig.json`, `vite.config.ts`
- Run: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`

3. **Environment & Secrets Boundary**
- `.env.example`, `src/lib/env/server.ts`
- Validate required env keys, safe defaults, and server/client secret separation.

4. **CI/CD & Deployment Controls**
- `.github/workflows/*`, `docker-compose.yml`, release/branch assumptions
- Verify CI matches local quality gates and deploy constraints.

5. **Architecture Contract**
- `docs/adr/*`, `docs/phases/*`, `docs/plans/*`
- Confirm codebase behavior still matches accepted ADR decisions.

6. **App Shell, Routing, and Access Control**
- `src/routes/__root.tsx`, pathless layouts, route guards, redirects, 404/error boundaries
- Validate SSR/hydration safety and protected-route coverage.

7. **Cross-Cutting Infrastructure**
- `src/lib/db/*`, `src/lib/errors/*`, `src/lib/server/*`, `src/lib/utils/*`
- Check server result contracts, logging discipline, rate limiting, and background tasks.

8. **Feature Modules (One by One)**
- `src/features/auth`, `src/features/contact`, `src/features/email`, `src/features/users`
- Verify server-function validation, auth checks, boundaries, and UI wiring.

9. **Data Layer & Migrations**
- `src/lib/db/schema/**`, `drizzle/**`, `drizzle.config.ts`
- Confirm schema/migration parity, constraints, indexes, and migration discipline.

10. **Security Hardening Pass (OWASP)**
- Input validation, access control, secret handling, log redaction, CSRF/cookie posture, XSS surfaces.

11. **Docs Drift & Backlog**
- Identify stale docs/import paths/placeholders and produce prioritized remediation list.

12. **Sign-Off Report**
- Summarize: pass/fail per section, blockers, risks, and ordered fix plan.
