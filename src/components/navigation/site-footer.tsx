'use client'

import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUp,
  ExternalLink,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  Twitter,
  Youtube,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { BrandLockup, brandConfig } from '@/components/brand'
import { quickNavigationLinks } from '@/components/navigation/site-navigation'
import { subscribeToEmailTopicFn } from '@/features/email/client/email'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Services', to: '/services' as const },
      { label: 'Portfolio', to: '/portfolio' as const },
      { label: 'Blog', to: '/blog' as const },
      { label: 'Contact', to: '/contact' as const },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' as const },
      { label: 'Home', to: '/' as const },
      { label: 'Contact', to: '/contact' as const },
      { label: 'Privacy Policy', to: '/privacy-policy' as const },
    ],
  },
] as const

const socialLabels = {
  x: 'X',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
} as const

const socialIconMap = {
  x: Twitter,
  linkedin: Linkedin,
  github: Github,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
} as const

type SocialLabelKey = keyof typeof socialLabels

export function SiteFooter() {
  const shouldReduceMotion = useReducedMotion() ?? false
  const year = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const socialLinks = Object.entries(brandConfig.social).filter(
    (entry): entry is [SocialLabelKey, string] => {
      const [key, value] = entry
      return Object.prototype.hasOwnProperty.call(socialLabels, key) && Boolean(value)
    },
  )
  const legalLinks = quickNavigationLinks.filter((item) => item.to === '/privacy-policy')

  return (
    <footer className="relative overflow-hidden border-t border-border bg-card/85 backdrop-blur-xl">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-32 left-1/2 size-80 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
          animate={
            shouldReduceMotion
              ? undefined
              : { opacity: [0.2, 0.5, 0.2], scale: [0.92, 1.06, 0.92] }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 14, repeat: Infinity, ease: 'easeInOut' }
          }
        />
        <motion.div
          className="absolute -bottom-28 right-0 size-80 rounded-full bg-accent/15 blur-3xl"
          animate={
            shouldReduceMotion
              ? undefined
              : { opacity: [0.2, 0.4, 0.2], rotate: [0, 24, 0] }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 16, repeat: Infinity, ease: 'linear' }
          }
        />
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_repeat(2,minmax(0,1fr))]">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-2">
              <Card className="rounded-xl border border-border bg-card/95 px-3 py-1.5 text-xs font-semibold tracking-[0.24em] text-muted-foreground uppercase shadow-none">
                Nu Graphix
              </Card>
              <Badge
                variant="outline"
                className="border-accent/35 bg-accent/15 text-foreground"
              >
                <motion.span
                  animate={shouldReduceMotion ? undefined : { rotate: [0, 10, -10, 0] }}
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : { duration: 2.2, repeat: Infinity, repeatDelay: 2.8 }
                  }
                  className="inline-flex"
                >
                  <Sparkles className="size-3.5 text-accent" />
                </motion.span>
                {brandConfig.serviceName}
              </Badge>
            </div>

            <BrandLockup compact />

            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              {brandConfig.tagline}
            </p>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="inline-flex items-center gap-2">
                <MapPin className="size-4" />
                South Africa
              </p>
              <p className="inline-flex items-center gap-2">
                <Phone className="size-4" />
                Contact via discovery call request
              </p>
              <a
                href={`mailto:${brandConfig.contactEmail}`}
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Mail className="size-4" />
                {brandConfig.contactEmail}
              </a>
            </div>

            <form
              className="flex flex-col gap-2 sm:flex-row"
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
                      topic: 'blog',
                      source: 'public-footer',
                    },
                  })
                  setEmail('')
                  toast.success('Subscribed to newsletter updates.')
                } catch (error) {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : 'Unable to subscribe right now.',
                  )
                } finally {
                  setIsSubmitting(false)
                }
              }}
            >
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="h-10 rounded-xl border-border bg-background/75"
                required
              />
              <Button
                type="submit"
                className="h-10 rounded-xl sm:shrink-0"
                disabled={isSubmitting || email.trim().length === 0}
                aria-label="Subscribe to newsletter"
              >
                <Send className="size-4" />
              </Button>
            </form>

            <p className="text-xs text-muted-foreground">
              Weekly systems updates. No spam.
            </p>

            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {socialLinks.map(([network, href], index) => {
                  const Icon = socialIconMap[network]

                  return (
                    <motion.a
                      key={network}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.2,
                        delay: shouldReduceMotion ? 0 : Math.min(index * 0.06, 0.24),
                      }}
                    >
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="outline"
                        className="rounded-full border-border bg-background/70 text-muted-foreground hover:text-foreground"
                      >
                        <Icon className="size-4" />
                        <span className="sr-only">{socialLabels[network]}</span>
                      </Button>
                    </motion.a>
                  )
                })}
              </div>
            ) : null}
          </motion.div>

          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                delay: shouldReduceMotion ? 0 : 0.06 + sectionIndex * 0.06,
              }}
            >
              <h3 className="mb-4 text-sm font-semibold text-foreground/90">
                {section.title}
              </h3>
              <nav className="space-y-2">
                {section.links.map((item, linkIndex) => (
                  <motion.div
                    key={`${section.title}-${item.to}-${item.label}`}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.2,
                      delay: shouldReduceMotion ? 0 : Math.min(linkIndex * 0.04, 0.16),
                    }}
                  >
                    <Link
                      to={item.to}
                      className="inline-flex rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
          className="h-px origin-left bg-border"
        />

        <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <p>
              © {year} {brandConfig.companyName}. All rights reserved.
            </p>
            <p className="text-muted-foreground/80">
              {brandConfig.serviceName} · {brandConfig.dashboardSubLabel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {legalLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              className="rounded-full border-border bg-background/80"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              aria-label="Scroll to top"
            >
              <motion.span
                animate={shouldReduceMotion ? undefined : { y: [0, -2, 0] }}
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                }
                className="inline-flex"
              >
                <ArrowUp className="size-4" />
              </motion.span>
            </Button>
            <a
              href={brandConfig.siteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
            >
              Website
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
