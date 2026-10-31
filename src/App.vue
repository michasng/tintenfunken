<script setup lang="ts">
import { provide, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import CardSearch from '@/components/CardSearch.vue'
import BottomNavigation from '@/components/primitives/BottomNavigation.vue'
import BottomNavItem from '@/components/primitives/BottomNavItem.vue'
import ButtonComponent from '@/components/primitives/ButtonComponent.vue'
import { ButtonSize } from '@/components/primitives/ButtonSize'
import { IconName } from '@/components/primitives/IconName'
import NavTab from '@/components/primitives/NavTab.vue'
import NavTabGroup from '@/components/primitives/NavTabGroup.vue'
import SelectField from '@/components/primitives/SelectField.vue'
import { useDeck } from '@/composables/useDeck'
import { PRINT_SETTINGS_KEY } from '@/composables/usePrintSettings'
import { DuplexMode } from '@/domain/DuplexMode'
import { FIRST_CARD_NUMBER } from '@/domain/Card'
import { FlipEdge } from '@/domain/FlipEdge'
import { AppView } from '@/router/AppView'
import { toRouteLocation } from '@/router/toRouteLocation'

const LOGO_URL = `${import.meta.env.BASE_URL}icon.svg`

const NAVIGATION_ITEMS = [
  { view: AppView.Overview, label: 'Übersicht', icon: IconName.Overview },
  { view: AppView.Preview, label: 'Vorschau', icon: IconName.Preview },
  { view: AppView.Print, label: 'Druck', icon: IconName.Print },
]

const deck = useDeck()
const route = useRoute()
const router = useRouter()

const showCard = (cardNumber: number) => router.push(toRouteLocation(AppView.Preview, cardNumber))

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
  <div class="flex min-h-dvh flex-col overflow-x-clip max-sm:pb-16 print:block print:min-h-0">
    <header
      class="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-panel-border bg-panel px-4 py-[10px] sm:gap-5 sm:px-6 print:hidden"
    >
      <img :src="LOGO_URL" alt="Tintenfunken" class="size-8 shrink-0 rounded-[6px]" />
      <NavTabGroup label="Ansicht" class="max-sm:hidden">
        <NavTab
          v-for="item in NAVIGATION_ITEMS"
          :key="item.view"
          :to="toRouteLocation(item.view, FIRST_CARD_NUMBER)"
        >
          {{ item.label }}
        </NavTab>
      </NavTabGroup>
      <div v-if="route.name === AppView.Preview" class="min-w-0 flex-1">
        <CardSearch :deck="deck" @select="showCard" />
      </div>
      <template v-if="route.name === AppView.Print">
        <SelectField v-model="duplexMode" label="Duplex" :options="duplexOptions" />
        <SelectField v-model="flipEdge" label="Wendeseite" :options="flipEdgeOptions" />
        <div class="ml-auto">
          <ButtonComponent :size="ButtonSize.Compact" @click="printPage">Drucken</ButtonComponent>
        </div>
      </template>
    </header>
    <RouterView />
    <BottomNavigation label="Ansicht" class="sm:hidden">
      <BottomNavItem
        v-for="item in NAVIGATION_ITEMS"
        :key="item.view"
        :to="toRouteLocation(item.view, FIRST_CARD_NUMBER)"
        :icon="item.icon"
      >
        {{ item.label }}
      </BottomNavItem>
    </BottomNavigation>
  </div>
</template>
