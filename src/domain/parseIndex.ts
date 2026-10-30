import type { Category } from '@/domain/Category'
import { isCategory } from '@/domain/isCategory'

export interface IndexEntry {
  category: Category
  path: string
}

const CATEGORY_LINE = /^- (?<name>.+)$/
const CARD_LINE = /^\s+- \[[^\]]*\]\((?<path>[^)]+)\)/

export const parseIndex = (text: string): IndexEntry[] => {
  const entries: IndexEntry[] = []
  let category: Category | undefined
  for (const line of text.split(/\r?\n/)) {
    const categoryName = line.match(CATEGORY_LINE)?.groups?.name?.trim()
    if (categoryName !== undefined) {
      if (!isCategory(categoryName)) throw new Error(`Unknown category "${categoryName}" in index`)
      category = categoryName
      continue
    }
    const path = line.match(CARD_LINE)?.groups?.path
    if (path === undefined) continue
    if (category === undefined) throw new Error(`Card "${path}" appears before any category`)
    entries.push({ category, path })
  }
  return entries
}
