import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import FlipPanel from '@/components/FlipPanel.vue'

const mountPanel = (flipped = false) =>
  mount(FlipPanel, {
    props: { flipped },
    slots: {
      front: '<span data-testid="front">Front</span><button>Inner</button>',
      back: '<span>Back</span>',
    },
  })

describe('FlipPanel', () => {
  describe('given the panel is clicked', () => {
    it('requests to flip to the back', async () => {
      const panel = mountPanel()

      await panel.get('[data-testid="front"]').trigger('click')

      expect(panel.emitted('update:flipped')).toEqual([[true]])
    })

    it('requests to flip back to the front when already flipped', async () => {
      const panel = mountPanel(true)

      await panel.get('[data-testid="front"]').trigger('click')

      expect(panel.emitted('update:flipped')).toEqual([[false]])
    })
  })

  describe('given the panel is focused and Enter or Space is pressed', () => {
    it.each(['enter', 'space'])('requests to flip on %s', async (key) => {
      const panel = mountPanel()

      await panel.get('[role="button"]').trigger(`keydown.${key}`)

      expect(panel.emitted('update:flipped')).toEqual([[true]])
    })
  })

  describe('given an interactive child is clicked', () => {
    it('does not flip', async () => {
      const panel = mountPanel()

      await panel.get('button').trigger('click')

      expect(panel.emitted('update:flipped')).toBeUndefined()
    })
  })

  describe('given Enter is pressed on an interactive child', () => {
    it('does not flip', async () => {
      const panel = mountPanel()

      await panel.get('button').trigger('keydown.enter')

      expect(panel.emitted('update:flipped')).toBeUndefined()
    })
  })
})
