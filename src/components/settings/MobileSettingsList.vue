<template>
  <div class="pb-20">
    <div
      v-for="item in settingMenuItems"
      :key="item.key"
    >
      <button
        class="hover:bg-base-200/30 active:bg-base-200/50 flex w-full items-center gap-4 px-5 py-4 text-left transition-colors"
        :class="{ hidden: item.hidden }"
        @click="$emit('select', item.key)"
      >
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          :class="item.iconBgClass || 'bg-primary/10'"
        >
          <component
            :is="item.icon"
            class="h-5 w-5"
            :class="item.iconClass || 'text-primary'"
          />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-base-content truncate text-base font-medium">
            {{ $t(item.label) }}
          </div>
          <div
            v-if="item.description"
            class="text-base-content/50 mt-0.5 truncate text-xs"
          >
            {{ item.description }}
          </div>
        </div>
        <ChevronRightIcon class="text-base-content/40 h-5 w-5 shrink-0" />
      </button>
      <div
        v-if="item.divider"
        class="border-base-200/50 mx-5 border-b"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ChevronRightIcon,
  Cog6ToothIcon,
  ServerStackIcon,
  Squares2X2Icon,
  SwatchIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineEmits<{
  select: [key: string]
}>()

const settingMenuItems = computed(() => [
  {
    key: 'appearanceGroup',
    label: 'appearanceGroup',
    icon: SwatchIcon,
    iconBgClass: 'bg-purple-500/10',
    iconClass: 'text-purple-500',
    description: t('appearance') + ', ' + t('background'),
    hidden: false,
    divider: false,
  },
  {
    key: 'proxyGroup',
    label: 'proxyGroup',
    icon: Squares2X2Icon,
    iconBgClass: 'bg-blue-500/10',
    iconClass: 'text-blue-500',
    description: t('proxyStyle') + ', ' + t('icon') + ', ' + t('latency'),
    hidden: false,
    divider: false,
  },
  {
    key: 'systemGroup',
    label: 'systemGroup',
    icon: Cog6ToothIcon,
    iconBgClass: 'bg-green-500/10',
    iconClass: 'text-green-500',
    description:
      t('general') +
      ', ' +
      t('mobileSettings') +
      ', ' +
      t('overviewSettings') +
      ', ' +
      t('connectionSettings'),
    hidden: false,
    divider: false,
  },
  {
    key: 'backendCoreGroup',
    label: 'backendCoreGroup',
    icon: ServerStackIcon,
    iconBgClass: 'bg-orange-500/10',
    iconClass: 'text-orange-500',
    description: t('backend') + ', ' + t('ports') + ', ' + t('coreUpgrade') + ', ' + t('actions'),
    hidden: false,
    divider: false,
  },
  {
    key: 'toolsGroup',
    label: 'toolsGroup',
    icon: WrenchScrewdriverIcon,
    iconBgClass: 'bg-cyan-500/10',
    iconClass: 'text-cyan-500',
    description: t('dnsQuery') + ', ' + t('zashboardSettings'),
    hidden: false,
    divider: false,
  },
])
</script>
