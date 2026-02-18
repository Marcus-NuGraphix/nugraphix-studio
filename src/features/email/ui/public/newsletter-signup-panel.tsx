'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, Mail, Send, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { EmailTopic } from '@/features/email/model/types'
import { subscribeToEmailTopicFn } from '@/features/email/client/email'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type PublicNewsletterTopic = Extract<EmailTopic, 'blog' | 'press' | 'product'>

interface NewsletterSignupPanelProps {
  topic: PublicNewsletterTopic
  className?: string
  title?: string
  description?: string
  source?: string
  highlights?: Array<string>
  subscriberLabel?: string
}

const defaultHighlights = [
  'Weekly systems insights',
  'Product and release updates',
  'No spam, unsubscribe anytime',
]

export function NewsletterSignupPanel({
  topic,
  className,
  title = 'Join the Nu Graphix newsletter',
  description = 'Get practical architecture notes, release updates, and delivery insights directly in your inbox.',
  source = 'public-newsletter-panel',
  highlights = defaultHighlights,
  subscriberLabel = 'Join 10,000+ readers following Nu Graphix updates',
}: NewsletterSignupPanelProps) {
  const shouldReduceMotion = useReducedMotion() ?? false
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)

  useEffect(() => {
    if (!isSubmitted) {
      return
    }

    const timeout = window.setTimeout(() => {
      setIsSubmitted(false)
    }, 3_200)

    return () => window.clearTimeout(timeout)
  }, [isSubmitted])

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/8 via-background to-accent/10 p-1',
        className,
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 size-72 rounded-full bg-primary/10 blur-3xl"
        animate={
          shouldReduceMotion
            ? undefined
            : { scale: [1, 1.15, 1], rotate: [0, 90, 0] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 18, repeat: Infinity, ease: 'linear' }
        }
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 size-72 rounded-full bg-accent/10 blur-3xl"
        animate={
          shouldReduceMotion
            ? undefined
            : { scale: [1.12, 1, 1.12], rotate: [0, -90, 0] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 14, repeat: Infinity, ease: 'linear' }
        }
      />

      <Card className="relative overflow-hidden border-border bg-card/85 p-6 shadow-none sm:p-8 md:p-10">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,380px)] md:items-center">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
            className="space-y-4"
          >
            <motion.div
              animate={shouldReduceMotion ? undefined : { rotate: [0, 8, -8, 0] }}
              transition={
                shouldReduceMotion
                  ? undefined
                  : { duration: 2.2, repeat: Infinity, repeatDelay: 3 }
              }
            >
              <Badge
                variant="secondary"
                className="inline-flex h-6 items-center gap-2 border-border bg-secondary text-secondary-foreground"
              >
                <Sparkles className="size-3.5" />
                Stay Updated
              </Badge>
            </motion.div>

            <h3 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {title}
            </h3>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>

            <div className="flex flex-wrap gap-2">
              {highlights.map((item, index) => (
                <motion.div
                  key={item}
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.2,
                    delay: shouldReduceMotion ? 0 : Math.min(index * 0.08, 0.24),
                  }}
                >
                  <Badge
                    variant="outline"
                    className="inline-flex items-center gap-1.5 border-border bg-background/80 text-foreground"
                  >
                    <Check className="size-3 text-accent" />
                    {item}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: 0.05 }}
          >
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="newsletter-form"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                  className="space-y-3 rounded-2xl border border-border bg-background/80 p-4"
                  onSubmit={async (event) => {
                    event.preventDefault()
                    if (isSubmitting || email.trim().length === 0) {
                      return
                    }

                    setIsSubmitting(true)
                    try {
                      await subscribeToEmailTopicFn({
                        data: {
                          email,
                          topic,
                          source,
                        },
                      })
                      setEmail('')
                      setIsSubmitted(true)
                      toast.success('Subscription updated successfully')
                    } catch (error) {
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : 'Failed to update subscription',
                      )
                    } finally {
                      setIsSubmitting(false)
                    }
                  }}
                >
                  <label htmlFor="newsletter-signup-email" className="sr-only">
                    Email address
                  </label>

                  <motion.div
                    animate={isInputFocused ? { scale: 1.01, y: -1 } : { scale: 1, y: 0 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
                    className="relative rounded-md"
                  >
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Input
                      id="newsletter-signup-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      placeholder="Enter your email"
                      className="pl-9"
                      required
                    />
                  </motion.div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || email.trim().length === 0}
                  >
                    {isSubmitting ? 'Submitting...' : 'Subscribe'}
                    <motion.span
                      className="ml-2 inline-flex"
                      animate={shouldReduceMotion ? undefined : { x: [0, 4, 0] }}
                      transition={
                        shouldReduceMotion
                          ? undefined
                          : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                      }
                    >
                      <Send className="size-4" />
                    </motion.span>
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    By subscribing, you agree to our privacy policy.
                  </p>
                </motion.form>
              ) : (
                <motion.div
                  key="newsletter-success"
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-background/80 p-4 text-center"
                >
                  <motion.span
                    initial={shouldReduceMotion ? false : { scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.45,
                      type: 'spring',
                      stiffness: 220,
                      damping: 18,
                    }}
                    className="inline-flex size-14 items-center justify-center rounded-full border border-accent/35 bg-accent/15"
                  >
                    <Check className="size-7 text-accent" />
                  </motion.span>
                  <p className="text-base font-semibold text-foreground">You are all set.</p>
                  <p className="text-sm text-muted-foreground">
                    Check your inbox to confirm your subscription.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </Card>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        {subscriberLabel}
      </p>
    </section>
  )
}

