import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BlogPostContent, getPublicBlogPostBySlugFn } from '@/features/blog'

export const Route = createFileRoute('/_public/blog/$slug')({
  loader: async ({ params }) => {
    const result = await getPublicBlogPostBySlugFn({ data: { slug: params.slug } })

    if (!result.ok) {
      if (result.error.code === 'NOT_FOUND') {
        throw notFound()
      }
      throw new Error(result.error.message)
    }

    return result.data
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: getBrandPageTitle(loaderData?.metaTitle ?? loaderData?.title ?? 'Blog'),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          loaderData?.metaDescription ??
            loaderData?.excerpt ??
            'Nu Graphix blog article.',
        ),
      },
    ],
  }),
  component: BlogPostPage,
})

function BlogPostPage() {
  const post = Route.useLoaderData()

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Blog
      </Link>

      <Card className="border-border bg-card shadow-none">
        <CardHeader className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString()
              : 'Draft'}{' '}
            · {post.readingTimeMinutes} min read
          </p>
          <CardTitle className="text-balance text-3xl">{post.title}</CardTitle>
          {post.excerpt ? (
            <p className="text-sm text-muted-foreground">{post.excerpt}</p>
          ) : null}
        </CardHeader>
        <CardContent>
          <BlogPostContent contentJson={post.contentJson} />
        </CardContent>
      </Card>
    </div>
  )
}
