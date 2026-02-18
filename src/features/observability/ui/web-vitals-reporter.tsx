'use client'

import { useEffect } from 'react'
import type { Metric } from 'web-vitals'
import { captureWebVitalMetricFn } from '@/features/observability/client/observability'
import { normalizeWebVitalNameFromMetric } from '@/lib/observability'

const MAX_ROUTE_PATH_LENGTH = 256

const normalizeRoutePath = (pathname: string) => {
  const trimmed = pathname.trim()
  if (!trimmed) {
    return '/'
  }

  return trimmed.slice(0, MAX_ROUTE_PATH_LENGTH)
}

export function WebVitalsReporter() {
  useEffect(() => {
    let disposed = false

    const reportMetric = async (metric: Metric) => {
      if (disposed) {
        return
      }

      const normalizedMetric = normalizeWebVitalNameFromMetric(metric.name)
      if (!normalizedMetric) {
        return
      }

      try {
        await captureWebVitalMetricFn({
          data: {
            metricId: metric.id,
            metric: normalizedMetric,
            rating: metric.rating,
            value: metric.value,
            delta: metric.delta,
            routePath: normalizeRoutePath(window.location.pathname),
            navigationType: metric.navigationType,
            source: 'web-vitals-browser',
          },
        })
      } catch {
        // Metrics capture should never break user flows.
      }
    }

    void import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      onCLS(reportMetric)
      onFCP(reportMetric)
      onINP(reportMetric)
      onLCP(reportMetric)
      onTTFB(reportMetric)
    })

    return () => {
      disposed = true
    }
  }, [])

  return null
}
