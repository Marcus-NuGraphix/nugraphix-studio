import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  COOKIE_MAX_AGE_SECONDS,
  DARK_MODE_MEDIA_QUERY,
  THEME_COOKIE_NAME,
} from './constants'
import type { ReactNode } from 'react'
import type { ResolvedTheme, Theme } from './constants'

export type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
)
ThemeContext.displayName = 'ThemeContext'

function getThemeFromCookie(): Theme | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp(`(^| )${THEME_COOKIE_NAME}=([^;]+)`),
  )
  const value = match ? decodeURIComponent(match[2]) : null
  return value === 'light' || value === 'dark' || value === 'system'
    ? value
    : null
}

function persistTheme(value: Theme) {
  if (typeof document === 'undefined') return
  const secure = window.location.protocol === 'https:' ? ';Secure' : ''
  document.cookie = `${THEME_COOKIE_NAME}=${encodeURIComponent(value)};max-age=${COOKIE_MAX_AGE_SECONDS};path=/;SameSite=Lax${secure}`
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === 'system' ? getSystemTheme() : theme
}

function applyThemeToDOM(resolved: ResolvedTheme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: {
  children: ReactNode
  defaultTheme?: Theme
}) {
  // Initialize from cookie immediately — the blocking script has already
  // applied the class to <html>, so this keeps React state in sync.
  const [theme, setThemeState] = useState<Theme>(
    () => getThemeFromCookie() ?? defaultTheme,
  )
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(theme),
  )

  const setTheme = useCallback((next: Theme) => {
    persistTheme(next)
    setThemeState(next)
  }, [])

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const resolved = resolveTheme(theme)
    setResolvedTheme(resolved)
    applyThemeToDOM(resolved)
  }, [theme])

  // Listen for OS theme changes when in system mode
  useEffect(() => {
    if (theme !== 'system' || typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(DARK_MODE_MEDIA_QUERY)
    const handleChange = () => {
      const resolved = getSystemTheme()
      setResolvedTheme(resolved)
      applyThemeToDOM(resolved)
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [theme])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
