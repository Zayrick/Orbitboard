<template>
  <div class="divide-base-200/50 divide-y pb-20">
    <button
      v-for="item in settingMenuItems"
      :key="item.key"
      class="hover:bg-base-200/30 active:bg-base-200/50 flex w-full items-center gap-4 px-5 py-4 text-left transition-colors"
      :class="{ hidden: item.hidden }"
      @click="$emit('select', item.key)"
    >
      <div class="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        <component
          :is="item.icon"
          class="text-primary h-5 w-5"
        />
      </div>
      <div class="min-w-0 flex-1">
        <div class="text-base-content truncate text-base font-medium">
          {{ $t(item.label) }}
        </div>
      </div>
      <ChevronRightIcon class="text-base-content/40 h-5 w-5 shrink-0" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { SETTINGS_MENU_KEY } from '@/constant'
import { hiddenSettingsItems } from '@/store/settings'
import {
  ArrowPathIcon,
  BoltIcon,
  ChevronRightIcon,
  ClockIcon,
  Cog6ToothIcon,
  CubeTransparentIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  GlobeAltIcon,
  LinkIcon,
  PhotoIcon,
  ServerIcon,
  Squares2X2Icon,
  SwatchIcon,
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'

defineEmits<{
  select: [key: string]
}>()

const settingMenuItems = computed(() => [
  {
    key: 'appearance',
    label: 'appearance',
    icon: SwatchIcon,
    hidden: false,
  },
  {
    key: 'background',
    label: 'background',
    icon: PhotoIcon,
    hidden: false,
  },
  {
    key: 'general',
    label: 'general',
    icon: Cog6ToothIcon,
    hidden: false,
  },
  {
    key: 'mobile',
    label: 'mobileSettings',
    icon: DevicePhoneMobileIcon,
    hidden: false,
  },
  {
    key: 'overview',
    label: 'overviewSettings',
    icon: CubeTransparentIcon,
    hidden: false,
  },
  {
    key: 'backend',
    label: 'backend',
    icon: ServerIcon,
    hidden: false,
  },
  {
    key: 'ports',
    label: 'ports',
    icon: LinkIcon,
    hidden: false,
  },
  {
    key: 'coreUpgrade',
    label: 'coreUpgrade',
    icon: ArrowPathIcon,
    hidden: false,
  },
  {
    key: 'actions',
    label: 'actions',
    icon: BoltIcon,
    hidden: hiddenSettingsItems.value[`${SETTINGS_MENU_KEY.backend}.actions`],
  },
  {
    key: 'dnsQuery',
    label: 'dnsQuery',
    icon: GlobeAltIcon,
    hidden: false,
  },
  {
    key: 'latency',
    label: 'latency',
    icon: ClockIcon,
    hidden: false,
  },
  {
    key: 'proxyStyle',
    label: 'proxyStyle',
    icon: Squares2X2Icon,
    hidden: false,
  },
  {
    key: 'icon',
    label: 'icon',
    icon: EyeIcon,
    hidden: false,
  },
  {
    key: 'connections',
    label: 'connectionSettings',
    icon: LinkIcon,
    hidden: false,
  },
  {
    key: 'zashboard',
    label: 'zashboardSettings',
    icon: CubeTransparentIcon,
    hidden: false,
  },
])
</script>
