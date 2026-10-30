<script setup lang="ts">
import { provide, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import ButtonComponent from '@/components/primitives/ButtonComponent.vue'
import { ButtonSize } from '@/components/primitives/ButtonSize'
import NavTab from '@/components/primitives/NavTab.vue'
import NavTabGroup from '@/components/primitives/NavTabGroup.vue'
import SelectField from '@/components/primitives/SelectField.vue'
import { PRINT_SETTINGS_KEY } from '@/composables/usePrintSettings'
import { DuplexMode } from '@/domain/DuplexMode'
import { FIRST_CARD_NUMBER } from '@/domain/Card'
import { FlipEdge } from '@/domain/FlipEdge'
import { AppView } from '@/router/AppView'
import { toRouteLocation } from '@/router/toRouteLocation'

const route = useRoute()

const duplexMode = ref(DuplexMode.Manual)
const flipEdge = ref(FlipEdge.Long)
provide(PRINT_SETTINGS_KEY, { duplexMode, flipEdge })

const printPage = () => window.print()

const duplexOptions = [
  { value: DuplexMode.Manual, label: 'Manuell' },
  { value: DuplexMode.Automatic, label: 'Automatisch' },
]
const flipEdgeOptions = [
  { value: FlipEdge.Long, label: 'Lange Kante' },
  { value: FlipEdge.Short, label: 'Kurze Kante' },
]
</script>

<template>
  <header
    class="sticky top-0 z-10 flex flex-wrap items-center gap-5 border-b border-panel-border bg-panel px-6 py-[10px] print:hidden"
  >
    <span class="mr-2 font-serif text-[1.1rem] tracking-[0.18em] text-text-strong italic">
      Tintenfunken
    </span>
    <NavTabGroup label="Ansicht">
      <NavTab :to="toRouteLocation(AppView.Overview, FIRST_CARD_NUMBER)">Übersicht</NavTab>
      <NavTab :to="toRouteLocation(AppView.Preview, FIRST_CARD_NUMBER)">Vorschau</NavTab>
      <NavTab :to="toRouteLocation(AppView.Print, FIRST_CARD_NUMBER)">Druck</NavTab>
    </NavTabGroup>
    <template v-if="route.name === AppView.Print">
      <SelectField v-model="duplexMode" label="Duplex" :options="duplexOptions" />
      <SelectField v-model="flipEdge" label="Wendeseite" :options="flipEdgeOptions" />
      <div class="ml-auto">
        <ButtonComponent :size="ButtonSize.Compact" @click="printPage">Drucken</ButtonComponent>
      </div>
    </template>
  </header>
  <RouterView />
</template>
