SECURITY REVIEW MODE

Check:

- validation (Zod)
- auth/roles (server-side)
- rate limiting
- Turnstile verification (if public form)
- error leaks
- unsafe HTML injection
- logging hygiene
  Return:
- top issues (ranked)
- exact file/line guidance
- minimal fix approach
