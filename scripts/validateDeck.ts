import { readDeckFromDisk } from './readDeckFromDisk'

const deck = readDeckFromDisk()
console.log(`Deck is valid: ${deck.length} cards`)
