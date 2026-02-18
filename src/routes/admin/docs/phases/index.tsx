import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/admin/docs/phases/')({
  component: AdminPhasePlaybooksPage,
})

type PhaseStatus = 'Complete' | 'In Progress' | 'Pending'

interface PhasePlaybookLink {
  phase: string
  status: PhaseStatus
  summary: string
  href: string
}

interface ProgramDocLink {
  title: string
  description: string
  href: string
}

const DOCS_BASE_URL =
  'https://github.com/Marcus-NuGraphix/nugraphix-studio/blob/dev'

const phasePlaybooks: Array<PhasePlaybookLink> = [
  {
    phase: 'Phase 0',
    status: 'Complete',
    summary: 'Baseline and docs governance',
    href: `${DOCS_BASE_URL}/docs/08-implementation/01-phased-plan.md#phase-0---baseline-and-docs-governance`,
  },
  {
    phase: 'Phase 1',
    status: 'Complete',
    summary: 'Local environment hardening',
    href: `${DOCS_BASE_URL}/docs/08-implementation/01-phased-plan.md#phase-1---local-environment-hardening`,
  },
  {
    phase: 'Phase 2',
    status: 'Pending',
    summary: 'Production-dev runtime on VM',
    href: `${DOCS_BASE_URL}/docs/08-implementation/01-phased-plan.md#phase-2---production-dev-runtime-on-vm`,
  },
  {
    phase: 'Phase 3',
    status: 'In Progress',
    summary: 'Hosting and latency decision',
    href: `${DOCS_BASE_URL}/docs/08-implementation/01-phased-plan.md#phase-3---hosting-and-latency-decision`,
  },
  {
    phase: 'Phase 4',
    status: 'Pending',
    summary: 'Design system and lib foundation expansion',
    href: `${DOCS_BASE_URL}/docs/08-implementation/01-phased-plan.md#phase-4---design-system-and-lib-foundation-expansion`,
  },
  {
    phase: 'Phase 5',
    status: 'Pending',
    summary: 'Dashboard workspaces refactor',
    href: `${DOCS_BASE_URL}/docs/08-implementation/01-phased-plan.md#phase-5---dashboard-workspaces-refactor`,
  },
  {
    phase: 'Phase 6',
    status: 'Pending',
    summary: 'Auth and security hardening',
    href: `${DOCS_BASE_URL}/docs/08-implementation/01-phased-plan.md#phase-6---auth-and-security-hardening`,
  },
  {
    phase: 'Phase 7',
    status: 'Pending',
    summary: 'Repo polish and CI discipline',
    href: `${DOCS_BASE_URL}/docs/08-implementation/01-phased-plan.md#phase-7---repo-polish-and-ci-discipline`,
  },
  {
    phase: 'Phase 8',
    status: 'Pending',
    summary: 'Final readiness review',
    href: `${DOCS_BASE_URL}/docs/08-implementation/01-phased-plan.md#phase-8---final-readiness-review`,
  },
]

const programLinks: Array<ProgramDocLink> = [
  {
    title: 'System Index',
    description: 'Single entry point for active hardening docs.',
    href: `${DOCS_BASE_URL}/docs/00-index.md`,
  },
  {
    title: 'Task Board',
    description: 'Active, in-progress, and completed tasks.',
    href: `${DOCS_BASE_URL}/docs/08-implementation/02-task-board.md`,
  },
  {
    title: 'Risk Register',
    description: 'Top production blockers and mitigations.',
    href: `${DOCS_BASE_URL}/docs/01-audit/02-risk-register.md`,
  },
  {
    title: 'Decisions Log',
    description: 'Operational decisions and follow-up actions.',
    href: `${DOCS_BASE_URL}/docs/08-implementation/03-decisions-log.md`,
  },
]

const statusVariant = (status: PhaseStatus) => {
  if (status === 'Complete') return 'secondary'
  if (status === 'In Progress') return 'default'
  return 'outline'
}

function AdminPhasePlaybooksPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Phase Playbooks
        </h1>
        <p className="text-sm text-muted-foreground">
          Direct links to the active docs-first execution plan and governance
          records.
        </p>
      </header>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Active Phases</CardTitle>
          <CardDescription>
            Status and source-of-record links for phases 0-8.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {phasePlaybooks.map((item) => (
              <li
                key={item.phase}
                className="flex flex-col gap-2 rounded-md border border-border p-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {item.phase}
                    </p>
                    <Badge
                      variant={statusVariant(item.status)}
                      className="rounded-md"
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.summary}</p>
                </div>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-foreground hover:text-primary"
                >
                  Open playbook
                  <ArrowUpRight className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-none">
        <CardHeader>
          <CardTitle>Program Documents</CardTitle>
          <CardDescription>
            Fast access to the current hardening governance set.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {programLinks.map((item) => (
              <li
                key={item.title}
                className="flex flex-col gap-1 rounded-md border border-border p-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-foreground hover:text-primary"
                >
                  Open document
                  <ArrowUpRight className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
