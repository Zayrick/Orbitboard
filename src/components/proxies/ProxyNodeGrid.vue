<template>
  <div
    class="grid gap-2"
    :style="gridStyle"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { minProxyCardWidth } from '@/store/settings'
import { computed } from 'vue'

const props = defineProps<{
  /** 固定列数，优先级高于自动计算 */
  columns?: number
}>()

const gridStyle = computed(() => {
  if (props.columns && props.columns > 0) {
    // 使用固定列数，避免动画过程中重新计算
    return `grid-template-columns: repeat(${props.columns}, minmax(0, 1fr));`
  }
  // 默认自适应列数
  return `grid-template-columns: repeat(auto-fill, minmax(${minProxyCardWidth.value}px, 1fr));`
})
</script>
