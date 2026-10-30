import type { Card } from '@/domain/Card'
import type { Category } from '@/domain/Category'

export interface ResolvedReference {
  title: string
  category?: Category
  number?: number
}

export const resolveReferences = (card: Card, deck: Card[]): ResolvedReference[] =>
  card.references.map((title) => {
    const referenced = deck.find((candidate) => candidate.title === title)
    return { title, category: referenced?.category, number: referenced?.number }
  })
