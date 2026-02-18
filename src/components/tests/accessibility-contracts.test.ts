import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const rootDir = process.cwd()

const scanRoots = [
  path.resolve(rootDir, 'src/components'),
  path.resolve(rootDir, 'src/features'),
  path.resolve(rootDir, 'src/routes'),
]

const listFiles = async (directory: string): Promise<Array<string>> => {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        return listFiles(fullPath)
      }

      return [fullPath]
    }),
  )

  return files.flat()
}

const toProjectPath = (filePath: string) =>
  path.relative(rootDir, filePath).replaceAll('\\', '/')

const readSource = async (projectPath: string) => {
  const fullPath = path.resolve(rootDir, projectPath)
  return readFile(fullPath, 'utf8')
}

describe('accessibility contracts', () => {
  it('requires dialog/sheet title semantics for content usage', async () => {
    const allFiles = (
      await Promise.all(scanRoots.map((scanRoot) => listFiles(scanRoot)))
    )
      .flat()
      .filter((filePath) => filePath.endsWith('.tsx'))
      .filter((filePath) => !filePath.endsWith('.test.tsx'))

    const dialogIgnore = new Set([
      'src/components/ui/dialog.tsx',
    ])

    const sheetIgnore = new Set([
      'src/components/ui/sheet.tsx',
    ])

    const missingDialogTitles: Array<string> = []
    const missingSheetTitles: Array<string> = []

    for (const filePath of allFiles) {
      const projectPath = toProjectPath(filePath)
      const source = await readFile(filePath, 'utf8')

      if (
        source.includes('DialogContent') &&
        !source.includes('DialogTitle') &&
        !dialogIgnore.has(projectPath)
      ) {
        missingDialogTitles.push(projectPath)
      }

      if (
        source.includes('SheetContent') &&
        !source.includes('SheetTitle') &&
        !sheetIgnore.has(projectPath)
      ) {
        missingSheetTitles.push(projectPath)
      }
    }

    expect(missingDialogTitles).toEqual([])
    expect(missingSheetTitles).toEqual([])
  })

  it('preserves shared navigation accessibility labels', async () => {
    const siteHeaderSource = await readSource(
      'src/components/navigation/site-header.tsx',
    )
    const siteFooterSource = await readSource(
      'src/components/navigation/site-footer.tsx',
    )

    expect(siteHeaderSource).toContain('aria-label="Toggle navigation menu"')
    expect(siteHeaderSource).toContain('<SheetTitle className="sr-only">')
    expect(siteHeaderSource).toContain('Site Navigation')

    expect(siteFooterSource).toContain('aria-label="Subscribe to newsletter"')
    expect(siteFooterSource).toContain('aria-label="Scroll to top"')
    expect(siteFooterSource).toContain('className="sr-only"')
  })

  it('preserves shared form-control labeling patterns', async () => {
    const searchInputSource = await readSource(
      'src/components/forms/search-input.tsx',
    )
    const tagPickerSource = await readSource(
      'src/components/forms/tag-picker.tsx',
    )
    const fieldSource = await readSource('src/components/ui/field.tsx')
    const newsletterSignupSource = await readSource(
      'src/features/email/ui/public/newsletter-signup-panel.tsx',
    )

    expect(searchInputSource).toContain("aria-label={props['aria-label'] ?? 'Search'}")
    expect(searchInputSource).toContain('aria-label="Clear search"')
    expect(searchInputSource).toContain('aria-label="Searching"')

    expect(tagPickerSource).toContain('aria-label="Tag input"')
    expect(tagPickerSource).toContain('aria-label={`Remove ${tag} tag`}')

    expect(fieldSource).toContain('role="alert"')
    expect(newsletterSignupSource).toContain(
      '<label htmlFor="newsletter-signup-email" className="sr-only">',
    )
  })
})
