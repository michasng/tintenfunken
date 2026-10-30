<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CardBack from '@/components/CardBack.vue'
import CardFront from '@/components/CardFront.vue'
import CardSearch from '@/components/CardSearch.vue'
import FlipPanel from '@/components/FlipPanel.vue'
import ButtonComponent from '@/components/primitives/ButtonComponent.vue'
import { useDeck } from '@/composables/useDeck'
import { FIRST_CARD_NUMBER } from '@/domain/Card'
import { resolveReferences } from '@/domain/resolveReferences'
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

const goTo = (targetNumber: number) => router.push(toRouteLocation(AppView.Preview, targetNumber))
</script>

<template>
  <section v-if="card" class="flex flex-col items-center gap-[22px] px-6 pt-10 pb-20">
    <CardSearch :deck="deck" @select="goTo" />
    <FlipPanel :key="cardNumber" v-model:flipped="flipped">
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
    <div class="flex items-center gap-[18px]">
      <ButtonComponent :disabled="cardNumber === FIRST_CARD_NUMBER" @click="goTo(cardNumber - 1)">
        Zurück
      </ButtonComponent>
      <span class="min-w-[60px] text-center text-[0.8rem] text-text tabular-nums">
        {{ cardNumber }} / {{ deck.length }}
      </span>
      <ButtonComponent :disabled="cardNumber === deck.length" @click="goTo(cardNumber + 1)">
        Weiter
      </ButtonComponent>
    </div>
    <p class="text-[0.7rem] tracking-[0.04em] text-muted">Karte anklicken zum Wenden</p>
  </section>
</template>
