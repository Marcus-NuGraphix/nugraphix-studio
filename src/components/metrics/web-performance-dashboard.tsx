'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Code2,
  Download,
  FileCode,
  FileImage,
  FileType,
  Layout,
  Lightbulb,
  Smartphone,
  Zap,
} from 'lucide-react'
import type { Variants } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type WebPerformanceStatus = 'good' | 'needs-improvement' | 'poor'
export type PerformanceResourceType = 'js' | 'css' | 'image' | 'font' | 'other'

export interface WebPerformanceVital {
  label: string
  value: string | number
  unit?: string
  description: string
  status: WebPerformanceStatus
  icon: ReactNode
}

export interface PerformanceResourceItem {
  name: string
  type: PerformanceResourceType
  size: string
  time: string
}

export interface PerformanceTipGroup {
  title: string
  icon: ReactNode
  items: Array<string>
}

interface WebPerformanceDashboardProps {
  className?: string
  score?: number
  scoreDescription?: string
  vitals?: Array<WebPerformanceVital>
  resources?: Array<PerformanceResourceItem>
  tips?: Array<PerformanceTipGroup>
  onRunAudit?: () => void
  onExport?: () => void
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
}

const defaultVitals: Array<WebPerformanceVital> = [
  {
    label: 'Largest Contentful Paint (LCP)',
    value: '1.2',
    unit: 's',
    description: 'Time for primary content to become visible.',
    status: 'good',
    icon: <Layout className="size-5" />,
  },
  {
    label: 'First Input Delay (FID)',
    value: '12',
    unit: 'ms',
    description: 'Delay between first interaction and browser response.',
    status: 'good',
    icon: <Zap className="size-5" />,
  },
  {
    label: 'Cumulative Layout Shift (CLS)',
    value: '0.04',
    description: 'Visual stability score across layout updates.',
    status: 'good',
    icon: <Layout className="size-5" />,
  },
  {
    label: 'Interaction to Next Paint (INP)',
    value: '180',
    unit: 'ms',
    description: 'Overall responsiveness during user interactions.',
    status: 'needs-improvement',
    icon: <Activity className="size-5" />,
  },
]

const defaultResources: Array<PerformanceResourceItem> = [
  { name: 'main-app.js', type: 'js', size: '142 KB', time: '45ms' },
  { name: 'styles.css', type: 'css', size: '24 KB', time: '12ms' },
  { name: 'hero-image.webp', type: 'image', size: '86 KB', time: '120ms' },
  { name: 'brand-font.woff2', type: 'font', size: '32 KB', time: '25ms' },
  { name: 'analytics.js', type: 'js', size: '15 KB', time: '30ms' },
]

const defaultTips: Array<PerformanceTipGroup> = [
  {
    title: 'Optimize LCP',
    icon: <Layout className="size-5" />,
    items: [
      'Prioritize above-the-fold image delivery and compression.',
      'Defer non-critical scripts and preload key resources.',
      'Minimize render-blocking stylesheet chains.',
    ],
  },
  {
    title: 'Improve FID/INP',
    icon: <Zap className="size-5" />,
    items: [
      'Break long tasks into smaller units with idle scheduling.',
      'Split client bundles by route and priority.',
      'Avoid heavy sync work inside event handlers.',
    ],
  },
  {
    title: 'Reduce CLS',
    icon: <Smartphone className="size-5" />,
    items: [
      'Define fixed media dimensions or aspect-ratio containers.',
      'Reserve layout space for embedded surfaces and dynamic blocks.',
      'Prefer transform animations over layout-affecting properties.',
    ],
  },
  {
    title: 'Resource Governance',
    icon: <Code2 className="size-5" />,
    items: [
      'Use compression and immutable cache headers for static assets.',
      'Route static delivery through CDN edges close to users.',
      'Track regressions by reviewing bundle deltas each release.',
    ],
  },
]

const statusStyles: Record<
  WebPerformanceStatus,
  {
    badgeClassName: string
    iconClassName: string
    icon: LucideIcon
    label: string
  }
> = {
  good: {
    badgeClassName: 'border-accent/35 bg-accent/15 text-foreground',
    iconClassName: 'text-accent',
    icon: CheckCircle2,
    label: 'Good',
  },
  'needs-improvement': {
    badgeClassName: 'border-primary/35 bg-primary/10 text-foreground',
    iconClassName: 'text-primary',
    icon: AlertCircle,
    label: 'Needs improvement',
  },
  poor: {
    badgeClassName: 'border-destructive/35 bg-destructive/10 text-destructive',
    iconClassName: 'text-destructive',
    icon: AlertCircle,
    label: 'Poor',
  },
}

const resourceIconClassNames: Record<PerformanceResourceType, string> = {
  js: 'text-primary',
  css: 'text-accent',
  image: 'text-muted-foreground',
  font: 'text-secondary-foreground',
  other: 'text-muted-foreground',
}

const resourceIcons: Record<PerformanceResourceType, LucideIcon> = {
  js: FileCode,
  css: FileType,
  image: FileImage,
  font: FileType,
  other: FileCode,
}

export function WebPerformanceDashboard({
  className,
  score = 92,
  scoreDescription = 'Your page is optimized and delivering a reliable user experience.',
  vitals = defaultVitals,
  resources = defaultResources,
  tips = defaultTips,
  onRunAudit,
  onExport,
}: WebPerformanceDashboardProps) {
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card/70 p-5 sm:p-6',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 size-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 size-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial={prefersReducedMotion ? undefined : 'hidden'}
        animate="visible"
        className="space-y-6"
      >
        <Header
          onExport={onExport}
          onRunAudit={onRunAudit}
          prefersReducedMotion={prefersReducedMotion}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {vitals.map((vital) => (
            <VitalCard
              key={vital.label}
              vital={vital}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <ScoreCard
            score={score}
            description={scoreDescription}
            prefersReducedMotion={prefersReducedMotion}
          />
          <ResourceBreakdown resources={resources} />
        </div>

        <TipsPanel tips={tips} />
      </motion.div>
    </section>
  )
}

interface HeaderProps {
  onRunAudit?: () => void
  onExport?: () => void
  prefersReducedMotion: boolean
}

function Header({ onRunAudit, onExport, prefersReducedMotion }: HeaderProps) {
  return (
    <motion.div variants={itemVariants} className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="inline-flex h-6 items-center gap-2 border-accent/40 bg-accent/15 px-3 text-[11px] tracking-[0.12em] uppercase"
          >
            <span className="size-2 rounded-full bg-accent" />
            Audit complete
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Web Performance
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Core Web Vitals, resource behavior, and optimization guidance for
            current release quality checks.
          </p>
        </div>

        <div className="inline-flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="rounded-full"
            onClick={onExport}
            aria-label="Export performance report"
          >
            <Download className="size-4" />
          </Button>
          <motion.div
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.98 }}
          >
            <Button type="button" className="rounded-full" onClick={onRunAudit}>
              Run audit
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

interface VitalCardProps {
  vital: WebPerformanceVital
  prefersReducedMotion: boolean
}

function VitalCard({ vital, prefersReducedMotion }: VitalCardProps) {
  const statusMeta = statusStyles[vital.status]
  const StatusIcon = statusMeta.icon

  return (
    <motion.article
      variants={itemVariants}
      whileHover={prefersReducedMotion ? undefined : { y: -2 }}
      className="group rounded-xl border border-border bg-background/75 p-4 shadow-xs"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="rounded-lg border border-border bg-background/70 p-2 text-muted-foreground">
          {vital.icon}
        </div>

        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium',
            statusMeta.badgeClassName,
          )}
        >
          <StatusIcon className={cn('size-3.5', statusMeta.iconClassName)} />
          {statusMeta.label}
        </span>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {vital.label}
        </p>
        <p className="inline-flex items-end gap-1 text-3xl font-bold tracking-tight text-foreground">
          {vital.value}
          {vital.unit ? (
            <span className="pb-1 text-sm font-medium text-muted-foreground">
              {vital.unit}
            </span>
          ) : null}
        </p>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {vital.description}
      </p>
    </motion.article>
  )
}

interface ScoreCardProps {
  score: number
  description: string
  prefersReducedMotion: boolean
}

function ScoreCard({
  score,
  description,
  prefersReducedMotion,
}: ScoreCardProps) {
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const safeScore = Math.min(100, Math.max(0, score))
  const strokeDashoffset = circumference - (safeScore / 100) * circumference
  const scoreToneClassName =
    safeScore >= 90
      ? 'text-accent'
      : safeScore >= 70
        ? 'text-primary'
        : 'text-destructive'

  return (
    <motion.div
      variants={itemVariants}
      className="rounded-xl border border-border bg-background/75 p-5 text-center"
    >
      <div className="mx-auto mb-5 grid w-fit place-items-center">
        <svg className="h-44 w-44 -rotate-90 transform">
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-muted/35"
          />
          <motion.circle
            cx="88"
            cy="88"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={scoreToneClassName}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: prefersReducedMotion ? 0 : 1.2,
              ease: 'easeOut',
            }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <p className="text-4xl font-bold tracking-tighter text-foreground">
            {safeScore}
          </p>
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            score
          </p>
        </div>
      </div>

      <h3 className="text-base font-semibold text-foreground">
        {safeScore >= 90
          ? 'Excellent performance'
          : safeScore >= 70
            ? 'Stable performance'
            : 'Needs optimization'}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </motion.div>
  )
}

interface ResourceBreakdownProps {
  resources: Array<PerformanceResourceItem>
}

function ResourceBreakdown({ resources }: ResourceBreakdownProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="xl:col-span-2 rounded-xl border border-border bg-background/75 p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">
          Resource breakdown
        </h3>
        <Badge variant="secondary" className="h-6">
          {resources.length} requests
        </Badge>
      </div>

      <div className="space-y-3">
        {resources.map((resource) => {
          const Icon = resourceIcons[resource.type]

          return (
            <div
              key={`${resource.name}-${resource.time}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border/80 bg-card/70 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background/60">
                  <Icon
                    className={cn(
                      'size-4',
                      resourceIconClassNames[resource.type],
                    )}
                    aria-hidden="true"
                  />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {resource.name}
                  </p>
                  <p className="text-[11px] tracking-[0.1em] text-muted-foreground uppercase">
                    {resource.type}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {resource.time}
                </p>
                <p className="text-xs text-muted-foreground">{resource.size}</p>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

interface TipsPanelProps {
  tips: Array<PerformanceTipGroup>
}

function TipsPanel({ tips }: TipsPanelProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-xl border border-border bg-background/75 p-5"
    >
      <div className="mb-5 flex items-center gap-2">
        <Lightbulb className="size-5 text-primary" />
        <h3 className="text-base font-semibold text-foreground">
          Performance optimization tips
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tips.map((tip) => (
          <article
            key={tip.title}
            className="space-y-3 rounded-lg border border-border bg-card/70 p-4"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex size-8 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                {tip.icon}
              </span>
              <h4 className="text-sm font-semibold text-foreground">
                {tip.title}
              </h4>
            </div>
            <ul className="space-y-2">
              {tip.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </motion.div>
  )
}
