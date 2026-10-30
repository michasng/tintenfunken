import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { AppView } from '@/router/AppView'
import { restoreScrollPosition } from '@/router/restoreScrollPosition'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: AppView.Preview, component: {} },
    { path: '/overview', name: AppView.Overview, component: {} },
  ],
})

const visit = async (path: string) => {
  await router.push(path)
  return router.currentRoute.value
}

describe('restoreScrollPosition', () => {
  describe('given the browser remembers a position', () => {
    it('returns to that position', async () => {
      const firstPreview = await visit('/')
      const overview = await visit('/overview')
      const savedPosition = { left: 0, top: 840 }

      expect(restoreScrollPosition(overview, firstPreview, savedPosition)).toEqual(savedPosition)
    })
  })

  describe('when switching to another view', () => {
    it('starts at the top', async () => {
      const overview = await visit('/overview')
      const laterPreview = await visit('/?card=12')

      expect(restoreScrollPosition(laterPreview, overview, null)).toEqual({ top: 0 })
    })
  })

  describe('when moving to another card within the same view', () => {
    it('keeps the current position', async () => {
      const firstPreview = await visit('/')
      const laterPreview = await visit('/?card=12')

      expect(restoreScrollPosition(laterPreview, firstPreview, null)).toBe(false)
    })
  })
})
