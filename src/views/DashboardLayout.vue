<template>
  <div class="bg-base-200/50 dashboard-layout flex size-full">
    <SideBar v-if="!isMiddleScreen" />
    <RouterView v-slot="{ Component, route }">
      <div
        class="relative flex-1 overflow-hidden"
        ref="swiperRef"
      >
        <div class="absolute flex h-full w-full flex-col overflow-y-auto">
          <Transition
            :name="(route.meta.transition as string) || 'fade'"
            v-if="isMiddleScreen"
          >
            <Component :is="Component" />
          </Transition>
          <Component
            v-else
            :is="Component"
          />
        </div>

        <template v-if="isMiddleScreen">
          <!-- 移动端底部导航栏 -->
          <div
            class="dock-container"
            :style="{
              bottom: 'calc(var(--spacing) * 2 + env(safe-area-inset-bottom))',
            }"
          >
            <!-- 主导航项容器 -->
            <div
              class="bg-base-100/20 dock-main relative z-10 flex h-14 items-center shadow-sm backdrop-blur-sm"
              :class="moreMenuOpen && 'dock-expanded'"
              :ref="setDockEl"
            >
              <!-- 滑动背景指示器 -->
              <div class="dock-bg-indicator" />
              <!-- 主导航项 -->
              <AnimatePresence mode="sync">
                <Motion
                  v-for="(r, index) in MOBILE_MAIN_ROUTES"
                  :key="r"
                  as="button"
                  @click="!moreMenuOpen && router.push({ name: r })"
                  class="dock-nav-item relative z-10 flex h-14 flex-col items-center justify-center overflow-hidden"
                  :class="[
                    r === route.name && 'dock-item-active',
                    moreMenuOpen && 'pointer-events-none',
                  ]"
                  :ref="(el) => setDockItemRef(r, el)"
                  :initial="false"
                  :animate="{
                    flex: moreMenuOpen ? 0 : 1,
                    width: moreMenuOpen ? '0px' : 'auto',
                    opacity: moreMenuOpen ? 0 : 1,
                    scale: moreMenuOpen ? 0.3 : 1,
                    filter: moreMenuOpen ? 'blur(4px)' : 'blur(0px)',
                  }"
                  :transition="{
                    type: 'spring',
                    stiffness: 450,
                    damping: 32,
                    mass: 0.9,
                    delay: moreMenuOpen ? 0 : 0.02 * index,
                    opacity: { duration: 0.12, ease: 'easeOut' },
                    filter: { duration: 0.15 },
                  }"
                >
                  <component
                    :is="ROUTE_ICON_MAP[r]"
                    class="h-5 w-5 flex-shrink-0"
                  />
                  <span class="dock-label mt-0.5 text-xs whitespace-nowrap">
                    {{ $t(r) }}
                  </span>
                </Motion>
              </AnimatePresence>

              <!-- 更多菜单内容 - 形变后显示在导航栏内 -->
              <AnimatePresence mode="wait">
                <Motion
                  v-if="moreMenuOpen"
                  as="div"
                  class="absolute inset-0 flex items-center justify-around px-3"
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 1 }"
                  :exit="{ opacity: 0, transition: { duration: 0.1 } }"
                  :transition="{ duration: 0.15, delay: 0.08 }"
                >
                  <Motion
                    v-for="(r, index) in MOBILE_MORE_ROUTES"
                    :key="r"
                    as="button"
                    @click="navigateToMore(r)"
                    class="dock-more-menu-item relative flex h-12 flex-1 flex-col items-center justify-center"
                    :class="r === route.name && 'text-primary'"
                    :initial="{ opacity: 0, y: 15, scale: 0.5 }"
                    :animate="{ opacity: 1, y: 0, scale: 1 }"
                    :exit="{
                      opacity: 0,
                      y: -8,
                      scale: 0.7,
                      transition: {
                        duration: 0.12,
                        delay: 0.02 * (MOBILE_MORE_ROUTES.length - 1 - index),
                      },
                    }"
                    :transition="{
                      type: 'spring',
                      stiffness: 550,
                      damping: 28,
                      mass: 0.7,
                      delay: 0.04 * index + 0.06,
                    }"
                  >
                    <Motion
                      as="div"
                      class="flex flex-col items-center"
                      :initial="{ scale: 0.6, rotate: -10 }"
                      :animate="{ scale: 1, rotate: 0 }"
                      :transition="{
                        type: 'spring',
                        stiffness: 500,
                        damping: 20,
                        delay: 0.05 * index + 0.1,
                      }"
                    >
                      <component
                        :is="ROUTE_ICON_MAP[r]"
                        class="h-5 w-5 flex-shrink-0"
                      />
                      <span class="mt-0.5 text-xs">
                        {{ $t(r) }}
                      </span>
                    </Motion>
                  </Motion>
                </Motion>
              </AnimatePresence>
            </div>

            <!-- 更多按钮 - 点击后缩小 -->
            <Motion
              as="button"
              @click="moreMenuOpen = !moreMenuOpen"
              class="dock-more-btn bg-base-100/20 relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full shadow-sm backdrop-blur-sm"
              :class="[
                isMoreRouteActive(route.name) && !moreMenuOpen && 'dock-more-active',
                moreMenuOpen && 'dock-more-expanded',
              ]"
              :ref="(el) => setDockItemRef('more', el)"
              :animate="{
                scale: moreMenuOpen ? 0.85 : 1,
                y: moreMenuOpen ? 4 : 0,
              }"
              :transition="{
                type: 'spring',
                stiffness: 500,
                damping: 28,
                mass: 0.8,
              }"
            >
              <AnimatePresence mode="wait">
                <Motion
                  :key="moreMenuOpen ? 'close' : 'more'"
                  as="div"
                  class="flex items-center justify-center"
                  :initial="{ scale: 0.5, rotate: -90, opacity: 0 }"
                  :animate="{ scale: 1, rotate: 0, opacity: 1 }"
                  :exit="{ scale: 0.5, rotate: 90, opacity: 0, transition: { duration: 0.15 } }"
                  :transition="{
                    type: 'spring',
                    stiffness: 600,
                    damping: 25,
                  }"
                >
                  <component
                    :is="moreMenuOpen ? XMarkIcon : MOBILE_MORE_ICON"
                    class="h-5 w-5 flex-shrink-0"
                  />
                </Motion>
              </AnimatePresence>
            </Motion>
          </div>
          <div class="dock-shadow"></div>

          <!-- 背景遮罩 -->
          <Transition name="fade">
            <div
              v-if="moreMenuOpen"
              class="fixed inset-0 z-10 bg-black/20 backdrop-blur-[2px]"
              @click="moreMenuOpen = false"
            />
          </Transition>
        </template>
      </div>
    </RouterView>

    <DialogWrapper v-model="autoSwitchBackendDialog">
      <div class="mb-2">
        {{ $t('currentBackendUnavailable') }}
      </div>
      <div class="flex justify-end gap-2">
        <button
          class="btn btn-sm"
          @click="autoSwitchBackendDialog = false"
        >
          {{ $t('cancel') }}
        </button>
        <button
          class="btn btn-primary btn-sm"
          @click="autoSwitchBackend"
        >
          {{ $t('confirm') }}
        </button>
      </div>
    </DialogWrapper>
  </div>
</template>

<script setup lang="ts">
import { isBackendAvailable } from '@/api'
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import SideBar from '@/components/sidebar/SideBar.vue'
import { dockTop } from '@/composables/paddingViews'
import { useSettings } from '@/composables/settings'
import { useSwipeRouter } from '@/composables/swipe'
import {
  MOBILE_MAIN_ROUTES,
  MOBILE_MORE_ICON,
  MOBILE_MORE_ROUTES,
  PROXY_TAB_TYPE,
  ROUTE_ICON_MAP,
  ROUTE_NAME,
  RULE_TAB_TYPE,
} from '@/constant'
import { showNotification } from '@/helper/notification'
import { getLabelFromBackend, isMiddleScreen } from '@/helper/utils'
import { fetchConfigs } from '@/store/config'
import { initConnections } from '@/store/connections'
import { initLogs } from '@/store/logs'
import { initSatistic } from '@/store/overview'
import { fetchProxies, proxiesTabShow } from '@/store/proxies'
import { fetchRules, rulesTabShow } from '@/store/rules'
import { activeBackend, activeUuid, backendList } from '@/store/setup'
import type { Backend } from '@/types'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useDocumentVisibility, useElementBounding } from '@vueuse/core'
import { AnimatePresence, Motion, useAnimate } from 'motion-v'
import type { ComponentPublicInstance } from 'vue'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { swiperRef } = useSwipeRouter()

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Navigation
// ─────────────────────────────────────────────────────────────────────────────
const moreMenuOpen = ref(false)

const isMoreRouteActive = (routeName: unknown) => {
  return (MOBILE_MORE_ROUTES as readonly string[]).includes(String(routeName))
}

const navigateToMore = (routeName: ROUTE_NAME) => {
  moreMenuOpen.value = false
  router.push({ name: routeName })
}

// 路由变化时关闭“更多”菜单（例如手势返回/外部跳转），避免遮罩残留
watch(
  () => route.name,
  () => {
    moreMenuOpen.value = false
  },
)

const dockRef = ref<HTMLDivElement>()
const dockItemRefs = reactive<Record<string, HTMLButtonElement | null>>({})
const [dockScope, animateDock] = useAnimate()

const toDomEl = (el: Element | ComponentPublicInstance | null): HTMLElement | null => {
  if (!el) return null
  if (el instanceof HTMLElement) return el
  // Motion 等组件上的 ref 通常拿到的是组件实例，这里取其根 DOM
  const dom = (el as unknown as { $el?: unknown }).$el
  return dom instanceof HTMLElement ? dom : null
}

const setDockEl = (el: Element | ComponentPublicInstance | null) => {
  const dom = toDomEl(el) as HTMLDivElement | null
  dockRef.value = dom ?? undefined
  ;(dockScope as unknown as { value: Element | null }).value = dom
}

const setDockItemRef = (name: string, el: Element | ComponentPublicInstance | null) => {
  dockItemRefs[name] = (toDomEl(el) as HTMLButtonElement | null) ?? null
}

// ─────────────────────────────────────────────────────────────────────────────
// Dock Indicator Animation
// ─────────────────────────────────────────────────────────────────────────────
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
const INDICATOR_PADDING = 4 // 左右边距 0.25rem = 4px

// 使用 ref 追踪状态，避免闭包问题
const indicatorState = ref({ left: 0, width: 0, wasMoreActive: false, initialized: false })
// 动画版本号，用于取消过时的动画
let animationVersion = 0

const getIndicatorPosition = () => {
  const container = dockRef.value
  const currentRouteName = String(route.name)
  // 如果当前路由在 "更多" 子菜单中，返回 null（更多按钮有自己的高亮样式）
  if (isMoreRouteActive(currentRouteName)) return null

  const activeBtn = dockItemRefs[currentRouteName]
  if (!container || !activeBtn) return null

  // 防御：避免 ref 意外不是 DOM 元素导致运行时异常，进而让指示器一直不更新
  if (
    typeof (activeBtn as unknown as { getBoundingClientRect?: unknown }).getBoundingClientRect !==
    'function'
  )
    return null

  const containerRect = container.getBoundingClientRect()
  const btnRect = activeBtn.getBoundingClientRect()

  // 验证矩形有效性，避免布局抖动导致的异常值
  if (btnRect.width <= 0 || containerRect.width <= 0) return null

  // 计算位置时考虑边距，宽度减去边距避免贴边
  const left = btnRect.left - containerRect.left + INDICATOR_PADDING
  const width = btnRect.width - INDICATOR_PADDING * 2

  // 边界检查，确保值在合理范围内
  if (left < 0 || width <= 0 || left + width > containerRect.width) return null

  return { left, width }
}

const animateDockIndicator = async () => {
  if (!isMiddleScreen.value) return

  // 递增版本号，标记当前动画
  const currentVersion = ++animationVersion

  // 需求调整：更多菜单内不再显示滑动背景指示器（避免闪现/错位）。
  // 注意：这里必须在 nextTick 之前处理，否则展开瞬间可能会先渲染到“展开态颜色”。
  if (moreMenuOpen.value) {
    indicatorState.value = { ...indicatorState.value, wasMoreActive: true, initialized: true }
    animateDock('.dock-bg-indicator', { opacity: 0 }, { duration: 0, ease: 'linear' })
    return
  }

  await nextTick()

  // 如果已经有新的动画触发，取消当前动画
  if (currentVersion !== animationVersion) return

  const currentRouteName = String(route.name)
  const isCurrentMoreActive = isMoreRouteActive(currentRouteName)

  const target = getIndicatorPosition()
  const state = indicatorState.value

  // 从更多按钮移动到主导航：使用渐隐渐显效果
  if (state.wasMoreActive && target) {
    // 立即更新状态，避免竞态
    indicatorState.value = {
      left: target.left,
      width: target.width,
      wasMoreActive: false,
      initialized: true,
    }
    animateDock(
      '.dock-bg-indicator',
      { left: `${target.left}px`, width: `${target.width}px`, opacity: 1 },
      { duration: 0.25, ease: EASE_OUT_EXPO },
    )
    return
  }

  // 移动到更多按钮：渐隐
  if (!target) {
    indicatorState.value = { ...state, wasMoreActive: isCurrentMoreActive }
    animateDock('.dock-bg-indicator', { opacity: 0 }, { duration: 0.15, ease: 'easeOut' })
    return
  }

  const { left: newLeft, width: newWidth } = target
  const { left: oldLeft, width: oldWidth, initialized } = state

  // 首次或未初始化：直接设置位置
  if (!initialized) {
    indicatorState.value = {
      left: newLeft,
      width: newWidth,
      wasMoreActive: false,
      initialized: true,
    }
    animateDock(
      '.dock-bg-indicator',
      { left: `${newLeft}px`, width: `${newWidth}px`, opacity: 1 },
      { duration: 0.3, ease: EASE_OUT_EXPO },
    )
    return
  }

  // 位置没有变化，跳过动画
  if (Math.abs(newLeft - oldLeft) < 1 && Math.abs(newWidth - oldWidth) < 1) return

  // 立即更新状态到目标位置
  indicatorState.value = { left: newLeft, width: newWidth, wasMoreActive: false, initialized: true }

  // 使用单一动画，避免多个并行动画产生的竞态
  const movingRight = newLeft > oldLeft
  const stretchWidth = movingRight ? newLeft - oldLeft + newWidth : oldLeft - newLeft + oldWidth
  const stretchLeft = movingRight ? oldLeft : newLeft

  // 阶段1：拉伸动画
  animateDock(
    '.dock-bg-indicator',
    { left: `${stretchLeft}px`, width: `${stretchWidth}px`, opacity: 1 },
    { duration: 0.15, ease: EASE_OUT_EXPO },
  )

  // 使用 requestAnimationFrame 确保在下一帧执行收缩动画
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })

  // 检查是否被新动画取消
  if (currentVersion !== animationVersion) return

  // 阶段2：收缩到目标位置
  animateDock(
    '.dock-bg-indicator',
    { left: `${newLeft}px`, width: `${newWidth}px` },
    { duration: 0.2, ease: EASE_OUT_EXPO },
  )
}

let indicatorRafId = 0
const scheduleAnimateDockIndicator = () => {
  if (indicatorRafId) return
  indicatorRafId = requestAnimationFrame(() => {
    indicatorRafId = 0
    void animateDockIndicator()
  })
}

// 打开/关闭更多菜单时同步处理指示器，杜绝“展开的一瞬间闪一下”。
watch(
  moreMenuOpen,
  (open) => {
    // 取消所有正在进行/排队的指示器动画
    animationVersion++

    if (open) {
      indicatorState.value = { ...indicatorState.value, wasMoreActive: true, initialized: true }
      animateDock('.dock-bg-indicator', { opacity: 0 }, { duration: 0, ease: 'linear' })
      return
    }

    // 关闭更多菜单后，在下一帧更新指示器位置
    scheduleAnimateDockIndicator()
  },
  { flush: 'sync' },
)

// ─────────────────────────────────────────────────────────────────────────────
// Watchers & Lifecycle
// ─────────────────────────────────────────────────────────────────────────────
const { top: dockRefTop } = useElementBounding(dockRef)

watch(dockRefTop, () => (dockTop.value = window.innerHeight - dockRefTop.value), {
  immediate: true,
})
watch([() => route.name, isMiddleScreen, dockRefTop], scheduleAnimateDockIndicator)
onMounted(scheduleAnimateDockIndicator)

watch(
  activeUuid,
  () => {
    if (!activeUuid.value) return
    rulesTabShow.value = RULE_TAB_TYPE.RULES
    proxiesTabShow.value = PROXY_TAB_TYPE.PROXIES
    fetchConfigs()
    fetchProxies()
    fetchRules()
    initConnections()
    initLogs()
    initSatistic()
  },
  { immediate: true },
)

// ─────────────────────────────────────────────────────────────────────────────
// Auto Switch Backend
// ─────────────────────────────────────────────────────────────────────────────
const autoSwitchBackendDialog = ref(false)

const autoSwitchBackend = async () => {
  const otherEnds = backendList.value.filter((end) => end.uuid !== activeUuid.value)
  autoSwitchBackendDialog.value = false

  const available = await Promise.race<Backend>(
    otherEnds.map(
      (end) =>
        new Promise((resolve, reject) => {
          setTimeout(reject, 10000)
          isBackendAvailable(end).then((res) => res && resolve(end))
        }),
    ),
  )

  if (available) {
    activeUuid.value = available.uuid
    showNotification({
      content: 'backendSwitchTo',
      params: { backend: getLabelFromBackend(available) },
    })
  }
}

const documentVisible = useDocumentVisibility()

watch(
  documentVisible,
  async () => {
    if (!activeBackend.value || backendList.value.length < 2 || documentVisible.value !== 'visible')
      return

    try {
      const activeBackendUuid = activeBackend.value.uuid
      const isAvailable = await isBackendAvailable(activeBackend.value)
      if (activeBackendUuid !== activeUuid.value) return
      if (!isAvailable) autoSwitchBackendDialog.value = true
    } catch {
      autoSwitchBackendDialog.value = true
    }
  },
  { immediate: true },
)

watch(documentVisible, () => {
  if (documentVisible.value === 'visible') fetchProxies()
})

const { checkUIUpdate } = useSettings()
checkUIUpdate()
</script>

<style scoped>
/* 背景遮罩淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
