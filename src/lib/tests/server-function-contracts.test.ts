import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const featuresDir = path.resolve(process.cwd(), 'src/features')

const listFeatureFiles = async (directory: string): Promise<Array<string>> => {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        return listFeatureFiles(fullPath)
      }
      return [fullPath]
    }),
  )

  return files.flat()
}

describe('server mutation contracts', () => {
  it('keeps inputValidator coverage on POST server functions', async () => {
    const files = await listFeatureFiles(featuresDir)
    const serverFiles = files.filter((file) => {
      const normalized = file.replaceAll('\\', '/')
      return (
        normalized.includes('/server/') &&
        normalized.endsWith('.ts') &&
        !normalized.endsWith('.test.ts')
      )
    })

    const missingValidators: Array<string> = []

    for (const file of serverFiles) {
      const source = await readFile(file, 'utf8')
      const matches = source.matchAll(
        /export const\s+(\w+)\s*=\s*createServerFn\(\{\s*method:\s*'POST'\s*\}\)([\s\S]*?)\.handler\(/g,
      )

      for (const match of matches) {
        const fnName = match[1]
        const chain = match[2]
        if (!chain.includes('.inputValidator(')) {
          const relativePath = path.relative(process.cwd(), file)
          missingValidators.push(`${relativePath}:${fnName}`)
        }
      }
    }

    expect(missingValidators).toEqual([])
  })
})
