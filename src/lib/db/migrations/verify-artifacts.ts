import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

interface JournalEntry {
  idx: number
  tag: string
}

interface JournalFile {
  entries: Array<JournalEntry>
}

interface VerifyDrizzleArtifactsResult {
  issues: Array<string>
  journalTags: Array<string>
  snapshotPrefixes: Array<string>
  sqlTags: Array<string>
}

const migrationSqlFilePattern = /^(\d{4}_[a-z0-9_]+)\.sql$/i
const migrationSnapshotPattern = /^(\d{4})_snapshot\.json$/i
const migrationTagPattern = /^(\d{4})_[a-z0-9_]+$/i

const toSortedUnique = (values: Array<string>) =>
  Array.from(new Set(values)).sort((a, b) => a.localeCompare(b))

const parseJournal = async (journalPath: string) => {
  const raw = await readFile(journalPath, 'utf8')
  return JSON.parse(raw) as JournalFile
}

export const verifyDrizzleArtifacts = async ({
  drizzleDir = path.resolve(process.cwd(), 'drizzle'),
}: {
  drizzleDir?: string
} = {}): Promise<VerifyDrizzleArtifactsResult> => {
  const issues: Array<string> = []
  const metaDir = path.join(drizzleDir, 'meta')
  const journalPath = path.join(metaDir, '_journal.json')

  const [drizzleEntries, metaEntries, journal] = await Promise.all([
    readdir(drizzleDir, { withFileTypes: true }),
    readdir(metaDir, { withFileTypes: true }),
    parseJournal(journalPath),
  ])

  const sqlTags = toSortedUnique(
    drizzleEntries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name.match(migrationSqlFilePattern)?.[1] ?? '')
      .filter(Boolean),
  )

  const snapshotPrefixes = toSortedUnique(
    metaEntries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name.match(migrationSnapshotPattern)?.[1] ?? '')
      .filter(Boolean),
  )

  const journalTags = journal.entries.map((entry) => entry.tag)
  const uniqueJournalTags = toSortedUnique(journalTags)

  if (journal.entries.length === 0) {
    if (sqlTags.length > 0 || snapshotPrefixes.length > 0) {
      issues.push(
        'drizzle/meta/_journal.json has no entries, but migration artifacts exist.',
      )
    }
  }

  journal.entries.forEach((entry, index) => {
    if (entry.idx !== index) {
      issues.push(
        `Journal idx mismatch for ${entry.tag}: expected ${index}, received ${entry.idx}.`,
      )
    }

    if (!migrationTagPattern.test(entry.tag)) {
      issues.push(`Journal tag format invalid: ${entry.tag}.`)
    }
  })

  if (uniqueJournalTags.length !== journalTags.length) {
    issues.push('Journal has duplicate migration tags.')
  }

  for (const tag of uniqueJournalTags) {
    if (!sqlTags.includes(tag)) {
      issues.push(
        `Journal references missing SQL migration file: drizzle/${tag}.sql.`,
      )
    }

    const prefix = tag.slice(0, 4)
    if (!snapshotPrefixes.includes(prefix)) {
      issues.push(
        `Journal migration ${tag} is missing snapshot metadata: drizzle/meta/${prefix}_snapshot.json.`,
      )
    }
  }

  for (const tag of sqlTags) {
    if (!uniqueJournalTags.includes(tag)) {
      issues.push(`SQL migration is missing journal entry: drizzle/${tag}.sql.`)
    }
  }

  const latestJournalPrefix = uniqueJournalTags.at(-1)?.slice(0, 4)
  const latestSnapshotPrefix = snapshotPrefixes.at(-1)

  if (latestJournalPrefix !== latestSnapshotPrefix) {
    issues.push(
      `Latest journal migration (${latestJournalPrefix ?? 'none'}) does not match latest snapshot (${latestSnapshotPrefix ?? 'none'}).`,
    )
  }

  return {
    issues,
    journalTags: uniqueJournalTags,
    snapshotPrefixes,
    sqlTags,
  }
}
