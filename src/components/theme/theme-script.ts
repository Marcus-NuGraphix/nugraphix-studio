import { COOKIE_MAX_AGE_SECONDS, THEME_COOKIE_NAME } from './constants'

/**
 * Blocking inline script that runs before first paint.
 * Reads the theme cookie and applies the correct class to <html>.
 * This prevents the flash-of-wrong-theme (FOWT) in SSR apps.
 *
 * IMPORTANT: This script is serialized as a string and injected via
 * dangerouslySetInnerHTML in the <head>. It must be self-contained —
 * no imports, no closures over module scope.
 */
export const themeScript = /* js */ `(function(){
  var cookieName = '${THEME_COOKIE_NAME}';
  var darkQuery = '(prefers-color-scheme: dark)';
  var root = document.documentElement;

  function readCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function writeCookie(value) {
    document.cookie =
      cookieName +
      '=' +
      encodeURIComponent(value) +
      ';max-age=${COOKIE_MAX_AGE_SECONDS};path=/;SameSite=Lax';
  }

  function isValidTheme(value) {
    return value === 'light' || value === 'dark' || value === 'system';
  }

  var theme = readCookie(cookieName);
  if (!isValidTheme(theme)) {
    theme = 'system';
    writeCookie(theme);
  }

  var resolved =
    theme === 'system'
      ? (window.matchMedia(darkQuery).matches ? 'dark' : 'light')
      : theme;

  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
})()`
