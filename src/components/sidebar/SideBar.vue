<template>
  <div
    class="sidebar text-base-content scrollbar-hidden h-full w-64 overflow-x-hidden bg-transparent p-4"
  >
    <div
      ref="navContainer"
      class="relative flex h-full w-full flex-col gap-4"
    >
      <!-- Shared Active Highlight (Sliding Background) -->
      <div
        class="pointer-events-none absolute z-0 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        :style="highlightStyle"
      />

      <div class="flex-1 space-y-6">
        <div
          v-for="group in categorizedRoutes"
          :key="group.title"
          class="flex flex-col gap-2"
        >
          <div class="text-base-content/50 px-4 text-xs font-bold tracking-wider uppercase">
            {{ $t(group.title) }}
          </div>
          <ul class="flex w-full flex-col gap-1 p-0">
            <li
              v-for="r in group.routes"
              :key="r"
            >
              <a
                :ref="(el) => (itemRefs[r] = el as HTMLElement)"
                class="nav-item relative z-10 flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors"
                @click.passive="() => router.push({ name: r })"
                @mousemove="handleMouseMove"
                @mouseleave="handleMouseLeave"
              >
                <component
                  :is="ROUTE_ICON_MAP[r]"
                  class="h-5 w-5"
                />
                {{ $t(r) }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-auto">
        <CommonSidebar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommonSidebar from '@/components/sidebar/CommonCtrl.vue'
import { ROUTE_ICON_MAP, ROUTE_NAME } from '@/constant'
import router from '@/router'
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const navContainer = ref<HTMLElement | null>(null)
const itemRefs = reactive<Record<string, HTMLElement>>({})

const highlightStyle = reactive({
  top: '0px',
  left: '0px',
  width: '0px',
  height: '0px',
  opacity: '0',
  backgroundColor: 'rgba(128, 128, 128, 0.15)',
})

const updateHighlight = async () => {
  await nextTick()
  const activeEl = itemRefs[route.name as string]
  const container = navContainer.value

  if (!activeEl || !container) {
    highlightStyle.opacity = '0'
    return
  }

  const containerRect = container.getBoundingClientRect()
  const itemRect = activeEl.getBoundingClientRect()

  Object.assign(highlightStyle, {
    top: `${itemRect.top - containerRect.top}px`,
    left: `${itemRect.left - containerRect.left}px`,
    width: `${itemRect.width}px`,
    height: `${itemRect.height}px`,
    opacity: '1',
  })
}

watch(() => route.name, updateHighlight, { immediate: true })

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (navContainer.value) {
    resizeObserver = new ResizeObserver(updateHighlight)
    resizeObserver.observe(navContainer.value)
  }
  setTimeout(updateHighlight, 100)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

const handleMouseMove = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  target.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
  target.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  target.style.setProperty('--spotlight-opacity', '1')
}

const handleMouseLeave = (e: MouseEvent) => {
  ;(e.currentTarget as HTMLElement).style.setProperty('--spotlight-opacity', '0')
}

const categorizedRoutes = [
  { title: 'category_general', routes: [ROUTE_NAME.overview] },
  {
    title: 'category_network',
    routes: [ROUTE_NAME.proxies, ROUTE_NAME.rules, ROUTE_NAME.connections],
  },
  { title: 'category_settings', routes: [ROUTE_NAME.logs, ROUTE_NAME.settings] },
]
</script>

<style scoped>
.nav-item {
  border: 1px solid transparent;
}

/* Border Spotlight Effect */
.nav-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  padding: 1px;
  background: radial-gradient(
    300px circle at var(--mouse-x, 0px) var(--mouse-y, 0px),
    currentColor,
    transparent 40%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  z-index: 2;
  opacity: var(--spotlight-opacity, 0);
  transition: opacity 0.2s ease;
}
</style>
