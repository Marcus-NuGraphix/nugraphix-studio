import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: AuthRouteComponent,
})

function AuthRouteComponent() {
  return <div>Hello "/_auth"!</div>
}
