<script setup lang="ts">
defineProps<{ label: string; text: string; examples?: boolean }>()
</script>

<template>
  <div class="flex shrink-0 flex-col gap-[2px]">
    <div class="text-[0.55rem] font-bold tracking-[0.16em] text-(--accent) uppercase">
      {{ label }}
    </div>
    <p
      class="text-[0.72rem] leading-[1.52]"
      :class="examples ? 'text-[#5a4e48] italic' : 'text-[#2a2420]'"
    >
      {{ text }}
    </p>
  </div>
</template>
