import { createFileRoute, notFound } from '@tanstack/react-router'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import {
  PublicBlogPostPage,
  findDemoPublicBlogPostBySlug,
  getPublicBlogPostBySlugFn,
} from '@/features/blog'

export const Route = createFileRoute('/_public/blog/$slug')({
  loader: async ({ params }) => {
    const demoPost = findDemoPublicBlogPostBySlug(params.slug)

    try {
      const result = await getPublicBlogPostBySlugFn({ data: { slug: params.slug } })

      if (!result.ok) {
        if (result.error.code === 'NOT_FOUND') {
          if (demoPost) {
            return {
              ...demoPost,
              isDemoContent: true,
            }
          }
          throw notFound()
        }
        throw new Error(result.error.message)
      }

      return {
        ...result.data,
        isDemoContent: false,
      }
    } catch (error) {
      if (error instanceof Response) throw error
      if (demoPost) {
        return {
          ...demoPost,
          isDemoContent: true,
        }
      }
      throw error
    }
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
    <PublicBlogPostPage
      post={post}
      isDemoContent={post.isDemoContent}
    />
  )
}
