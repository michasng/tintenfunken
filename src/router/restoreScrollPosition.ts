import type { RouterScrollBehavior } from 'vue-router'

const TOP_OF_PAGE = { top: 0 }

export const restoreScrollPosition: RouterScrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) return savedPosition
  if (to.name !== from.name) return TOP_OF_PAGE
  return false
}
