import { describe, expect, it } from 'vitest'
import { verifyDrizzleArtifacts } from '../migrations/verify-artifacts'

describe('drizzle migration artifacts', () => {
  it('are deterministic and internally consistent', async () => {
    const result = await verifyDrizzleArtifacts()
    expect(result.issues).toEqual([])
  })
})
