import { AlertCircle, RotateCcw } from 'lucide-react'
import { AppError, toSafeActionErrorMessage } from '@/lib/errors'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorComponentProps {
  error: unknown
  reset?: () => void
  title?: string
  className?: string
  showDetailsInDev?: boolean
}

const fallbackMessage =
  'An unexpected error interrupted this request. Please retry in a moment.'

function getErrorMessage(error: unknown) {
  if (error instanceof AppError) {
    return error.message
  }

  if (error instanceof Error) {
    return toSafeActionErrorMessage({
      error,
      fallback: fallbackMessage,
    })
  }

  return fallbackMessage
}

function getErrorDetails(error: unknown) {
  if (error instanceof Error) {
    return error.stack ?? error.message
  }

  if (typeof error === 'string') {
    return error
  }

  try {
    return JSON.stringify(error, null, 2)
  } catch {
    return String(error)
  }
}

export function ErrorComponent({
  error,
  reset,
  title = 'Something went wrong',
  className,
  showDetailsInDev = true,
}: ErrorComponentProps) {
  const message = getErrorMessage(error)
  const details = getErrorDetails(error)

  return (
    <div
      className={cn(
        'mx-auto flex min-h-[40vh] w-full max-w-2xl items-center justify-center p-6',
        className,
      )}
    >
      <div className="w-full space-y-4 rounded-xl border border-destructive/30 bg-destructive/5 p-5 md:p-6">
        <Alert variant="destructive" className="border-destructive/30 bg-card">
          <AlertCircle className="size-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>

        {reset ? (
          <div className="flex items-center justify-end">
            <Button type="button" variant="outline" onClick={reset}>
              <RotateCcw className="size-4" />
              Try again
            </Button>
          </div>
        ) : null}

        {showDetailsInDev && import.meta.env.DEV ? (
          <details className="rounded-lg border border-border bg-background p-3">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              Debug details
            </summary>
            <pre className="mt-3 max-h-56 overflow-auto text-xs whitespace-pre-wrap text-muted-foreground">
              {details}
            </pre>
          </details>
        ) : null}
      </div>
    </div>
  )
}
