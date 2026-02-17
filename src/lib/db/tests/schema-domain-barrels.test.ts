import { describe, expect, it } from 'vitest'
import * as authDomain from '../schema/auth'
import * as newsDomain from '../schema/blog'
import * as contentDomain from '../schema/content'
import * as emailDomain from '../schema/email'
import * as rootSchema from '../schema/index'
import * as mediaDomain from '../schema/media'

describe('db schema domain barrel contracts', () => {
  it('re-exports auth schema through the root barrel', () => {
    expect(rootSchema.user).toBe(authDomain.user)
    expect(rootSchema.session).toBe(authDomain.session)
    expect(rootSchema.account).toBe(authDomain.account)
  })

  it('re-exports newsroom schema through the root barrel', () => {
    expect(rootSchema.post).toBe(newsDomain.post)
    expect(rootSchema.postCategory).toBe(newsDomain.postCategory)
    expect(rootSchema.postTag).toBe(newsDomain.postTag)
    expect(rootSchema.pressRelease).toBe(newsDomain.pressRelease)
  })

  it('re-exports media, email, and content schema through the root barrel', () => {
    expect(rootSchema.mediaAsset).toBe(mediaDomain.mediaAsset)
    expect(rootSchema.emailMessage).toBe(emailDomain.emailMessage)
    expect(rootSchema.contentEntry).toBe(contentDomain.contentEntry)
  })
})
