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

export const Route = createFileRoute('/_public/portfolio/$slug')({
  head: ({ params }) => ({
    meta: [
      {
        title: getBrandPageTitle(formatSlug(params.slug)),
      },
      {
        name: 'description',
        content: getBrandMetaDescription(
          `Case study scaffold for ${formatSlug(params.slug)} in the Nu Graphix portfolio structure.`,
        ),
      },
    ],
  }),
  component: PortfolioCaseStudyPage,
})

function PortfolioCaseStudyPage() {
  const { slug } = Route.useParams()
  const title = formatSlug(slug)

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/portfolio"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Portfolio
      </Link>

      <Card className="border-border bg-card shadow-none">
        <CardHeader className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Case Study Scaffold
          </p>
          <CardTitle className="text-balance text-3xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
          <p>
            This route provides the case-study structure for future delivery:
            context, architecture approach, implementation highlights, and
            operational outcomes.
          </p>
          <p>
            The page is scaffolded to support narrative proof and measurable
            result snapshots once final project content is approved.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
