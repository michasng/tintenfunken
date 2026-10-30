import { onMounted, watch, type Ref } from 'vue'

const MINIMUM_FONT_SIZE_PX = 8
const FONT_SIZE_STEP_PX = 0.5

const fontSizePx = (element: HTMLElement) => parseFloat(getComputedStyle(element).fontSize)

const shrinkToFit = (element: HTMLElement) => {
  element.style.fontSize = ''
  while (element.scrollWidth > element.clientWidth && fontSizePx(element) > MINIMUM_FONT_SIZE_PX) {
    element.style.fontSize = `${fontSizePx(element) - FONT_SIZE_STEP_PX}px`
  }
}

export const useFitText = (element: Ref<HTMLElement | null>, text: () => string) => {
  const fit = () => {
    if (element.value) shrinkToFit(element.value)
  }
  onMounted(async () => {
    fit()
    await document.fonts?.ready
    fit()
  })
  watch(text, fit, { flush: 'post' })
}
