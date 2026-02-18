'use client'

import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, BookOpen, CalendarDays, Clock3 } from 'lucide-react'
import type { BlogPublicPostListItem } from '@/features/blog/model/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PublicBlogCardProps {
  post: BlogPublicPostListItem
  className?: string
}

const formatPublishDate = (value: Date) =>
  value.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export function PublicBlogCard({ post, className }: PublicBlogCardProps) {
  const shouldReduceMotion = useReducedMotion()
  const coverImage = post.coverImage?.trim()

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={shouldReduceMotion ? undefined : { y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={cn('self-start', className)}
    >
      <Card
        className={cn(
          'group relative overflow-hidden rounded-3xl border border-border/70 bg-card/85 shadow-none backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/15',
        )}
      >
        <Link
          to="/blog/$slug"
          params={{ slug: post.slug }}
          className="flex h-full flex-col focus-visible:ring-ring/60 rounded-3xl focus-visible:ring-2 focus-visible:outline-none"
        >
          <div className="relative aspect-[16/10] border-b border-border/70 sm:aspect-[16/9]">
            {coverImage ? (
              <motion.img
                src={coverImage}
                alt={post.title}
                loading="lazy"
                className="h-full w-full object-cover"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/30 via-background to-accent/30" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />

            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              {post.featured ? (
                <Badge className="rounded-full border border-accent/30 bg-accent/20 text-accent-foreground">
                  Featured
                </Badge>
              ) : null}
              <Badge variant="outline" className="rounded-full border-primary/30 bg-background/75">
                <BookOpen className="mr-1 size-3.5" />
                Insight
              </Badge>
            </div>

            <div className="pointer-events-none absolute right-3 bottom-3 z-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-safe:translate-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/90 px-3 py-1.5 text-[11px] font-semibold text-primary-foreground shadow-lg shadow-primary/30">
                Read more
                <ArrowUpRight className="size-3.5" />
              </span>
            </div>
          </div>

          <CardHeader className="space-y-3 pb-2 pt-4">
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/60 px-2.5 py-1">
                <Clock3 className="size-3.5" />
                {post.readingTimeMinutes} min read
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/60 px-2.5 py-1">
                <CalendarDays className="size-3.5" />
                {formatPublishDate(post.publishedAt)}
              </span>
            </div>
            <CardTitle className="line-clamp-2 text-balance text-lg leading-6 group-hover:text-primary">
              {post.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-4 pb-4 pt-1">
            <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">
              {post.excerpt ?? 'Read the latest Nu Graphix editorial update.'}
            </p>
            <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent-foreground opacity-100 transition-all duration-300 md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100">
              Read full post
              <ArrowUpRight className="size-3.5" />
            </span>
          </CardContent>
        </Link>
      </Card>
    </motion.article>
  )
}
