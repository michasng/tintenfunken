import { inject, type InjectionKey } from 'vue'
import type { Card } from '@/domain/Card'

export const DECK_KEY: InjectionKey<Card[]> = Symbol('deck')

export const useDeck = (): Card[] => {
  const deck = inject(DECK_KEY)
  if (deck === undefined) throw new Error('No deck provided')
  return deck
}
