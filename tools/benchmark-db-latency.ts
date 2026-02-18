import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { config as loadDotEnv } from 'dotenv'
import { Pool } from 'pg'

loadDotEnv({ path: resolve(process.cwd(), '.env.local') })
loadDotEnv({ path: resolve(process.cwd(), '.env') })

interface BenchmarkTarget {
  label: string
  connectionString: string
}

interface BenchmarkStats {
  minMs: number
  maxMs: number
  avgMs: number
  p50Ms: number
  p95Ms: number
}

interface TargetBenchmarkResult {
  label: string
  target: string
  query: string
  warmupIterations: number
  benchmarkIterations: number
  succeeded: number
  failed: number
  stats: BenchmarkStats
}

interface BenchmarkReport {
  generatedAt: string
  location: string
  query: string
  warmupIterations: number
  benchmarkIterations: number
  targets: Array<TargetBenchmarkResult>
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

const summarize = (durationsMs: Array<number>): BenchmarkStats => {
  const sorted = [...durationsMs].sort((a, b) => a - b)
  const total = durationsMs.reduce((acc, value) => acc + value, 0)

  return {
    minMs: sorted[0] ?? 0,
    maxMs: sorted[sorted.length - 1] ?? 0,
    avgMs: durationsMs.length > 0 ? total / durationsMs.length : 0,
    p50Ms: percentile(sorted, 50),
    p95Ms: percentile(sorted, 95),
  }
}

const parseTargets = (): Array<BenchmarkTarget> => {
  const rawTargets = process.env.BENCHMARK_DB_TARGETS?.trim()

  if (rawTargets) {
    return rawTargets
      .split(';')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const splitIndex = entry.indexOf('=')
        if (splitIndex < 1 || splitIndex === entry.length - 1) {
          throw new Error(
            `Invalid BENCHMARK_DB_TARGETS entry "${entry}". Expected "label=postgresql://...".`,
          )
        }

        return {
          label: entry.slice(0, splitIndex).trim(),
          connectionString: entry.slice(splitIndex + 1).trim(),
        }
      })
  }

  const defaultUrl = process.env.DATABASE_URL?.trim()
  if (!defaultUrl) {
    throw new Error(
      'DATABASE_URL is required when BENCHMARK_DB_TARGETS is not provided.',
    )
  }

  return [{ label: 'default', connectionString: defaultUrl }]
}

const redactTarget = (connectionString: string) => {
  const parsed = new URL(connectionString)
  const dbName = parsed.pathname.replace(/^\//, '') || 'postgres'
  const port = parsed.port || '5432'

  return `${parsed.protocol}//${parsed.hostname}:${port}/${dbName}`
}

const round = (value: number) => Number(value.toFixed(2))

const measureQuery = async (pool: Pool, query: string) => {
  const start = performance.now()
  await pool.query(query)
  return performance.now() - start
}

const runTargetBenchmark = async ({
  target,
  query,
  warmupIterations,
  benchmarkIterations,
}: {
  target: BenchmarkTarget
  query: string
  warmupIterations: number
  benchmarkIterations: number
}): Promise<TargetBenchmarkResult> => {
  const pool = new Pool({
    connectionString: target.connectionString,
    max: 1,
    idleTimeoutMillis: 5_000,
  })

  try {
    for (let i = 0; i < warmupIterations; i += 1) {
      await measureQuery(pool, query)
    }

    const successfulSamples: Array<number> = []
    let failed = 0

    for (let i = 0; i < benchmarkIterations; i += 1) {
      try {
        const elapsedMs = await measureQuery(pool, query)
        successfulSamples.push(elapsedMs)
      } catch {
        failed += 1
      }
    }

    if (successfulSamples.length === 0) {
      throw new Error(
        `All benchmark queries failed for target "${target.label}".`,
      )
    }

    const stats = summarize(successfulSamples)

    return {
      label: target.label,
      target: redactTarget(target.connectionString),
      query,
      warmupIterations,
      benchmarkIterations,
      succeeded: successfulSamples.length,
      failed,
      stats: {
        minMs: round(stats.minMs),
        maxMs: round(stats.maxMs),
        avgMs: round(stats.avgMs),
        p50Ms: round(stats.p50Ms),
        p95Ms: round(stats.p95Ms),
      },
    }
  } finally {
    await pool.end()
  }
}

const toBoolean = (value: string | undefined, fallback: boolean) => {
  if (!value) return fallback
  const normalized = value.trim().toLowerCase()
  if (normalized === 'true') return true
  if (normalized === 'false') return false
  return fallback
}

const writeReportArtifact = async (report: BenchmarkReport) => {
  const artifactDir = resolve(process.cwd(), 'docs/03-hosting/artifacts')
  await mkdir(artifactDir, { recursive: true })

  const safeTimestamp = report.generatedAt.replace(/[:.]/g, '-')
  const artifactPath = resolve(
    artifactDir,
    `db-latency-${safeTimestamp}.json`,
  )

  await writeFile(artifactPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  return artifactPath
}

const main = async () => {
  const targets = parseTargets()
  const query = process.env.BENCHMARK_QUERY?.trim() || 'select 1'
  const location = process.env.BENCHMARK_LOCATION?.trim() || 'unspecified'
  const warmupIterations = parseNumber(process.env.BENCHMARK_WARMUP, 5)
  const benchmarkIterations = parseNumber(process.env.BENCHMARK_ITERATIONS, 30)
  const shouldWriteArtifact = toBoolean(
    process.env.BENCHMARK_WRITE_ARTIFACT,
    true,
  )

  const results: Array<TargetBenchmarkResult> = []
  for (const target of targets) {
    const result = await runTargetBenchmark({
      target,
      query,
      warmupIterations,
      benchmarkIterations,
    })
    results.push(result)
  }

  const report: BenchmarkReport = {
    generatedAt: new Date().toISOString(),
    location,
    query,
    warmupIterations,
    benchmarkIterations,
    targets: results,
  }

  console.log('DB latency benchmark summary:')
  console.table(
    results.map((result) => ({
      target: result.label,
      endpoint: result.target,
      p50Ms: result.stats.p50Ms,
      p95Ms: result.stats.p95Ms,
      avgMs: result.stats.avgMs,
      minMs: result.stats.minMs,
      maxMs: result.stats.maxMs,
      succeeded: result.succeeded,
      failed: result.failed,
    })),
  )

  if (shouldWriteArtifact) {
    const artifactPath = await writeReportArtifact(report)
    console.log(`[benchmark-db-latency] Wrote artifact: ${artifactPath}`)
  }
}

main().catch((error) => {
  console.error('[benchmark-db-latency] Benchmark failed.')
  console.error(error)
  process.exitCode = 1
})
