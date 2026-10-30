<script setup lang="ts">
import { computed } from 'vue'
import { CATEGORY_ACCENT_COLORS, type Category } from '@/domain/Category'

const props = defineProps<{
  title: string
  category?: Category
  interactive: boolean
}>()

const emit = defineEmits<{ select: [] }>()

const accentStyle = computed(() =>
  props.category ? { '--accent': CATEGORY_ACCENT_COLORS[props.category] } : undefined,
)
</script>

<template>
  <button
    v-if="interactive"
    type="button"
    class="cursor-pointer rounded-[2px] bg-(--accent) px-[5px] py-[2px] text-[0.48rem] font-medium text-white opacity-85 hover:underline hover:opacity-100 focus-visible:underline focus-visible:opacity-100"
    :style="accentStyle"
    @click="emit('select')"
  >
    {{ title }}
  </button>
  <span
    v-else
    class="rounded-[2px] bg-(--accent) px-[5px] py-[2px] text-[0.48rem] font-medium text-white opacity-85"
    :style="accentStyle"
  >
    {{ title }}
  </span>
</template>
