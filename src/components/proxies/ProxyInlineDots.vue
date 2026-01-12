<template>
  <div
    ref="containerRef"
    class="pointer-events-none absolute inset-0 z-0"
    aria-hidden="true"
  >
    <div
      class="proxy-inline-dots__grid grid h-full w-full p-0 opacity-25 blur-[0.3px] brightness-95 saturate-50"
      :style="gridStyle"
    >
      <div
        v-for="(item, idx) in items"
        :key="item.placeholder ? `ph-${idx}` : item.name"
        class="rounded-full"
        :class="getDotClass(item)"
        :style="dotStyle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NOT_CONNECTED } from '@/constant'
import { getLatencyByName } from '@/store/proxies'
import { lowLatency, mediumLatency } from '@/store/settings'
import { useElementSize } from '@vueuse/core'
import { computed, ref } from 'vue'

// 间距随点大小动态调整：gap = clamp(round(dotSize * ratio), min, max)
// 目标：点尽可能大，同时间距随之合理变化。
const GAP_RATIO = 0.35
const GAP_MIN_PX = 2
const GAP_MAX_PX = 10

const props = defineProps<{
  nodes: string[]
  active?: string
  groupName?: string
}>()

type DotItem = { name: string; placeholder: boolean }

const containerRef = ref<HTMLElement | null>(null)
const { width, height } = useElementSize(containerRef)

type Layout = {
  cols: number
  rows: number
  dotSize: number
  gap: number
}

const clampInt = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, Math.round(value)))

const getGapPx = (dotSize: number) => {
  const raw = Math.round(dotSize * GAP_RATIO)
  return Math.max(GAP_MIN_PX, Math.min(GAP_MAX_PX, raw))
}

const solveBestDotSizeWithDynamicGap = (
  w: number,
  h: number,
  cols: number,
  rows: number,
): { dotSize: number; gap: number } => {
  // 上界：忽略 gap 时的最大点尺寸
  let dot = Math.floor(Math.min(w / cols, h / rows))

  if (dot <= 0) return { dotSize: 0, gap: GAP_MIN_PX }

  // 单调收敛：dot 越大 -> gap 越大 -> dot 可能变小
  for (let i = 0; i < 6; i++) {
    const gap = getGapPx(dot)
    const availableW = w - (cols - 1) * gap
    const availableH = h - (rows - 1) * gap

    if (availableW <= 0 || availableH <= 0) {
      return { dotSize: 0, gap }
    }

    const nextDot = Math.floor(Math.min(availableW / cols, availableH / rows))
    if (nextDot === dot) {
      return { dotSize: dot, gap }
    }

    dot = nextDot
    if (dot <= 0) {
      return { dotSize: 0, gap }
    }
  }

  return { dotSize: dot, gap: getGapPx(dot) }
}

const layout = computed<Layout>(() => {
  const n = props.nodes.length
  const w = Math.floor(width.value)
  const h = Math.floor(height.value)

  if (n <= 0 || w <= 0 || h <= 0) {
    return { cols: 1, rows: 1, dotSize: 0, gap: GAP_MIN_PX }
  }

  // 目标：看起来“足够好”即可，不追求绝对最优。
  // 用宽高比估算列数，并只尝试邻域候选(±1)，避免 O(n) 遍历。
  const ratio = w / h
  const estimatedCols = clampInt(Math.sqrt(n * ratio), 1, n)
  const candidateCols = Array.from(
    new Set([estimatedCols - 1, estimatedCols, estimatedCols + 1].filter((c) => c >= 1 && c <= n)),
  )

  let best: Layout = {
    cols: estimatedCols,
    rows: Math.ceil(n / estimatedCols),
    dotSize: 0,
    gap: GAP_MIN_PX,
  }

  for (const cols of candidateCols) {
    const rows = Math.ceil(n / cols)
    const { dotSize, gap } = solveBestDotSizeWithDynamicGap(w, h, cols, rows)
    if (dotSize <= 0) continue

    const isBetter =
      dotSize > best.dotSize ||
      (dotSize === best.dotSize && Math.abs(cols - rows) < Math.abs(best.cols - best.rows)) ||
      (dotSize === best.dotSize &&
        Math.abs(cols - rows) === Math.abs(best.cols - best.rows) &&
        cols > best.cols)

    if (isBetter) best = { cols, rows, dotSize, gap }
  }

  return best
})

const items = computed<DotItem[]>(() => {
  const { cols } = layout.value
  const base = props.nodes.map((name) => ({ name, placeholder: false }))
  const remainder = props.nodes.length % cols
  if (remainder === 0) return base

  const placeholders = Array.from({ length: cols - remainder }, () => ({
    name: '',
    placeholder: true,
  }))
  return base.concat(placeholders)
})

const gridStyle = computed(() => {
  const { cols, rows, dotSize, gap } = layout.value
  if (dotSize <= 0) return { display: 'none' }

  return {
    gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
    gridAutoRows: `${dotSize}px`,
    gap: `${gap}px`,
    justifyContent: rows > 1 && cols > 1 ? 'space-between' : 'start',
    alignContent: rows > 1 ? 'space-between' : 'start',
  }
})

const dotStyle = computed(() => {
  const { dotSize } = layout.value
  return { width: `${dotSize}px`, height: `${dotSize}px` }
})

const getBgClass = (latency: number) => {
  if (latency === NOT_CONNECTED) return 'bg-base-content/18'
  if (latency < lowLatency.value) return 'bg-low-latency/35'
  if (latency < mediumLatency.value) return 'bg-medium-latency/35'
  return 'bg-high-latency/35'
}

const getDotClass = (item: DotItem) => {
  if (item.placeholder) return 'opacity-0'

  const latency = getLatencyByName(item.name, props.groupName)
  const base = getBgClass(latency)
  const isActive = props.active === item.name

  return isActive ? `${base} ring-1 ring-primary/45` : base
}
</script>

<style scoped>
/*
 * 这是标题区域的“装饰性背景预览”。
 * 重点是“可感知但不抢戏”：左侧（文字密集区）更淡，右侧稍明显。
 */
.proxy-inline-dots__grid {
  -webkit-mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0px,
    rgba(0, 0, 0, 0.35) 72px,
    rgba(0, 0, 0, 1) 180px
  );
  mask-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0px,
    rgba(0, 0, 0, 0.35) 72px,
    rgba(0, 0, 0, 1) 180px
  );
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
</style>
