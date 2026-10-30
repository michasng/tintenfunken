import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { Card } from '@/domain/Card'
import { loadDeck } from '@/domain/loadDeck'

const PROJECT_ROOT = resolve(import.meta.dirname, '..')
const INDEX_FILE = 'cards.md'
const CARDS_DIRECTORY = 'cards'

export const ARTWORKS_DIRECTORY = join(PROJECT_ROOT, 'public', 'artworks')

export const readDeckFromDisk = (): Card[] => {
  const read = (path: string) => readFileSync(join(PROJECT_ROOT, path), 'utf-8')
  const cardTexts = Object.fromEntries(
    readdirSync(join(PROJECT_ROOT, CARDS_DIRECTORY)).map((file) => {
      const path = `${CARDS_DIRECTORY}/${file}`
      return [path, read(path)]
    }),
  )
  return loadDeck(read(INDEX_FILE), cardTexts)
}
