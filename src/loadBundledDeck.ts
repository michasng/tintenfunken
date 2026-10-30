import indexText from '/cards.md?raw'
import { loadDeck } from '@/domain/loadDeck'
import type { Card } from '@/domain/Card'

const ROOT_PREFIX = /^\//

const cardTexts = Object.fromEntries(
  Object.entries(
    import.meta.glob<string>('/cards/*.md', { query: '?raw', import: 'default', eager: true }),
  ).map(([path, text]) => [path.replace(ROOT_PREFIX, ''), text]),
)

export const loadBundledDeck = (): Card[] => loadDeck(indexText, cardTexts)
