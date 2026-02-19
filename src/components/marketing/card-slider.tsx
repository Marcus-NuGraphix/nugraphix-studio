'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface CardSliderItem {
  id: string
  content: ReactNode
}

interface CardSliderProps {
  items: Array<CardSliderItem>
  ariaLabel: string
  className?: string
  itemClassName?: string
}

export function CardSlider({
  items,
  ariaLabel,
  className,
  itemClassName,
}: CardSliderProps) {
  const shouldReduceMotion = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const x = useMotionValue(0)
  const [dragLimit, setDragLimit] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollState = useCallback(
    (position = x.get(), limit = dragLimit) => {
      const roundedPosition = Math.round(position)
      const roundedLimit = Math.round(limit)
      setCanScrollPrev(roundedPosition < -4)
      setCanScrollNext(roundedPosition > -roundedLimit + 4)
    },
    [dragLimit, x],
  )

  const updateMetrics = useCallback(() => {
    const viewport = viewportRef.current
    const track = trackRef.current

    if (!viewport || !track) {
      setDragLimit(0)
      updateScrollState(0, 0)
      return
    }

    const limit = Math.max(0, track.scrollWidth - viewport.clientWidth)
    setDragLimit(limit)

    const clamped = Math.min(0, Math.max(-limit, x.get()))
    if (clamped !== x.get()) {
      x.set(clamped)
    }

    updateScrollState(clamped, limit)
  }, [updateScrollState, x])

  useEffect(() => {
    updateMetrics()
    const handleResize = () => updateMetrics()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [items.length, updateMetrics])

  useEffect(() => {
    const unsubscribe = x.on('change', (value) => updateScrollState(value))
    return () => unsubscribe()
  }, [updateScrollState, x])

  const scrollByViewport = (direction: 'prev' | 'next') => {
    const viewport = viewportRef.current
    if (!viewport) return

    const delta = Math.max(viewport.clientWidth * 0.8, 260)
    const current = x.get()
    const target =
      direction === 'next'
        ? Math.max(current - delta, -dragLimit)
        : Math.min(current + delta, 0)

    animate(x, target, {
      type: 'spring',
      stiffness: 260,
      damping: 30,
      mass: 0.85,
    })
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className={cn('group/slider relative space-y-4', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        className="absolute top-1/2 left-2 z-20 -translate-y-1/2"
        initial={{ opacity: 0, x: -6 }}
        animate={{
          opacity: canScrollPrev ? 1 : 0,
          x: canScrollPrev ? 0 : -6,
        }}
        transition={{ duration: 0.2 }}
      >
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => scrollByViewport('prev')}
          disabled={!canScrollPrev}
          aria-label="Scroll cards left"
          className="pointer-events-auto rounded-full border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70"
        >
          <ChevronLeft className="size-4" />
        </Button>
      </motion.div>

      <motion.div
        className="absolute top-1/2 right-2 z-20 -translate-y-1/2"
        initial={{ opacity: 0, x: 6 }}
        animate={{
          opacity: canScrollNext ? 1 : 0,
          x: canScrollNext ? 0 : 6,
        }}
        transition={{ duration: 0.2 }}
      >
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => scrollByViewport('next')}
          disabled={!canScrollNext}
          aria-label="Scroll cards right"
          className="pointer-events-auto rounded-full border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70"
        >
          <ChevronRight className="size-4" />
        </Button>
      </motion.div>

      <motion.div
        ref={viewportRef}
        role="region"
        aria-label={ariaLabel}
        className={cn(
          'overflow-hidden rounded-3xl border border-border/60 bg-muted/20 px-4 py-6 sm:px-6',
        )}
        whileTap={{ cursor: 'grabbing' }}
      >
        <motion.div
          ref={trackRef}
          style={{ x }}
          drag={shouldReduceMotion ? false : 'x'}
          dragConstraints={{ right: 0, left: -dragLimit }}
          dragElastic={0.08}
          onDragEnd={() => updateScrollState()}
          className="flex cursor-grab gap-4 active:cursor-grabbing"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className={cn(
                'w-[min(86vw,22rem)] shrink-0 sm:w-[22rem]',
                itemClassName,
              )}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.35,
                delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.25),
                ease: 'easeOut',
              }}
              whileHover={shouldReduceMotion ? undefined : { y: -4 }}
            >
              {item.content}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <div className="flex justify-end gap-2 px-1 md:hidden">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => scrollByViewport('prev')}
          disabled={!canScrollPrev}
          aria-label="Scroll cards left"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => scrollByViewport('next')}
          disabled={!canScrollNext}
          aria-label="Scroll cards right"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
