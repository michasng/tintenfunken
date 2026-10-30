import type { PageItemKind } from '@/domain/PageItemKind'

export interface DividerItem {
  kind: PageItemKind.Divider
  sheetCount: number
}
