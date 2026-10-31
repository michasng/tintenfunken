<script setup lang="ts">
import { ref } from 'vue'
import type { Card } from '@/domain/Card'
import { SearchKey } from '@/components/SearchKey'

const MAXIMUM_SUGGESTIONS = 8
const NO_SUGGESTION = -1

const props = defineProps<{ deck: Card[] }>()
const emit = defineEmits<{ select: [cardNumber: number] }>()

const term = ref('')
const suggestions = ref<Card[]>([])
const activeIndex = ref(NO_SUGGESTION)

const closeSuggestions = () => {
  suggestions.value = []
  activeIndex.value = NO_SUGGESTION
}

const updateSuggestions = () => {
  const normalizedTerm = term.value.trim().toLowerCase()
  activeIndex.value = NO_SUGGESTION
  suggestions.value = normalizedTerm
    ? props.deck
        .filter((card) => card.title.toLowerCase().includes(normalizedTerm))
        .slice(0, MAXIMUM_SUGGESTIONS)
    : []
}

const choose = (card: Card) => {
  term.value = ''
  closeSuggestions()
  emit('select', card.number)
}

const moveActive = (step: number) => {
  const count = suggestions.value.length
  activeIndex.value = (activeIndex.value + step + count) % count
}

const chooseActiveOrFirst = () => {
  const card = suggestions.value[activeIndex.value] ?? suggestions.value[0]
  if (card) choose(card)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (suggestions.value.length === 0) return
  const action = keyActions[event.key]
  if (!action) return
  if (event.key !== SearchKey.Escape) event.preventDefault()
  action()
}

const keyActions: Record<string, () => void> = {
  [SearchKey.ArrowDown]: () => moveActive(1),
  [SearchKey.ArrowUp]: () => moveActive(-1),
  [SearchKey.Enter]: chooseActiveOrFirst,
  [SearchKey.Escape]: closeSuggestions,
}
</script>

<template>
  <div class="relative w-full max-w-64">
    <input
      v-model="term"
      type="search"
      role="combobox"
      placeholder="Karte suchen …"
      autocomplete="off"
      aria-label="Karte suchen"
      aria-autocomplete="list"
      :aria-expanded="suggestions.length > 0"
      class="w-full rounded-[4px] border border-control-border bg-control px-2 py-1 text-[0.7rem] text-text placeholder:text-[#6b6280] focus:outline-2 focus:outline-offset-1 focus:outline-brand"
      @input="updateSuggestions"
      @blur="closeSuggestions"
      @keydown="handleKeydown"
    />
    <ul
      v-if="suggestions.length"
      role="listbox"
      class="absolute inset-x-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-[6px] border border-control-border bg-panel shadow-[0_8px_24px_rgba(0,0,0,.5)]"
    >
      <li
        v-for="(card, index) in suggestions"
        :key="card.number"
        role="option"
        :aria-selected="index === activeIndex"
        class="cursor-pointer truncate px-[14px] py-2 text-[0.78rem] text-text hover:bg-brand hover:text-white"
        :class="{ 'bg-brand text-white': index === activeIndex }"
        @mousedown.prevent="choose(card)"
      >
        {{ card.title }}
      </li>
    </ul>
  </div>
</template>
