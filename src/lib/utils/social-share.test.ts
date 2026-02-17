import { describe, expect, it } from 'vitest'
import { canNativeShare, resolveShareUrl } from '@/lib/utils/social-share'

describe('resolveShareUrl', () => {
  it('returns canonical as-is during SSR', () => {
    expect(resolveShareUrl('/blog/post')).toBe('/blog/post')
  })

  it('returns empty string when canonical is absent during SSR', () => {
    expect(resolveShareUrl()).toBe('')
  })
})

describe('canNativeShare', () => {
  it('returns false when navigator.share is unavailable', () => {
    expect(canNativeShare()).toBe(false)
  })
})
