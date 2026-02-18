# Nu Graphix Studio

Full-stack TanStack Start application for Nu Graphix public marketing,
admin operations, and future productization.

## Stack

| Layer | Technology |
| --- | --- |
| Framework | TanStack Start (React 19, Vite, Nitro SSR) |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS v4 + shadcn/ui + CVA |
| Database | Neon Postgres + Drizzle ORM |
| Auth | Better Auth |
| Validation | Zod |
| CI | GitHub Actions |

## Getting Started

```bash
pnpm install
cp .env.example .env.local
pnpm db:push
pnpm dev
```

App URL: `http://localhost:3000`

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start dev server (port 3000) |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm test` | Run Vitest |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:push` | Push schema changes |

## Project Structure

```text
src/
  routes/        File-based routing
  features/      Feature modules (auth, users, contact, email)
  lib/           Shared infrastructure
  components/    UI primitives and composition sets
docs/
  adr/           ADR summary + archive
  plans/         Active roadmap + archived plans
  phases/        Execution phase board
  reference/     Technical contract references
  audits/        Audit workflow and snapshots
  agent/         Agent operating contract
```

## Documentation

- `ARCHITECTURE.md` - architecture reference and implementation standards
- `AI.md` - AI execution constraints and read-first contract
- `CONTRIBUTING.md` - branch, commit, and release discipline
- `docs/README.md` - full documentation index
- `docs/adr/ADR-SUMMARY-0001-0022.md` - consolidated ADR summary
- `docs/plans/ROADMAP-2026-BLOG-MVP.md` - active delivery roadmap

## ADR Status

- ADR archive is complete for `0001` through `0022`.
- Next ADR number: `0023`.
