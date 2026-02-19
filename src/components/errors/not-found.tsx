import { Link } from '@tanstack/react-router'
import { ArrowLeft, Compass, FileQuestion, Newspaper } from 'lucide-react'
import { BrandBadge, BrandLockup } from '@/components/brand'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-10">
      <div className="absolute inset-0 bg-linear-to-b from-primary/15 via-background to-background" />
      <div className="absolute top-[-6rem] right-[-6rem] size-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute bottom-[-5rem] left-[-4rem] size-72 rounded-full bg-secondary/35 blur-3xl" />

      <section className="relative z-10 w-full max-w-2xl rounded-2xl border border-border bg-card/90 p-6 shadow-lg backdrop-blur sm:p-10">
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center">
            <BrandLockup compact includeTagline />
          </div>

          <div className="space-y-4">
            <BrandBadge showServiceName className="rounded-full" />
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-muted">
              <FileQuestion className="size-8 text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
                Page Not Found
              </p>
              <h1 className="text-4xl leading-none font-semibold tracking-tight sm:text-5xl">
                404
              </h1>
              <p className="mx-auto max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                The page you requested is unavailable or has moved. Return to a
                valid route and continue from the main Nu Graphix navigation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="size-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/blog">
                <Newspaper className="size-4" />
                Open Blog
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/contact">
                <Compass className="size-4" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
