import { createFileRoute, notFound } from '@tanstack/react-router'
import { getBrandMetaDescription, getBrandPageTitle } from '@/components/brand'
import {
  PublicBlogPostPage,
  demoPublicBlogPostListItems,
  findDemoPublicBlogPostBySlug,
  getPublicBlogPostBySlugFn,
  getPublicBlogPostsFn,
} from '@/features/blog'

const getDemoRelatedPosts = (slug: string) =>
  demoPublicBlogPostListItems.filter((post) => post.slug !== slug).slice(0, 6)

export const Route = createFileRoute('/_public/blog/$slug')({
  loader: async ({ params }) => {
    const demoPost = findDemoPublicBlogPostBySlug(params.slug)
    let relatedPosts = getDemoRelatedPosts(params.slug)

    try {
      const result = await getPublicBlogPostsFn({
        data: { page: 1, pageSize: 8, query: undefined },
      })
      const candidateRelatedPosts = result.posts
        .filter((post) => post.slug !== params.slug)
        .slice(0, 6)

      if (candidateRelatedPosts.length > 0) {
        relatedPosts = candidateRelatedPosts
      }
    } catch (error) {
      if (error instanceof Response) throw error
    }

    try {
      const result = await getPublicBlogPostBySlugFn({ data: { slug: params.slug } })

      if (!result.ok) {
        if (result.error.code === 'NOT_FOUND') {
          if (demoPost) {
            return {
              ...demoPost,
              isDemoContent: true,
              relatedPosts,
            }
          }
          throw notFound()
        }
        throw new Error(result.error.message)
      }

      return {
        ...result.data,
        isDemoContent: false,
        relatedPosts,
      }
    } catch (error) {
      if (error instanceof Response) throw error
      if (demoPost) {
        return {
          ...demoPost,
          isDemoContent: true,
          relatedPosts,
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
      relatedPosts={post.relatedPosts}
      isDemoContent={post.isDemoContent}
    />
  )
}
