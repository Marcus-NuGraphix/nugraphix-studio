export interface ShareData {
  url: string
  title: string
  description?: string
}

/**
 * Resolve a canonical URL to an absolute URL suitable for sharing.
 * Falls back to the current page URL when no canonical is provided.
 */
export function resolveShareUrl(canonicalUrl?: string | null): string {
  const normalizedCanonical = canonicalUrl?.trim()

  if (typeof window === 'undefined') return normalizedCanonical ?? ''
  if (!normalizedCanonical) return window.location.href

  try {
    return new URL(normalizedCanonical, window.location.origin).toString()
  } catch {
    return window.location.href
  }
}

// ---------------------------------------------------------------------------
// Popup helper
// ---------------------------------------------------------------------------

function openPopup(url: string, width = 600, height = 500): void {
  if (typeof window === 'undefined') return

  const left = Math.round(window.screenX + (window.outerWidth - width) / 2)
  const top = Math.round(window.screenY + (window.outerHeight - height) / 2)
  const popup = window.open(
    url,
    'share',
    `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`,
  )

  if (popup) {
    popup.focus()
    return
  }

  // Fallback when popups are blocked.
  window.location.href = url
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const collapseWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim()

/**
 * Build a share blurb from title + optional description.
 * Keeps it concise for character-limited platforms.
 */
function buildShareText(data: ShareData, maxLength?: number): string {
  const title = collapseWhitespace(data.title)
  const description = data.description
    ? collapseWhitespace(data.description)
    : undefined

  if (!description) return title

  const full = `${title} - ${description}`
  if (!maxLength || full.length <= maxLength) return full

  const clipped = full.slice(0, Math.max(1, maxLength - 1)).trim()
  return `${clipped}...`
}

// ---------------------------------------------------------------------------
// Platform share actions
//
// Facebook & LinkedIn pull content from OG meta tags on the shared URL.
// They do NOT accept inline text — the preview card (title, description,
// image) is determined by what their crawler finds at the URL.
//
// X, WhatsApp, and Email DO accept inline content, so we pass the article
// title + description to those platforms.
// ---------------------------------------------------------------------------

export function shareOnX(data: ShareData): void {
  // X allows ~280 chars total; the URL shortens to ~23 chars.
  const text = buildShareText(data, 250)
  const params = new URLSearchParams({ text, url: data.url })
  openPopup(`https://twitter.com/intent/tweet?${params.toString()}`, 600, 300)
}

export function shareOnFacebook(data: ShareData): void {
  // Facebook ignores inline text — it crawls the URL for og:title,
  // og:description, and og:image. The `quote` param shows as a
  // highlighted excerpt the user can optionally include.
  const params = new URLSearchParams({
    u: data.url,
    quote: buildShareText(data),
  })
  openPopup(
    `https://www.facebook.com/sharer/sharer.php?${params.toString()}`,
    600,
    500,
  )
}

export function shareOnLinkedIn(data: ShareData): void {
  // LinkedIn only accepts a URL and renders its own preview from OG tags.
  const params = new URLSearchParams({ url: data.url })
  openPopup(
    `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`,
    600,
    600,
  )
}

export function shareOnWhatsApp(data: ShareData): void {
  const lines = [data.title]
  if (data.description) lines.push(data.description)
  lines.push(data.url)
  const params = new URLSearchParams({ text: lines.join('\n\n') })
  openPopup(`https://wa.me/?${params.toString()}`, 600, 500)
}

export function shareViaEmail(data: ShareData): void {
  if (typeof window === 'undefined') return
  const subject = encodeURIComponent(data.title)
  const lines = []
  if (data.description) lines.push(data.description)
  lines.push(data.url)
  const body = encodeURIComponent(lines.join('\n\n'))
  window.location.href = `mailto:?subject=${subject}&body=${body}`
}

// ---------------------------------------------------------------------------
// Clipboard
// ---------------------------------------------------------------------------

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false
  }

  const clipboard = (
    navigator as unknown as {
      clipboard?: { writeText?: (value: string) => Promise<void> }
    }
  ).clipboard

  try {
    if (typeof clipboard?.writeText === 'function') {
      await clipboard.writeText(text)
      return true
    }
  } catch {
    // Attempt legacy fallback below.
  }

  if (typeof document === 'undefined') {
    return false
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  try {
    const copied = document.execCommand('copy')
    document.body.removeChild(textarea)
    return copied
  } catch {
    document.body.removeChild(textarea)
    return false
  }
}

// ---------------------------------------------------------------------------
// Native Web Share API
// ---------------------------------------------------------------------------

export function canNativeShare(): boolean {
  return (
    typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  )
}

export async function nativeShare(data: ShareData): Promise<boolean> {
  if (!canNativeShare()) return false

  const payload = {
    title: data.title,
    text: data.description ?? data.title,
    url: data.url,
  }

  try {
    if (
      typeof navigator.canShare === 'function' &&
      !navigator.canShare(payload)
    ) {
      return false
    }

    await navigator.share(payload)
    return true
  } catch {
    return false
  }
}
