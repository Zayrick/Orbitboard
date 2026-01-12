<template>
  <div class="h-full overflow-y-auto">
    <!-- Desktop layout: masonry cards -->
    <template v-if="!isMiddleScreen">
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
    </template>

    <!-- Mobile layout: list with detail page -->
    <template v-else>
      <div class="relative h-full">
        <Transition :name="transitionName">
          <MobileSettingsDetail
            v-if="selectedSetting"
            :key="selectedSetting"
            :settingKey="selectedSetting"
            class="absolute inset-0"
            @back="goBack"
          />
        </Transition>
        <div
          v-show="!selectedSetting"
          class="h-full"
        >
          <h1 class="p-4 pt-8 pb-2 text-2xl font-bold">
            {{ t('settings') }}
          </h1>
          <MobileSettingsList @select="selectSetting" />
        </div>
      </div>
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
import MobileSettingsDetail from '@/components/settings/MobileSettingsDetail.vue'
import MobileSettingsList from '@/components/settings/MobileSettingsList.vue'
import { usePaddingForViews } from '@/composables/paddingViews'
import { isMiddleScreen } from '@/helper/utils'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { padding } = usePaddingForViews()

const selectedSetting = ref<string | null>(null)
const transitionName = ref('settings-slide')

const selectSetting = (key: string) => {
  transitionName.value = 'settings-slide'
  selectedSetting.value = key
}

const goBack = () => {
  transitionName.value = 'settings-slide-back'
  selectedSetting.value = null
}
</script>
