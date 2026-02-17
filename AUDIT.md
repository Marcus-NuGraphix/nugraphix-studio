# Nu Graphix Studio — Pre-Week-1 Architectural Audit

**Date:** 2026-02-17
**Scope:** Full structural validation and gap analysis before active development
**Mode:** Read-only audit — no code modifications proposed

---

## Strengths

- **Exceptional documentation coherence.** 7 phases + 6 ADRs + master plan + weekly roadmap are internally consistent with zero contradictions detected across all cross-references (tech stack, security rules, MVP scope, branding).
- **Layered agent governance.** AI.md (entry contract) > docs/agent/* (operating system) > docs/agent/skills/* (source-of-truth protocols) > .agents/skills/* (supporting references). Hierarchy is explicit and documented in `00-index.md`.
- **ServerResult contract is locked.** Defined in Phase 03 with concrete TypeScript types, reinforced in Phase 04 security checklist, and referenced in Phase 05 debug protocol. Consistent across all layers.
- **Intentional SaaS restraint.** Phase 01 explicitly excludes billing, multi-tenant UI, feature gating. Phase 07 designs org/membership model WITHOUT premature implementation. orgId is planned but not activated.
- **Strict TypeScript configuration.** `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports` all enabled.
- **Complete script coverage for dev loop.** `dev`, `build`, `preview`, `test`, `typecheck`, `lint`, `format`, `check` all present and functional.
- **Feature-first folder structure scaffolded.** `src/features/`, `src/lib/auth|db|email|errors|observability|rateLimit|search` directories exist as documented in Phase 03.
- **Dark mode supported from day one.** CSS variables use OKLCH color space with full `.dark` class override in `src/styles.css`.
- **PWA manifest branded.** `manifest.json` already references "Nu Graphix Studio" with proper icons.
- **MCP triple-configuration.** `.mcp.json` (root/Windows), `.vscode/mcp.json` (VSCode), `.codex/config.toml` (Codex) — all three configured for shadcn and Context7.
- **13 shadcn/ui components already installed** (button, card, input, label, select, alert-dialog, badge, combobox, dropdown-menu, field, input-group, separator, textarea).
- **Production-grade debug protocol** (Phase 05) with 3-failure rule, structured workflow, root cause classification, and AI mistakes log requirement.

---

## Gaps / Missing Pieces

| # | Gap | Priority | Source |
|---|-----|----------|--------|
| 1 | **No GitHub Actions CI workflow.** Phase 06 mandates CI on every push to `dev`/`main` (typecheck, lint, build, test). `.github/workflows/` does not exist. | Critical | Phase 06 |
| 2 | **No `src/lib/` implementation files.** All 7 subdirectories (`auth/`, `db/`, `email/`, `errors/`, `observability/`, `rateLimit/`, `search/`) are empty. Week 1 requires `auth.ts`, `session.ts`, `client.ts`, `AppError.ts`, `toServerFail.ts`, `logger.ts`. | High | Week 01, Phase 03 |
| 3 | **No `src/features/` directories.** Phase 03 specifies feature-first structure (`src/features/<feature>/components\|server\|schemas\|types\|utils`). Currently empty. | High | Phase 03 |
| 4 | **Core backend dependencies not installed.** `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `better-auth`, `zod`, `@sentry/react`, `@sentry/vite-plugin`, `@sendgrid/mail`, `prosekit` referenced in Week 0 but absent from `package.json`. | High | Week 00 |
| 5 | **No `docs/ai-mistakes.md`.** Phase 05 mandates this as required documentation infrastructure. | Medium | Phase 05 |
| 6 | **No `.env.local` scaffold.** Week 0 checklist requires placeholder env files. Only `.env.example` exists. | Medium | Week 00 |
| 7 | **`CONTEXT7_API_KEY` missing from `.env.example`.** MCP configs reference this variable but it's not in the template. | Low | MCP configs |
| 8 | **TanStack logos still in `public/`.** `tanstack-circle-logo.png` and `tanstack-word-logo-white.svg` remain from starter template. ADR-0006 requires Nu Graphix branding. | Low | ADR-0006 |
| 9 | **`manifest.json` theme_color is `#000000`.** Should align with cyan primary from design system. | Low | ADR-0006, Phase 02 |
| 10 | **No `src/hooks/` directory.** `components.json` defines `@/hooks` alias but directory doesn't exist. | Low | components.json |

---

## Security Observations

| # | Observation | Status | Priority |
|---|------------|--------|----------|
| 1 | **XSS risk for ProseKit is documented but not yet enforced.** ADR-0004 and Phase 04 specify no `dangerouslySetInnerHTML` without sanitization, no `javascript:` protocols, CSP restrictions. No sanitization library in `package.json`, no CSP headers configured. Acceptable at bootstrap — must be addressed before content rendering is built. | Documented, not enforced | High (when building) |
| 2 | **Rate limiting has no implementation path defined.** Phase 03/04 specify `lib/rateLimit/limiter.ts` and Cloudflare edge rate limiting, but no specific library or Workers config documented. Decision needed: Cloudflare-only vs. application-level vs. both. | Design gap | Medium |
| 3 | **Auth rules are consistent and well-documented.** Better Auth + cookie-based sessions + SameSite + server-side role enforcement specified uniformly across AI.md, Phase 03, Phase 04, ADR-0003. No contradictions. | Clean | N/A |
| 4 | **Environment isolation relies on discipline, not tooling.** No validation that production secrets can't leak into `.env.local`. Consider adding env validation to CI (e.g., `envalid` or `@t3-oss/env-core`). | Risk | Medium |
| 5 | **Logging hygiene rules are thorough.** The "never log" list (passwords, tokens, secrets, raw content_json, email bodies) is repeated consistently in Phase 03, Phase 04, Phase 05, ADR-0005. | Clean | N/A |
| 6 | **No CSP headers configured yet.** Phase 04 and ADR-0004 require CSP in production. Roadmap places this in Week 6 hardening — acceptable timing. | Planned | Low (for now) |

---

## Architectural Drift Risks

1. **Starter template artifacts in source tree.** `src/components/example.tsx` and `src/components/component-example.tsx` demonstrate shadcn/ui but don't align with feature-first architecture. `src/routes/index.tsx` renders `ComponentExample` as the home page. These should be removed before feature work begins to prevent confusion about where UI code lives.

2. **Theme token drift risk (low but present).** `src/styles.css` uses OKLCH values from the shadcn preset. Phase 02 describes "cyan primary, emerald accent, slate neutral." The OKLCH hues approximate the right values (primary ~222deg = cyan, accent ~163deg = emerald), but there's no documentation mapping specific OKLCH values to design system names. A comment-level token reference would prevent drift.

3. **No `drizzle.config.ts` exists yet.** When Drizzle is installed, config must align with ADR-0002 (Neon serverless driver, `src/lib/db/` schema location). A developer could scaffold Drizzle with defaults that don't match documented architecture.

4. **`src/logo.svg` in source root.** This is a TanStack starter asset sitting at the root of `src/`. Should be either replaced with Nu Graphix logo or removed.

---

## Tooling / MCP Observations

| Item | Status | Notes |
|------|--------|-------|
| MCP servers configured (shadcn + Context7) | Confirmed | All three tools (Claude, VSCode, Codex) have matching configs |
| Windows compatibility | Confirmed | Root `.mcp.json` uses `cmd /c`, `.vscode/mcp.json` uses `${env:}` syntax, `.codex/config.toml` uses TOML stdio |
| `npx -y shadcn@latest` version pinning | Note | Always fetches latest — MCP behavior could change between sessions |
| Sentry Vite plugin not in `vite.config.ts` | Gap | Needs adding when Sentry is integrated (Week 1) |
| ESLint config is minimal (TanStack defaults) | Note | No custom rules for `ServerResult` enforcement, `any` banning, or `dangerouslySetInnerHTML` banning. Valuable but not blocking. |
| Vitest configured with test script | Confirmed | No test files exist yet — infrastructure ready, tests needed alongside features |
| `.editorconfig` enforces LF + 2-space indent | Confirmed | Matches prettier config, prevents Windows CRLF issues |
| VSCode extensions recommended | Confirmed | Prettier, ESLint, Tailwind, Vitest, GitLens, Code Spell Checker |

---

## Documentation Gaps

1. **Missing: `docs/ai-mistakes.md`** — Phase 05 mandates this file as required infrastructure. Should be created with the template (Date, Feature, Phase, Environment, Mistake, Root Cause, Detection Signal, Prevention Rule, Severity).

2. **Missing: ADR for testing strategy.** Phases 03/04 mention "tests pass (if applicable)" but no ADR defines what testing looks like — unit vs. integration vs. e2e, coverage targets, patterns for server functions vs. UI components. Recommend ADR-0007.

3. **Missing: ADR for email deliverability.** SendGrid is specified but SPF/DKIM/DMARC, sender verification, and bounce handling are undocumented. Critical for contact form and email notifications.

4. **Analytics tool undecided.** Phase 01 mentions "Umami or Plausible" — no ADR or decision exists. Minor for now; needed before Week 7.

5. **No feature flag / gradual rollout strategy.** Phase 06 deployment is all-or-nothing. Acceptable for solo MVP; should be noted for future SaaS phase.

6. **Agent skills 01-07 exist and are properly indexed.** Hierarchy over `.agents/skills/` packs is clearly stated in `00-index.md`. No conflict detected.

---

## Overengineering Warnings

1. **Phase 07 (SaaS Readiness) is extensive for a pre-MVP repo.** ~40 pages of org model, RLS activation, background jobs, data portability. Well-written and clearly labeled "design only" — but volume could distract. **Recommendation:** Phase 07 remains as reference; agents should NOT implement Phase 07 patterns until explicitly instructed.

2. **7 agent skill protocols + 13 skill packs is a heavy governance layer.** For solo development this is comprehensive but could create friction if an agent reconciles conflicting guidance. The hierarchy (`docs/agent` > `.agents/skills`) is clearly stated — this mitigates the risk.

3. **The 3-failure debug rule and postmortem protocol are rigorous for solo pre-MVP.** Not overengineered (they'll pay dividends) — but enforcement depends entirely on discipline since there's no automation to back it.

4. **No premature abstractions in code.** `src/lib/utils.ts` contains only the standard `cn()` helper. No unnecessary wrappers, no DI containers, no over-abstracted patterns. The codebase is clean.

---

## Pre-Week-1 Action Checklist

- [ ] **Create `.github/workflows/ci.yml`** — typecheck + lint + build on push to `dev`/`main`. Single most critical missing piece per Phase 06.
- [ ] **Install core backend dependencies** — `drizzle-orm`, `drizzle-kit`, `@neondatabase/serverless`, `zod`, `better-auth` per Week 0 manifest.
- [ ] **Remove starter template artifacts** — delete `src/components/example.tsx`, `src/components/component-example.tsx`, `src/logo.svg`, and TanStack logos from `public/`.
- [ ] **Create `docs/ai-mistakes.md`** with the template from Phase 05.
- [ ] **Add `CONTEXT7_API_KEY` to `.env.example`** for consistency with MCP configs.
- [ ] **Update `manifest.json` theme_color** from `#000000` to cyan primary (approx `#0891b2`).
- [ ] **Create `src/hooks/` directory** to match the `@/hooks` alias in `components.json`.
- [ ] **Scaffold `.env.local`** with placeholders matching `.env.example` per Week 0 checklist.
- [ ] **Add token reference comment** at top of `src/styles.css` mapping OKLCH variables to design system names (primary=cyan, accent=emerald, neutral=slate).
- [ ] **Verify `pnpm typecheck && pnpm lint && pnpm build`** all pass cleanly before beginning Week 1 work.
