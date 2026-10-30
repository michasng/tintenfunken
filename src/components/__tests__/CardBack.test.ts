import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CardBack from '@/components/CardBack.vue'
import type { Card } from '@/domain/Card'
import { Category } from '@/domain/Category'
import type { ResolvedReference } from '@/domain/resolveReferences'

const FULL_CARD: Card = {
  number: 1,
  category: Category.Archetype,
  title: 'Der Held',
  slug: 'der-held',
  essence: 'Essence',
  function: 'Does a thing',
  application: 'Apply it',
  examples: 'Dune, Alien',
  pitfall: 'Beware',
  references: ['Der Mentor', 'Unbekannt'],
  sources: ['Source one', 'Source two'],
  artworkPrompt: '',
}

const BARE_CARD: Card = { ...FULL_CARD, pitfall: undefined, references: [], sources: [] }

const REFERENCES: ResolvedReference[] = [
  { title: 'Der Mentor', category: Category.Archetype, number: 2 },
  { title: 'Unbekannt' },
]

describe('CardBack', () => {
  describe('given interactive references', () => {
    it('emits the referenced card number when a matching reference is clicked', async () => {
      const back = mount(CardBack, {
        props: { card: FULL_CARD, references: REFERENCES, interactiveReferences: true },
      })

      await back.get('button').trigger('click')

      expect(back.emitted('click-reference')).toEqual([[2]])
    })

    it('shows references without a matching card as plain text', () => {
      const back = mount(CardBack, {
        props: { card: FULL_CARD, references: REFERENCES, interactiveReferences: true },
      })

      expect(back.findAll('button').map((button) => button.text())).toEqual(['Der Mentor'])
      expect(back.text()).toContain('Unbekannt')
    })
  })

  describe('given non-interactive references', () => {
    it('renders no buttons', () => {
      const back = mount(CardBack, { props: { card: FULL_CARD, references: REFERENCES } })

      expect(back.findAll('button')).toHaveLength(0)
      expect(back.text()).toContain('Der Mentor')
    })
  })

  describe('given a card with all optional content', () => {
    it('shows the warning, references and sources', () => {
      const back = mount(CardBack, { props: { card: FULL_CARD, references: REFERENCES } })

      expect(back.text()).toContain('Beware')
      expect(back.text()).toMatch(/Passt\szu/)
      expect(back.text()).toContain('Source one')
      expect(back.text()).toContain('Source two')
    })
  })

  describe('given a card without optional content', () => {
    it('omits the warning, references and sources', () => {
      const back = mount(CardBack, { props: { card: BARE_CARD, references: [] } })

      expect(back.text()).not.toContain('Beware')
      expect(back.text()).not.toMatch(/Passt\szu/)
      expect(back.text()).not.toContain('Source one')
    })
  })
})
