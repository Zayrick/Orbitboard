<template>
  <!-- Static Card (visible when not floating) -->
  <div
    v-if="!isCardFloating"
    ref="staticCardRef"
    class="card cursor-pointer overflow-hidden"
    @click="openModal"
    @contextmenu.prevent.stop="handlerLatencyTest"
  >
    <ProxyGroupCardContent
      :name="name"
      :proxy-group="proxyGroup"
      :proxies-count="proxiesCount"
      :render-proxies="renderProxies"
      :show-inline-dots="showInlineDots"
      :show-preview="showPreview"
      :is-latency-testing="isLatencyTesting"
      :download-total="downloadTotal"
      :hidden-group="hiddenGroup ?? false"
      @latency-test="handlerLatencyTest"
      @toggle-hidden="handlerGroupToggle"
      @node-click="(node: string) => handlerProxySelect(name, node)"
    />
  </div>

  <!-- Placeholder (maintains layout when card is floating) -->
  <div
    v-else
    class="card"
    :style="{ height: `${originalRect.height}px`, visibility: 'hidden' }"
  />

  <!-- Teleport floating card to body -->
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isModalOpen"
        class="bg-base-300/60 fixed inset-0 z-[100] backdrop-blur-sm"
        @click="closeModal"
      />
    </Transition>

    <!-- Floating Card -->
    <div
      v-if="isCardFloating"
      ref="floatingCardRef"
      class="card fixed z-[101] cursor-pointer overflow-hidden will-change-transform"
      :style="floatingCardStyle"
      @contextmenu.prevent.stop="handlerLatencyTest"
    >
      <ProxyGroupCardContent
        :name="name"
        :proxy-group="proxyGroup"
        :proxies-count="proxiesCount"
        :render-proxies="renderProxies"
        :show-inline-dots="showInlineDots && !isModalOpen"
        :show-preview="showPreview && !isModalOpen"
        :is-latency-testing="isLatencyTesting"
        :download-total="downloadTotal"
        :hidden-group="hiddenGroup ?? false"
        @latency-test="handlerLatencyTest"
        @toggle-hidden="handlerGroupToggle"
        @node-click="(node: string) => handlerProxySelect(name, node)"
      />

      <!-- Expanded Content -->
      <div
        class="overflow-hidden transition-all duration-300 ease-out"
        :style="{
          maxHeight: showExpandedContent ? '60vh' : '0px',
          opacity: showExpandedContent ? 1 : 0,
        }"
      >
        <div
          class="max-h-[60vh] overflow-y-auto overscroll-contain px-3 pb-3"
          :class="[SCROLLABLE_PARENT_CLASS]"
          @click.stop
        >
          <Component
            :is="groupProxiesByProvider ? ProxiesByProvider : ProxiesContent"
            :name="name"
            :now="proxyGroup.now"
            :render-proxies="renderProxies"
            :columns="fixedColumns"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useBounceOnVisible } from '@/composables/bouncein'
import { calculateGridColumns, disableProxiesPageScroll } from '@/composables/proxies'
import { useRenderProxies } from '@/composables/renderProxies'
import { PROXY_PREVIEW_TYPE } from '@/constant'
import { isHiddenGroup } from '@/helper'
import { SCROLLABLE_PARENT_CLASS } from '@/helper/utils'
import { activeConnections } from '@/store/connections'
import {
  handlerProxySelect,
  hiddenGroupMap,
  proxyGroupLatencyTest,
  proxyMap,
} from '@/store/proxies'
import { groupProxiesByProvider, proxyPreviewType } from '@/store/settings'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import ProxiesByProvider from './ProxiesByProvider.vue'
import ProxiesContent from './ProxiesContent.vue'
import ProxyGroupCardContent from './ProxyGroupCardContent.vue'

const props = defineProps<{
  name: string
}>()

const proxyGroup = computed(() => proxyMap.value[props.name])
const allProxies = computed(() => proxyGroup.value.all ?? [])
const { proxiesCount, renderProxies } = useRenderProxies(allProxies, props.name)

const showInlineDots = computed(() => proxyPreviewType.value === PROXY_PREVIEW_TYPE.INLINE)
const showPreview = computed(() => proxyPreviewType.value !== PROXY_PREVIEW_TYPE.INLINE)

// Refs
const staticCardRef = ref<HTMLDivElement>()
const floatingCardRef = ref<HTMLDivElement>()

// Animation states
const isCardFloating = ref(false)
const isModalOpen = ref(false)
const showExpandedContent = ref(false)
const isAnimating = ref(false)

// Store positions
const originalRect = ref({ top: 0, left: 0, width: 0, height: 0 })
const currentTransform = ref({ x: 0, y: 0, scale: 1, width: 0 })

// 预计算的固定列数，用于防止动画过程中布局抖动
const fixedColumns = ref<number | undefined>(undefined)

// Calculate modal target position
const getModalPosition = () => {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const modalWidth = Math.min(viewportWidth - 32, 500)
  const modalLeft = (viewportWidth - modalWidth) / 2
  const modalTop = Math.max(viewportHeight * 0.1, 40)

  return { left: modalLeft, top: modalTop, width: modalWidth }
}

// Floating card style with CSS transitions - iOS spring-like animation
const floatingCardStyle = computed(() => {
  const { x, y, scale, width } = currentTransform.value

  // Keep motion curve consistent across the app.
  // Matches `EASE_OUT_EXPO` used in `src/views/HomePage.vue`.
  const EASE_OUT_EXPO = 'cubic-bezier(0.25, 1, 0.5, 1)'

  return {
    top: `${originalRect.value.top}px`,
    left: `${originalRect.value.left}px`,
    width: `${width || originalRect.value.width}px`,
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    transformOrigin: 'top left',
    transition: isAnimating.value
      ? `transform 0.4s ${EASE_OUT_EXPO}, width 0.4s ${EASE_OUT_EXPO}, border-radius 0.3s ease-out`
      : 'none',
    borderRadius: isModalOpen.value ? '16px' : '8px',
  }
})

// Open modal with iOS-like animation
const openModal = () => {
  if (!staticCardRef.value || isAnimating.value) return

  // Capture original position
  const rect = staticCardRef.value.getBoundingClientRect()
  originalRect.value = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  }

  // 预先计算目标宽度并锁定列数，防止动画过程中布局抖动
  const modal = getModalPosition()
  fixedColumns.value = calculateGridColumns(modal.width)

  // Initialize transform at origin
  currentTransform.value = { x: 0, y: 0, scale: 1, width: rect.width }

  // Show floating card at original position
  isCardFloating.value = true
  disableProxiesPageScroll.value = true

  // Start animation to modal position
  nextTick(() => {
    isAnimating.value = true

    requestAnimationFrame(() => {
      const modal = getModalPosition()
      const deltaX = modal.left - originalRect.value.left
      const deltaY = modal.top - originalRect.value.top

      currentTransform.value = {
        x: deltaX,
        y: deltaY,
        scale: 1,
        width: modal.width,
      }

      isModalOpen.value = true
      // Show content immediately with the animation
      showExpandedContent.value = true

      // End animating state after animation completes
      setTimeout(() => {
        isAnimating.value = false
      }, 400)
    })
  })
}

// Close modal with reverse animation
const closeModal = () => {
  if (isAnimating.value) return

  showExpandedContent.value = false
  isAnimating.value = true
  isModalOpen.value = false

  // Animate back to original position
  requestAnimationFrame(() => {
    currentTransform.value = {
      x: 0,
      y: 0,
      scale: 1,
      width: originalRect.value.width,
    }

    // Clean up after animation
    setTimeout(() => {
      isCardFloating.value = false
      isAnimating.value = false
      disableProxiesPageScroll.value = false
      fixedColumns.value = undefined
    }, 400)
  })
}

// Close on escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isModalOpen.value) {
    closeModal()
  }
}

watch(isModalOpen, (open) => {
  if (open) {
    window.addEventListener('keydown', handleKeydown)
  } else {
    window.removeEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (isModalOpen.value || isCardFloating.value) {
    disableProxiesPageScroll.value = false
  }
})

// Latency testing
const isLatencyTesting = ref(false)
const handlerLatencyTest = async () => {
  if (isLatencyTesting.value) return

  isLatencyTesting.value = true
  try {
    await proxyGroupLatencyTest(props.name)
  } finally {
    isLatencyTesting.value = false
  }
}

const downloadTotal = computed(() => {
  const speed = activeConnections.value
    .filter((conn) => conn.chains.includes(props.name))
    .reduce((total, conn) => total + conn.downloadSpeed, 0)

  return speed
})

const hiddenGroup = computed({
  get: () => isHiddenGroup(props.name),
  set: (value: boolean) => {
    hiddenGroupMap.value[props.name] = value
  },
})

const handlerGroupToggle = () => {
  hiddenGroup.value = !hiddenGroup.value
}

useBounceOnVisible()
</script>
