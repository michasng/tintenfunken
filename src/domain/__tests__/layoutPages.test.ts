import { describe, expect, it } from 'vitest'
import type { Card } from '@/domain/Card'
import { Category } from '@/domain/Category'
import { DuplexMode } from '@/domain/DuplexMode'
import { FlipEdge } from '@/domain/FlipEdge'
import { PageItemKind } from '@/domain/PageItemKind'
import { layoutPages } from '@/domain/layoutPages'
import type { PageItem } from '@/domain/PageItem'
import type { SheetItem } from '@/domain/SheetItem'

const makeDeck = (size: number): Card[] =>
  Array.from({ length: size }, (_, index) => ({
    number: index + 1,
    category: Category.Archetype,
    title: `Card ${index + 1}`,
    slug: `card-${index + 1}`,
    essence: '',
    function: '',
    application: '',
    examples: '',
    references: [],
    sources: [],
    artworkPrompt: '',
  }))

const asSheet = (item: PageItem | undefined): SheetItem => {
  if (item === undefined || item.kind === PageItemKind.Divider) throw new Error('Expected a sheet')
  return item
}

const numbersOf = (item: PageItem | undefined) =>
  asSheet(item).slots.map((slot) => slot?.number ?? null)

describe('layoutPages', () => {
  describe('given a deck that does not fill the last sheet', () => {
    it('pads the last front sheet with empty slots', () => {
      const pages = layoutPages(makeDeck(5), DuplexMode.Manual, FlipEdge.Long)

      expect(numbersOf(pages[1])).toEqual([5, null, null, null])
    })
  })

  describe('given automatic duplex', () => {
    it('interleaves each front sheet with its back sheet', () => {
      const pages = layoutPages(makeDeck(8), DuplexMode.Automatic, FlipEdge.Long)

      expect(pages.map((page) => page.kind)).toEqual([
        PageItemKind.FrontSheet,
        PageItemKind.BackSheet,
        PageItemKind.FrontSheet,
        PageItemKind.BackSheet,
      ])
    })

    it('numbers sheets and mirrors back sheets along the long edge', () => {
      const [front, back] = layoutPages(makeDeck(4), DuplexMode.Automatic, FlipEdge.Long)

      expect(front).toMatchObject({ sheetNumber: 1, sheetCount: 1 })
      expect(numbersOf(front)).toEqual([1, 2, 3, 4])
      expect(numbersOf(back)).toEqual([2, 1, 4, 3])
    })

    it('mirrors back sheets along the short edge', () => {
      const [, back] = layoutPages(makeDeck(4), DuplexMode.Automatic, FlipEdge.Short)

      expect(numbersOf(back)).toEqual([3, 4, 1, 2])
    })
  })

  describe('given manual duplex', () => {
    it('lists front sheets, a divider, then back sheets in reverse order', () => {
      const pages = layoutPages(makeDeck(8), DuplexMode.Manual, FlipEdge.Long)

      expect(pages.map((page) => page.kind)).toEqual([
        PageItemKind.FrontSheet,
        PageItemKind.FrontSheet,
        PageItemKind.Divider,
        PageItemKind.BackSheet,
        PageItemKind.BackSheet,
      ])
      expect(pages.slice(3).map((page) => asSheet(page).sheetNumber)).toEqual([2, 1])
    })

    it('reports the number of printed sheets on the divider', () => {
      const pages = layoutPages(makeDeck(9), DuplexMode.Manual, FlipEdge.Long)

      expect(pages.find((page) => page.kind === PageItemKind.Divider)).toMatchObject({
        sheetCount: 3,
      })
    })
  })
})
