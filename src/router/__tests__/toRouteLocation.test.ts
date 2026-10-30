import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { AppView } from '@/router/AppView'
import { toRouteLocation } from '@/router/toRouteLocation'

const resolveUrl = (view: AppView, cardNumber: number) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: AppView.Preview, component: {} },
      { path: '/print', name: AppView.Print, component: {} },
    ],
  })
  return router.resolve(toRouteLocation(view, cardNumber)).fullPath
}

describe('toRouteLocation', () => {
  describe('given the preview of the first card', () => {
    it('omits the card parameter', () => {
      expect(resolveUrl(AppView.Preview, 1)).toBe('/')
    })
  })

  describe('given the preview of a later card', () => {
    it('includes the card parameter', () => {
      expect(resolveUrl(AppView.Preview, 12)).toBe('/?card=12')
    })
  })

  describe('given the print view', () => {
    it('points to the print path without a card', () => {
      expect(resolveUrl(AppView.Print, 12)).toBe('/print')
    })
  })
})
