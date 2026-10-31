<script setup lang="ts">
import { ref } from 'vue'
import CardFront from '@/components/CardFront.vue'
import { useFitScale } from '@/composables/useFitScale'
import type { Card } from '@/domain/Card'

defineProps<{ card: Card }>()

const container = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const scale = useFitScale(container, content)
</script>

<template>
  <div ref="container" class="relative aspect-[89/140] w-full" aria-hidden="true">
    <div
      ref="content"
      class="absolute top-0 left-0 origin-top-left"
      :style="{ transform: `scale(${scale})` }"
    >
      <CardFront :card="card" />
    </div>
  </div>
</template>
