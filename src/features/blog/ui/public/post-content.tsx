import type { BlogDocJSON } from '@/features/blog/model/types'
import { toBlogRenderBlocks } from '@/features/blog/model/content'
import { cn } from '@/lib/utils'

interface BlogPostContentProps {
  contentJson: BlogDocJSON
  className?: string
}

const headingClassNames: Record<number, string> = {
  1: 'text-3xl font-semibold tracking-tight text-foreground',
  2: 'text-2xl font-semibold tracking-tight text-foreground',
  3: 'text-xl font-semibold tracking-tight text-foreground',
  4: 'text-lg font-semibold tracking-tight text-foreground',
  5: 'text-base font-semibold tracking-tight text-foreground',
  6: 'text-base font-semibold tracking-tight text-foreground',
}

export function BlogPostContent({ contentJson, className }: BlogPostContentProps) {
  const blocks = toBlogRenderBlocks(contentJson, 240)

  if (blocks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        This article is currently empty.
      </p>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {blocks.map((block, index) => {
        if (block.kind === 'paragraph') {
          return (
            <p
              key={`${index}-${block.text.slice(0, 24)}`}
              className="text-base leading-8 text-foreground/90"
            >
              {block.text}
            </p>
          )
        }

        if (block.kind === 'heading') {
          const headingClassName = headingClassNames[block.level] ?? headingClassNames[2]
          const headingProps = {
            id: block.id,
            className: cn('scroll-mt-24', headingClassName),
          }

          if (block.level === 1) {
            return (
              <h1 key={`${index}-${block.id}`} {...headingProps}>
                {block.text}
              </h1>
            )
          }

          if (block.level === 3) {
            return (
              <h3 key={`${index}-${block.id}`} {...headingProps}>
                {block.text}
              </h3>
            )
          }

          if (block.level === 4) {
            return (
              <h4 key={`${index}-${block.id}`} {...headingProps}>
                {block.text}
              </h4>
            )
          }

          if (block.level === 5) {
            return (
              <h5 key={`${index}-${block.id}`} {...headingProps}>
                {block.text}
              </h5>
            )
          }

          if (block.level === 6) {
            return (
              <h6 key={`${index}-${block.id}`} {...headingProps}>
                {block.text}
              </h6>
            )
          }

          return (
            <h2 key={`${index}-${block.id}`} {...headingProps}>
              {block.text}
            </h2>
          )
        }

        if (block.kind === 'quote') {
          return (
            <blockquote
              key={`${index}-${block.text.slice(0, 24)}`}
              className="border-primary/50 rounded-r-xl border-l-4 bg-primary/5 px-5 py-3 text-sm leading-7 text-muted-foreground"
            >
              {block.text}
            </blockquote>
          )
        }

        if (block.kind === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul'
          return (
            <ListTag
              key={`list-${index}`}
              className={cn(
                'space-y-2 pl-5 text-sm leading-7 text-foreground/90',
                block.ordered ? 'list-decimal' : 'list-disc',
              )}
            >
              {block.items.map((item) => (
                <li key={`${index}-${item.slice(0, 30)}`}>{item}</li>
              ))}
            </ListTag>
          )
        }

        if (block.kind === 'image') {
          return (
            <figure
              key={`${index}-${block.src}`}
              className="space-y-2 overflow-hidden rounded-2xl border border-border bg-card"
            >
              <img
                src={block.src}
                alt={block.alt}
                loading="lazy"
                className="h-auto max-h-[520px] w-full object-cover"
              />
              {block.caption ? (
                <figcaption className="px-4 pb-4 text-xs leading-6 text-muted-foreground">
                  {block.caption}
                </figcaption>
              ) : null}
            </figure>
          )
        }

        if (block.kind === 'code') {
          return (
            <pre
              key={`${index}-${block.code.slice(0, 20)}`}
              className="overflow-x-auto rounded-2xl border border-border bg-muted/40 p-4 text-xs leading-6 text-foreground"
            >
              {block.language ? (
                <span className="mb-2 block text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  {block.language}
                </span>
              ) : null}
              <code>{block.code}</code>
            </pre>
          )
        }

        return (
          <hr
            key={`divider-${index}`}
            className="border-border/70"
          />
        )
      })}
    </div>
  )
}
