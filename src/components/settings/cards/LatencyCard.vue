<template>
  <SettingsCard
    :title="$t('latency')"
    :icon="ClockIcon"
    :hidden="!hasVisibleItems"
  >
    <div class="flex flex-col">
      <SettingsItem
        :label="$t('speedtestUrl')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.proxies}.speedtestUrl`]"
      >
        <TextInput
          class="w-40"
          v-model="speedtestUrl"
          :clearable="true"
        />
      </SettingsItem>
      <SettingsItem
        :label="$t('speedtestTimeout')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.proxies}.speedtestTimeout`]"
      >
        <input
          type="number"
          class="input input-sm w-20"
          v-model="speedtestTimeout"
        />
        <span class="text-base-content/70 text-sm">ms</span>
      </SettingsItem>
      <SettingsItem
        :label="$t('lowLatencyDesc')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.proxies}.lowLatency`]"
      >
        <input
          type="number"
          class="input input-sm w-20"
          v-model="lowLatency"
        />
        <span class="text-base-content/70 text-sm">ms</span>
      </SettingsItem>
      <SettingsItem
        :label="$t('mediumLatencyDesc')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.proxies}.mediumLatency`]"
      >
        <input
          type="number"
          class="input input-sm w-20"
          v-model="mediumLatency"
        />
        <span class="text-base-content/70 text-sm">ms</span>
      </SettingsItem>
      <SettingsItem
        :label="$t('ipv6Test')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.proxies}.ipv6Test`]"
      >
        <input
          class="toggle toggle-primary"
          type="checkbox"
          v-model="IPv6test"
        />
      </SettingsItem>
      <SettingsItem
        :label="$t('independentLatencyTest')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.proxies}.independentLatencyTest`]"
      >
        <template #tooltip>
          <QuestionMarkCircleIcon
            class="text-base-content/50 h-4 w-4 cursor-pointer"
            @mouseenter="showTip($event, $t('independentLatencyTestTip'))"
          />
        </template>
        <input
          class="toggle toggle-primary"
          type="checkbox"
          v-model="independentLatencyTest"
        />
      </SettingsItem>
    </div>
    <div
      v-if="independentLatencyTest"
      class="border-base-200/50 mt-4 border-t pt-4"
    >
      <GroupTestUrlsSettings />
    </div>
  </SettingsCard>
</template>

<script setup lang="ts">
import TextInput from '@/components/common/TextInput.vue'
import GroupTestUrlsSettings from '@/components/settings/GroupTestUrlsSettings.vue'
import SettingsCard from '@/components/settings/SettingsCard.vue'
import SettingsItem from '@/components/settings/SettingsItem.vue'
import { SETTINGS_MENU_KEY } from '@/constant'
import { useTooltip } from '@/helper/tooltip'
import {
  hiddenSettingsItems,
  independentLatencyTest,
  IPv6test,
  lowLatency,
  mediumLatency,
  speedtestTimeout,
  speedtestUrl,
} from '@/store/settings'
import { ClockIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const { showTip } = useTooltip()

const hasVisibleItems = computed(() => {
  const keys = [
    `${SETTINGS_MENU_KEY.proxies}.speedtestUrl`,
    `${SETTINGS_MENU_KEY.proxies}.speedtestTimeout`,
    `${SETTINGS_MENU_KEY.proxies}.lowLatency`,
    `${SETTINGS_MENU_KEY.proxies}.mediumLatency`,
    `${SETTINGS_MENU_KEY.proxies}.ipv6Test`,
    `${SETTINGS_MENU_KEY.proxies}.independentLatencyTest`,
  ]
  return keys.some((key) => !hiddenSettingsItems.value[key])
})
</script>
