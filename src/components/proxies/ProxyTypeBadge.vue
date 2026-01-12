<template>
  <span
    class="text-base-content/70 border-base-content/70 group relative inline-flex h-4 max-w-4 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border px-0 text-[10px] leading-none transition-[max-width,padding] duration-200 ease-out hover:max-w-24 hover:px-1.5"
    :title="type"
  >
    <Component
      :is="typeIcon"
      class="absolute top-1/2 left-1/2 h-3 w-3 shrink-0 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200 ease-out group-hover:opacity-0"
    />
    <span
      class="whitespace-nowrap opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
    >
      {{ type }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { PROXY_TYPE } from '@/constant'
import {
  ArrowPathIcon,
  ArrowRightIcon,
  ArrowRightStartOnRectangleIcon,
  ArrowsRightLeftIcon,
  BoltIcon,
  LightBulbIcon,
  ListBulletIcon,
  NoSymbolIcon,
  ServerStackIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps<{ type: string }>()

const TYPE_ICON_MAP: Record<string, typeof ArrowRightIcon> = {
  [PROXY_TYPE.Direct]: ArrowRightIcon,
  [PROXY_TYPE.Reject]: NoSymbolIcon,
  [PROXY_TYPE.RejectDrop]: XMarkIcon,
  [PROXY_TYPE.Compatible]: WrenchScrewdriverIcon,
  [PROXY_TYPE.Pass]: ArrowRightStartOnRectangleIcon,
  [PROXY_TYPE.Dns]: ServerStackIcon,
  [PROXY_TYPE.Selector]: ListBulletIcon,
  [PROXY_TYPE.Fallback]: ArrowPathIcon,
  [PROXY_TYPE.URLTest]: BoltIcon,
  [PROXY_TYPE.Smart]: LightBulbIcon,
  [PROXY_TYPE.LoadBalance]: ArrowsRightLeftIcon,
}

const typeIcon = computed(() => {
  const key = (props.type ?? '').toLowerCase()
  return TYPE_ICON_MAP[key] ?? ArrowRightIcon
})
</script>
