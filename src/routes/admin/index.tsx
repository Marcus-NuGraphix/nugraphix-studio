import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { authGetSessionFn } from '@/features/auth/server/auth.queries'

export const Route = createFileRoute('/admin/')({
  component: AdminHome,
})

function AdminHome() {
  const getSession = useServerFn(authGetSessionFn)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <button
        className="mt-4 underline"
        onClick={async () => {
          const res = await getSession()
          console.log(res)
        }}
      >
        Test authGetSessionFn (logs result)
      </button>
    </div>
  )
}
