export const THEME_COOKIE_NAME = 'ui-theme'
export const COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60
export const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)'

export const themeValues = ['light', 'dark', 'system'] as const
export type Theme = (typeof themeValues)[number]

export const resolvedThemeValues = ['light', 'dark'] as const
export type ResolvedTheme = (typeof resolvedThemeValues)[number]
