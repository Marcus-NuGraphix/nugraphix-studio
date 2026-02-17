import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import {
  COOKIE_MAX_AGE_SECONDS,
  DARK_MODE_MEDIA_QUERY,
  THEME_COOKIE_NAME,
} from './constants'

export type Theme = 'dark' | 'light' | 'system'

type ThemeProviderState = {
  theme: Theme
  resolvedTheme: 'dark' | 'light'
  setTheme: (theme: Theme) => void
}

export const ThemeContext = createContext<ThemeProviderState | undefined>(
  undefined,
)

function getThemeFromCookie(): Theme | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp(`(^| )${THEME_COOKIE_NAME}=([^;]+)`),
  )
  return match ? (match[2] as Theme) : null
}

function persistTheme(value: Theme) {
  if (typeof document === 'undefined') return
  document.cookie = `${THEME_COOKIE_NAME}=${value};max-age=${COOKIE_MAX_AGE_SECONDS};path=/;SameSite=Lax`
}

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches ? 'dark' : 'light'
}

function resolveTheme(theme: Theme): 'dark' | 'light' {
  return theme === 'system' ? getSystemTheme() : theme
}

function applyThemeToDOM(resolved: 'dark' | 'light') {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: {
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  // Initialize from cookie immediately — the blocking script has already
  // applied the class to <html>, so this keeps React state in sync.
  const [theme, setThemeState] = useState<Theme>(
    () => getThemeFromCookie() ?? defaultTheme,
  )
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(() =>
    resolveTheme(theme),
  )

  const setTheme = useCallback((next: Theme) => {
    persistTheme(next)
    setThemeState(next)
    const resolved = resolveTheme(next)
    setResolvedTheme(resolved)
    applyThemeToDOM(resolved)
  }, [])

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const resolved = resolveTheme(theme)
    setResolvedTheme(resolved)
    applyThemeToDOM(resolved)
  }, [theme])

  // Listen for OS theme changes when in system mode
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia(DARK_MODE_MEDIA_QUERY)
    const handleChange = () => {
      const resolved = getSystemTheme()
      setResolvedTheme(resolved)
      applyThemeToDOM(resolved)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
