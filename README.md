# Nu Graphix Studio

Full-stack application built with TanStack Start serving as a public marketing site, internal admin system (CMS + Knowledge Base), and foundation for vertical SaaS products.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | TanStack Start (React 19, Vite, Nitro SSR) |
| Routing | TanStack Router (file-based) |
| Styling | Tailwind CSS v4 + shadcn/ui + CVA |
| Database | Neon Postgres (Singapore) + Drizzle ORM |
| Auth | Better Auth (email/password) |
| Validation | Zod |
| CI | GitHub Actions |

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Fill in DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL

# Push schema to database
pnpm db:push

# Start dev server
pnpm dev
```

The app runs at `http://localhost:3000`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (port 3000) |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Auto-fix lint issues |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm format` | Format with Prettier |
| `pnpm test` | Run Vitest |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:push` | Push schema to database |

## Project Structure

```
src/
  routes/           File-based routing
  features/         Feature-organized business logic
  lib/              Core infrastructure (auth, db, errors)
  components/       UI components (shadcn/ui, brand, theme)
docs/
  adr/              Architecture Decision Records
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for full details.

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — Architecture reference, patterns, and stack overview
- [CONTRIBUTING.md](CONTRIBUTING.md) — Branch strategy and commit conventions
- [docs/adr/](docs/adr/) — Architecture Decision Records (ADR-0001 through ADR-0010)
