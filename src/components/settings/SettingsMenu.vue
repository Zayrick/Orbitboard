<template>
  <div
    ref="menuRef"
    class="scrollbar-hidden bg-base-100/20 absolute right-2 left-2 z-30 rounded-3xl shadow-sm backdrop-blur-sm"
    :class="{ 'cursor-grabbing': isDragging, 'cursor-grab': !isDragging }"
    :style="styleForSafeArea"
    @touchstart.passive.stop
    @touchmove.passive.stop
    @touchend.passive.stop
  >
    <ul class="menu w-full max-w-7xl flex-row">
      <li
        v-for="item in menuItems"
        :key="item.key"
        :ref="(el) => setMenuItemRef(el, item.key)"
        class="flex-1 flex-shrink-0 md:w-full"
      >
        <a
          class="flex justify-center rounded-2xl px-4 py-2 whitespace-nowrap"
          :class="[activeMenuKey === item.key ? 'menu-active' : '']"
          @click="handleMenuClick(item.key)"
        >
          <component
            :is="item.icon"
            class="h-5 w-5"
          />
          <span class="hidden lg:block">
            {{ $t(item.label) }}
          </span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { SETTINGS_MENU_KEY } from '@/constant'
import { isMiddleScreen } from '@/helper/utils'
import { useSwipe } from '@vueuse/core'
import type { Component } from 'vue'
import { computed, ref } from 'vue'

type MenuItem = {
  key: SETTINGS_MENU_KEY
  label: string
  icon: Component
  component: Component
}

const props = defineProps<{
  menuItems: MenuItem[]
  activeMenuKey: SETTINGS_MENU_KEY
}>()

const emit = defineEmits<{
  (e: 'menu-click', key: SETTINGS_MENU_KEY): void
}>()

const styleForSafeArea = computed(() => {
  if (isMiddleScreen.value) {
    return {
      bottom: 'calc(var(--spacing) * 20 + env(safe-area-inset-bottom))',
    }
  }
  return {
    top: 'calc(var(--spacing) * 2)',
  }
})

const menuRef = ref<HTMLDivElement>()
const menuItemRefs = ref<Map<SETTINGS_MENU_KEY, HTMLLIElement>>(new Map())
const isDragging = ref(false)

const setMenuItemRef = (el: unknown, key: SETTINGS_MENU_KEY) => {
  if (el && el instanceof HTMLLIElement) {
    menuItemRefs.value.set(key, el)
  }
}

const handleMenuClick = (key: SETTINGS_MENU_KEY) => {
  // 如果正在拖动，不触发点击事件
  if (isDragging.value) {
    return
  }
  emit('menu-click', key)
}

const getMenuItemAtPosition = (x: number): SETTINGS_MENU_KEY | null => {
  if (!menuRef.value) return null

  const menuRect = menuRef.value.getBoundingClientRect()
  const relativeX = x - menuRect.left

  // 找到触摸位置对应的菜单项
  for (const [key, itemEl] of menuItemRefs.value.entries()) {
    const itemRect = itemEl.getBoundingClientRect()
    const itemRelativeX = itemRect.left - menuRect.left
    const itemWidth = itemRect.width

    if (relativeX >= itemRelativeX && relativeX <= itemRelativeX + itemWidth) {
      return key
    }
  }

  return null
}

useSwipe(menuRef, {
  passive: false,
  onSwipe(e: TouchEvent) {
    const targetKey = getMenuItemAtPosition(e.touches[0].clientX)
    if (targetKey && targetKey !== props.activeMenuKey) {
      emit('menu-click', targetKey)
    }
  },
})

defineExpose({
  menuRef,
})
</script>
