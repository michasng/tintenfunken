<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import ButtonComponent from '@/components/primitives/ButtonComponent.vue'
import { ButtonSize } from '@/components/primitives/ButtonSize'
import SelectField from '@/components/primitives/SelectField.vue'
import { PRINT_SETTINGS_KEY } from '@/composables/usePrintSettings'
import { DuplexMode } from '@/domain/DuplexMode'
import { FIRST_CARD_NUMBER } from '@/domain/Card'
import { FlipEdge } from '@/domain/FlipEdge'
import { AppView } from '@/router/AppView'
import { toRouteLocation } from '@/router/toRouteLocation'

const route = useRoute()
const router = useRouter()

const duplexMode = ref(DuplexMode.Manual)
const flipEdge = ref(FlipEdge.Long)
provide(PRINT_SETTINGS_KEY, { duplexMode, flipEdge })

const view = computed({
  get: () => (route.name === AppView.Print ? AppView.Print : AppView.Preview),
  set: (selected: AppView) => {
    router.push(toRouteLocation(selected, FIRST_CARD_NUMBER))
  },
})

const printPage = () => window.print()

const viewOptions = [
  { value: AppView.Preview, label: 'Vorschau' },
  { value: AppView.Print, label: 'Druck' },
]
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
  <nav
    class="sticky top-0 z-10 flex flex-wrap items-center gap-5 border-b border-panel-border bg-panel px-6 py-[10px] print:hidden"
  >
    <span class="mr-2 font-serif text-[1.1rem] tracking-[0.18em] text-text-strong italic">
      Tintenfunken
    </span>
    <SelectField v-model="view" label="Ansicht" :options="viewOptions" />
    <template v-if="view === AppView.Print">
      <SelectField v-model="duplexMode" label="Duplex" :options="duplexOptions" />
      <SelectField v-model="flipEdge" label="Wendeseite" :options="flipEdgeOptions" />
      <div class="ml-auto">
        <ButtonComponent :size="ButtonSize.Compact" @click="printPage">Drucken</ButtonComponent>
      </div>
    </template>
  </nav>
  <RouterView />
</template>
