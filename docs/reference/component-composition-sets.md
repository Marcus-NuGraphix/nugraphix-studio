# Shared Component Composition Sets

Last updated: 2026-02-18

This reference defines the first composition-layer component sets built on top
of `src/components/ui` primitives.

## Purpose

Keep `routes/` and `features/` focused on domain logic by centralizing shared,
reusable view composition in `src/components/*`.

## New Component Sets

### 1. Layout Set (`src/components/layout`)

- `app-shell.tsx`: shared shell wrapper for sidebar + topbar + content areas.
- `top-bar.tsx`: responsive top bar with title/subtitle/slot regions.
- `page-header.tsx`: standardized page title/description/action header block.

Primary dependencies:

- `@/components/ui/sidebar`
- `@/hooks/use-mobile`
- `@/lib/utils` (`cn`)

### 2. Metrics Set (`src/components/metrics`)

- `stat-card.tsx`: reusable KPI/stat surface with optional trend and icon.
- `web-performance-dashboard.tsx`: composable Core Web Vitals and resource
  health dashboard panel for admin monitoring surfaces.

Primary dependencies:

- `@/components/ui/card`
- tokenized tone mapping based on ADR-0014 (`accent`, `destructive`, `muted`)

### 3. Forms Set (`src/components/forms`)

- `search-input.tsx`: normalized search field with loading/clear behavior.
- `tag-picker.tsx`: controlled tag input with keyboard support and dedupe.

Primary dependencies:

- `@/components/ui/input-group`, `@/components/ui/input`, `@/components/ui/badge`
- `@/hooks/use-mobile`
- `@/lib/utils` (`cn`, `generate-slug`)

### 4. Editor Set (`src/components/editor`)

- `editor-shell.tsx`: standardized editor control block (title/slug/status + actions)
  and content/metadata panel layout.

Primary dependencies:

- `@/components/ui/card`, `@/components/ui/select`, `@/components/ui/input`
- `@/hooks/use-mobile`
- `@/lib/utils` (`cn`, `generate-slug`)

### 5. Marketing Set (`src/components/marketing`)

- `news-feed.tsx`: filterable editorial feed composition with search, category
  chips, and optional open/share/bookmark actions.

Primary dependencies:

- `@/components/ui/avatar`, `@/components/ui/badge`, `@/components/ui/button`,
  `@/components/ui/input`
- `framer-motion`
- token-safe color pairings per ADR-0027

### 6. Feedback Set (`src/components/feedback`)

- `notification-center.tsx`: expandable, dismissible notification stack for
  status and recovery messaging demos.

Primary dependencies:

- `@/components/ui/card`, `@/components/ui/button`, `@/components/ui/badge`
- `framer-motion`
- semantic status token mapping (`accent`, `destructive`, `primary`,
  `secondary`)

## Integration Order (Recommended)

1. Admin CMS routes (`/admin/content/posts/*`) adopt `EditorShell` + `PageHeader`.
2. Admin dashboard/home routes adopt `StatCard` + `WebPerformanceDashboard`.
3. Public blog surfaces adopt `NewsFeed` for quick-filter editorial previews.
4. Feature screens with list filtering adopt `SearchInput`.
5. Content taxonomy/tag workflows adopt `TagPicker`.
6. Admin component demos and status workflows adopt `NotificationCenter`.

## Guardrails

- Keep business logic in feature modules/server functions, not shared components.
- Use token classes only (`bg-card`, `text-muted-foreground`, etc.).
- Prefer composition over introducing new primitives where existing `ui/*` covers the need.
