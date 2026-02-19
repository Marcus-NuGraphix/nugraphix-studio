# ADR 0011 — Theme System & Dark Mode (SSR-Safe)

**Status:** Accepted
**Date:** 2026-02-17
**Related ADRs:**

- 0001 Project Foundation
- 0006 Brand System & Component Architecture

---

## Context

Nu Graphix Studio runs with SSR via TanStack Start (Nitro). The application supports light, dark, and system (OS preference) themes. The initial implementation used a client-side-only approach that caused a flash of wrong theme (FOWT) on every page load — the server rendered without a theme class, and the client applied it after hydration.

---

## Decision

### 1. Cookie-Based Persistence (Not localStorage)

Theme preference is stored in a cookie (`ui-theme`) rather than localStorage because:

- Cookies are available during SSR (via request headers) — enabling future server-side theme resolution
- Cookies are available in blocking scripts before React hydrates
- localStorage is not accessible during SSR, causing unavoidable mismatch

Cookie configuration:
- Name: `ui-theme`
- Values: `light`, `dark`, `system`
- Max-age: 1 year
- Path: `/`
- SameSite: `Lax`

### 2. Blocking Inline Script in `<head>`

A self-contained inline script runs **synchronously before first paint**:

```html
<head>
  <script>
    // Reads ui-theme cookie
    // Resolves 'system' → actual OS preference
    // Adds 'dark' or 'light' class to <html>
    // Sets cookie to 'system' if none exists (first visit)
  </script>
</head>
```

This eliminates FOWT because the browser never paints without the correct theme class. The script is defined in `theme-script.ts` and injected via `dangerouslySetInnerHTML` in the root shell component.

### 3. `suppressHydrationWarning` on `<html>`

The blocking script modifies `<html>` before React hydrates. Without `suppressHydrationWarning`, React would warn about the class mismatch between server HTML (no theme class) and client DOM (theme class added by script).

```tsx
<html lang="en" suppressHydrationWarning>
```

This is the standard pattern used by next-themes, Remix, and other SSR frameworks.

### 4. ThemeProvider Syncs React State

The `ThemeProvider` initializes state from the cookie (not from `useEffect`), keeping React state synchronized with what the blocking script already applied:

```ts
const [theme, setThemeState] = useState<Theme>(
  () => getThemeFromCookie() ?? defaultTheme,
)
```

The provider also:
- Exposes `resolvedTheme` (always `'dark'` or `'light'`, never `'system'`)
- Listens for OS theme changes when in system mode
- Updates both cookie and DOM class when theme changes

### 5. File Structure

```
src/components/theme/
  constants.ts          # Cookie name, max-age, media query
  theme-script.ts       # Blocking inline script (string)
  theme-provider.tsx    # React context provider
  use-theme.ts          # Consumer hook
  theme-toggle.tsx      # UI toggle component (shadcn dropdown)
```

### 6. CSS Configuration

Tailwind v4 with shadcn/ui uses class-based dark mode:

```css
@custom-variant dark (&:is(.dark *));
```

Theme variables are defined in `:root` (light) and `.dark` (dark) blocks in `styles.css`.

---

## Consequences

### Positive

- No flash of wrong theme on any page load (SSR or client navigation)
- Theme persists across sessions via cookie
- System preference is respected and tracked in real-time
- React state stays synchronized with DOM
- Standard pattern — same approach used by next-themes, Remix apps
- Cookie available for future server-side theme resolution if needed

### Trade-offs

- `dangerouslySetInnerHTML` used for the blocking script (safe — content is a build-time constant, not user input)
- `suppressHydrationWarning` suppresses legitimate warnings on `<html>` (acceptable — only the class attribute differs)
- Script duplicates constants from `constants.ts` as string literals (unavoidable for inline scripts)

---
