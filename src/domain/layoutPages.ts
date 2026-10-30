import type { Card } from '@/domain/Card'
import { chunkIntoSheets } from '@/domain/chunkIntoSheets'
import { DuplexMode } from '@/domain/DuplexMode'
import type { FlipEdge } from '@/domain/FlipEdge'
import { mirrorSlots } from '@/domain/mirrorSlots'
import { PageItemKind } from '@/domain/PageItemKind'
import type { PageItem } from '@/domain/PageItem'
import type { SheetItem } from '@/domain/SheetItem'
import type { Slot } from '@/domain/Slot'

export const layoutPages = (
  deck: Card[],
  duplexMode: DuplexMode,
  flipEdge: FlipEdge,
): PageItem[] => {
  const sheets = chunkIntoSheets(deck)
  const sheetCount = sheets.length
  const front = (slots: Slot[], index: number): SheetItem => ({
    kind: PageItemKind.FrontSheet,
    sheetNumber: index + 1,
    sheetCount,
    slots,
  })
  const back = (slots: Slot[], index: number): SheetItem => ({
    kind: PageItemKind.BackSheet,
    sheetNumber: index + 1,
    sheetCount,
    slots: mirrorSlots(slots, flipEdge),
  })

  if (duplexMode === DuplexMode.Automatic) {
    return sheets.flatMap((slots, index) => [front(slots, index), back(slots, index)])
  }

  return [
    ...sheets.map(front),
    { kind: PageItemKind.Divider, sheetCount },
    ...sheets.map(back).reverse(),
  ]
}
