import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CardSearch from '@/components/CardSearch.vue'
import type { Card } from '@/domain/Card'
import { Category } from '@/domain/Category'

const TITLES = ['Der Held', 'Der Mentor', 'Der Schatten', 'Heldenreise']

const makeDeck = (titles: string[]): Card[] =>
  titles.map((title, index) => ({
    number: index + 1,
    category: Category.Archetype,
    title,
    slug: title,
    essence: '',
    function: '',
    application: '',
    examples: '',
    references: [],
    sources: [],
    artworkPrompt: '',
  }))

const mountSearch = (titles = TITLES) => mount(CardSearch, { props: { deck: makeDeck(titles) } })

type Search = ReturnType<typeof mountSearch>

const type = (search: Search, text: string) => search.get('input').setValue(text)
const suggestionTitles = (search: Search) =>
  search.findAll('[role="option"]').map((option) => option.text())

describe('CardSearch', () => {
  describe('given a typed term', () => {
    it('suggests titles containing it case-insensitively', async () => {
      const search = mountSearch()

      await type(search, 'HELD')

      expect(suggestionTitles(search)).toEqual(['Der Held', 'Heldenreise'])
    })

    it('suggests nothing for a term without matches', async () => {
      const search = mountSearch()

      await type(search, 'xyz')

      expect(suggestionTitles(search)).toEqual([])
    })

    it('limits suggestions to eight', async () => {
      const search = mountSearch(Array.from({ length: 20 }, (_, index) => `Karte ${index}`))

      await type(search, 'karte')

      expect(suggestionTitles(search)).toHaveLength(8)
    })
  })

  describe('given suggestions are shown', () => {
    it('moves the highlight with arrow keys and wraps around', async () => {
      const search = mountSearch()
      await type(search, 'der')

      const input = search.get('input')
      await input.trigger('keydown', { key: 'ArrowDown' })
      await input.trigger('keydown', { key: 'ArrowUp' })
      expect(search.get('[aria-selected="true"]').text()).toBe('Der Schatten')

      await input.trigger('keydown', { key: 'ArrowDown' })
      expect(search.get('[aria-selected="true"]').text()).toBe('Der Held')
    })

    it('selects the highlighted suggestion on Enter and clears the field', async () => {
      const search = mountSearch()
      await type(search, 'der')
      await search.get('input').trigger('keydown', { key: 'ArrowDown' })
      await search.get('input').trigger('keydown', { key: 'ArrowDown' })

      await search.get('input').trigger('keydown', { key: 'Enter' })

      expect(search.emitted('select')).toEqual([[2]])
      expect(search.get('input').element.value).toBe('')
      expect(suggestionTitles(search)).toEqual([])
    })

    it('selects the first suggestion on Enter when none is highlighted', async () => {
      const search = mountSearch()
      await type(search, 'der')

      await search.get('input').trigger('keydown', { key: 'Enter' })

      expect(search.emitted('select')).toEqual([[1]])
    })

    it('selects a suggestion on mousedown', async () => {
      const search = mountSearch()
      await type(search, 'der')

      await search.findAll('[role="option"]')[2]?.trigger('mousedown')

      expect(search.emitted('select')).toEqual([[3]])
    })

    it('closes on Escape', async () => {
      const search = mountSearch()
      await type(search, 'der')

      await search.get('input').trigger('keydown', { key: 'Escape' })

      expect(suggestionTitles(search)).toEqual([])
    })

    it('closes when the field loses focus', async () => {
      const search = mountSearch()
      await type(search, 'der')

      await search.get('input').trigger('blur')

      expect(suggestionTitles(search)).toEqual([])
    })
  })
})
