<template>
  <template v-if="!renderConnections.length">
    <div
      class="p-2"
      :style="padding"
    >
      <div class="card flex-row p-2 text-sm">
        {{ $t('noContent') }}
      </div>
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
import { usePaddingForViews } from '@/composables/paddingViews'
import { renderConnections } from '@/store/connections'
import { connectionCardLines } from '@/store/settings'
import type { Connection } from '@/types'
import { computed } from 'vue'
import VirtualScroller from '../common/VirtualScroller.vue'
import ConnectionCard from './ConnectionCard'
const { padding } = usePaddingForViews()
const size = computed(() => {
  return connectionCardLines.value.length * 28 + 4
})
</script>
