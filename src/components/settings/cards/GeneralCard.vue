<template>
  <SettingsCard
    :title="$t('general')"
    :icon="Cog6ToothIcon"
    :hidden="!hasVisibleItems"
  >
    <div class="flex flex-col">
      <SettingsItem
        :label="$t('autoDisconnectIdleUDP')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.autoDisconnectIdleUDP`]"
      >
        <template #tooltip>
          <QuestionMarkCircleIcon
            class="text-base-content/50 h-4 w-4 cursor-pointer"
            @mouseenter="showTip($event, $t('autoDisconnectIdleUDPTip'))"
          />
        </template>
        <input
          type="checkbox"
          v-model="autoDisconnectIdleUDP"
          class="toggle toggle-primary"
        />
      </SettingsItem>
      <SettingsItem
        v-if="autoDisconnectIdleUDP"
        :label="$t('autoDisconnectIdleUDPTime')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.autoDisconnectIdleUDPTime`]"
      >
        <input
          type="number"
          class="input input-sm w-16"
          v-model="autoDisconnectIdleUDPTime"
        />
        <span class="text-base-content/70 text-sm">mins</span>
      </SettingsItem>
      <SettingsItem
        :label="$t('IPInfoAPI')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.IPInfoAPI`]"
      >
        <template #tooltip>
          <QuestionMarkCircleIcon
            class="text-base-content/50 h-4 w-4 cursor-pointer"
            @mouseenter="showTip($event, $t('IPInfoAPITip'))"
          />
        </template>
        <select
          class="select select-sm w-28"
          v-model="IPInfoAPI"
        >
          <option
            v-for="opt in Object.values(IP_INFO_API)"
            :key="opt"
            :value="opt"
          >
            {{ opt }}
          </option>
        </select>
      </SettingsItem>
      <SettingsItem
        v-if="isSingBox"
        :label="$t('displayAllFeatures')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.displayAllFeatures`]"
      >
        <template #tooltip>
          <QuestionMarkCircleIcon
            class="text-base-content/50 h-4 w-4 cursor-pointer"
            @mouseenter="showTip($event, $t('displayAllFeaturesTip'))"
          />
        </template>
        <input
          type="checkbox"
          v-model="displayAllFeatures"
          class="toggle toggle-primary"
        />
      </SettingsItem>
    </div>
  </SettingsCard>
</template>

<script setup lang="ts">
import { isSingBox } from '@/api'
import SettingsCard from '@/components/settings/SettingsCard.vue'
import SettingsItem from '@/components/settings/SettingsItem.vue'
import { IP_INFO_API, SETTINGS_MENU_KEY } from '@/constant'
import { useTooltip } from '@/helper/tooltip'
import {
  autoDisconnectIdleUDP,
  autoDisconnectIdleUDPTime,
  displayAllFeatures,
  hiddenSettingsItems,
  IPInfoAPI,
} from '@/store/settings'
import { Cog6ToothIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const { showTip } = useTooltip()

const hasVisibleItems = computed(() => {
  const keys = [
    `${SETTINGS_MENU_KEY.general}.autoDisconnectIdleUDP`,
    `${SETTINGS_MENU_KEY.general}.IPInfoAPI`,
    `${SETTINGS_MENU_KEY.general}.displayAllFeatures`,
  ]
  return keys.some((key) => !hiddenSettingsItems.value[key])
})
</script>
