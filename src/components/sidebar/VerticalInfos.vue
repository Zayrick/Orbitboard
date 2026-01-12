<template>
  <div class="card mx-1 flex flex-col gap-4 py-2 text-xs">
    <div class="flex flex-col gap-4">
      <div class="flex flex-col items-center justify-center gap-1">
        <ArrowsRightLeftIcon class="h-4 w-4" />
        {{ statisticsMap[STATISTICS_TYPE.CONNECTIONS] }}
      </div>
    </div>

    <div class="flex flex-col items-center justify-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { STATISTICS_TYPE, statisticsMap } from '@/composables/statistics'
import { ArrowsRightLeftIcon } from '@heroicons/vue/24/outline'
</script>
