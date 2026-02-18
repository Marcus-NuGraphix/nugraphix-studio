import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { BlogPostContent } from '@/features/blog/ui/public/post-content'

describe('blog public rendering safety', () => {
  it('escapes script-like text content and never injects raw HTML', () => {
    const html = renderToStaticMarkup(
      <BlogPostContent
        contentJson={{
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: '<script>alert("xss")</script>' },
              ],
            },
          ],
        }}
      />,
    )

    expect(html).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
    expect(html).not.toContain('<script>alert("xss")</script>')
  })
})

