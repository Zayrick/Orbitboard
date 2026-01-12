<template>
  <div class="h-full overflow-y-auto">
    <h1
      class="p-4 pt-8 pb-0 text-4xl font-bold"
      :style="padding"
    >
      {{ t('settings') }}
    </h1>
    <div
      class="settings-cards-masonry p-4"
      :style="padding"
    >
      <AppearanceCard />
      <BackgroundCard />
      <GeneralCard />
      <MobileCard />
      <OverviewCard />
      <BackendCard />
      <PortsCard />
      <CoreUpgradeCard />
      <ActionsCard />
      <DnsQueryCard />
      <LatencyCard />
      <ProxyStyleCard />
      <IconCard />
      <ConnectionsCard />
      <ZashboardCard />
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
import { usePaddingForViews } from '@/composables/paddingViews'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { padding } = usePaddingForViews()
</script>
