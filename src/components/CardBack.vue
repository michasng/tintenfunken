<script setup lang="ts">
import { useTemplateRef } from 'vue'
import CardField from '@/components/CardField.vue'
import ReferenceChip from '@/components/ReferenceChip.vue'
import { useFitText } from '@/composables/useFitText'
import type { Card } from '@/domain/Card'
import { CATEGORY_ACCENT_COLORS } from '@/domain/Category'
import type { ResolvedReference } from '@/domain/resolveReferences'

const props = defineProps<{
  card: Card
  references: ResolvedReference[]
  bleedExtended?: boolean
  interactiveReferences?: boolean
}>()

const emit = defineEmits<{ 'click-reference': [cardNumber: number] }>()

const titleElement = useTemplateRef<HTMLElement>('title')
useFitText(titleElement, () => props.card.title)

const selectReference = (reference: ResolvedReference) => {
  if (reference.number !== undefined) emit('click-reference', reference.number)
}
</script>

<template>
  <div
    class="relative h-[140mm] w-[89mm] font-sans"
    :style="{ '--accent': CATEGORY_ACCENT_COLORS[card.category] }"
  >
    <div
      class="absolute flex flex-col overflow-hidden rounded-[3mm] bg-[#FAF7F2]"
      :class="bleedExtended ? '-inset-[2.5mm]' : 'inset-0'"
    >
      <div class="h-[19mm] shrink-0 bg-(--accent) p-[5mm]">
        <div
          class="text-[0.53rem] font-semibold tracking-[0.15em] text-[rgba(255,255,255,.65)] uppercase"
        >
          {{ card.category }}
        </div>
        <div
          ref="title"
          class="mt-px font-serif text-[1.3rem] leading-[1.1] font-bold whitespace-nowrap text-white"
        >
          {{ card.title }}
        </div>
      </div>
      <div class="flex flex-1 flex-col gap-[3.5mm] overflow-hidden p-[5mm]">
        <CardField label="Funktion" :text="card.function" />
        <div class="h-px shrink-0 bg-[#e8e0d4]"></div>
        <CardField label="Anwendung" :text="card.application" />
        <div class="h-px shrink-0 bg-[#e8e0d4]"></div>
        <CardField label="Beispiele" :text="card.examples" examples />
        <template v-if="card.pitfall">
          <div class="h-px shrink-0 bg-[#e8e0d4]"></div>
          <div
            class="shrink-0 rounded-r-[3px] border-l-[2.5px] border-[#C07A10] bg-[#fdf3e2] px-[8px] pt-[5px] pb-[6px]"
          >
            <p
              class="text-[0.65rem] leading-[1.46] text-[#6a4010] before:text-[0.66rem] before:text-[#9A5A08] before:content-['⚠_']"
            >
              {{ card.pitfall }}
            </p>
          </div>
        </template>
      </div>
      <div
        class="flex h-[20.5mm] shrink-0 flex-col justify-between gap-[4px] overflow-hidden border-t border-[#DDD4C4] bg-[#EEE6DA] px-[5mm] py-[4mm]"
      >
        <div v-if="references.length" class="flex items-start gap-[6px]">
          <span
            class="shrink-0 pt-[2px] text-[0.51rem] font-bold tracking-[0.13em] whitespace-nowrap text-[#999] uppercase"
          >
            Passt&nbsp;zu
          </span>
          <div class="flex flex-wrap gap-[3px]">
            <ReferenceChip
              v-for="reference in references"
              :key="reference.title"
              :title="reference.title"
              :category="reference.category"
              :interactive="Boolean(interactiveReferences) && reference.number !== undefined"
              @select="selectReference(reference)"
            />
          </div>
        </div>
        <p v-if="card.sources.length" class="text-[0.56rem] leading-[1.4] text-[#6E645A] italic">
          <template v-for="(source, index) in card.sources" :key="source">
            <br v-if="index > 0" />
            {{ source }}
          </template>
        </p>
      </div>
    </div>
  </div>
</template>
