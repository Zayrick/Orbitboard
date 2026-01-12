<template>
  <div class="bg-base-200/50 home-page flex size-full">
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
          <div
            class="bg-base-100/20 dock dock-xs relative z-10 h-14 w-auto shadow-sm backdrop-blur-sm"
            :style="{
              padding: '0',
              bottom: 'calc(var(--spacing) * 2 + env(safe-area-inset-bottom))',
            }"
            :ref="setDockEl"
          >
            <div class="dock-indicator" />
            <button
              v-for="r in renderRoutes"
              :key="r"
              @click="router.push({ name: r })"
              class="h-14 flex-col items-center justify-center pt-2"
              :class="r === route.name && 'dock-item-active'"
              :ref="(el) => setDockItemRef(r, el)"
            >
              <component
                :is="ROUTE_ICON_MAP[r]"
                class="h-5 w-5 flex-shrink-0"
              />
              <span class="dock-label">
                {{ $t(r) }}
              </span>
            </button>
          </div>
          <div class="dock-shadow"></div>
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
import { PROXY_TAB_TYPE, ROUTE_ICON_MAP, RULE_TAB_TYPE } from '@/constant'
import { renderRoutes } from '@/helper'
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
import { useDocumentVisibility, useElementBounding } from '@vueuse/core'
import { useAnimate } from 'motion-v'
import type { ComponentPublicInstance } from 'vue'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { swiperRef } = useSwipeRouter()

const dockRef = ref<HTMLDivElement>()
const dockItemRefs = reactive<Record<string, HTMLButtonElement | null>>({})
const [dockScope, animateDock] = useAnimate()

const setDockEl = (el: Element | ComponentPublicInstance | null) => {
  const dom = (el as unknown as HTMLDivElement | null) || null
  dockRef.value = dom ?? undefined
  ;(dockScope as unknown as { value: Element | null }).value = dom
}

const setDockItemRef = (name: string, el: Element | ComponentPublicInstance | null) => {
  dockItemRefs[name] = (el as unknown as HTMLButtonElement | null) ?? null
}

// ─────────────────────────────────────────────────────────────────────────────
// Dock Indicator Animation
// ─────────────────────────────────────────────────────────────────────────────
const INDICATOR_WIDTH = 40
const EASE_SPRING = [0.22, 0.9, 0.2, 1] as const
const EASE_SMOOTH = [0.25, 0.1, 0.25, 1] as const
const indicatorState = { left: 0, right: 0 }

const getIndicatorPosition = () => {
  const container = dockRef.value
  const activeBtn = dockItemRefs[String(route.name)]
  if (!container || !activeBtn) return null

  const containerRect = container.getBoundingClientRect()
  const btnRect = activeBtn.getBoundingClientRect()
  const left = btnRect.left - containerRect.left + (btnRect.width - INDICATOR_WIDTH) / 2
  return { left, right: containerRect.width - left - INDICATOR_WIDTH }
}

const animateDockIndicator = async () => {
  if (!isMiddleScreen.value) return
  await nextTick()

  const target = getIndicatorPosition()
  if (!target) {
    return animateDock('.dock-indicator', { opacity: 0 }, { duration: 0.12, ease: 'easeOut' })
  }

  const { left: newLeft, right: newRight } = target
  const { left: oldLeft, right: oldRight } = indicatorState
  const isFirstTime = oldLeft === 0 && oldRight === 0

  // 首次：直接跳转到位置
  if (isFirstTime) {
    Object.assign(indicatorState, { left: newLeft, right: newRight })
    return animateDock(
      '.dock-indicator',
      { left: `${newLeft}px`, right: `${newRight}px`, opacity: 1 },
      { duration: 0.22, ease: EASE_SPRING },
    )
  }

  // 后续：leading edge 先动，trailing edge 延迟跟随
  const movingRight = newLeft > oldLeft
  const [leadProp, trailProp] = movingRight ? ['right', 'left'] : ['left', 'right']
  const [leadVal, trailVal] = movingRight ? [newRight, newLeft] : [newLeft, newRight]

  await Promise.all([
    animateDock(
      '.dock-indicator',
      { [leadProp]: `${leadVal}px`, opacity: 1 },
      { duration: 0.18, ease: EASE_SPRING },
    ),
    new Promise<void>((r) => setTimeout(r, 15)).then(() =>
      animateDock(
        '.dock-indicator',
        { [trailProp]: `${trailVal}px` },
        { duration: 0.22, ease: EASE_SMOOTH },
      ),
    ),
  ])

  Object.assign(indicatorState, { left: newLeft, right: newRight })
}

// ─────────────────────────────────────────────────────────────────────────────
// Watchers & Lifecycle
// ─────────────────────────────────────────────────────────────────────────────
const { top: dockRefTop } = useElementBounding(dockRef)

watch(dockRefTop, () => (dockTop.value = window.innerHeight - dockRefTop.value), {
  immediate: true,
})
watch([() => route.name, isMiddleScreen, dockRefTop], animateDockIndicator)
onMounted(animateDockIndicator)

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
