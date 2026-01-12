<template>
  <div
    v-if="!hidden"
    class="border-base-200/40 flex items-center justify-between gap-3 border-b py-2.5 last:border-b-0"
    :class="{ 'col-span-full': fullWidth }"
  >
    <div class="flex min-w-0 flex-1 items-center gap-1.5">
      <span class="text-base-content/90 truncate text-sm font-medium">{{ label }}</span>
      <slot name="tooltip" />
    </div>
    <div class="flex flex-shrink-0 items-center gap-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  hidden?: boolean
  fullWidth?: boolean
}>()
</script>
