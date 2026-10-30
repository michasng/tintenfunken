import { describe, expect, it } from 'vitest'
import type { Card } from '@/domain/Card'
import { Category } from '@/domain/Category'
import { selectCards } from '../selectCards'

const card = (number: number, title: string, slug: string): Card => ({
  number,
  category: Category.Archetype,
  title,
  slug,
  essence: '',
  function: '',
  application: '',
  examples: '',
  references: [],
  sources: [],
  artworkPrompt: '',
})

const DECK = [card(1, 'Der Held', 'der-held'), card(2, 'Der Mentor', 'der-mentor')]

describe('selectCards', () => {
  describe('given no wanted keys', () => {
    it('selects the whole deck', () => {
      expect(selectCards(DECK, [])).toEqual({ cards: DECK, unknown: [] })
    })
  })

  describe('given titles and slugs in any case', () => {
    it('selects the matching cards in the requested order', () => {
      const { cards } = selectCards(DECK, ['DER-MENTOR', 'der held'])

      expect(cards.map((selected) => selected.number)).toEqual([2, 1])
    })
  })

  describe('given an unknown key', () => {
    it('reports it and still selects the known cards', () => {
      expect(selectCards(DECK, ['Der Held', 'Typo'])).toEqual({
        cards: [DECK[0]],
        unknown: ['Typo'],
      })
    })
  })
})
