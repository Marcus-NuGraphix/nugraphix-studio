# PHASE 1 — STRATEGY & FOUNDATIONS

## Nu Graphix Studio (TanStack Start Platform)

---

# 1️⃣ Vision & Product Definition

## Objective

Design and build **Nu Graphix Studio** — a structured dual-purpose platform that:

1. Positions Nu Graphix as a high-level digital systems architecture consultancy.
2. Operates as the internal execution engine that captures, refines, and productizes repeatable system architecture patterns.
3. Forms the long-term technical and structural foundation for vertical SaaS and paid education products.

This is not a “company website”.

It is:

* A marketing engine
* A knowledge engine
* A systems architecture laboratory
* A SaaS incubation foundation

---

# Strategic Positioning

Nu Graphix Studio positions Nu Graphix as:

> “Structured Systems Architecture for Operational Businesses.”

Not:

* A freelance dev shop
* A generic web agency
* A portfolio-only website

It must reflect:

* Systems thinking
* Operational clarity
* Architectural discipline
* Long-term scalability

---

# Problem Statement

Without this platform:

* Marketing remains reactive and inconsistent.
* Technical knowledge fragments across notes and memory.
* Architecture decisions lack documentation and repeatability.
* Content production is sporadic.
* SaaS evolution lacks structural foundations.

Nu Graphix Studio creates:

* Centralized institutional knowledge.
* Repeatable architectural patterns.
* A structured delivery methodology.
* Authority through documented technical thinking.
* A controlled path from consultancy → productized SaaS.

---

# Target Audience

## Primary (Revenue Now)

South African SMEs with operational complexity:

* Construction
* Logistics
* Manufacturing
* Property management
* Multi-branch service businesses

Pain:

* Spreadsheet dependency
* Manual processes
* Reporting blind spots
* WhatsApp chaos
* No system ownership

---

## Secondary (Influencer Layer)

Operations managers who:

* Experience inefficiency daily
* Need automation and visibility
* Want accountability and audit trails
* Validate you internally to the owner

---

## Tertiary (Future Monetization)

Developers and founders who:

* Want structured architecture thinking
* Want practical real-world system design
* Want implementation patterns

This persona does **not** influence MVP decisions.

---

# Market Category

Nu Graphix Studio operates in three overlapping categories:

1. Digital Systems Architecture Consultancy
2. Internal Operating Platform
3. SaaS Incubation Framework

---

# Core Value Proposition

Nu Graphix designs structured digital systems that:

* Eliminate manual processes
* Centralize operational control
* Improve reporting transparency
* Unlock measurable business growth

Nu Graphix Studio is both:

* Public proof of capability
* Internal execution engine
* Repeatability system
* SaaS incubation layer

---

# MVP Scope (Strict Cutline)

This is the most important section for preventing scope creep.

---

## INCLUDED (MVP)

### Marketing Layer

* Core marketing pages
* Services overview
* Portfolio / case studies
* Blog (rich text powered by ProseKit)
* Contact form with Turnstile + email

### Internal Admin

* Authentication (admin only)
* CMS (posts, case studies, pages)
* Knowledge Base (rich text + search)
* Architecture Docs Hub (ADRs + standards)
* Postgres full-text search
* Structured logging
* Email notifications
* Observability (Sentry + logs)
* CI/CD pipeline

---

## EXCLUDED (Post-MVP)

* Client portal
* Multi-tenant UI
* Billing / subscriptions
* CRM dashboard
* Advanced analytics dashboard
* Social automation tooling
* RLS enforcement (app-level scoping only)
* SaaS feature gating
* Organization management UI

---

# Success Metrics

## Business KPIs

* Qualified inbound leads/month
* Lead → consult conversion rate
* Consult → proposal conversion rate
* Proposal → signed conversion rate
* Average contract value
* Recurring revenue %
* Blog publishing consistency

---

## Authority Metrics

* Blog posts/month
* Organic traffic growth
* Returning visitor rate
* Email list growth (future)

---

## Internal Efficiency Metrics

* KB entries/week
* Architecture decisions documented per project
* Time-to-publish content
* Number of reusable system templates created
* Feature implementation velocity

---

## Technical Targets

* Core Web Vitals: “Good”
* <300ms P95 server function latency
* 99.9% uptime
* Zero sensitive data leaks
* Structured mutation logging
* Automated DB backups verified

---

# User Personas

## Persona 1 — Operations-Focused Business Owner

* ROI-driven
* Wants clarity
* Doesn’t care about tech jargon
* Needs measurable improvement

---

## Persona 2 — Operations Manager

* Feels daily inefficiency
* Needs automation
* Wants accountability
* Wants structured system thinking

---

## Persona 3 — You (Founder / Architect)

Critical persona.

Goals:

* Reduce cognitive load
* Capture knowledge as assets
* Convert patterns into reusable modules
* Build compounding authority
* Create SaaS-ready architecture

Nu Graphix Studio must reduce mental fragmentation.

---

## Persona 4 — Future Learner

* Wants structured system design thinking
* Tired of tutorial-based learning
* Wants real implementation clarity

Does not influence MVP complexity.

---

# Core Feature Breakdown (MVP)

---

## Public Marketing (Ship First)

1. Home
2. About
3. Services
4. Portfolio
5. Blog
6. Contact

Principles:

* Clarity over design complexity
* Authority over aesthetics
* Performance-first

---

## Admin Layer

### 1️⃣ Authentication

* Roles: `guest`, `admin`
* Server-side enforcement
* No client-trust logic

---

### 2️⃣ CMS

Content types:

* Blog Post
* Case Study
* Static Page

Storage:

* content_json (ProseMirror JSON)
* content_text (search index)

Editor:

* ProseKit

---

### 3️⃣ Knowledge Base

Structured notes:

* Categories
* Tags
* Search (Postgres FTS)
* Internal linking
* Draft/refined status

Purpose:

* Internal architecture memory
* Blog idea generation
* SaaS pattern library

---

### 4️⃣ Architecture Docs Hub

Sections:

* ADRs
* Design System rules
* Auth strategy
* Deployment standards
* Boilerplate templates
* Tooling standards

This is the “institutional brain.”

---

# Tech Stack (Locked for Phase 1)

Frontend:

* TanStack Start
* Tailwind
* shadcn/ui
* TanStack Query
* TanStack Table

Backend:

* Server Functions
* Zod validation
* Structured error contract

Database:

* Neon PostgreSQL
* Drizzle ORM
* App-level scoping
* Postgres full-text search

Auth:

* Better Auth
* Admin-only initially

Hosting:

* Cloudflare
* R2 for storage

Email:

* SendGrid (free tier initially)
* All email via server functions

Observability:

* Sentry
* Structured logs
* Workers logs

Bot Protection:

* Cloudflare Turnstile

Analytics:

* Umami or Plausible (MVP lightweight)

---

# Architectural Boundaries

To protect MVP focus:

* No multi-tenant UI
* No billing
* No feature gating
* No SaaS complexity
* No heavy analytics dashboards
* No client accounts

Single-tenant admin-only system.

SaaS foundation is architectural, not operational yet.

---

# One-Sentence Anchor

Nu Graphix Studio is the structured marketing and internal architecture platform that transforms consultancy knowledge into repeatable, scalable system intelligence.

---
