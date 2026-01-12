<template>
  <div
    class="relative flex size-full flex-col overflow-hidden"
    :style="!useConnectionCard && padding"
  >
    <h1
      class="p-4 pt-8 pb-0 text-4xl font-bold"
      :style="useConnectionCard && padding"
    >
      {{ t('connections') }}
    </h1>
    <template v-if="useConnectionCard">
      <ConnectionCardList />
    </template>
    <template v-else>
      <ConnectionCtrl />
      <ConnectionTable />
    </template>
    <ConnectionDetails />
  </div>
</template>

<script setup lang="ts">
import ConnectionCardList from '@/components/connections/ConnectionCardList.vue'
import ConnectionDetails from '@/components/connections/ConnectionDetails.vue'
import ConnectionTable from '@/components/connections/ConnectionTable.vue'
import ConnectionCtrl from '@/components/sidebar/ConnectionCtrl.tsx'
import { usePaddingForViews } from '@/composables/paddingViews'
import { useConnectionCard } from '@/store/settings'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { padding } = usePaddingForViews({
  offsetTop: 0,
  offsetBottom: 0,
})
</script>

<style>
.vjs-tree {
  font-family:
    NotoEmoji,
    Monaco,
    Menlo,
    Consolas,
    Bitstream Vera Sans Mono,
    monospace;
}
.vjs-tree-node.is-highlight,
.vjs-tree-node:hover {
  background-color: var(--color-base-200);
}
</style>
