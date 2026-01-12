<template>
  <div class="flex flex-col gap-6">
    <!-- Appearance Group -->
    <template v-if="groupKey === 'appearanceGroup'">
      <SettingsSection :title="$t('themeAndStyle')">
        <AppearanceCard />
      </SettingsSection>
      <SettingsSection :title="$t('backgroundSettings')">
        <BackgroundCard />
      </SettingsSection>
    </template>

    <!-- Proxy Group -->
    <template v-else-if="groupKey === 'proxyGroup'">
      <SettingsSection :title="$t('proxyDisplaySettings')">
        <ProxyStyleCard />
      </SettingsSection>
      <SettingsSection :title="$t('iconSettings')">
        <IconCard />
      </SettingsSection>
      <SettingsSection :title="$t('latencySettings')">
        <LatencyCard />
      </SettingsSection>
    </template>

    <!-- System Group -->
    <template v-else-if="groupKey === 'systemGroup'">
      <SettingsSection :title="$t('generalConfig')">
        <GeneralCard />
      </SettingsSection>
      <SettingsSection :title="$t('mobileConfig')">
        <MobileCard />
      </SettingsSection>
      <SettingsSection :title="$t('overviewConfig')">
        <OverviewCard />
      </SettingsSection>
      <SettingsSection :title="$t('connectionConfig')">
        <ConnectionsCard />
      </SettingsSection>
    </template>

    <!-- Backend & Core Group -->
    <template v-else-if="groupKey === 'backendCoreGroup'">
      <SettingsSection :title="$t('backendConfig')">
        <BackendCard />
      </SettingsSection>
      <SettingsSection :title="$t('portsConfig')">
        <PortsCard />
      </SettingsSection>
      <SettingsSection :title="$t('coreConfig')">
        <CoreUpgradeCard />
      </SettingsSection>
      <SettingsSection :title="$t('actionsConfig')">
        <ActionsCard />
      </SettingsSection>
    </template>

    <!-- Tools Group -->
    <template v-else-if="groupKey === 'toolsGroup'">
      <SettingsSection :title="$t('dnsConfig')">
        <DnsQueryCard />
      </SettingsSection>
      <SettingsSection :title="$t('dashboardConfig')">
        <ZashboardCard />
      </SettingsSection>
    </template>
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
import SettingsSection from '@/components/settings/SettingsSection.vue'

defineProps<{
  groupKey: string
}>()
</script>
