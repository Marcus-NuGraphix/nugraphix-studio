import { createFileRoute, notFound, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { BlogPostEditorInput } from '@/features/blog'
import { PageHeader } from '@/components/layout'
import {
  BlogPostEditorForm,
  getAdminBlogPostByIdFn,
  unpublishBlogPostFn,
  updateBlogPostFn,
} from '@/features/blog'

export const Route = createFileRoute('/admin/content/posts/$id')({
  loader: async ({ params }) => {
    const result = await getAdminBlogPostByIdFn({ data: { id: params.id } })

    if (!result.ok) {
      if (result.error.code === 'NOT_FOUND') {
        throw notFound()
      }
      throw new Error(result.error.message)
    }

    return result.data
  },
  component: EditPostPage,
})

function EditPostPage() {
  const post = Route.useLoaderData()
  const router = useRouter()

  const savePost = async (payload: BlogPostEditorInput) => {
    const result = await updateBlogPostFn({ data: { id: post.id, ...payload } })

    if (!result.ok) {
      toast.error(result.error.message)
      throw new Error(result.error.message)
    }

    toast.success(
      result.data.status === 'published'
        ? 'Post updated and published.'
        : 'Post updated successfully.',
    )

    await router.invalidate({ sync: true })
  }

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Editorial"
        title="Edit Post"
        description="Update content, metadata, and publish state for this article."
      />

      <BlogPostEditorForm
        initialValues={{
          title: post.title,
          slug: post.slug,
          status: post.status,
          contentJson: post.contentJson,
          excerpt: post.excerpt ?? '',
          coverImage: post.coverImage ?? '',
          metaTitle: post.metaTitle ?? '',
          metaDescription: post.metaDescription ?? '',
          canonicalUrl: post.canonicalUrl ?? '',
          featured: post.featured,
          isBreaking: post.isBreaking,
        }}
        onSave={async (values) => {
          await savePost(values)
        }}
        onPublish={async (values) => {
          await savePost({ ...values, status: 'published' })
        }}
        onArchive={async () => {
          const result = await unpublishBlogPostFn({
            data: { id: post.id, status: 'archived' },
          })

          if (!result.ok) {
            toast.error(result.error.message)
            throw new Error(result.error.message)
          }

          toast.success('Post archived.')
          await router.invalidate({ sync: true })
        }}
      />
    </section>
  )
}
