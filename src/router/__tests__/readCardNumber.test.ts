import { describe, expect, it } from 'vitest'
import { readCardNumber } from '@/router/readCardNumber'

const DECK_SIZE = 10

describe('readCardNumber', () => {
  describe('given no card in the query', () => {
    it('returns the first card', () => {
      expect(readCardNumber(undefined, DECK_SIZE)).toBe(1)
    })
  })

  describe('given a valid card number', () => {
    it('returns it', () => {
      expect(readCardNumber('7', DECK_SIZE)).toBe(7)
    })
  })

  describe('given an invalid value', () => {
    it('returns the first card', () => {
      expect(readCardNumber('abc', DECK_SIZE)).toBe(1)
    })
  })

  describe('given an out-of-range value', () => {
    it('clamps to the deck range', () => {
      expect(readCardNumber('999', DECK_SIZE)).toBe(DECK_SIZE)
      expect(readCardNumber('-4', DECK_SIZE)).toBe(1)
    })
  })

  describe('given repeated card parameters', () => {
    it('uses the first one', () => {
      expect(readCardNumber(['3', '5'], DECK_SIZE)).toBe(3)
    })
  })
})
