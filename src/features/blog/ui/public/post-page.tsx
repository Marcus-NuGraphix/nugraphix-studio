import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
  PenLine,
  Sparkles,
} from 'lucide-react'
import type {
  BlogPostDetail,
  BlogPublicPostListItem,
} from '@/features/blog/model/types'
import { CardSlider } from '@/components/marketing'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { toBlogContentHeadings } from '@/features/blog/model/content'
import { PublicBlogCard } from '@/features/blog/ui/public/blog-card'
import { BlogPostContent } from '@/features/blog/ui/public/post-content'

interface PublicBlogPostPageProps {
  post: BlogPostDetail
  relatedPosts?: Array<BlogPublicPostListItem>
  isDemoContent?: boolean
}

const publishingGuidance = [
  {
    id: 'focus',
    title: 'Focus before drafting',
    content:
      'Define the reader and the decision they need to make. Drafting starts only after the problem statement and success criteria are explicit.',
  },
  {
    id: 'layered-editing',
    title: 'Use layered editorial passes',
    content:
      'Run structure, message, and polish passes separately. This keeps edits intentional and reduces rework across author and reviewer loops.',
  },
  {
    id: 'quality-gate',
    title: 'Publish through a quality gate',
    content:
      'Validate claims against source material, remove ambiguity, and ensure the article has a clear next step for readers before publishing.',
  },
]

const formatDateLabel = (value: Date | null, fallback: string) =>
  value
    ? value.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : fallback

export function PublicBlogPostPage({
  post,
  relatedPosts = [],
  isDemoContent = false,
}: PublicBlogPostPageProps) {
  const headings = toBlogContentHeadings(post.contentJson, 10)
  const publishedLabel = formatDateLabel(post.publishedAt, 'Draft')
  const updatedLabel = formatDateLabel(post.updatedAt, publishedLabel)
  const coverImage = post.coverImage?.trim()
  const categoryLabel = post.featured ? 'Featured Insight' : 'Field Note'

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Blog
      </Link>

      <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <header className="relative overflow-hidden border-b border-border">
          <div className="relative h-56 bg-gradient-to-br from-primary/20 via-background to-muted sm:h-72">
            {coverImage ? (
              <img
                src={coverImage}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-border/60 bg-background/85 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <BookOpen className="size-3.5 text-primary" />
              {categoryLabel}
            </div>
          </div>

          <div className="space-y-4 px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                Public Editorial
              </Badge>
              <Badge variant="outline" className="rounded-full">
                <Clock3 className="mr-1 size-3.5" />
                {post.readingTimeMinutes} min read
              </Badge>
              <Badge variant="outline" className="rounded-full">
                <CalendarDays className="mr-1 size-3.5" />
                {publishedLabel}
              </Badge>
              {isDemoContent ? (
                <Badge variant="outline" className="rounded-full border-primary/40">
                  <Sparkles className="mr-1 size-3.5 text-primary" />
                  Demo content
                </Badge>
              ) : null}
            </div>

            <h1 className="max-w-4xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {post.excerpt ? (
              <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                {post.excerpt}
              </p>
            ) : null}
          </div>
        </header>

        <div className="grid gap-8 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)]">
          <section className="min-w-0">
            <BlogPostContent contentJson={post.contentJson} />
          </section>

          <aside className="space-y-4">
            <Card className="border-border bg-background">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Article Overview</CardTitle>
                <CardDescription>
                  Editorial metadata for this publication.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">Author</span>
                  <span className="text-right font-medium text-foreground">
                    {post.authorName}
                  </span>
                </div>
                <Separator />
                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">Published</span>
                  <span className="text-right text-foreground">{publishedLabel}</span>
                </div>
                <Separator />
                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="text-right text-foreground">{updatedLabel}</span>
                </div>
                <Separator />
                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">Read time</span>
                  <span className="text-right text-foreground">
                    {post.readingTimeMinutes} minutes
                  </span>
                </div>
              </CardContent>
            </Card>

            {headings.length > 0 ? (
              <Card className="border-border bg-background">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">In This Article</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      style={{ paddingLeft: `${Math.max(heading.level - 1, 0) * 12 + 8}px` }}
                    >
                      {heading.text}
                    </a>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            <Card className="border-border bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Editorial Playbook</CardTitle>
                <CardDescription>
                  How Nu Graphix structures high-signal technical writing.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {publishingGuidance.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger className="text-sm">
                        {item.title}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm leading-7 text-muted-foreground">
                        {item.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </aside>
        </div>

        <footer className="border-t border-border px-6 py-6 sm:px-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Continue exploring Nu Graphix engineering notes and operational case studies.
            </p>
            <Button variant="secondary" asChild>
              <Link to="/blog">
                <PenLine className="size-4" />
                Browse more posts
              </Link>
            </Button>
          </div>
        </footer>

        {relatedPosts.length > 0 ? (
          <section className="space-y-4 border-t border-border px-6 py-8 sm:px-10">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Related reads
              </h2>
              <p className="text-sm text-muted-foreground">
                Continue with additional Nu Graphix engineering and delivery insights.
              </p>
            </div>

            <CardSlider
              ariaLabel="Related blog posts"
              items={relatedPosts.map((relatedPost) => ({
                id: relatedPost.id,
                content: <PublicBlogCard post={relatedPost} className="h-full" />,
              }))}
              itemClassName="w-[min(88vw,20rem)] sm:w-[20rem]"
            />
          </section>
        ) : null}
      </article>
    </div>
  )
}
