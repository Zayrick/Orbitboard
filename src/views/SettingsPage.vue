<template>
  <div class="relative flex h-full flex-col overflow-hidden">
    <!-- 右侧内容区域 -->
    <div
      ref="scrollContainerRef"
      class="overflow-x-hidden overflow-y-auto"
      @scroll.passive="handleScroll"
      :style="padding"
    >
      <div class="grid grid-cols-1 gap-2 max-md:pb-14 md:pt-14">
        <div class="flex flex-col gap-4 px-2">
          <div
            v-for="item in menuItems"
            :key="item.key"
            :id="`item-${item.key}`"
            :data-key="item.key"
            class="card"
          >
            <component :is="item.component" />
          </div>
        </div>
      </div>
    </div>

    <!-- 左侧菜单 -->
    <SettingsMenu
      ref="menuComponentRef"
      :menu-items="menuItems"
      :active-menu-key="activeMenuKey"
      @menu-click="handleMenuClick"
    />
  </div>
</template>

<script setup lang="ts">
import BackendSettings from '@/components/settings/BackendSettings.vue'
import ConnectionsSettings from '@/components/settings/ConnectionsSettings.vue'
import GeneralSettings from '@/components/settings/GeneralSettings.vue'
import OverviewSettings from '@/components/settings/OverviewSettings.vue'
import ProxiesSettings from '@/components/settings/ProxiesSettings.vue'
import SettingsMenu from '@/components/settings/SettingsMenu.vue'
import { usePaddingForViews } from '@/composables/paddingViews'
import { SETTINGS_MENU_KEY } from '@/constant'
import { splitOverviewPage } from '@/store/settings'
import {
  ArrowsRightLeftIcon,
  CubeTransparentIcon,
  GlobeAltIcon,
  HomeIcon,
  ServerIcon,
} from '@heroicons/vue/24/outline'
import { throttle } from 'lodash'
import type { Component } from 'vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

type MenuItem = {
  key: SETTINGS_MENU_KEY
  label: string
  icon: Component
  component: Component
}

const { padding } = usePaddingForViews()
const route = useRoute()

const menuComponentRef = ref<InstanceType<typeof SettingsMenu> | null>(null)
const scrollContainerRef = ref<HTMLDivElement>()
const menuItems = computed<MenuItem[]>(() => {
  const overviewItem = {
    key: SETTINGS_MENU_KEY.overview,
    label: 'overviewSettings',
    icon: CubeTransparentIcon,
    component: OverviewSettings,
  }
  const items = [
    {
      key: SETTINGS_MENU_KEY.general,
      label: 'zashboardSettings',
      icon: HomeIcon,
      component: GeneralSettings,
    },
    {
      key: SETTINGS_MENU_KEY.backend,
      label: 'backendSettings',
      icon: ServerIcon,
      component: BackendSettings,
    },
    {
      key: SETTINGS_MENU_KEY.proxies,
      label: 'proxySettings',
      icon: GlobeAltIcon,
      component: ProxiesSettings,
    },
    {
      key: SETTINGS_MENU_KEY.connections,
      label: 'connectionSettings',
      icon: ArrowsRightLeftIcon,
      component: ConnectionsSettings,
    },
  ]

  if (splitOverviewPage.value) {
    items.push(overviewItem)
  } else {
    items.splice(1, 0, overviewItem)
  }
  return items
})
const activeMenuKey = ref(menuItems.value[0].key)
const getItemRef = (key: SETTINGS_MENU_KEY) => {
  return document.getElementById(`item-${key}`)
}

const isTriggerByClick = ref(false)
const timeoutId = ref<number>()

const handleMenuClick = (key: SETTINGS_MENU_KEY) => {
  activeMenuKey.value = key

  const index = menuItems.value.findIndex((item) => item.key === key)
  if (index !== -1) {
    isTriggerByClick.value = true
    clearTimeout(timeoutId.value)
    timeoutId.value = setTimeout(() => {
      isTriggerByClick.value = false
    }, 1000)
    const element = getItemRef(key)
    if (element && scrollContainerRef.value) {
      const containerRect = scrollContainerRef.value.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      const scrollTop = scrollContainerRef.value.scrollTop
      const targetScrollTop = scrollTop + elementRect.top - containerRect.top - 86

      scrollContainerRef.value.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      })
    }
  }
}

const scrollTop = ref(0)
const updateActiveMenuByScroll = () => {
  if (!scrollContainerRef.value || isTriggerByClick.value) return

  const containerRect = scrollContainerRef.value.getBoundingClientRect()
  const newScrollTop = scrollContainerRef.value.scrollTop
  const containerCenter =
    containerRect.top + containerRect.height * (newScrollTop > scrollTop.value ? 0.8 : 0.5)

  let minDistance = Infinity
  let closestKey: SETTINGS_MENU_KEY | null = null

  menuItems.value.forEach((item) => {
    const element = getItemRef(item.key)
    if (!element) return

    const elementRect = element.getBoundingClientRect()
    const elementCenter = elementRect.top + elementRect.height / 2
    const distance = Math.abs(elementCenter - containerCenter)

    if (distance < minDistance) {
      minDistance = distance
      closestKey = item.key
    }
  })

  // 如果找到了最近的元素，更新激活菜单
  if (closestKey && closestKey !== activeMenuKey.value) {
    activeMenuKey.value = closestKey
  }

  scrollTop.value = newScrollTop
}

const handleScroll = throttle(updateActiveMenuByScroll, 100)

onMounted(() => {
  requestAnimationFrame(async () => {
    const scrollTo = route.query.scrollTo as SETTINGS_MENU_KEY
    if (scrollTo) {
      handleMenuClick(scrollTo)
    }
  })
})
</script>
