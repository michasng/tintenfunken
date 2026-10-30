import type { Card } from '@/domain/Card'
import { parseCardText } from '@/domain/parseCardText'
import { parseIndex } from '@/domain/parseIndex'
import { slugify } from '@/domain/slugify'

export const loadDeck = (indexText: string, cardTexts: Record<string, string>): Card[] =>
  parseIndex(indexText).map(({ category, path }, position) => {
    const cardText = cardTexts[path]
    if (cardText === undefined) throw new Error(`Index links to missing card "${path}"`)
    const parsed = parseCardText(cardText)
    return { ...parsed, category, number: position + 1, slug: slugify(parsed.title) }
  })
