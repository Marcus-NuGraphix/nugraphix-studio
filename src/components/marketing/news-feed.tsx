'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  Bookmark,
  Clock3,
  MessageSquare,
  Newspaper,
  Search,
  Share2,
  TrendingUp,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface NewsFeedAuthor {
  name: string
  role?: string
  avatarSrc?: string
}

export interface NewsFeedItem {
  id: string
  title: string
  summary: string
  category: string
  publishedLabel: string
  readTimeLabel: string
  author?: NewsFeedAuthor
  commentsCount?: number
  trending?: boolean
}

interface NewsFeedProps {
  items: Array<NewsFeedItem>
  title?: string
  description?: string
  className?: string
  onOpenItem?: (item: NewsFeedItem) => void
  onBookmarkItem?: (item: NewsFeedItem) => void
  onShareItem?: (item: NewsFeedItem) => void
}

const initialsFromName = (name: string) =>
  name
    .split(' ')
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase()

export function NewsFeed({
  items,
  title = 'Latest Updates',
  description = 'Stay informed with recent posts and insights.',
  className,
  onOpenItem,
  onBookmarkItem,
  onShareItem,
}: NewsFeedProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = useMemo(
    () => ['All', ...new Set(items.map((item) => item.category))],
    [items],
  )

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const matchesCategory =
          activeCategory === 'All' || item.category === activeCategory
        const query = searchQuery.trim().toLowerCase()
        const matchesSearch =
          query.length === 0 ||
          item.title.toLowerCase().includes(query) ||
          item.summary.toLowerCase().includes(query)

        return matchesCategory && matchesSearch
      }),
    [activeCategory, items, searchQuery],
  )

  return (
    <section className={cn('space-y-6', className)}>
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h2 className="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground">
            <Newspaper className="size-5 text-primary" aria-hidden="true" />
            {title}
          </h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="relative w-full md:w-64">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search updates..."
            className="pl-9"
            aria-label="Search news feed"
          />
        </div>
      </header>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
              activeCategory === category
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-secondary/60 text-secondary-foreground hover:bg-secondary',
            )}
            aria-pressed={activeCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-4" role="list">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <NewsFeedCard
                key={item.id}
                item={item}
                index={index}
                prefersReducedMotion={prefersReducedMotion}
                onOpenItem={onOpenItem}
                onBookmarkItem={onBookmarkItem}
                onShareItem={onShareItem}
              />
            ))
          ) : (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-border bg-muted/40 p-8 text-center"
            >
              <p className="text-sm font-medium text-foreground">
                No matching updates found.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another category or adjust the search query.
              </p>
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setActiveCategory('All')
                  setSearchQuery('')
                }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

interface NewsFeedCardProps {
  item: NewsFeedItem
  index: number
  prefersReducedMotion: boolean
  onOpenItem?: (item: NewsFeedItem) => void
  onBookmarkItem?: (item: NewsFeedItem) => void
  onShareItem?: (item: NewsFeedItem) => void
}

function NewsFeedCard({
  item,
  index,
  prefersReducedMotion,
  onOpenItem,
  onBookmarkItem,
  onShareItem,
}: NewsFeedCardProps) {
  const initialAnimation = prefersReducedMotion ? false : { opacity: 0, y: 18 }

  return (
    <motion.article
      role="listitem"
      initial={initialAnimation}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: prefersReducedMotion ? 0 : Math.min(index * 0.06, 0.24),
        duration: prefersReducedMotion ? 0 : 0.32,
      }}
      whileHover={prefersReducedMotion ? undefined : { y: -3 }}
      className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-5 shadow-xs backdrop-blur"
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      </div>

      <div className="relative space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-8 border border-border">
              {item.author?.avatarSrc ? (
                <AvatarImage src={item.author.avatarSrc} alt={item.author.name} />
              ) : null}
              <AvatarFallback className="text-xs">
                {item.author ? initialsFromName(item.author.name) : 'NG'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-foreground">
                {item.author?.name ?? 'Nu Graphix Editorial'}
              </p>
              {item.author?.role ? (
                <p className="text-[11px] text-muted-foreground">{item.author.role}</p>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {item.trending ? (
              <Badge
                variant="secondary"
                className="h-5 gap-1 border-accent/40 bg-accent/15 px-2 text-[10px] text-foreground"
              >
                <TrendingUp className="size-3 text-accent" />
                Trending
              </Badge>
            ) : null}
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock3 className="size-3" />
              {item.publishedLabel}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
              {item.title}
            </h3>
            <Badge variant="outline" className="text-[10px] font-normal">
              {item.category}
            </Badge>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
          <div className="inline-flex items-center gap-3 text-xs text-muted-foreground">
            {typeof item.commentsCount === 'number' ? (
              <span className="inline-flex items-center gap-1">
                <MessageSquare className="size-3.5" />
                {item.commentsCount}
              </span>
            ) : null}
            <span>{item.readTimeLabel}</span>
          </div>

          <div className="inline-flex items-center gap-1">
            {onShareItem ? (
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="rounded-full"
                onClick={() => onShareItem(item)}
                aria-label={`Share ${item.title}`}
              >
                <Share2 className="size-3.5" />
              </Button>
            ) : null}
            {onBookmarkItem ? (
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="rounded-full"
                onClick={() => onBookmarkItem(item)}
                aria-label={`Bookmark ${item.title}`}
              >
                <Bookmark className="size-3.5" />
              </Button>
            ) : null}
            {onOpenItem ? (
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                className="rounded-full text-primary hover:bg-primary/10"
                onClick={() => onOpenItem(item)}
                aria-label={`Open ${item.title}`}
              >
                <ArrowRight className="size-3.5" />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
