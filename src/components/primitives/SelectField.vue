<script setup lang="ts" generic="Value extends string">
import type { SelectOption } from '@/components/primitives/SelectOption'

defineProps<{ label: string; options: SelectOption<Value>[] }>()

const selected = defineModel<Value>({ required: true })
</script>

<template>
  <label class="flex items-center gap-[7px]">
    <span class="text-[0.7rem] whitespace-nowrap text-muted">{{ label }}</span>
    <select
      v-model="selected"
      class="cursor-pointer rounded-[4px] border border-control-border bg-control px-2 py-1 text-[0.7rem] text-text focus:outline-2 focus:outline-offset-1 focus:outline-brand"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </label>
</template>
