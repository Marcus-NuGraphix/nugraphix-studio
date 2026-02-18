# Component Audit Artifact (2026-02-18)

## Scope

- `src/components/*`
- `src/features/*/ui/*`

## Evidence Commands

```powershell
rg --files src/components/ui
rg --files src/components
rg --files src/features | Where-Object { $_ -match '[\\/]+ui[\\/]+' }
git log --since="2025-12-01" --pretty=format: --name-only -- src/components src/features
rg -n "(bg|text|border|from|to|via|ring|stroke|fill)-(...)-[0-9]{2,3}" src/components src/features
rg -n "#[0-9A-Fa-f]{3,8}" src/components src/features
rg -n "@/features/" src/components
```

## Inventory Counts

- Shared primitives (`src/components/ui/*`): `55`
- Shared composition (`src/components/*` excluding `ui/*`): `59`
- Feature UI (`src/features/*/ui/*`): `55`

Feature UI distribution:

- `users`: 16
- `contact`: 9
- `media`: 9
- `email`: 8
- `auth`: 5
- `blog`: 5
- `observability`: 1

## High-Churn Files (since 2025-12-01)

- `7` `src/components/navigation/site-header.tsx`
- `5` `src/components/navigation/admin/navigation.ts`
- `4` `src/features/auth/ui/signup-form.tsx`
- `4` `src/features/auth/ui/login-form.tsx`
- `4` `src/components/theme/theme-toggle.tsx`
- `3` `src/components/ui/input-otp.tsx`
- `3` `src/components/ui/input-group.tsx`
- `3` `src/components/ui/dropdown-menu.tsx`

## Notable Drift Findings

- Shared-layer feature coupling:
  - `src/components/navigation/site-header.tsx`
  - `src/components/navigation/site-footer.tsx`
  - `src/components/navigation/admin/admin-sidebar.tsx`
- Token exceptions:
  - `src/components/ui/chart.tsx` (`#ccc`, `#fff` selector literals)
  - `src/features/email/server/templates.server.tsx` (email HTML inline hex colors)

## Accessibility Heuristic Check

Dialog/sheet title scan did not identify missing `DialogTitle`/`SheetTitle` in
checked TSX files under the scope above.
