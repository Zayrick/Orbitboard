<template>
  <div class="h-full overflow-y-auto">
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

const { padding } = usePaddingForViews()
</script>
