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
  var c = '${THEME_COOKIE_NAME}';
  var m = document.cookie.match(new RegExp('(^| )' + c + '=([^;]+)'));
  var t = m ? m[2] : null;
  var d = '(prefers-color-scheme: dark)';
  var r = document.documentElement;

  if (!t) {
    t = 'system';
    document.cookie = c + '=system;max-age=${COOKIE_MAX_AGE_SECONDS};path=/;SameSite=Lax';
  }

  var resolved = t === 'system'
    ? (window.matchMedia(d).matches ? 'dark' : 'light')
    : t;

  r.classList.add(resolved);
})()`
