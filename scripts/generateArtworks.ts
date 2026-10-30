import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { buildPayload } from './artworks/buildPayload'
import { buildPrompt } from './artworks/buildPrompt'
import { formatArtworkRecord } from './artworks/formatArtworkRecord'
import { ForgeError, requestArtwork } from './artworks/requestArtwork'
import { selectCards } from './artworks/selectCards'
import { ARTWORKS_DIRECTORY, readDeckFromDisk } from './readDeckFromDisk'

const FORGE_URL = 'http://127.0.0.1:7860'

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { seed: { type: 'string' } },
})
const seed = values.seed === undefined ? undefined : Number(values.seed)
if (seed !== undefined && !Number.isInteger(seed)) {
  console.error(`Invalid seed '${values.seed}'.`)
  process.exit(1)
}

const { cards, unknown } = selectCards(readDeckFromDisk(), positionals)
for (const key of unknown) console.error(`Unknown card '${key}', skipping.`)

mkdirSync(ARTWORKS_DIRECTORY, { recursive: true })

try {
  for (const [index, card] of cards.entries()) {
    process.stdout.write(`[${index + 1}/${cards.length}] ${card.title} ... `)
    const prompt = buildPrompt(card.category, card.artworkPrompt)
    const artwork = await requestArtwork(FORGE_URL, buildPayload(prompt, seed))
    writeFileSync(join(ARTWORKS_DIRECTORY, `${card.slug}.png`), artwork.png)
    writeFileSync(
      join(ARTWORKS_DIRECTORY, `${card.slug}.txt`),
      formatArtworkRecord(artwork.seed, prompt),
    )
    console.log(`done (seed ${artwork.seed})`)
  }
} catch (error) {
  if (!(error instanceof ForgeError)) throw error
  console.error(`\n${error.message}`)
  process.exit(1)
}
