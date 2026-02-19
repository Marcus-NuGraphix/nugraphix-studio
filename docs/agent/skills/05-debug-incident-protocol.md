# Skill 05 — Debug & Incident Protocol

## 3-failure rule

After 3 failed attempts:

- Stop
- Diagnose (top suspects)
- Add targeted logs
- Confirm root cause
- Apply one minimal fix
- Add prevention note to `docs/ai-mistakes.md`

Implementation hook:

- Use `recordFailureForEscalation(...)` from
  `src/lib/observability/failure-escalation.ts`.
- Resolve recovered incidents with `resolveFailureEscalation(...)`.

## Production incidents

- Hotfix branch
- Rollback plan
- Postmortem required for S1

## Structured incident logs

- Emit `incident.event` via `logIncidentEvent(...)` in
  `src/lib/observability/incident-log.ts`.
- Required fields:
  - `incidentKey`
  - `domain`
  - `category`
  - `action`
  - `severity`
  - `status`

## Blog publish-flow standard

- `incidentKey`: `blog.publish-flow`
- `category`: `publish-flow`
- `severity`: `S2`
