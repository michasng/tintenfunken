<script setup lang="ts">
import { IconName } from '@/components/primitives/IconName'

const PATHS: Record<IconName, string> = {
  [IconName.ChevronLeft]: 'M15 18l-6-6 6-6',
  [IconName.ChevronRight]: 'M9 18l6-6-6-6',
  [IconName.Overview]: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',
  [IconName.Preview]:
    'M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M9 7h6',
  [IconName.Print]:
    'M6 9V3h12v6 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v7H6z',
}

defineProps<{ name: IconName }>()
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="size-5"
  >
    <path :d="PATHS[name]" />
  </svg>
</template>
