import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { config as loadDotEnv } from 'dotenv'

loadDotEnv({ path: resolve(process.cwd(), '.env.local') })
loadDotEnv({ path: resolve(process.cwd(), '.env') })

interface HttpPathBenchmarkResult {
  path: string
  url: string
  status: number | null
  succeeded: number
  failed: number
  minMs: number
  maxMs: number
  avgMs: number
  p50Ms: number
  p95Ms: number
}

interface HttpBenchmarkReport {
  generatedAt: string
  location: string
  origin: string
  redirectMode: RequestRedirect
  warmupIterations: number
  benchmarkIterations: number
  paths: Array<HttpPathBenchmarkResult>
}

const parseNumber = (value: string | undefined, fallback: number) => {
  if (!value) return fallback

  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const percentile = (sorted: Array<number>, p: number) => {
  if (sorted.length === 0) return 0

  const index = Math.ceil((p / 100) * sorted.length) - 1
  const boundedIndex = Math.min(Math.max(index, 0), sorted.length - 1)
  return sorted[boundedIndex]
}

const round = (value: number) => Number(value.toFixed(2))

const summarize = (samples: Array<number>) => {
  const sorted = [...samples].sort((a, b) => a - b)
  const total = samples.reduce((sum, sample) => sum + sample, 0)

  return {
    minMs: round(sorted[0] ?? 0),
    maxMs: round(sorted[sorted.length - 1] ?? 0),
    avgMs: round(samples.length > 0 ? total / samples.length : 0),
    p50Ms: round(percentile(sorted, 50)),
    p95Ms: round(percentile(sorted, 95)),
  }
}

const parsePaths = () => {
  const raw = process.env.BENCHMARK_HTTP_PATHS?.trim()
  if (!raw) {
    return ['/', '/blog', '/login', '/admin/dashboard']
  }

  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((path) => (path.startsWith('/') ? path : `/${path}`))
}

const measureFetch = async (url: URL, redirectMode: RequestRedirect) => {
  const startedAt = performance.now()
  const response = await fetch(url, {
    method: 'GET',
    redirect: redirectMode,
    headers: {
      'cache-control': 'no-cache',
      pragma: 'no-cache',
    },
  })

  return {
    elapsedMs: performance.now() - startedAt,
    status: response.status,
  }
}

const benchmarkPath = async ({
  origin,
  path,
  warmupIterations,
  benchmarkIterations,
  redirectMode,
}: {
  origin: string
  path: string
  warmupIterations: number
  benchmarkIterations: number
  redirectMode: RequestRedirect
}): Promise<HttpPathBenchmarkResult> => {
  const url = new URL(path, origin)
  let lastStatus: number | null = null

  for (let i = 0; i < warmupIterations; i += 1) {
    try {
      const result = await measureFetch(url, redirectMode)
      lastStatus = result.status
    } catch {
      // Warmup failures are tolerated.
    }
  }

  const samples: Array<number> = []
  let failed = 0

  for (let i = 0; i < benchmarkIterations; i += 1) {
    try {
      const result = await measureFetch(url, redirectMode)
      lastStatus = result.status
      samples.push(result.elapsedMs)
    } catch {
      failed += 1
    }
  }

  if (samples.length === 0) {
    throw new Error(`All HTTP benchmark requests failed for path "${path}".`)
  }

  const stats = summarize(samples)

  return {
    path,
    url: url.toString(),
    status: lastStatus,
    succeeded: samples.length,
    failed,
    ...stats,
  }
}

const toBoolean = (value: string | undefined, fallback: boolean) => {
  if (!value) return fallback
  const normalized = value.trim().toLowerCase()
  if (normalized === 'true') return true
  if (normalized === 'false') return false
  return fallback
}

const writeArtifact = async (report: HttpBenchmarkReport) => {
  const directory = resolve(process.cwd(), 'docs/03-hosting/artifacts')
  await mkdir(directory, { recursive: true })

  const safeTimestamp = report.generatedAt.replace(/[:.]/g, '-')
  const artifactPath = resolve(directory, `http-ttfb-${safeTimestamp}.json`)
  await writeFile(artifactPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  return artifactPath
}

const main = async () => {
  const origin =
    process.env.BENCHMARK_HTTP_ORIGIN?.trim() || 'https://nugraphix.co.za'
  const location = process.env.BENCHMARK_LOCATION?.trim() || 'unspecified'
  const warmupIterations = parseNumber(process.env.BENCHMARK_WARMUP, 5)
  const benchmarkIterations = parseNumber(process.env.BENCHMARK_ITERATIONS, 30)
  const redirectMode = (process.env.BENCHMARK_HTTP_REDIRECT_MODE?.trim() ||
    'manual') as RequestRedirect
  const shouldWriteArtifact = toBoolean(
    process.env.BENCHMARK_WRITE_ARTIFACT,
    true,
  )

  const paths = parsePaths()
  const results: Array<HttpPathBenchmarkResult> = []

  for (const path of paths) {
    const result = await benchmarkPath({
      origin,
      path,
      warmupIterations,
      benchmarkIterations,
      redirectMode,
    })

    results.push(result)
  }

  const report: HttpBenchmarkReport = {
    generatedAt: new Date().toISOString(),
    location,
    origin,
    redirectMode,
    warmupIterations,
    benchmarkIterations,
    paths: results,
  }

  console.log('HTTP TTFB benchmark summary:')
  console.table(
    results.map((result) => ({
      path: result.path,
      status: result.status,
      p50Ms: result.p50Ms,
      p95Ms: result.p95Ms,
      avgMs: result.avgMs,
      minMs: result.minMs,
      maxMs: result.maxMs,
      succeeded: result.succeeded,
      failed: result.failed,
    })),
  )

  if (shouldWriteArtifact) {
    const artifactPath = await writeArtifact(report)
    console.log(`[benchmark-http-ttfb] Wrote artifact: ${artifactPath}`)
  }
}

main().catch((error) => {
  console.error('[benchmark-http-ttfb] Benchmark failed.')
  console.error(error)
  process.exitCode = 1
})
