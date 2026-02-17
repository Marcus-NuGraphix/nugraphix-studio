import { env } from '@/lib/env/server'

const RECAPTCHA_VERIFY_ENDPOINT =
  'https://www.google.com/recaptcha/api/siteverify'

const getExpectedHostname = () => {
  const url = env.PUBLIC_APP_URL ?? env.BETTER_AUTH_BASE_URL

  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}

interface RecaptchaVerificationResponse {
  success: boolean
  score?: number
  action?: string
  hostname?: string
  'error-codes'?: Array<string>
}

const verifyRecaptchaLocallyAllowed = () =>
  process.env.NODE_ENV !== 'production' && !env.RECAPTCHA_SECRET_KEY

export const verifyRecaptchaToken = async ({
  token,
  remoteIp,
  expectedAction,
}: {
  token: string
  remoteIp?: string | null
  expectedAction: string
}) => {
  if (!env.RECAPTCHA_SECRET_KEY) {
    if (verifyRecaptchaLocallyAllowed()) {
      return
    }

    throw new Error('reCAPTCHA is not configured on the server.')
  }

  const payload = new URLSearchParams({
    secret: env.RECAPTCHA_SECRET_KEY,
    response: token,
  })

  if (remoteIp) {
    payload.set('remoteip', remoteIp)
  }

  const response = await fetch(RECAPTCHA_VERIFY_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload.toString(),
  })

  if (!response.ok) {
    throw new Error('Unable to verify reCAPTCHA at this time.')
  }

  const result = (await response.json()) as RecaptchaVerificationResponse
  if (!result.success) {
    throw new Error('reCAPTCHA verification failed.')
  }

  if (result.action !== expectedAction) {
    throw new Error('reCAPTCHA action mismatch.')
  }

  if (
    typeof result.score === 'number' &&
    result.score < env.RECAPTCHA_MIN_SCORE
  ) {
    throw new Error('reCAPTCHA risk score is too low.')
  }

  const expectedHostname = getExpectedHostname()
  if (
    expectedHostname &&
    result.hostname &&
    result.hostname !== expectedHostname
  ) {
    throw new Error('reCAPTCHA hostname validation failed.')
  }
}
