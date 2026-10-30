import { FlipEdge } from '@/domain/FlipEdge'
import type { Slot } from '@/domain/Slot'

export const mirrorSlots = (slots: Slot[], flipEdge: FlipEdge): Slot[] => {
  const [topLeft = null, topRight = null, bottomLeft = null, bottomRight = null] = slots
  return flipEdge === FlipEdge.Long
    ? [topRight, topLeft, bottomRight, bottomLeft]
    : [bottomLeft, bottomRight, topLeft, topRight]
}
