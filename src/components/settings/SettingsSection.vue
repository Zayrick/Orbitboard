<template>
  <div class="settings-section">
    <div
      v-if="title"
      class="text-base-content/60 mb-3 px-1 text-xs font-semibold tracking-wide uppercase"
    >
      {{ title }}
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
