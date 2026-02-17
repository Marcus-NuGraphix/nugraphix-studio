type RecaptchaReadyCallback = () => void

interface GrecaptchaApi {
  ready: (callback: RecaptchaReadyCallback) => void
  execute: (siteKey: string, options: { action: string }) => Promise<string>
}

declare global {
  interface Window {
    grecaptcha?: GrecaptchaApi
    __cmsRecaptchaScriptPromise?: Promise<void>
  }
}

const RECAPTCHA_BASE_URL = 'https://www.google.com/recaptcha/api.js?render='

const waitForGrecaptchaReady = async () =>
  new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error('reCAPTCHA did not initialize in time.'))
    }, 8000)

    window.grecaptcha?.ready(() => {
      window.clearTimeout(timeout)
      resolve()
    })
  })

const loadRecaptchaScript = async (siteKey: string) => {
  if (window.__cmsRecaptchaScriptPromise) {
    return window.__cmsRecaptchaScriptPromise
  }

  if (window.grecaptcha) {
    window.__cmsRecaptchaScriptPromise = Promise.resolve()
    return window.__cmsRecaptchaScriptPromise
  }

  window.__cmsRecaptchaScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-cms-recaptcha="true"]',
    )

    if (existing) {
      if (window.grecaptcha) {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener(
        'error',
        () => reject(new Error('Failed to load reCAPTCHA script.')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = `${RECAPTCHA_BASE_URL}${encodeURIComponent(siteKey)}`
    script.async = true
    script.defer = true
    script.dataset.cmsRecaptcha = 'true'
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener(
      'error',
      () => reject(new Error('Failed to load reCAPTCHA script.')),
      { once: true },
    )
    document.head.appendChild(script)
  })

  return window.__cmsRecaptchaScriptPromise
}

export const executeRecaptcha = async ({
  siteKey,
  action,
}: {
  siteKey: string
  action: string
}) => {
  if (!siteKey) {
    throw new Error('reCAPTCHA site key is not configured.')
  }

  await loadRecaptchaScript(siteKey)
  await waitForGrecaptchaReady()

  const token = await window.grecaptcha?.execute(siteKey, { action })
  if (!token) {
    throw new Error('Failed to generate reCAPTCHA token.')
  }

  return token
}
