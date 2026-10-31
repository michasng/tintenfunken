import { describe, expect, it, vi } from 'vitest'
import { createSwipeHandlers } from '@/lib/createSwipeHandlers'

const touchAt = (clientX: number, clientY: number) => ({ changedTouches: [{ clientX, clientY }] })

const setup = () => {
  const onSwipeLeft = vi.fn<() => void>()
  const onSwipeRight = vi.fn<() => void>()
  const handlers = createSwipeHandlers({ onSwipeLeft, onSwipeRight })
  return { onSwipeLeft, onSwipeRight, ...handlers }
}

describe('createSwipeHandlers', () => {
  describe('given a horizontal swipe to the left', () => {
    it('reports a left swipe', () => {
      const { onSwipeLeft, onSwipeRight, handleTouchStart, handleTouchEnd } = setup()

      handleTouchStart(touchAt(200, 100))
      handleTouchEnd(touchAt(100, 110))

      expect(onSwipeLeft).toHaveBeenCalledOnce()
      expect(onSwipeRight).not.toHaveBeenCalled()
    })
  })

  describe('given a horizontal swipe to the right', () => {
    it('reports a right swipe', () => {
      const { onSwipeLeft, onSwipeRight, handleTouchStart, handleTouchEnd } = setup()

      handleTouchStart(touchAt(100, 100))
      handleTouchEnd(touchAt(200, 90))

      expect(onSwipeRight).toHaveBeenCalledOnce()
      expect(onSwipeLeft).not.toHaveBeenCalled()
    })
  })

  describe('when the movement is too short', () => {
    it('reports nothing', () => {
      const { onSwipeLeft, onSwipeRight, handleTouchStart, handleTouchEnd } = setup()

      handleTouchStart(touchAt(100, 100))
      handleTouchEnd(touchAt(120, 100))

      expect(onSwipeLeft).not.toHaveBeenCalled()
      expect(onSwipeRight).not.toHaveBeenCalled()
    })
  })

  describe('when the movement is mostly vertical', () => {
    it('reports nothing', () => {
      const { onSwipeLeft, onSwipeRight, handleTouchStart, handleTouchEnd } = setup()

      handleTouchStart(touchAt(100, 100))
      handleTouchEnd(touchAt(180, 300))

      expect(onSwipeLeft).not.toHaveBeenCalled()
      expect(onSwipeRight).not.toHaveBeenCalled()
    })
  })

  describe('when a touch ends without having started', () => {
    it('reports nothing', () => {
      const { onSwipeLeft, onSwipeRight, handleTouchEnd } = setup()

      handleTouchEnd(touchAt(100, 100))

      expect(onSwipeLeft).not.toHaveBeenCalled()
      expect(onSwipeRight).not.toHaveBeenCalled()
    })
  })

  describe('when a second touch ends after a completed swipe', () => {
    it('reports only the first swipe', () => {
      const { onSwipeLeft, handleTouchStart, handleTouchEnd } = setup()

      handleTouchStart(touchAt(200, 100))
      handleTouchEnd(touchAt(100, 100))
      handleTouchEnd(touchAt(0, 100))

      expect(onSwipeLeft).toHaveBeenCalledOnce()
    })
  })
})
