import { describe, expect, it } from 'vitest'
import type { Card } from '@/domain/Card'
import { Category } from '@/domain/Category'
import { resolveReferences } from '@/domain/resolveReferences'

const buildCard = (overrides: Partial<Card>): Card => ({
  number: 1,
  category: Category.Archetype,
  title: 'Der Held',
  slug: 'der-held',
  essence: '',
  function: '',
  application: '',
  examples: '',
  references: [],
  sources: [],
  artworkPrompt: '',
  ...overrides,
})

describe('resolveReferences', () => {
  describe('given references to cards in the deck', () => {
    it('adds the number and category of each referenced card', () => {
      const mentor = buildCard({ number: 2, title: 'Der Mentor', category: Category.Scene })
      const hero = buildCard({ references: ['Der Mentor'] })

      expect(resolveReferences(hero, [hero, mentor])).toEqual([
        { title: 'Der Mentor', category: Category.Scene, number: 2 },
      ])
    })
  })

  describe('given a reference to a card outside the deck', () => {
    it('keeps the title without number and category', () => {
      const hero = buildCard({ references: ['Der Schatten'] })

      expect(resolveReferences(hero, [hero])).toEqual([
        { title: 'Der Schatten', category: undefined, number: undefined },
      ])
    })
  })
})
