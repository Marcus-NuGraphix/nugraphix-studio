import { createFileRoute } from '@tanstack/react-router'
import { ComponentExample } from '@/components/component-example'
import { ThemeToggle } from '@/components/theme/theme-toggle'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <>
      <ThemeToggle />
      <ComponentExample />
    </>
  )
}
