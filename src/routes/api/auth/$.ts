import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/features/auth/server/auth'

export const handleAuthGet = async ({ request }: { request: Request }) => {
  return await auth.handler(request)
}

export const handleAuthPost = async ({ request }: { request: Request }) => {
  return await auth.handler(request)
}

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: handleAuthGet,
      POST: handleAuthPost,
    },
  },
})
