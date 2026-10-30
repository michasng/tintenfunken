<script setup lang="ts">
const INTERACTIVE_SELECTOR = 'button, a, input, select, textarea'

const flipped = defineModel<boolean>('flipped', { default: false })

const toggle = () => {
  flipped.value = !flipped.value
}

const toggleUnlessFromInteractiveChild = (event: MouseEvent) => {
  if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return
  toggle()
}
</script>

<template>
  <div class="perspective-[2000px]">
    <div
      role="button"
      tabindex="0"
      :aria-pressed="flipped"
      class="relative cursor-pointer rounded-[3mm] shadow-[0_2px_6px_rgba(0,0,0,.45),0_12px_40px_rgba(0,0,0,.5)] transition-transform duration-[600ms] ease-[ease] transform-3d"
      :class="{ 'rotate-y-180': flipped }"
      @click="toggleUnlessFromInteractiveChild"
      @keydown.enter.self.prevent="toggle"
      @keydown.space.self.prevent="toggle"
    >
      <div class="rounded-[3mm] backface-hidden">
        <slot name="front" />
      </div>
      <div class="absolute inset-0 rotate-y-180 rounded-[3mm] backface-hidden">
        <slot name="back" />
      </div>
    </div>
  </div>
</template>
