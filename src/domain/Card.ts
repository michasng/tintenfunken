import type { Category } from '@/domain/Category'

export const FIRST_CARD_NUMBER = 1

export interface Card {
  number: number
  category: Category
  title: string
  slug: string
  essence: string
  function: string
  application: string
  examples: string
  pitfall?: string
  references: string[]
  sources: string[]
  artworkPrompt: string
}
