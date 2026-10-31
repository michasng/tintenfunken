export enum Category {
  Archetype = 'Archetyp',
  Transformation = 'Wandlung',
  Structure = 'Struktur',
  Trope = 'Trope',
  Conflict = 'Konflikt',
  Pace = 'Tempo',
  WorldBuilding = 'Weltenbau',
  Atmosphere = 'Atmosphäre',
  Perspective = 'Perspektive',
  Scene = 'Szene',
  Dialogue = 'Dialog',
  Theme = 'Thema',
}

export const CATEGORY_ACCENT_COLORS: Record<Category, string> = {
  [Category.Archetype]: '#8c1a6a',
  [Category.Transformation]: '#6902aa',
  [Category.Structure]: '#5e7495',
  [Category.Trope]: '#2153be',
  [Category.Conflict]: '#077cad',
  [Category.Pace]: '#028389',
  [Category.WorldBuilding]: '#0f5c31',
  [Category.Atmosphere]: '#038a3e',
  [Category.Perspective]: '#d28a09',
  [Category.Scene]: '#815323',
  [Category.Dialogue]: '#c24b03',
  [Category.Theme]: '#95002b',
}
