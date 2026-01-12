<template>
  <div class="bg-base-200/50 flex h-full flex-col">
    <!-- Header with back button -->
    <div
      class="border-base-200/50 bg-base-100/80 sticky top-0 z-10 flex items-center gap-3 border-b px-4 py-3 backdrop-blur-sm"
    >
      <button
        class="btn btn-ghost btn-sm btn-square"
        @click="$emit('back')"
      >
        <ChevronLeftIcon class="h-5 w-5" />
      </button>
      <h2 class="text-lg font-semibold">{{ $t(currentTitle) }}</h2>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-4 py-4 pb-20">
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ActionsCard,
  AppearanceCard,
  BackendCard,
  BackgroundCard,
  ConnectionsCard,
  CoreUpgradeCard,
  DnsQueryCard,
  GeneralCard,
  IconCard,
  LatencyCard,
  MobileCard,
  OverviewCard,
  PortsCard,
  ProxyStyleCard,
  ZashboardCard,
} from '@/components/settings/cards'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { computed, type Component } from 'vue'

const props = defineProps<{
  settingKey: string
}>()

defineEmits<{
  back: []
}>()

const settingsConfig: Record<string, { component: Component; title: string }> = {
  appearance: { component: AppearanceCard, title: 'appearance' },
  background: { component: BackgroundCard, title: 'background' },
  general: { component: GeneralCard, title: 'general' },
  mobile: { component: MobileCard, title: 'mobileSettings' },
  overview: { component: OverviewCard, title: 'overviewSettings' },
  backend: { component: BackendCard, title: 'backend' },
  ports: { component: PortsCard, title: 'ports' },
  coreUpgrade: { component: CoreUpgradeCard, title: 'coreUpgrade' },
  actions: { component: ActionsCard, title: 'actions' },
  dnsQuery: { component: DnsQueryCard, title: 'dnsQuery' },
  latency: { component: LatencyCard, title: 'latency' },
  proxyStyle: { component: ProxyStyleCard, title: 'proxyStyle' },
  icon: { component: IconCard, title: 'icon' },
  connections: { component: ConnectionsCard, title: 'connectionSettings' },
  zashboard: { component: ZashboardCard, title: 'zashboardSettings' },
}

const currentComponent = computed(() => {
  return settingsConfig[props.settingKey]?.component
})

const currentTitle = computed(() => {
  return settingsConfig[props.settingKey]?.title || 'settings'
})
</script>
