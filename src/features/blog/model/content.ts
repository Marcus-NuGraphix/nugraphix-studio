import type { BlogDocJSON } from '@/features/blog/model/types'

export const emptyBlogDoc = (): BlogDocJSON => ({
  type: 'doc',
  content: [{ type: 'paragraph' }],
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

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
  return collector.join(' ').replace(/\s+/g, ' ').trim()
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
