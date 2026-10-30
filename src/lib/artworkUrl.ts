export const artworkUrl = (slug: string): string =>
  `${import.meta.env.BASE_URL}artworks/${slug}.png`
