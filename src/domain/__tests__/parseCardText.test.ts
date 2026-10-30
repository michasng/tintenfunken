import { describe, expect, it } from 'vitest'
import { parseCardText } from '@/domain/parseCardText'

describe('parseCardText', () => {
  describe('given a card with a link in a list item', () => {
    it('keeps the link text without markup or list marker', () => {
      const parsed = parseCardText('## Titel\n\nKern.\n\n### Passt zu\n\n- [Der Mentor](x.md)\n')

      expect(parsed.references).toEqual(['Der Mentor'])
    })
  })

  describe('given a section with an unknown heading', () => {
    it('ignores its content', () => {
      const parsed = parseCardText('## Titel\n\nKern.\n\n### Unbekannt\n\nIgnoriert.\n')

      expect(parsed.essence).toBe('Kern.')
    })
  })

  describe('given a card without a warning', () => {
    it('leaves the pitfall undefined', () => {
      expect(parseCardText('## Titel\n\nKern.\n').pitfall).toBeUndefined()
    })
  })
})
