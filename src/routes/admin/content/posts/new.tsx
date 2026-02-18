import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { BlogPostEditorInput } from '@/features/blog'
import { PageHeader } from '@/components/layout'
import {
  BlogPostEditorForm,
  createBlogPostFn,
  emptyBlogDoc,
} from '@/features/blog'

export const Route = createFileRoute('/admin/content/posts/new')({
  component: CreatePostPage,
})

function CreatePostPage() {
  const navigate = Route.useNavigate()

  const createPost = async (payload: BlogPostEditorInput) => {
    const result = await createBlogPostFn({ data: payload })

    if (!result.ok) {
      toast.error(result.error.message)
      throw new Error(result.error.message)
    }

    toast.success(
      result.data.status === 'published'
        ? 'Post published successfully.'
        : 'Draft created successfully.',
    )

    await navigate({
      to: '/admin/content/posts/$id',
      params: { id: result.data.id },
    })
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Editorial"
        title="Create Post"
        description="Draft or publish a new blog post with structured rich-text content powered by ProseKit."
      />

      <BlogPostEditorForm
        initialValues={{
          title: '',
          slug: '',
          status: 'draft',
          contentJson: emptyBlogDoc(),
          excerpt: '',
          coverImage: '',
          metaTitle: '',
          metaDescription: '',
          canonicalUrl: '',
          featured: false,
          isBreaking: false,
        }}
        onSave={async (values) => {
          await createPost({ ...values, status: values.status })
        }}
        onPublish={async (values) => {
          await createPost({ ...values, status: 'published' })
        }}
      />
    </section>
  )
}
