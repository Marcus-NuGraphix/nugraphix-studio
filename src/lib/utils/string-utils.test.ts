import { describe, expect, it } from 'vitest'
import { generateSlug } from '@/lib/utils/generate-slug'
import { getInitials } from '@/lib/utils/get-initials'

describe('generateSlug', () => {
  it('creates stable kebab-case slugs', () => {
    expect(generateSlug('Structured Digital Systems')).toBe(
      'structured-digital-systems',
    )
  })

  it('normalizes accented characters and punctuation', () => {
    expect(generateSlug('Café déjà vu!')).toBe('cafe-deja-vu')
  })

  it('falls back when slug result is empty', () => {
    expect(generateSlug('***')).toBe('untitled')
    expect(generateSlug('***', { fallback: 'post' })).toBe('post')
  })

  it('honors maxLength without leaving trailing separators', () => {
    expect(generateSlug('alpha beta gamma delta', { maxLength: 11 })).toBe(
      'alpha-beta',
    )
  })
})

describe('getInitials', () => {
  it('uses first and last parts for multi-word names', () => {
    expect(getInitials('Jane Mary Doe')).toBe('JD')
  })

  it('supports email-style names', () => {
    expect(getInitials('alice.operations@example.com')).toBe('AO')
  })

  it('returns fallback for empty input', () => {
    expect(getInitials('   ')).toBe('?')
    expect(getInitials('', { fallback: 'NA' })).toBe('NA')
  })

  it('supports up to three initials when requested', () => {
    expect(getInitials('John Ronald Reuel Tolkien', { maxInitials: 3 })).toBe(
      'JTR',
    )
  })
})
