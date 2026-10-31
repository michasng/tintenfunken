import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

const FALLBACK_SCALE = 1

export const useFitScale = (
  container: Ref<HTMLElement | null>,
  content: Ref<HTMLElement | null>,
) => {
  const scale = ref(FALLBACK_SCALE)
  const observer = new ResizeObserver(() => {
    const contentWidthPixels = content.value?.offsetWidth
    const containerWidthPixels = container.value?.clientWidth
    if (!contentWidthPixels || !containerWidthPixels) return
    scale.value = containerWidthPixels / contentWidthPixels
  })

  onMounted(() => {
    if (container.value) observer.observe(container.value)
  })
  onBeforeUnmount(() => observer.disconnect())

  return scale
}
