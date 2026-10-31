<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :title="label"
    class="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand text-white hover:bg-brand-hover disabled:cursor-default disabled:bg-control disabled:text-[#555]"
  >
    <slot />
  </button>
</template>
