<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

defineProps<{ to: RouteLocationRaw }>()
</script>

<template>
  <RouterLink v-slot="{ href, navigate, isActive }" :to="to" custom>
    <a
      :href="href"
      :aria-current="isActive ? 'page' : undefined"
      class="rounded-[4px] px-4 py-[5px] text-[0.75rem] tracking-[0.06em] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
      :class="
        isActive ? 'cursor-default bg-control text-text-strong' : 'text-muted hover:text-text'
      "
      @click="navigate"
    >
      <slot />
    </a>
  </RouterLink>
</template>
