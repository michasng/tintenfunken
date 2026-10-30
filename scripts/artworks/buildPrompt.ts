import { Category } from '@/domain/Category'

const CATEGORY_PALETTES: Record<Category, string> = {
  [Category.Archetype]: 'muted palette of deep purples and magentas',
  [Category.Transformation]: 'muted palette of deep violets and purples',
  [Category.Structure]: 'muted palette of deep navy blues',
  [Category.Trope]: 'muted palette of rich cobalt blues',
  [Category.Conflict]: 'muted palette of steel blues and ceruleans',
  [Category.Pace]: 'muted palette of teals and dark cyans',
  [Category.WorldBuilding]: 'muted palette of deep forest greens',
  [Category.Atmosphere]: 'muted palette of emerald greens',
  [Category.Perspective]: 'muted palette of warm ambers and oranges',
  [Category.Scene]: 'muted palette of deep earthy browns and siennas',
  [Category.Dialogue]: 'muted palette of burnt sienna and deep oranges',
  [Category.Theme]: 'muted palette of deep crimsons and dark reds',
}

export const PROMPT_SEPARATOR = ',\n'

const wrapperPrompt = (category: Category) =>
  [
    'dark literary fantasy illustration, chiaroscuro lighting, atmospheric',
    `ink wash and etching style, ${CATEGORY_PALETTES[category]}`,
    'continuous composition seamless to the edge',
  ].join(PROMPT_SEPARATOR)

export const buildPrompt = (category: Category, artworkPrompt: string): string =>
  [artworkPrompt, wrapperPrompt(category)].join(PROMPT_SEPARATOR)
