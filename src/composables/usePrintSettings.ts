import { inject, type InjectionKey } from 'vue'
import type { PrintSettings } from '@/composables/PrintSettings'

export const PRINT_SETTINGS_KEY: InjectionKey<PrintSettings> = Symbol('printSettings')

export const usePrintSettings = (): PrintSettings => {
  const settings = inject(PRINT_SETTINGS_KEY)
  if (settings === undefined) throw new Error('No print settings provided')
  return settings
}
