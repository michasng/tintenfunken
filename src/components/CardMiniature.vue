<script setup lang="ts">
import CardFront from '@/components/CardFront.vue'
import type { Card } from '@/domain/Card'

defineProps<{ card: Card }>()
</script>

<template>
  <div class="relative h-[56mm] w-[35.6mm]" aria-hidden="true">
    <div class="absolute top-0 left-0 origin-top-left scale-40">
      <CardFront :card="card" />
    </div>
  </div>
</template>
