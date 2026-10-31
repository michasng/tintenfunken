import type { TouchPoint } from '@/lib/TouchPoint'

export interface SwipeTouchEvent {
  changedTouches: ArrayLike<TouchPoint>
}
