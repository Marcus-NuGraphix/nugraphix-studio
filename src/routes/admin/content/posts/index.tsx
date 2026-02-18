import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { blogAdminPostFiltersSchema } from '@/features/blog/model/filters'
import { getAdminBlogPostsFn } from '@/features/blog/server/posts'

const postsSearchSchema = blogAdminPostFiltersSchema.partial()

export const Route = createFileRoute('/admin/content/posts/')({
  validateSearch: (search) => postsSearchSchema.parse(search),
  loaderDeps: ({ search }) => blogAdminPostFiltersSchema.parse(search),
  loader: async ({ deps }) => getAdminBlogPostsFn({ data: deps }),
  component: ContentPostsPage,
})

function ContentPostsPage() {
  const search = Route.useSearch()
  const data = Route.useLoaderData()
  const navigate = Route.useNavigate()

  const [queryDraft, setQueryDraft] = useState(data.filters.query ?? '')

  const statusLabel = useMemo(() => {
    if (!data.filters.status) return 'All statuses'
    return data.filters.status
  }, [data.filters.status])

  const updateSearch = (patch: Partial<typeof search>) => {
    void navigate({
      to: '/admin/content/posts',
      search: (prev) =>
        blogAdminPostFiltersSchema.parse({
          ...prev,
          ...patch,
        }),
    })
  }

  const formatDateTime = (value: Date | null) => {
    if (!value) return 'Not published'
    return new Date(value).toLocaleString()
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Editorial"
        title="Posts"
        description="Manage draft and published posts, review metadata, and continue editor workflows."
        actions={
          <Button asChild>
            <Link to="/admin/content/posts/new">Create Post</Link>
          </Button>
        }
      />

      <Card className="border-border bg-card shadow-none">
        <CardContent className="space-y-4 p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_220px_140px_auto]">
            <Input
              value={queryDraft}
              onChange={(event) => setQueryDraft(event.target.value)}
              placeholder="Search by title, slug, or excerpt"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  updateSearch({ page: 1, query: queryDraft || undefined })
                }
              }}
            />

            <Select
              value={data.filters.status ?? '__all'}
              onValueChange={(value) =>
                updateSearch({
                  page: 1,
                  status:
                    value === '__all'
                      ? undefined
                      : (value as
                          | 'draft'
                          | 'scheduled'
                          | 'published'
                          | 'archived'),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">All statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={String(data.filters.pageSize)}
              onValueChange={(value) =>
                updateSearch({
                  page: 1,
                  pageSize: Number(value),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 rows</SelectItem>
                <SelectItem value="12">12 rows</SelectItem>
                <SelectItem value="24">24 rows</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() =>
                updateSearch({
                  page: 1,
                  query: queryDraft || undefined,
                })
              }
            >
              Apply
            </Button>
          </div>

          <div className="rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No posts found for {statusLabel.toLowerCase()}.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.posts.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{entry.title}</p>
                          <p className="text-xs text-muted-foreground">/{entry.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{entry.status}</TableCell>
                      <TableCell>{formatDateTime(entry.updatedAt)}</TableCell>
                      <TableCell>{formatDateTime(entry.publishedAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/admin/content/posts/$id" params={{ id: entry.id }}>
                            Edit
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            <p className="text-sm text-muted-foreground">
              Showing {data.posts.length} of {data.total} posts
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={data.page <= 1}
                onClick={() => updateSearch({ page: data.page - 1 })}
              >
                Previous
              </Button>
              <p className="text-xs text-muted-foreground">
                Page {data.page} / {data.totalPages}
              </p>
              <Button
                size="sm"
                variant="outline"
                disabled={data.page >= data.totalPages}
                onClick={() => updateSearch({ page: data.page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
