<template>
  <div
    class="size-full overflow-x-hidden"
    :style="!useConnectionCard && padding"
  >
    <ConnectionCardList v-if="useConnectionCard" />
    <ConnectionTable v-else />
    <ConnectionDetails />
  </div>
</template>

<script setup lang="ts">
import ConnectionCardList from '@/components/connections/ConnectionCardList.vue'
import ConnectionDetails from '@/components/connections/ConnectionDetails.vue'
import ConnectionTable from '@/components/connections/ConnectionTable.vue'
import { usePaddingForCtrls } from '@/composables/paddingForCtrls'
import { useConnectionCard } from '@/store/settings'
const { padding } = usePaddingForCtrls(4)
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
