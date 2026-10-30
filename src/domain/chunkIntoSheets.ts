import type { Card } from '@/domain/Card'
import type { Slot } from '@/domain/Slot'

const CARDS_PER_SHEET = 4

export const chunkIntoSheets = (cards: Card[]): Slot[][] => {
  const sheets: Slot[][] = []
  for (let start = 0; start < cards.length; start += CARDS_PER_SHEET) {
    const slots: Slot[] = cards.slice(start, start + CARDS_PER_SHEET)
    while (slots.length < CARDS_PER_SHEET) slots.push(null)
    sheets.push(slots)
  }
  return sheets
}
