import type { Card } from '@/domain/Card'

export interface CardSelection {
  cards: Card[]
  unknown: string[]
}

export const selectCards = (deck: Card[], wanted: string[]): CardSelection => {
  if (wanted.length === 0) return { cards: deck, unknown: [] }

  const cardsByKey = new Map(
    deck.flatMap((card) => [[card.title.toLowerCase(), card] as const, [card.slug, card] as const]),
  )
  const cards: Card[] = []
  const unknown: string[] = []
  for (const key of wanted) {
    const card = cardsByKey.get(key.toLowerCase())
    if (card) cards.push(card)
    else unknown.push(key)
  }
  return { cards, unknown }
}
