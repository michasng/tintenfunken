import { CardSection } from '@/domain/CardSection'
import { joinExamples } from '@/domain/joinExamples'
import type { ParsedCardText } from '@/domain/ParsedCardText'

const SECTION_HEADINGS: Record<string, CardSection> = {
  Funktion: CardSection.Function,
  Anwendung: CardSection.Application,
  Beispiele: CardSection.Examples,
  Warnung: CardSection.Pitfall,
  'Passt zu': CardSection.References,
  Quellen: CardSection.Sources,
  Bild: CardSection.ArtworkPrompt,
}

const SECTION_HEADING_PREFIX = '### '
const CARD_HEADING_PREFIX = '## '
const LIST_MARKER = /^- /
const LINK_OR_IMAGE_MARKUP = /!?\[([^\]]*)\]\([^)]*\)/g

export const parseCardText = (text: string): ParsedCardText => {
  const sections = new Map<CardSection, string[]>()
  let currentLines: string[] = []
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line) continue
    if (line.startsWith(SECTION_HEADING_PREFIX)) {
      const section = SECTION_HEADINGS[line.slice(SECTION_HEADING_PREFIX.length).trim()]
      currentLines = []
      if (section !== undefined) sections.set(section, currentLines)
      continue
    }
    if (line.startsWith(CARD_HEADING_PREFIX)) {
      sections.set(CardSection.Title, [line.slice(CARD_HEADING_PREFIX.length).trim()])
      currentLines = []
      sections.set(CardSection.Essence, currentLines)
      continue
    }
    currentLines.push(line.replace(LIST_MARKER, '').replace(LINK_OR_IMAGE_MARKUP, '$1'))
  }
  const joined = (section: CardSection) => (sections.get(section) ?? []).join(' ')
  const pitfall = joined(CardSection.Pitfall).trim()
  return {
    title: joined(CardSection.Title),
    essence: joined(CardSection.Essence),
    function: joined(CardSection.Function),
    application: joined(CardSection.Application),
    examples: joinExamples(sections.get(CardSection.Examples) ?? []),
    pitfall: pitfall || undefined,
    references: sections.get(CardSection.References) ?? [],
    sources: sections.get(CardSection.Sources) ?? [],
    artworkPrompt: joined(CardSection.ArtworkPrompt),
  }
}
