<script setup lang="ts">
import { computed } from 'vue'
import CardBack from '@/components/CardBack.vue'
import CardFront from '@/components/CardFront.vue'
import { useDeck } from '@/composables/useDeck'
import { usePrintSettings } from '@/composables/usePrintSettings'
import { layoutPages } from '@/domain/layoutPages'
import { PageItemKind } from '@/domain/PageItemKind'
import { resolveReferences } from '@/domain/resolveReferences'

const deck = useDeck()
const { duplexMode, flipEdge } = usePrintSettings()

const pageItems = computed(() => layoutPages(deck, duplexMode.value, flipEdge.value))

const sheetLabel = (kind: PageItemKind, sheetNumber: number, sheetCount: number) =>
  `${kind === PageItemKind.FrontSheet ? 'Vorderseite' : 'Rückseite'} ${sheetNumber} / ${sheetCount}`
</script>

<template>
  <main class="flex flex-col items-center gap-[28px] px-6 pt-10 pb-20 print:gap-0 print:p-0">
    <template v-for="(item, itemIndex) in pageItems" :key="itemIndex">
      <section
        v-if="item.kind === PageItemKind.Divider"
        class="flex w-[210mm] flex-col gap-2 rounded-[8px] border border-panel-border bg-[#1a1530] px-8 py-[22px] text-center print:hidden"
      >
        <strong class="text-[0.85rem] font-semibold tracking-[0.05em] text-text-strong">
          Rückseiten einlegen
        </strong>
        <p class="text-[0.75rem] leading-[1.65] text-[#888]">
          Den bedruckten Stapel ({{ item.sheetCount }}&nbsp;{{
            item.sheetCount === 1 ? 'Seite' : 'Seiten'
          }}) aus dem Ausgabefach nehmen und in den Einzug legen.
        </p>
        <p class="text-[0.75rem] leading-[1.65] text-[#888]">
          Lange Kante: Stapel links–rechts wenden &nbsp;·&nbsp; Kurze Kante: Stapel oben–unten
          wenden
        </p>
      </section>
      <section
        v-else
        :data-label="sheetLabel(item.kind, item.sheetNumber, item.sheetCount)"
        class="relative grid h-[297mm] w-[210mm] shrink-0 grid-cols-[89mm_89mm] grid-rows-[140mm_140mm] content-center justify-center gap-[5mm] bg-white break-after-page shadow-[0_2px_6px_rgba(0,0,0,.45),0_10px_32px_rgba(0,0,0,.45)] before:absolute before:bottom-[calc(100%+5px)] before:left-0 before:text-[0.58rem] before:tracking-[0.2em] before:whitespace-nowrap before:text-[#555] before:uppercase before:content-[attr(data-label)] print:shadow-none print:before:hidden"
      >
        <div
          v-for="(card, slotIndex) in item.slots"
          :key="slotIndex"
          :class="item.kind === PageItemKind.BackSheet ? 'overflow-visible' : 'overflow-hidden'"
        >
          <template v-if="card">
            <CardBack
              v-if="item.kind === PageItemKind.BackSheet"
              :card="card"
              :references="resolveReferences(card, deck)"
              bleed-extended
            />
            <CardFront v-else :card="card" />
          </template>
        </div>
      </section>
    </template>
  </main>
</template>
