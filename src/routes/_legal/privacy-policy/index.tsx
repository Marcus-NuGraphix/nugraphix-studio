import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_legal/privacy-policy/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_legal/privacy-policy/"!</div>
}
