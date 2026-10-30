import { describe, expect, it } from 'vitest'
import { slugify } from '@/domain/slugify'

describe('slugify', () => {
  describe('given a title with umlauts', () => {
    it('transliterates them', () => {
      expect(slugify('Größe überm Äther')).toBe('groesse-ueberm-aether')
    })
  })

  describe('given a title with other diacritics', () => {
    it('strips them', () => {
      expect(slugify('Café Noël')).toBe('cafe-noel')
    })
  })

  describe('given a title with a trailing English synonym', () => {
    it('omits the synonym', () => {
      expect(slugify('Falsche Fährte (Red Herring)')).toBe('falsche-faehrte')
    })
  })

  describe('given a title with punctuation', () => {
    it('collapses non-alphanumerics into single dashes and trims them', () => {
      expect(slugify(' Show, Don’t Tell! ')).toBe('show-don-t-tell')
    })
  })
})
