import { Link } from '@tanstack/react-router'
import { Compass, FileQuestion } from 'lucide-react'
import { BrandBadge } from '@/components/brand'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-8 text-center">
      <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-background to-background" />
      <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex max-w-lg flex-col items-center gap-6">
        <BrandBadge />
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="size-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
            Page Not Found
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">404</h1>
          <p className="max-w-md text-muted-foreground">
            The page you are looking for does not exist, has moved, or is no
            longer available.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contact">
              <Compass className="size-4" />
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
