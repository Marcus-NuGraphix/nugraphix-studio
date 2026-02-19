import { sql } from 'drizzle-orm'
import type { SQL } from 'drizzle-orm'

export interface SearchQueryOptions {
  minTermLength?: number
  maxTerms?: number
}

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim()

export const normalizeSearchQuery = (query: string) => normalizeWhitespace(query)

export const extractSearchTerms = (
  query: string,
  options: SearchQueryOptions = {},
) => {
  const minTermLength = options.minTermLength ?? 2
  const maxTerms = options.maxTerms ?? 8
  const normalized = normalizeSearchQuery(query)

  if (normalized.length === 0) {
    return [] as Array<string>
  }

  return normalized
    .split(/[\s,.;:!?()[\]{}"'`|/\\+-]+/g)
    .map((term) => term.trim().toLowerCase())
    .filter((term) => term.length >= minTermLength)
    .slice(0, maxTerms)
}

export const buildTsQueryPrefix = (query: string) => {
  const terms = extractSearchTerms(query)
  if (terms.length === 0) {
    return ''
  }

  return terms.map((term) => `${term}:*`).join(' & ')
}

export type SearchConfig = 'simple' | 'english'

const resolveSearchConfig = (value?: SearchConfig): SearchConfig =>
  value ?? 'simple'

export const buildWebsearchQuerySql = (
  query: string,
  config?: SearchConfig,
) => {
  const normalized = normalizeSearchQuery(query)
  const resolvedConfig = resolveSearchConfig(config)
  return sql`websearch_to_tsquery(${resolvedConfig}::regconfig, ${normalized})`
}

export const buildTextSearchWhereSql = ({
  document,
  query,
  config,
}: {
  document: SQL
  query: string
  config?: SearchConfig
}) => {
  const normalized = normalizeSearchQuery(query)
  if (!normalized) {
    return sql`TRUE`
  }

  const resolvedConfig = resolveSearchConfig(config)

  return sql`to_tsvector(${resolvedConfig}::regconfig, coalesce(${document}, '')) @@ websearch_to_tsquery(${resolvedConfig}::regconfig, ${normalized})`
}

export const buildTextSearchRankSql = ({
  document,
  query,
  config,
}: {
  document: SQL
  query: string
  config?: SearchConfig
}) => {
  const normalized = normalizeSearchQuery(query)
  if (!normalized) {
    return sql`0`
  }

  const resolvedConfig = resolveSearchConfig(config)
  return sql`ts_rank(to_tsvector(${resolvedConfig}::regconfig, coalesce(${document}, '')), websearch_to_tsquery(${resolvedConfig}::regconfig, ${normalized}))`
}
