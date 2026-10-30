import { describe, expect, it } from 'vitest'
import { Category } from '@/domain/Category'
import { buildPayload } from '../buildPayload'
import { buildPrompt } from '../buildPrompt'
import { formatArtworkRecord } from '../formatArtworkRecord'

describe('buildPrompt', () => {
  describe('given a category and an artwork prompt', () => {
    it('combines the prompt with the wrapper and the category palette', () => {
      expect(buildPrompt(Category.Dialogue, 'two figures')).toBe(
        [
          'two figures',
          'dark literary fantasy illustration, chiaroscuro lighting, atmospheric',
          'ink wash and etching style, muted palette of burnt sienna and deep oranges',
          'continuous composition seamless to the edge',
        ].join(',\n'),
      )
    })

    it('uses a different palette for another category', () => {
      expect(buildPrompt(Category.Theme, 'x')).toContain('deep crimsons and dark reds')
    })
  })
})

describe('buildPayload', () => {
  describe('given no seed', () => {
    it('omits the seed', () => {
      expect(buildPayload('prompt')).not.toHaveProperty('seed')
    })

    it('carries the FLUX settings and the negative prompt', () => {
      expect(buildPayload('prompt')).toMatchObject({
        prompt: 'prompt',
        steps: 4,
        cfg_scale: 1,
        sampler_name: 'Euler',
        scheduler: 'Simple',
        negative_prompt: expect.stringContaining('typography'),
      })
    })
  })

  describe('given a seed', () => {
    it('includes it', () => {
      expect(buildPayload('prompt', 42)).toMatchObject({ seed: 42 })
    })
  })
})

describe('formatArtworkRecord', () => {
  describe('given a seed and prompt', () => {
    it('records both on separate lines', () => {
      expect(formatArtworkRecord(7, 'a,\nb')).toBe('seed: 7\nprompt: a,\nb\n')
    })
  })
})
