<template>
  <div
    ref="containerRef"
    class="pointer-events-none absolute inset-0 z-0 p-3"
    aria-hidden="true"
  >
    <canvas
      ref="canvasRef"
      class="mask-gradient h-full w-full opacity-25 blur-[0.3px] brightness-95 saturate-50"
    />
  </div>
</template>

<script setup lang="ts">
import { LATENCY_COLORS, NOT_CONNECTED } from '@/constant'
import { getLatencyByName } from '@/store/proxies'
import { lowLatency, mediumLatency } from '@/store/settings'
import { useElementSize } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  nodes: string[]
  active?: string
  groupName?: string
}>()

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const { width, height } = useElementSize(containerRef)

// Constants
const GAP_RATIO = 0.35
const GAP_LIMITS = [2, 10] as const
const ALPHA_LEVEL = 0.35

const THEME = {
  ...LATENCY_COLORS,
  base: 'rgba(166, 173, 187, 0.18)',
  active: 'oklch(65.69% 0.196 275.75)',
} as const

// Utils
const applyAlpha = (color: string, alpha: number) => {
  if (color.startsWith('oklch(')) return color.replace(')', ` / ${alpha})`)
  if (color.startsWith('rgb(')) return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`)
  return color
}

const getGap = (size: number) =>
  Math.max(GAP_LIMITS[0], Math.min(GAP_LIMITS[1], Math.round(size * GAP_RATIO)))

// Layout Engine
const layout = computed(() => {
  const n = props.nodes.length
  const w = width.value
  const h = height.value

  if (n <= 0 || w <= 0 || h <= 0) return { cols: 1, rows: 1, size: 0 }

  const ratio = w / h
  const estimatedCols = Math.round(Math.sqrt(n * ratio)) || 1
  const candidates = [estimatedCols - 1, estimatedCols, estimatedCols + 1].filter(
    (c) => c >= 1 && c <= n,
  )

  let best = { cols: 1, size: 0 }

  for (const cols of candidates) {
    const rows = Math.ceil(n / cols)
    let size = Math.floor(Math.min(w / cols, h / rows))

    // Refine size considering dynamic gap (3 iterations is sufficient for convergence)
    for (let i = 0; i < 3; i++) {
      const gap = getGap(size)
      const maxW = (w - (cols - 1) * gap) / cols
      const maxH = (h - (rows - 1) * gap) / rows
      const nextSize = Math.floor(Math.min(maxW, maxH))
      if (nextSize === size) break
      size = nextSize
    }

    if (size > best.size) best = { cols, size }
  }

  return { ...best, rows: Math.ceil(n / best.cols) }
})

const getDotColor = (name: string) => {
  const latency = getLatencyByName(name, props.groupName)
  if (latency === NOT_CONNECTED) return THEME.base

  const color =
    latency < lowLatency.value
      ? THEME.low
      : latency < mediumLatency.value
        ? THEME.medium
        : THEME.high

  return applyAlpha(color, ALPHA_LEVEL)
}

const draw = () => {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx || !width.value || !height.value) return

  const dpr = window.devicePixelRatio || 1
  canvas.width = width.value * dpr
  canvas.height = height.value * dpr
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, width.value, height.value)

  const { cols, rows, size } = layout.value
  if (size <= 0) return

  const radius = size / 2

  // Calculate spacing - prefer space-between to fill area, fallback to center
  const stepX = cols > 1 ? (width.value - size) / (cols - 1) : 0
  const stepY = rows > 1 ? (height.value - size) / (rows - 1) : 0

  // If we can't do space-between (1 col/row), center it
  const startX = cols > 1 ? radius : (width.value - size) / 2 + radius
  const startY = rows > 1 ? radius : (height.value - size) / 2 + radius

  props.nodes.forEach((name, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)

    const x = cols > 1 ? radius + col * stepX : startX
    const y = rows > 1 ? radius + row * stepY : startY

    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fillStyle = getDotColor(name)
    ctx.fill()

    if (props.active === name) {
      ctx.beginPath()
      ctx.arc(x, y, radius - 0.5, 0, Math.PI * 2)
      ctx.strokeStyle = applyAlpha(THEME.active, 0.45)
      ctx.lineWidth = 1
      ctx.stroke()
    }
  })
}

watch([width, height, () => props.nodes, () => props.active], draw, { flush: 'post' })

onMounted(() => requestAnimationFrame(draw))
</script>

<style scoped>
.mask-gradient {
  mask-image: linear-gradient(to right, transparent 0px, rgba(0, 0, 0, 0.35) 72px, black 180px);
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0px,
    rgba(0, 0, 0, 0.35) 72px,
    black 180px
  );
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
}
</style>
