# Fast XML Parser Mitigation Audit

Date: 2026-02-18  
Scope: Dependency vulnerability closure for `GHSA-jmr7-xgp7-cmfj`

## Summary

Closed the production high vulnerability caused by transitive
`fast-xml-parser` in the AWS SDK S3 chain by enforcing
`fast-xml-parser@5.3.6` through `pnpm.overrides`.

## Findings

### High (Resolved)

1. `fast-xml-parser` DoS advisory (`GHSA-jmr7-xgp7-cmfj`) in production dependency path.
   - Previous path:
     - `@aws-sdk/client-s3` -> `@aws-sdk/core` -> `@aws-sdk/xml-builder` -> `fast-xml-parser`
   - Mitigation:
     - Added override in `package.json`:
       - `"pnpm": { "overrides": { "fast-xml-parser": "5.3.6" } }`
   - Verification:
     - `pnpm list fast-xml-parser --depth 12` shows AWS SDK chain resolving to `5.3.6`.
     - `pnpm audit --prod` no longer reports the high advisory.

### Medium (Open)

1. Transitive `esbuild` advisory remains (`GHSA-67mh-4wv8-2f99`) under
   `better-auth` -> `drizzle-kit` -> `@esbuild-kit/*`.
   - Status: tracked as non-high follow-up in risk register.

## Verification Commands

- `pnpm install`
- `pnpm list fast-xml-parser --depth 12`
- `pnpm audit --prod`

## Recommended Next Step

1. Track upstream dependency updates to remove temporary override and close the
   remaining moderate advisory.
