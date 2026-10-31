<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import AppIcon from '@/components/primitives/AppIcon.vue'
import type { IconName } from '@/components/primitives/IconName'

defineProps<{ to: RouteLocationRaw; icon: IconName }>()
</script>

<template>
  <RouterLink v-slot="{ href, navigate, isActive }" :to="to" custom>
    <a
      :href="href"
      :aria-current="isActive ? 'page' : undefined"
      class="flex flex-1 flex-col items-center gap-1 py-2 text-[0.65rem] tracking-[0.06em] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
      :class="isActive ? 'cursor-default text-text-strong' : 'text-muted hover:text-text'"
      @click="navigate"
    >
      <AppIcon :name="icon" />
      <slot />
    </a>
  </RouterLink>
</template>
