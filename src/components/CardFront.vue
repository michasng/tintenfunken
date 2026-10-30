<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { useFitText } from '@/composables/useFitText'
import type { Card } from '@/domain/Card'
import { CATEGORY_ACCENT_COLORS } from '@/domain/Category'
import { artworkUrl } from '@/lib/artworkUrl'

const NUMBER_DIGITS = 2
const NUMBER_PADDING = '0'

const props = defineProps<{ card: Card }>()

const titleElement = useTemplateRef<HTMLElement>('title')
useFitText(titleElement, () => props.card.title)

const artworkFailed = ref(false)
watch(
  () => props.card.slug,
  () => {
    artworkFailed.value = false
  },
)
</script>

<template>
  <div
    class="relative h-[140mm] w-[89mm] font-sans"
    :style="{ '--accent': CATEGORY_ACCENT_COLORS[card.category] }"
  >
    <div class="absolute inset-0 flex flex-col overflow-hidden rounded-[3mm] bg-[#FAF7F2]">
      <div class="flex shrink-0 items-center justify-between bg-(--accent) p-[5mm]">
        <span
          class="text-[0.57rem] font-semibold tracking-[0.15em] text-[rgba(255,255,255,.9)] uppercase"
        >
          {{ card.category }}
        </span>
        <span class="font-serif text-[0.75rem] font-semibold text-[rgba(255,255,255,.85)] italic">
          {{ String(card.number).padStart(NUMBER_DIGITS, NUMBER_PADDING) }}
        </span>
      </div>
      <div class="h-[17mm] shrink-0 px-[5mm] pt-[5mm]">
        <h2
          ref="title"
          class="font-serif text-[2rem] leading-[1.05] font-bold whitespace-nowrap text-[#1a1212]"
        >
          {{ card.title }}
        </h2>
        <div class="mt-[9px] h-[2px] w-[30px] rounded-[1px] bg-(--accent) opacity-70"></div>
      </div>
      <div class="relative flex-1 overflow-hidden bg-[#120a1e]">
        <img
          :src="artworkUrl(card.slug)"
          alt=""
          class="block h-full w-full object-cover"
          @error="artworkFailed = true"
        />
        <div
          v-if="artworkFailed"
          class="absolute inset-0 bg-[linear-gradient(155deg,#2a1a3a_0%,#0f0618_100%)]"
        ></div>
      </div>
      <div class="h-[33mm] shrink-0 overflow-hidden bg-(--accent) p-[5mm]">
        <p class="text-[0.69rem] leading-[1.55] text-[rgba(255,255,255,.92)] italic">
          {{ card.essence }}
        </p>
      </div>
    </div>
  </div>
</template>
