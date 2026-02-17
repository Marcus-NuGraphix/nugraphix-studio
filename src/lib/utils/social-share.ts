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
  if (typeof window === 'undefined') return canonicalUrl ?? ''
  if (!canonicalUrl) return window.location.href

  try {
    return new URL(canonicalUrl, window.location.origin).toString()
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
  window.open(
    url,
    'share',
    `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`,
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a share blurb from title + optional description.
 * Keeps it concise for character-limited platforms.
 */
function buildShareText(data: ShareData, maxLength?: number): string {
  const { title, description } = data
  if (!description) return title
  const full = `${title} — ${description}`
  if (!maxLength || full.length <= maxLength) return full
  return `${full.slice(0, maxLength - 1)}…`
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
  openPopup(`https://x.com/intent/post?${params.toString()}`, 600, 300)
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
  if (typeof window === 'undefined') return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
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
  try {
    await navigator.share({
      title: data.title,
      text: data.description ?? data.title,
      url: data.url,
    })
    return true
  } catch {
    return false
  }
}
