<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CardBack from '@/components/CardBack.vue'
import CardFront from '@/components/CardFront.vue'
import FlipPanel from '@/components/FlipPanel.vue'
import AppIcon from '@/components/primitives/AppIcon.vue'
import IconButton from '@/components/primitives/IconButton.vue'
import { IconName } from '@/components/primitives/IconName'
import { useDeck } from '@/composables/useDeck'
import { FIRST_CARD_NUMBER } from '@/domain/Card'
import { resolveReferences } from '@/domain/resolveReferences'
import { createSwipeHandlers } from '@/lib/createSwipeHandlers'
import { AppView } from '@/router/AppView'
import { readCardNumber } from '@/router/readCardNumber'
import { toRouteLocation } from '@/router/toRouteLocation'

const deck = useDeck()
const route = useRoute()
const router = useRouter()

const cardNumber = computed(() => readCardNumber(route.query.card, deck.length))
const card = computed(() => deck[cardNumber.value - FIRST_CARD_NUMBER])
const references = computed(() => (card.value ? resolveReferences(card.value, deck) : []))

const flipped = ref(false)
watch(cardNumber, () => {
  flipped.value = false
})

const hasPrevious = computed(() => cardNumber.value > FIRST_CARD_NUMBER)
const hasNext = computed(() => cardNumber.value < deck.length)

const goTo = (targetNumber: number) => router.push(toRouteLocation(AppView.Preview, targetNumber))

const goToPrevious = () => {
  if (hasPrevious.value) goTo(cardNumber.value - 1)
}

const goToNext = () => {
  if (hasNext.value) goTo(cardNumber.value + 1)
}

const { handleTouchStart, handleTouchEnd } = createSwipeHandlers({
  onSwipeLeft: goToNext,
  onSwipeRight: goToPrevious,
})
</script>

<template>
  <section
    v-if="card"
    class="grid flex-1 grid-cols-[auto_auto_auto] content-center items-center justify-center justify-items-center gap-x-[18px] gap-y-[22px] px-3 py-6 max-sm:grid-cols-[auto_1fr_auto] sm:px-6 sm:py-10"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <FlipPanel
      :key="cardNumber"
      v-model:flipped="flipped"
      class="col-start-2 row-start-1 max-sm:col-span-3 max-sm:col-start-1"
    >
      <template #front>
        <CardFront :card="card" />
      </template>
      <template #back>
        <CardBack
          :card="card"
          :references="references"
          interactive-references
          @click-reference="goTo"
        />
      </template>
    </FlipPanel>
    <IconButton
      label="Zurück"
      :disabled="!hasPrevious"
      class="col-start-1 row-start-1 max-sm:row-start-2"
      @click="goToPrevious"
    >
      <AppIcon :name="IconName.ChevronLeft" />
    </IconButton>
    <IconButton
      label="Weiter"
      :disabled="!hasNext"
      class="col-start-3 row-start-1 max-sm:row-start-2"
      @click="goToNext"
    >
      <AppIcon :name="IconName.ChevronRight" />
    </IconButton>
    <span class="col-start-2 row-start-2 text-center text-[0.8rem] text-text tabular-nums">
      {{ cardNumber }} / {{ deck.length }}
    </span>
  </section>
</template>
