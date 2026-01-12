<template>
  <div
    v-if="!hidden"
    class="bg-base-100 border-base-200/50 overflow-hidden rounded-2xl border shadow-sm transition-shadow duration-200 hover:shadow-md"
    style="break-inside: avoid"
  >
    <div
      v-if="title || $slots.header"
      class="border-base-200/50 bg-base-200/20 flex items-center gap-3 border-b px-5 py-4"
    >
      <slot name="header">
        <component
          v-if="icon"
          :is="icon"
          class="text-primary h-5 w-5"
        />
        <span class="flex-1 text-base font-semibold">{{ title }}</span>
        <slot name="header-extra" />
      </slot>
    </div>
    <div class="px-5 py-4">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      class="border-base-200/50 bg-base-200/10 border-t px-5 py-3"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title?: string
  icon?: Component
  hidden?: boolean
}>()
</script>
