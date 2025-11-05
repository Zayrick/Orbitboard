<template>
  <div
    ref="parentRef"
    class="flex h-full w-full overflow-y-auto p-2"
    :style="padding"
  >
    <div
      :style="{
        height: `${totalSize}px`,
      }"
      class="relative w-full"
    >
      <div
        class="absolute top-0 left-0 w-full"
        :style="{
          transform: `translateY(${virtualRows[0]?.start ?? 0}px)`,
        }"
      >
        <div
          v-for="row in virtualRows"
          :key="row.key.toString()"
          :data-index="row.index"
          :ref="(ref) => measureElement(ref as Element | null)"
          class="mb-1"
        >
          <slot
            :item="data[row.index]"
            :index="row.index"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePaddingForCtrls } from '@/composables/paddingForCtrls'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { computed, nextTick, ref } from 'vue'

const { padding } = usePaddingForCtrls()
const parentRef = ref<HTMLElement | null>(null)
const props = withDefaults(
  defineProps<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
    size?: number
    overscan?: number
  }>(),
  {
    data: () => [],
    size: 64,
    overscan: 24,
  },
)
const virutalOptions = computed(() => {
  return {
    count: props.data.length,
    getScrollElement: () => parentRef.value,
    estimateSize: () => props.size,
    overscan: props.overscan,
  }
})

const rowVirtualizer = useVirtualizer(virutalOptions)

const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())
const totalSize = computed(() => rowVirtualizer.value.getTotalSize())

const measureElement = (el: Element | null) => {
  if (!el) {
    return
  }

  nextTick(() => {
    rowVirtualizer.value.measureElement(el)
  })

  return undefined
}
</script>
