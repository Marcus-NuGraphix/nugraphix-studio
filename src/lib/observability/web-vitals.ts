export const webVitalMetricValues = ['lcp', 'inp', 'cls', 'fcp', 'ttfb'] as const
export type WebVitalMetric = (typeof webVitalMetricValues)[number]

export const webVitalRatingValues = [
  'good',
  'needs-improvement',
  'poor',
] as const
export type WebVitalRating = (typeof webVitalRatingValues)[number]

const metricDisplayLabels: Record<WebVitalMetric, string> = {
  cls: 'Cumulative Layout Shift (CLS)',
  fcp: 'First Contentful Paint (FCP)',
  inp: 'Interaction to Next Paint (INP)',
  lcp: 'Largest Contentful Paint (LCP)',
  ttfb: 'Time to First Byte (TTFB)',
}

const metricUnits: Record<WebVitalMetric, string> = {
  cls: '',
  fcp: 'ms',
  inp: 'ms',
  lcp: 'ms',
  ttfb: 'ms',
}

const ratingThresholds: Record<
  WebVitalMetric,
  {
    goodUpperBound: number
    poorLowerBound: number
  }
> = {
  cls: {
    goodUpperBound: 0.1,
    poorLowerBound: 0.25,
  },
  fcp: {
    goodUpperBound: 1800,
    poorLowerBound: 3000,
  },
  inp: {
    goodUpperBound: 200,
    poorLowerBound: 500,
  },
  lcp: {
    goodUpperBound: 2500,
    poorLowerBound: 4000,
  },
  ttfb: {
    goodUpperBound: 800,
    poorLowerBound: 1800,
  },
}

const ratingScores: Record<WebVitalRating, number> = {
  good: 100,
  'needs-improvement': 72,
  poor: 35,
}

const metricWeights: Record<WebVitalMetric, number> = {
  cls: 0.2,
  fcp: 0.1,
  inp: 0.3,
  lcp: 0.3,
  ttfb: 0.1,
}

export const normalizeWebVitalMetricName = (
  metricName: string,
): WebVitalMetric | null => {
  const normalized = metricName.trim().toLowerCase()
  if (!normalized) {
    return null
  }

  if (!webVitalMetricValues.includes(normalized as WebVitalMetric)) {
    return null
  }

  return normalized as WebVitalMetric
}

export const normalizeWebVitalNameFromMetric = (
  metricName: string,
): WebVitalMetric | null => {
  const normalized = metricName.trim().toUpperCase()
  if (!normalized) {
    return null
  }

  return normalizeWebVitalMetricName(normalized.toLowerCase())
}

export const formatWebVitalValue = (
  metric: WebVitalMetric,
  value: number,
): string => {
  if (metric === 'cls') {
    return value.toFixed(2)
  }

  return String(Math.round(value))
}

export const getWebVitalMetricLabel = (metric: WebVitalMetric) =>
  metricDisplayLabels[metric]

export const getWebVitalMetricUnit = (metric: WebVitalMetric) =>
  metricUnits[metric]

export const calculateWebVitalScore = (
  ratings: Partial<Record<WebVitalMetric, WebVitalRating>>,
) => {
  let total = 0
  let appliedWeight = 0

  for (const metric of webVitalMetricValues) {
    const rating = ratings[metric]
    if (!rating) {
      continue
    }

    total += ratingScores[rating] * metricWeights[metric]
    appliedWeight += metricWeights[metric]
  }

  if (appliedWeight === 0) {
    return 0
  }

  return Math.round(total / appliedWeight)
}

export const resolveWebVitalRating = (
  metric: WebVitalMetric,
  value: number,
): WebVitalRating => {
  const thresholds = ratingThresholds[metric]
  if (value <= thresholds.goodUpperBound) {
    return 'good'
  }

  if (value > thresholds.poorLowerBound) {
    return 'poor'
  }

  return 'needs-improvement'
}

export const toNotificationTypeFromRating = (
  rating: WebVitalRating,
): 'success' | 'warning' | 'error' => {
  if (rating === 'poor') {
    return 'error'
  }

  if (rating === 'needs-improvement') {
    return 'warning'
  }

  return 'success'
}
