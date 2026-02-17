import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatSlug = (value: string) =>
  value
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export const Route = createFileRoute('/_public/blog/$slug')({
  head: ({ params }) => ({
    meta: [
      {
        title: getBrandPageTitle(formatSlug(params.slug)),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          `Article scaffold for ${formatSlug(params.slug)} in the Nu Graphix Studio publication workflow.`,
        ),
      },
    ],
  }),
  component: BlogPostPage,
})

function BlogPostPage() {
  const { slug } = Route.useParams()
  const title = formatSlug(slug)

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
            Article Scaffold
          </p>
          <CardTitle className="text-balance text-3xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            This route is now scaffolded and ready for CMS-backed content
            wiring. The current page confirms URL structure, metadata handling,
            and article template boundaries.
          </p>
          <p>
            Next implementation will connect published post data, reading-time
            metadata, and related content modules.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
