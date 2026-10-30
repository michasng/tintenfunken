import type { RouteLocationRaw } from 'vue-router'
import { AppView } from '@/router/AppView'
import { FIRST_CARD_NUMBER } from '@/domain/Card'

export const toRouteLocation = (view: AppView, cardNumber: number): RouteLocationRaw => {
  if (view === AppView.Print) return { name: AppView.Print }
  if (view === AppView.Overview) return { name: AppView.Overview }
  if (cardNumber <= FIRST_CARD_NUMBER) return { name: AppView.Preview }
  return { name: AppView.Preview, query: { card: String(cardNumber) } }
}
