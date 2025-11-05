<template>
  <template v-if="!renderConnections.length">
    <div
      class="card m-2 flex-row p-2 text-sm"
      :style="padding"
    >
      {{ $t('noContent') }}
    </div>
  </template>
  <VirtualScroller
    v-else
    :data="renderConnections"
    :size="size"
  >
    <template v-slot="{ item }: { item: Connection }">
      <ConnectionCard :conn="item" />
    </template>
  </VirtualScroller>
</template>

<script setup lang="ts">
import { usePaddingForCtrls } from '@/composables/paddingForCtrls'
import { renderConnections } from '@/store/connections'
import { connectionCardLines } from '@/store/settings'
import type { Connection } from '@/types'
import { computed } from 'vue'
import VirtualScroller from '../common/VirtualScroller.vue'
import ConnectionCard from './ConnectionCard'
const { padding } = usePaddingForCtrls()
const size = computed(() => {
  return connectionCardLines.value.length * 28 + 4
})
</script>
