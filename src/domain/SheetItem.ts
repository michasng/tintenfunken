import type { PageItemKind } from '@/domain/PageItemKind'
import type { Slot } from '@/domain/Slot'

export interface SheetItem {
  kind: PageItemKind.FrontSheet | PageItemKind.BackSheet
  sheetNumber: number
  sheetCount: number
  slots: Slot[]
}
