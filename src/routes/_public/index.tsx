import { createFileRoute } from '@tanstack/react-router'
import { ComponentExample } from '@/components/component-example'

export const Route = createFileRoute('/_public/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <ComponentExample />
    </>
  )
}
