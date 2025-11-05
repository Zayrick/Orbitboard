<template>
  <div
    ref="menuRef"
    class="scrollbar-hidden bg-base-100/80 rounded-3xl shadow-md backdrop-blur-sm"
    :class="{ 'cursor-grabbing': isDragging, 'cursor-grab': !isDragging }"
    @touchstart.passive.stop
    @touchmove.passive.stop
    @touchend.passive.stop
    @mousedown="handleMouseDown"
    @touchstart="handleTouchStart"
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
import type { Component } from 'vue'
import { onBeforeUnmount, ref } from 'vue'

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

const menuRef = ref<HTMLDivElement>()
const menuItemRefs = ref<Map<SETTINGS_MENU_KEY, HTMLLIElement>>(new Map())
const isDragging = ref(false)
const dragStartX = ref(0)
const DRAG_THRESHOLD = 5

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

  // 找到鼠标位置对应的菜单项
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

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return

  const targetKey = getMenuItemAtPosition(e.clientX)
  if (targetKey && targetKey !== props.activeMenuKey) {
    emit('menu-click', targetKey)
  }
}

const handleMouseUp = () => {
  if (isDragging.value) {
    // 延迟重置拖动状态，防止触发点击事件
    setTimeout(() => {
      isDragging.value = false
    }, 100)
  }
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}

const handleMouseDown = (e: MouseEvent) => {
  if (e.button !== 0) return // 只处理左键

  isDragging.value = false
  dragStartX.value = e.clientX

  const handleMove = (moveEvent: MouseEvent) => {
    const deltaX = Math.abs(moveEvent.clientX - dragStartX.value)
    if (deltaX > DRAG_THRESHOLD && !isDragging.value) {
      isDragging.value = true
      e.preventDefault()
    }
    if (isDragging.value) {
      handleMouseMove(moveEvent)
    }
  }

  const handleUp = () => {
    handleMouseUp()
    document.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseup', handleUp)
  }

  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleUp)
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || e.touches.length === 0) return

  const touch = e.touches[0]
  const targetKey = getMenuItemAtPosition(touch.clientX)
  if (targetKey && targetKey !== props.activeMenuKey) {
    emit('menu-click', targetKey)
  }
}

const handleTouchEnd = () => {
  if (isDragging.value) {
    setTimeout(() => {
      isDragging.value = false
    }, 100)
  }
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
}

const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 0) return

  const touch = e.touches[0]
  isDragging.value = false
  dragStartX.value = touch.clientX

  const handleMove = (moveEvent: TouchEvent) => {
    if (moveEvent.touches.length === 0) return
    const moveTouch = moveEvent.touches[0]
    const deltaX = Math.abs(moveTouch.clientX - dragStartX.value)
    if (deltaX > DRAG_THRESHOLD && !isDragging.value) {
      isDragging.value = true
      moveEvent.preventDefault()
    }
    if (isDragging.value) {
      handleTouchMove(moveEvent)
    }
  }

  const handleEnd = () => {
    handleTouchEnd()
    document.removeEventListener('touchmove', handleMove)
    document.removeEventListener('touchend', handleEnd)
  }

  document.addEventListener('touchmove', handleMove, { passive: false })
  document.addEventListener('touchend', handleEnd)
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
})

defineExpose({
  menuRef,
})
</script>
