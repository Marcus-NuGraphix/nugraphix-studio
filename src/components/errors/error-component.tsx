import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorComponentProps {
  error: Error
  reset?: () => void
}

export function ErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-6 text-destructive" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
      {reset && (
        <Button variant="outline" onClick={reset}>
          Try again
        </Button>
      )}
    </div>
  )
}
