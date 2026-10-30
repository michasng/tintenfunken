<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <nav
    :aria-label="label"
    class="flex gap-[2px] rounded-[6px] border border-panel-border bg-page p-[3px]"
  >
    <slot />
  </nav>
</template>
