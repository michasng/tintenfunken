import { describe, expect, it } from 'vitest'
import { joinExamples } from '@/domain/joinExamples'

describe('joinExamples', () => {
  describe('given examples without inner commas', () => {
    it('joins them with commas', () => {
      expect(joinExamples(['Dune', 'Alien'])).toBe('Dune, Alien')
    })
  })

  describe('given an example with a comma outside parentheses', () => {
    it('joins them with semicolons', () => {
      expect(joinExamples(['Dune, Teil 1', 'Alien'])).toBe('Dune, Teil 1; Alien')
    })
  })

  describe('given commas only inside parentheses or quotes', () => {
    it('joins them with commas', () => {
      expect(joinExamples(['Dune (Herbert, 1965)', '»Ja, genau«'])).toBe(
        'Dune (Herbert, 1965), »Ja, genau«',
      )
    })
  })
})
