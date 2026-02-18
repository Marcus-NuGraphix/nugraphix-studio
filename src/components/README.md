# Components Layer

This directory provides the shared UI layer for Nu Graphix Studio.

## Structure

- `ui/`: primitive components (shadcn/Radix-style building blocks).
- `layout/`: shell-level composition (`AppShell`, `TopBar`, `PageHeader`).
- `metrics/`: reusable KPI/stat display surfaces (`StatCard`).
- `forms/`: common form composition (`SearchInput`, `TagPicker`).
- `editor/`: content editing shell composition (`EditorShell`).
- `navigation/`: public/admin navigation systems.
- `tables/`: TanStack Table wrappers and utilities.
- `marketing/`: public-page section composition and reusable card slider molecule.
- `brand/`, `theme/`, `errors/`, `empties/`: cross-cutting presentation utilities.

## Rules

- Build from `ui/*` primitives first before introducing new base components.
- Keep business logic in `features/*`; shared components stay presentation-focused.
- Use tokenized classes (`bg-card`, `text-muted-foreground`, etc.) per ADR-0014.
