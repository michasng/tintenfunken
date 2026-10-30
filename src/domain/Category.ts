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
  [Category.Archetype]: '#8C1A6A',
  [Category.Transformation]: '#611b96',
  [Category.Structure]: '#112a75',
  [Category.Trope]: '#2153be',
  [Category.Conflict]: '#4187d3',
  [Category.Pace]: '#15939c',
  [Category.WorldBuilding]: '#0f5c31',
  [Category.Atmosphere]: '#3E9E56',
  [Category.Perspective]: '#e18a2d',
  [Category.Scene]: '#764b1c',
  [Category.Dialogue]: '#c25211',
  [Category.Theme]: '#8f1111',
}
