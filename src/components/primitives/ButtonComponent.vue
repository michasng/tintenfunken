<script setup lang="ts">
import { computed } from 'vue'
import { ButtonSize } from '@/components/primitives/ButtonSize'

const SIZE_CLASSES: Record<ButtonSize, string> = {
  [ButtonSize.Compact]: 'px-[18px] py-[6px] text-[0.7rem] tracking-[0.08em]',
  [ButtonSize.Regular]: 'px-5 py-2 text-[0.72rem] tracking-[0.06em]',
}

const props = withDefaults(defineProps<{ size?: ButtonSize }>(), { size: ButtonSize.Regular })

const sizeClasses = computed(() => SIZE_CLASSES[props.size])
</script>

<template>
  <button
    type="button"
    class="cursor-pointer rounded-[4px] bg-brand font-semibold text-white hover:bg-brand-hover disabled:cursor-default disabled:bg-control disabled:text-[#555]"
    :class="sizeClasses"
  >
    <slot />
  </button>
</template>
