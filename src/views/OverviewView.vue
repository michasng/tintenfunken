<script setup lang="ts">
import { RouterLink } from 'vue-router'
import CardMiniature from '@/components/CardMiniature.vue'
import { useDeck } from '@/composables/useDeck'
import { AppView } from '@/router/AppView'
import { toRouteLocation } from '@/router/toRouteLocation'

const deck = useDeck()
</script>

<template>
  <main class="px-6 pt-10 pb-20">
    <ul class="grid grid-cols-[repeat(auto-fill,minmax(35.6mm,1fr))] gap-5">
      <li v-for="card in deck" :key="card.number">
        <RouterLink
          :to="toRouteLocation(AppView.Preview, card.number)"
          :aria-label="card.title"
          class="block rounded-[1.2mm] transition duration-100 hover:-translate-y-2 hover:scale-105 hover:shadow-[0_12px_28px_rgba(0,0,0,.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <CardMiniature :card="card" />
        </RouterLink>
      </li>
    </ul>
  </main>
</template>
