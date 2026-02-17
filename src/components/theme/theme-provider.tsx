import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  COOKIE_EXPIRY_DAYS,
  DARK_MODE_MEDIA_QUERY,
  MILLISECONDS_PER_DAY,
  THEME_CLASSES,
  THEME_COOKIE_NAME,
} from './constants'

export type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
)

const getThemeFromCookie = (cookieName: string): Theme | null => {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`))
  return match ? (match[2] as Theme) : null
}

const setCookie = (
  name: string,
  value: string,
  days: number = COOKIE_EXPIRY_DAYS,
) => {
  if (typeof document === 'undefined') return
  const expires = new Date(
    Date.now() + days * MILLISECONDS_PER_DAY,
  ).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = getThemeFromCookie(THEME_COOKIE_NAME)

    if (savedTheme) {
      setThemeState(savedTheme)
    } else {
      setThemeState('system')
      setCookie(THEME_COOKIE_NAME, 'system')
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove(THEME_CLASSES.LIGHT, THEME_CLASSES.DARK)

    if (theme === 'system') {
      const systemTheme = window.matchMedia(DARK_MODE_MEDIA_QUERY).matches
        ? THEME_CLASSES.DARK
        : THEME_CLASSES.LIGHT

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted || theme !== 'system') return

    const mediaQuery = window.matchMedia(DARK_MODE_MEDIA_QUERY)

    const handleChange = () => {
      const root = window.document.documentElement
      root.classList.remove(THEME_CLASSES.LIGHT, THEME_CLASSES.DARK)

      const systemTheme = mediaQuery.matches
        ? THEME_CLASSES.DARK
        : THEME_CLASSES.LIGHT

      root.classList.add(systemTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, mounted])

  const value: ThemeProviderState = {
    theme,
    setTheme: (nextTheme: Theme) => {
      setCookie(THEME_COOKIE_NAME, nextTheme)
      setThemeState(nextTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
