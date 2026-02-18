import { describe, expect, it } from 'vitest'
import {
  calculateWebVitalScore,
  formatWebVitalValue,
  normalizeWebVitalNameFromMetric,
  toNotificationTypeFromRating,
} from '@/lib/observability/web-vitals'

describe('web-vitals helpers', () => {
  it('normalizes browser metric names', () => {
    expect(normalizeWebVitalNameFromMetric('LCP')).toBe('lcp')
    expect(normalizeWebVitalNameFromMetric(' cls ')).toBe('cls')
    expect(normalizeWebVitalNameFromMetric('unknown')).toBeNull()
  })

  it('formats CLS and timing metrics appropriately', () => {
    expect(formatWebVitalValue('cls', 0.0387)).toBe('0.04')
    expect(formatWebVitalValue('lcp', 1244.12)).toBe('1244')
  })

  it('calculates weighted web-vitals score', () => {
    expect(
      calculateWebVitalScore({
        lcp: 'good',
        inp: 'needs-improvement',
        cls: 'poor',
      }),
    ).toBe(73)
  })

  it('maps rating levels to notification tone', () => {
    expect(toNotificationTypeFromRating('good')).toBe('success')
    expect(toNotificationTypeFromRating('needs-improvement')).toBe('warning')
    expect(toNotificationTypeFromRating('poor')).toBe('error')
  })
})
