import type { BlogDocJSON } from '@/features/blog/model/types'

export interface BlogContentHeading {
  id: string
  text: string
  level: number
}

export type BlogRenderBlock =
  | {
      kind: 'heading'
      id: string
      level: number
      text: string
    }
  | {
      kind: 'paragraph'
      text: string
    }
  | {
      kind: 'quote'
      text: string
    }
  | {
      kind: 'list'
      ordered: boolean
      items: Array<string>
    }
  | {
      kind: 'image'
      src: string
      alt: string
      caption: string | null
    }
  | {
      kind: 'code'
      language: string | null
      code: string
    }
  | {
      kind: 'divider'
    }

export const emptyBlogDoc = (): BlogDocJSON => ({
  type: 'doc',
  content: [{ type: 'paragraph' }],
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim()

const toText = (value: unknown) => {
  const collector: Array<string> = []
  collectText(value, collector)
  return normalizeText(collector.join(' '))
}

const toAnchorId = (value: string) => {
  const normalized = normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return normalized.length > 0 ? normalized : 'section'
}

const withUniqueAnchorId = (value: string, seen: Record<string, number>) => {
  const base = toAnchorId(value)
  const nextCount = (seen[base] ?? 0) + 1
  seen[base] = nextCount
  return nextCount === 1 ? base : `${base}-${nextCount}`
}

const toHeadingLevel = (value: unknown) => {
  if (!isRecord(value)) return 2
  const level = value.level
  if (typeof level !== 'number' || Number.isNaN(level)) return 2
  if (level < 1) return 1
  if (level > 6) return 6
  return level
}

const toListItems = (value: unknown): Array<string> => {
  if (!Array.isArray(value)) return []
  return value
    .map((entry) => {
      if (!isRecord(entry)) return null
      if (entry.type !== 'listItem') return null
      return toText(entry.content)
    })
    .filter((item): item is string => Boolean(item))
}

const toCode = (value: unknown) => {
  if (!Array.isArray(value)) return ''
  const lines = value
    .map((node) => {
      if (!isRecord(node)) return ''
      if (node.type !== 'text') return ''
      if (typeof node.text !== 'string') return ''
      return node.text
    })
    .filter(Boolean)

  return lines.join('\n').trim()
}

const pushBlogRenderBlocks = (
  node: unknown,
  blocks: Array<BlogRenderBlock>,
  seenAnchorIds: Record<string, number>,
  maxBlocks: number,
) => {
  if (blocks.length >= maxBlocks) return

  if (Array.isArray(node)) {
    for (const child of node) {
      pushBlogRenderBlocks(child, blocks, seenAnchorIds, maxBlocks)
      if (blocks.length >= maxBlocks) break
    }
    return
  }

  if (!isRecord(node)) return

  const nodeType = node.type
  if (typeof nodeType !== 'string') {
    if (Array.isArray(node.content)) {
      pushBlogRenderBlocks(node.content, blocks, seenAnchorIds, maxBlocks)
    }
    return
  }

  if (nodeType === 'heading') {
    const text = toText(node.content)
    if (text.length > 0) {
      blocks.push({
        kind: 'heading',
        id: withUniqueAnchorId(text, seenAnchorIds),
        level: toHeadingLevel(node.attrs),
        text,
      })
    }
    return
  }

  if (nodeType === 'paragraph') {
    const text = toText(node.content)
    if (text.length > 0) {
      blocks.push({ kind: 'paragraph', text })
    }
    return
  }

  if (nodeType === 'blockquote') {
    const text = toText(node.content)
    if (text.length > 0) {
      blocks.push({ kind: 'quote', text })
    }
    return
  }

  if (nodeType === 'bulletList' || nodeType === 'orderedList') {
    const items = toListItems(node.content)
    if (items.length > 0) {
      blocks.push({
        kind: 'list',
        ordered: nodeType === 'orderedList',
        items,
      })
    }
    return
  }

  if (nodeType === 'image') {
    const attrs = isRecord(node.attrs) ? node.attrs : {}
    const src = typeof attrs.src === 'string' ? attrs.src.trim() : ''
    if (src.length > 0) {
      const alt = typeof attrs.alt === 'string' ? attrs.alt.trim() : ''
      const caption = typeof attrs.title === 'string' ? attrs.title.trim() : ''
      blocks.push({
        kind: 'image',
        src,
        alt: alt.length > 0 ? alt : 'Blog image',
        caption: caption.length > 0 ? caption : null,
      })
    }
    return
  }

  if (nodeType === 'codeBlock') {
    const attrs = isRecord(node.attrs) ? node.attrs : {}
    const language = typeof attrs.language === 'string' ? attrs.language : null
    const code = toCode(node.content)
    if (code.length > 0) {
      blocks.push({ kind: 'code', language, code })
    }
    return
  }

  if (nodeType === 'horizontalRule') {
    blocks.push({ kind: 'divider' })
    return
  }

  if (Array.isArray(node.content)) {
    pushBlogRenderBlocks(node.content, blocks, seenAnchorIds, maxBlocks)
  }
}

const collectText = (value: unknown, collector: Array<string>) => {
  if (Array.isArray(value)) {
    for (const item of value) {
      collectText(item, collector)
    }
    return
  }

  if (!isRecord(value)) {
    return
  }

  if (typeof value.text === 'string') {
    const text = value.text.trim()
    if (text.length > 0) {
      collector.push(text)
    }
  }

  if (Array.isArray(value.content)) {
    collectText(value.content, collector)
  }
}

export const parseBlogDoc = (value: string | null | undefined): BlogDocJSON => {
  if (!value) {
    return emptyBlogDoc()
  }

  try {
    const parsed = JSON.parse(value) as unknown
    if (
      isRecord(parsed) &&
      parsed.type === 'doc' &&
      typeof parsed.type === 'string'
    ) {
      return parsed as unknown as BlogDocJSON
    }
    return emptyBlogDoc()
  } catch {
    return emptyBlogDoc()
  }
}

export const toBlogDocString = (value: BlogDocJSON): string =>
  JSON.stringify(value)

export const toBlogContentText = (value: BlogDocJSON): string => {
  const collector: Array<string> = []
  collectText(value, collector)
  return normalizeText(collector.join(' '))
}

export const toBlogPreviewParagraphs = (
  value: BlogDocJSON,
  maxParagraphs = 20,
): Array<string> => {
  const paragraphs: Array<string> = []
  const visit = (node: unknown) => {
    if (paragraphs.length >= maxParagraphs) {
      return
    }

    if (Array.isArray(node)) {
      for (const child of node) {
        visit(child)
      }
      return
    }

    if (!isRecord(node)) {
      return
    }

    if (
      (node.type === 'paragraph' ||
        node.type === 'heading' ||
        node.type === 'blockquote') &&
      Array.isArray(node.content)
    ) {
      const textParts: Array<string> = []
      collectText(node.content, textParts)
      const text = textParts.join(' ').replace(/\s+/g, ' ').trim()
      if (text.length > 0) {
        paragraphs.push(text)
      }
    }

    if (Array.isArray(node.content)) {
      visit(node.content)
    }
  }

  visit(value.content)
  return paragraphs
}

export const toBlogRenderBlocks = (
  value: BlogDocJSON,
  maxBlocks = 200,
): Array<BlogRenderBlock> => {
  const blocks: Array<BlogRenderBlock> = []
  pushBlogRenderBlocks(value.content, blocks, {}, maxBlocks)
  return blocks
}

export const toBlogContentHeadings = (
  value: BlogDocJSON,
  maxHeadings = 16,
): Array<BlogContentHeading> =>
  toBlogRenderBlocks(value)
    .filter(
      (block): block is Extract<BlogRenderBlock, { kind: 'heading' }> =>
        block.kind === 'heading',
    )
    .slice(0, maxHeadings)
    .map((block) => ({
      id: block.id,
      text: block.text,
      level: block.level,
    }))

export const estimateReadingTimeMinutes = (text: string): number => {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  if (words === 0) return 1
  return Math.max(1, Math.ceil(words / 220))
}

export const toExcerpt = (text: string, explicitExcerpt?: string): string => {
  const normalizedExplicit = explicitExcerpt?.trim()
  if (normalizedExplicit) {
    return normalizedExplicit
  }

  const normalizedText = text.replace(/\s+/g, ' ').trim()
  if (normalizedText.length <= 180) {
    return normalizedText
  }

  return `${normalizedText.slice(0, 177).trimEnd()}...`
}
