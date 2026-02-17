# WEEK 0 — Foundation & Repo Bootstrapping

**Goal:** Get the skeleton running with zero feature complexity. 

## 0) Pre-flight (5 minutes)

**Decisions you’ve already made (locked):**

* Package manager: `pnpm`
* UI preset: shadcn + Radix + Nova + theme cyan + lucide + inter
* Framework template: `start` (TanStack Start)

**Quick checks**

* Node LTS installed (18+ / 20+ recommended)
* `pnpm -v` works
* Git installed and signed in (GitHub)

---

## 1) Create the project (your command)

From your workspace root (where you want the repo folder created):

```bash
pnpm dlx shadcn@latest create \
  --preset "https://ui.shadcn.com/init?base=radix&style=nova&baseColor=gray&theme=cyan&iconLibrary=lucide&font=inter&menuAccent=bold&menuColor=default&radius=default&template=start&rtl=false" \
  --template start
```

### Immediately after creation

```bash
cd <your-created-folder>
pnpm install
pnpm dev
```

**Acceptance criteria (Week 0 gate #1):**

* App boots
* No TS errors
* No runtime error in console
* Dark mode switch (or class strategy) works as expected

---

## 2) Initialize Git the Nu Graphix way

Inside repo:

```bash
git init
git add .
git commit -m "chore: bootstrap TanStack Start + shadcn preset"
```

Create branches:

```bash
git checkout -b dev
git checkout -b main
git checkout dev
```

**Repo rule reminder (from Phase 3):**

* Work on `feature/*` branches
* Merge to `dev`, then release to `main`

---

## 3) TypeScript strict mode + baseline correctness

Your goal is to ensure strictness is truly on and no “any leaks” slip in.

### Tasks

* Confirm `tsconfig.json` has:

  * `"strict": true`
  * `"noUncheckedIndexedAccess": true` (recommended)
  * `"exactOptionalPropertyTypes": true` (optional but helpful)

**Acceptance criteria (Week 0 gate #2):**

* `pnpm typecheck` (or equivalent) passes cleanly

---

## 4) Tailwind + shadcn tokens + dark mode (verify, don’t redesign)

Since your preset already seeds a theme, Week 0 is about verification + minor alignment.

### Tasks

* Confirm Tailwind is working
* Confirm shadcn theme variables exist (CSS variables)
* Confirm dark mode strategy is set (class-based strongly preferred)
* Confirm cyan is your primary accent, gray base

**Acceptance criteria (Week 0 gate #3):**

* Light/dark renders correctly across:

  * buttons
  * cards
  * inputs
  * typography

---

## 5) Add linting + formatting (Nu Graphix standard)

Week 0 requires eslint + prettier so you don’t fight formatting later. 

### Tasks

* Add ESLint config for:

  * TypeScript
  * React
  * import sorting (optional)
* Add Prettier config (and optionally Tailwind class sorting)

### Scripts to add (package.json)

* `lint`
* `format`
* `typecheck`

**Acceptance criteria (Week 0 gate #4):**

* `pnpm lint` passes
* `pnpm format` runs and is stable
* repo has consistent formatting

---

## 6) Install core dependencies (but don’t integrate yet)

Week 0 installs only. Integration starts Week 1+. 

### Install groups (recommended)

#### Core backend/data

```bash
pnpm add drizzle-orm drizzle-kit @neondatabase/serverless zod
```

#### Auth

```bash
pnpm add better-auth
```

#### TanStack ecosystem (some already included via template)

```bash
pnpm add @tanstack/react-query @tanstack/react-table
```

#### ProseKit

```bash
pnpm add prosekit
```

*(If ProseKit requires additional packages based on which extensions you use, we’ll add them when implementing editor in Week 3.)*

#### Observability

```bash
pnpm add @sentry/react @sentry/vite-plugin
```

#### Email + Turnstile

```bash
pnpm add @sendgrid/mail
pnpm add zod # (already installed above, just noting it’s required for input validation)
```

Turnstile verification usually uses `fetch` to Cloudflare’s siteverify endpoint (no special SDK required). So we’ll implement it as a `lib/turnstile/verify.ts` utility later.

**Acceptance criteria (Week 0 gate #5):**

* Install completes
* Build still passes after install

---

## 7) Create the Nu Graphix folder structure

This is a Week 0 requirement. 

Create these empty folders + placeholder `README.md` files where helpful:

```
src/
  features/
  lib/
    auth/
    db/
    email/
    errors/
    observability/
    rateLimit/
    search/
  ui/
docs/
```

Add a `docs/README.md` describing the docs layout.

**Acceptance criteria (Week 0 gate #6):**

* Structure exists
* No “random utils dumping ground”
* Future work has a clear home

---

## 8) Environment files (scaffold only)

Week 0 creates the files; Week 1 populates them.

Create:

* `.env.local`
* `.env.staging`
* `.env.production`

And add `.env*` to `.gitignore`.

### Define keys (placeholders)

Add placeholders (not real values) for:

* `DATABASE_URL`
* `BETTER_AUTH_SECRET`
* `SENDGRID_API_KEY`
* `TURNSTILE_SECRET_KEY`
* `TURNSTILE_SITE_KEY` (PUBLIC safe key)
* `SENTRY_DSN`

**Acceptance criteria (Week 0 gate #7):**

* env files exist
* no secrets committed
* app still runs locally

---

## 9) Setup CI (minimum viable)

Week 0 requires GitHub Actions: typecheck, lint, build. 

### Tasks

Create `.github/workflows/ci.yml` that runs on PRs and pushes to:

* `dev`
* `main`

Steps:

* checkout
* install pnpm
* install deps
* `pnpm lint`
* `pnpm typecheck`
* `pnpm build`

**Acceptance criteria (Week 0 gate #8):**

* CI passes on first PR

---

## 10) Week 0 “done” checklist (copy/paste)

* [ ] Project created with your shadcn preset
* [ ] `pnpm dev` works
* [ ] Git initialized + `main` / `dev` created
* [ ] TypeScript strict confirmed
* [ ] ESLint + Prettier installed + scripts added
* [ ] Core dependencies installed (no integration yet)
* [ ] Folder structure created (`features/`, `lib/`, `ui/`, `docs/`)
* [ ] `.env.local/.staging/.production` created + ignored
* [ ] CI workflow created and passing

---
