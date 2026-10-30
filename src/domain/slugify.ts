const TRAILING_PARENTHETICAL = /\s*\([^()]*\)\s*$/

export const slugify = (title: string): string =>
  title
    .replace(TRAILING_PARENTHETICAL, '')
    .toLowerCase()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
