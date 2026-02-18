import type { BlogDocJSON } from '@/features/blog/model/types'
import { toBlogPreviewParagraphs } from '@/features/blog/model/content'

interface BlogPostContentProps {
  contentJson: BlogDocJSON
}

export function BlogPostContent({ contentJson }: BlogPostContentProps) {
  const paragraphs = toBlogPreviewParagraphs(contentJson, 80)

  if (paragraphs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        This article is currently empty.
      </p>
    )
  }

  return (
    <div className="space-y-4 text-base leading-8 text-foreground">
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
      ))}
    </div>
  )
}
