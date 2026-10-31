import type { SwipeCallbacks } from '@/lib/SwipeCallbacks'
import type { SwipeTouchEvent } from '@/lib/SwipeTouchEvent'
import type { TouchPoint } from '@/lib/TouchPoint'

const MINIMUM_SWIPE_DISTANCE_PIXELS = 50
const FIRST_TOUCH_INDEX = 0

const readTouchPoint = (event: SwipeTouchEvent): TouchPoint | undefined => {
  const touch = event.changedTouches[FIRST_TOUCH_INDEX]
  return touch ? { clientX: touch.clientX, clientY: touch.clientY } : undefined
}

export const createSwipeHandlers = ({ onSwipeLeft, onSwipeRight }: SwipeCallbacks) => {
  let startPoint: TouchPoint | undefined

  const handleTouchStart = (event: SwipeTouchEvent) => {
    startPoint = readTouchPoint(event)
  }

  const handleTouchEnd = (event: SwipeTouchEvent) => {
    const origin = startPoint
    startPoint = undefined
    const endPoint = readTouchPoint(event)
    if (!origin || !endPoint) return

    const horizontalDistancePixels = endPoint.clientX - origin.clientX
    const verticalDistancePixels = endPoint.clientY - origin.clientY
    if (Math.abs(horizontalDistancePixels) < MINIMUM_SWIPE_DISTANCE_PIXELS) return
    if (Math.abs(horizontalDistancePixels) <= Math.abs(verticalDistancePixels)) return

    if (horizontalDistancePixels < 0) {
      onSwipeLeft()
      return
    }
    onSwipeRight()
  }

  return { handleTouchStart, handleTouchEnd }
}
