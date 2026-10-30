import { describe, expect, it } from 'vitest'
import { Category } from '@/domain/Category'
import { parseIndex } from '@/domain/parseIndex'

describe('parseIndex', () => {
  describe('given categories with card links', () => {
    it('returns each card path with its category in order', () => {
      const text = [
        '# Title',
        '- Archetyp',
        '  - [A](cards/a.md)',
        '- Szene',
        '  - [B](cards/b.md)',
      ].join('\n')

      expect(parseIndex(text)).toEqual([
        { category: Category.Archetype, path: 'cards/a.md' },
        { category: Category.Scene, path: 'cards/b.md' },
      ])
    })
  })

  describe('given an unknown category', () => {
    it('fails naming the category', () => {
      expect(() => parseIndex('- Unsinn')).toThrow('Unsinn')
    })
  })

  describe('given a card link before any category', () => {
    it('fails naming the path', () => {
      expect(() => parseIndex('  - [A](cards/a.md)')).toThrow('cards/a.md')
    })
  })
})
