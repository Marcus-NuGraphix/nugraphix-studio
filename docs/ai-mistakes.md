# AI Mistakes Log (Nu Graphix Studio)

This log is mandatory. Every repeat mistake becomes a rule, test, or constraint.

## Rules

- If an issue happens **twice**, it becomes a:
  - checklist item, OR
  - new prompt constraint, OR
  - validation rule, OR
  - test, OR
  - ADR (if architectural)

- Log entries must be written immediately after the fix is confirmed.

- Never use this file to vent. Keep it factual, precise, and prevention-focused.

---

## Entry Template (Copy/Paste)

### Date

YYYY-MM-DD

### Feature

<feature name>

### Phase

<phase number/name>

### Environment

local / staging / production

### Mistake

What was done wrong? (AI or human)

### Root Cause

Precise technical reason (not symptoms)

### Detection Signal

What log, error code, test, or symptom revealed it?

### Prevention Rule

The exact new rule we will enforce going forward.

Examples:

- “Do not modify any files outside the provided file list.”
- “All mutations must Zod-validate inputs.”
- “All admin mutations must call requireAdmin() server-side.”
- “Return ServerResult<T>; do not throw for expected failures.”
- “No dangerouslySetInnerHTML without sanitization.”

### Severity

Low / Medium / High

### Fix Summary

What was changed to fix it? (one paragraph max)

### Follow-up Tasks

- [ ] <task>
- [ ] <task>

---

## Mistakes

> No entries yet.
