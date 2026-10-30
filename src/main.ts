import { createApp } from 'vue'
import App from '@/App.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import { DECK_KEY } from '@/composables/useDeck'
import type { Card } from '@/domain/Card'
import { loadBundledDeck } from '@/loadBundledDeck'
import { createAppRouter } from '@/router/createAppRouter'
import '@/assets/main.css'

const APP_ROOT_SELECTOR = '#app'

const loadDeckOrFail = (): Card[] | Error => {
  try {
    return loadBundledDeck()
  } catch (error) {
    return error instanceof Error ? error : new Error(String(error))
  }
}

const deck = loadDeckOrFail()
if (deck instanceof Error) {
  createApp(AlertMessage, {
    message: `Das Deck konnte nicht geladen werden: ${deck.message}`,
  }).mount(APP_ROOT_SELECTOR)
} else {
  createApp(App).provide(DECK_KEY, deck).use(createAppRouter()).mount(APP_ROOT_SELECTOR)
}
