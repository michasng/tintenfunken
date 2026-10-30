import { describe, expect, it } from 'vitest'
import { Category } from '@/domain/Category'
import { loadDeck } from '@/domain/loadDeck'

const INDEX = `# Tintenfunken

- Archetyp
  - [Der Held](cards/der-held.md)
  - [Falsche Fährte (Red Herring)](cards/falsche-faehrte.md)
- Struktur
  - [3-Akt-Struktur](cards/3-akt-struktur.md)
`

const FULL_CARD = `## Der Held

Essence text.

### Funktion

Does a thing.

### Anwendung

How to apply?

### Beispiele

- Dune
- Alien

### Warnung

Beware.

### Passt zu

- [Der Mentor](der-mentor.md)
- Der Schatten

### Quellen

- Source one
- Source two

### Bild

![a hero on a hill](../public/artworks/der-held.png)

### Unbekannt

Ignored.
`

const MINIMAL_CARD = (title: string) => `## ${title}

Essence.

### Funktion

F.

### Anwendung

A.

### Beispiele

- E

### Bild

![prompt](../public/artworks/x.png)
`

const CARD_TEXTS = {
  'cards/der-held.md': FULL_CARD,
  'cards/falsche-faehrte.md': MINIMAL_CARD('Falsche Fährte (Red Herring)'),
  'cards/3-akt-struktur.md': MINIMAL_CARD('3-Akt-Struktur'),
}

describe('loadDeck', () => {
  describe('given an index and all its cards', () => {
    it('returns cards in index order with numbers and categories', () => {
      const deck = loadDeck(INDEX, CARD_TEXTS)

      expect(deck.map((card) => [card.number, card.category, card.title])).toEqual([
        [1, Category.Archetype, 'Der Held'],
        [2, Category.Archetype, 'Falsche Fährte (Red Herring)'],
        [3, Category.Structure, '3-Akt-Struktur'],
      ])
    })

    it('parses every section of a card', () => {
      const [hero] = loadDeck(INDEX, CARD_TEXTS)

      expect(hero).toMatchObject({
        essence: 'Essence text.',
        function: 'Does a thing.',
        application: 'How to apply?',
        examples: 'Dune, Alien',
        pitfall: 'Beware.',
        references: ['Der Mentor', 'Der Schatten'],
        sources: ['Source one', 'Source two'],
        artworkPrompt: 'a hero on a hill',
        slug: 'der-held',
      })
    })

    it('omits optional sections a card does not have', () => {
      const card = loadDeck(INDEX, CARD_TEXTS)[2]

      expect(card).toMatchObject({ pitfall: undefined, references: [], sources: [] })
    })

    it('derives the slug without the trailing English synonym', () => {
      expect(loadDeck(INDEX, CARD_TEXTS)[1]?.slug).toBe('falsche-faehrte')
    })
  })

  describe('given an index link without card text', () => {
    it('fails naming the missing card', () => {
      expect(() => loadDeck(INDEX, {})).toThrow('cards/der-held.md')
    })
  })

  describe('given an unknown category in the index', () => {
    it('fails naming the category', () => {
      expect(() => loadDeck('- Unsinn\n  - [X](cards/x.md)', {})).toThrow('Unsinn')
    })
  })
})
