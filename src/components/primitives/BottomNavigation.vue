<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <nav
    :aria-label="label"
    class="fixed inset-x-0 bottom-0 z-10 flex border-t border-panel-border bg-panel print:hidden"
  >
    <slot />
  </nav>
</template>
