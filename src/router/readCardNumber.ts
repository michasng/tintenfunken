import type { LocationQueryValue } from 'vue-router'
import { FIRST_CARD_NUMBER } from '@/domain/Card'

export const readCardNumber = (
  queryValue: LocationQueryValue | LocationQueryValue[] | undefined,
  deckSize: number,
): number => {
  const rawValue = Array.isArray(queryValue) ? queryValue[0] : queryValue
  const requested = Math.trunc(Number(rawValue)) || FIRST_CARD_NUMBER
  return Math.min(Math.max(requested, FIRST_CARD_NUMBER), Math.max(deckSize, FIRST_CARD_NUMBER))
}
