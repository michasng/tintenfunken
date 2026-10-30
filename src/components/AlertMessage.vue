<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <p
    role="alert"
    class="m-6 rounded-[4px] border border-[#8f1111] bg-[#2a0f0f] px-5 py-3 text-[0.8rem] text-text-strong"
  >
    {{ message }}
  </p>
</template>
