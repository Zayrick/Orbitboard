<template>
  <div
    class="scrollbar-hidden h-full"
    :class="disableProxiesPageScroll ? 'overflow-y-hidden' : 'overflow-y-scroll'"
    :style="padding"
    ref="proxiesRef"
    @scroll.passive="handleScroll"
  >
    <ProxiesCtrl />
    <!-- 双列布局 (移动端或用户选择双列时) -->
    <template v-if="displayTwoColumns">
      <div class="grid grid-cols-2 gap-1 p-2 md:pr-1">
        <div
          v-for="idx in [0, 1]"
          :key="idx"
          class="flex flex-1 flex-col gap-1"
        >
          <component
            v-for="name in filterContent(renderGroups, idx)"
            :is="renderComponent"
            :key="name"
            :name="name"
          />
        </div>
      </div>
    </template>
    <!-- 响应式网格布局 (开发中布局) -->
    <div
      v-else
      class="grid gap-1 p-2 md:pr-1"
      :class="groupsGridClass"
    >
      <component
        v-for="name in renderGroups"
        :is="renderComponent"
        :key="name"
        :name="name"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProxyGroup from '@/components/proxies/ProxyGroup.vue'
import ProxyGroupForMobile from '@/components/proxies/ProxyGroupForMobile.vue'
import ProxyProvider from '@/components/proxies/ProxyProvider.vue'
import ProxiesCtrl from '@/components/sidebar/ProxiesCtrl.tsx'
import { usePaddingForViews } from '@/composables/paddingViews'
import { disableProxiesPageScroll, isProxiesPageMounted, renderGroups } from '@/composables/proxies'
import { PROXY_GROUP_LAYOUT, PROXY_TAB_TYPE } from '@/constant'
import { isMiddleScreen } from '@/helper/utils'
import { fetchProxies, proxiesTabShow } from '@/store/proxies'
import { proxyGroupLayout } from '@/store/settings'
import { useSessionStorage } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

const { padding } = usePaddingForViews({
  offsetTop: 0,
  offsetBottom: 0,
})
const proxiesRef = ref()
const scrollStatus = useSessionStorage('cache/proxies-scroll-status', {
  [PROXY_TAB_TYPE.PROVIDER]: 0,
  [PROXY_TAB_TYPE.PROXIES]: 0,
})

const handleScroll = () => {
  scrollStatus.value[proxiesTabShow.value] = proxiesRef.value.scrollTop
}

const waitTickUntilReady = (startTime = performance.now()) => {
  if (
    performance.now() - startTime > 300 ||
    proxiesRef.value.scrollHeight > scrollStatus.value[proxiesTabShow.value]
  ) {
    proxiesRef.value.scrollTo({
      top: scrollStatus.value[proxiesTabShow.value],
      behavior: 'smooth',
    })
  } else {
    requestAnimationFrame(() => {
      waitTickUntilReady(startTime)
    })
  }
}

watch(proxiesTabShow, () =>
  nextTick(() => {
    waitTickUntilReady()
  }),
)

isProxiesPageMounted.value = false

onMounted(() => {
  setTimeout(() => {
    isProxiesPageMounted.value = true
    nextTick(() => {
      waitTickUntilReady()
      fetchProxies()
    })
  })
})

const renderComponent = computed(() => {
  if (proxiesTabShow.value === PROXY_TAB_TYPE.PROVIDER) {
    return ProxyProvider
  }

  // 移动端 + 双列布局时使用移动端专用组件
  if (isMiddleScreen.value && displayTwoColumns.value) {
    return ProxyGroupForMobile
  }

  return ProxyGroup
})

// 是否显示双列布局
const displayTwoColumns = computed(() => {
  // Provider 视图在移动端使用单列
  if (proxiesTabShow.value === PROXY_TAB_TYPE.PROVIDER && isMiddleScreen.value) {
    return false
  }
  // 用户选择双列布局且有多个代理组
  return proxyGroupLayout.value === PROXY_GROUP_LAYOUT.TWO_COLUMN && renderGroups.value.length > 1
})

// 响应式网格布局的样式类
const groupsGridClass = computed(() => {
  // Provider 视图单列展示
  if (proxiesTabShow.value === PROXY_TAB_TYPE.PROVIDER) {
    return 'grid-cols-1'
  }
  // 开发中布局：桌面端响应式多列
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
})

// 双列布局的内容过滤函数
const filterContent: <T>(all: T[], target: number) => T[] = (all, target) => {
  return all.filter((_, index: number) => index % 2 === target)
}
</script>
