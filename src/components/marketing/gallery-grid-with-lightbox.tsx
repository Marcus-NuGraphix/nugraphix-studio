'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Grid3X3, X, ZoomIn } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface GalleryGridImageItem {
  id: string
  imageSrc: string
  imageAlt: string
  title: string
  category: string
}

interface GalleryGridWithLightboxProps {
  items: Array<GalleryGridImageItem>
  className?: string
  title?: string
  description?: string
}

const DIALOG_TITLE_ID = 'marketing-gallery-dialog-title'
const DIALOG_DESCRIPTION_ID = 'marketing-gallery-dialog-description'

export function GalleryGridWithLightbox({
  items,
  className,
  title = 'Project gallery',
  description = 'Browse featured visuals across recent Nu Graphix delivery work.',
}: GalleryGridWithLightboxProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const categories = useMemo(
    () => ['All', ...new Set(items.map((item) => item.category))],
    [items],
  )

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') {
      return items
    }

    return items.filter((item) => item.category === activeCategory)
  }, [activeCategory, items])

  const selectedIndex = useMemo(
    () => items.findIndex((item) => item.id === selectedId),
    [items, selectedId],
  )
  const selectedItem = selectedIndex >= 0 ? items[selectedIndex] : null

  const goToNext = () => {
    if (selectedIndex < 0 || items.length === 0) {
      return
    }

    const nextIndex = (selectedIndex + 1) % items.length
    setSelectedId(items[nextIndex].id)
  }

  const goToPrevious = () => {
    if (selectedIndex < 0 || items.length === 0) {
      return
    }

    const previousIndex = (selectedIndex - 1 + items.length) % items.length
    setSelectedId(items[previousIndex].id)
  }

  const closeDialog = () => setSelectedId(null)

  useEffect(() => {
    if (!selectedItem) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [selectedItem])

  useEffect(() => {
    if (!selectedItem) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDialog()
      } else if (event.key === 'ArrowRight') {
        goToNext()
      } else if (event.key === 'ArrowLeft') {
        goToPrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedItem, selectedIndex, items])

  const onGalleryItemKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    id: string,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    setSelectedId(id)
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card/70 p-8 text-center">
        <p className="text-sm font-medium text-foreground">
          No gallery items available.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add project images to render this gallery.
        </p>
      </div>
    )
  }

  return (
    <section className={cn('space-y-6', className)}>
      <header className="space-y-2">
        <Badge
          variant="secondary"
          className="inline-flex h-6 items-center gap-2 border-border bg-secondary text-secondary-foreground"
        >
          <Grid3X3 className="size-3.5" />
          Gallery
        </Badge>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            type="button"
            size="sm"
            variant={activeCategory === category ? 'default' : 'outline'}
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
          >
            {category}
          </Button>
        ))}
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.28,
                delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.2),
              }}
            >
              <Card className="group overflow-hidden border-border bg-card/60 p-0 shadow-none">
                <button
                  type="button"
                  className="block w-full text-left"
                  onClick={() => setSelectedId(item.id)}
                  onKeyDown={(event) => onGalleryItemKeyDown(event, item.id)}
                  aria-label={`Open ${item.title} in lightbox`}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <motion.img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      className="h-full w-full object-cover"
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-foreground/75 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                      <div className="space-y-2 px-4 text-center">
                        <ZoomIn className="mx-auto size-6 text-background" />
                        <p className="text-sm font-semibold text-background">
                          {item.title}
                        </p>
                        <Badge
                          variant="outline"
                          className="border-background/60 bg-background/15 text-background"
                        >
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-50 bg-background/85 p-4 backdrop-blur-md"
            onClick={closeDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={DIALOG_TITLE_ID}
            aria-describedby={DIALOG_DESCRIPTION_ID}
          >
            <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
              <motion.div
                initial={shouldReduceMotion ? false : { scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { scale: 0.96, opacity: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.2,
                  ease: 'easeOut',
                }}
                onClick={(event) => event.stopPropagation()}
                className="relative w-full max-w-5xl"
              >
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  className="absolute top-3 right-3 z-10 rounded-full border-border bg-card/80"
                  onClick={closeDialog}
                  aria-label="Close gallery dialog"
                >
                  <X className="size-4" />
                </Button>

                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  className="absolute top-1/2 left-3 z-10 -translate-y-1/2 rounded-full border-border bg-card/80"
                  onClick={goToPrevious}
                  aria-label="Show previous image"
                >
                  <ChevronLeft className="size-4" />
                </Button>

                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  className="absolute top-1/2 right-3 z-10 -translate-y-1/2 rounded-full border-border bg-card/80"
                  onClick={goToNext}
                  aria-label="Show next image"
                >
                  <ChevronRight className="size-4" />
                </Button>

                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <motion.img
                    key={selectedItem.id}
                    src={selectedItem.imageSrc}
                    alt={selectedItem.imageAlt}
                    className="max-h-[72vh] w-full object-cover"
                    initial={shouldReduceMotion ? false : { opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
                  />
                  <div className="space-y-2 border-t border-border bg-card/90 px-5 py-4">
                    <h3
                      id={DIALOG_TITLE_ID}
                      className="text-lg font-semibold text-card-foreground"
                    >
                      {selectedItem.title}
                    </h3>
                    <p
                      id={DIALOG_DESCRIPTION_ID}
                      className="text-sm text-muted-foreground"
                    >
                      Category: {selectedItem.category}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  )
}
