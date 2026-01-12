<template>
  <SettingsCard
    :title="$t('connections')"
    :icon="ArrowsRightLeftIcon"
    :hidden="!hasVisibleItems"
  >
    <div class="flex flex-col">
      <SettingsItem
        :label="$t('connectionStyle')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.connections}.connectionStyle`]"
      >
        <select
          class="select select-sm w-24"
          v-model="useConnectionCard"
        >
          <option :value="false">
            {{ $t('table') }}
          </option>
          <option :value="true">
            {{ $t('card') }}
          </option>
        </select>
      </SettingsItem>
      <SettingsItem
        :label="$t('proxyChainDirection')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.connections}.proxyChainDirection`]"
      >
        <select
          class="select select-sm w-24"
          v-model="proxyChainDirection"
        >
          <option
            v-for="opt in Object.values(PROXY_CHAIN_DIRECTION)"
            :key="opt"
            :value="opt"
          >
            {{ $t(opt) }}
          </option>
        </select>
      </SettingsItem>
      <template v-if="!useConnectionCard">
        <SettingsItem
          :label="$t('tableWidthMode')"
          :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.connections}.tableWidthMode`]"
        >
          <select
            class="select select-sm w-28"
            v-model="tableWidthMode"
          >
            <option
              v-for="opt in Object.values(TABLE_WIDTH_MODE)"
              :key="opt"
              :value="opt"
            >
              {{ $t(opt) }}
            </option>
          </select>
        </SettingsItem>
        <SettingsItem
          :label="$t('tableSize')"
          :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.connections}.tableSize`]"
        >
          <select
            class="select select-sm w-28"
            v-model="tableSize"
          >
            <option
              v-for="opt in Object.values(TABLE_SIZE)"
              :key="opt"
              :value="opt"
            >
              {{ $t(opt) }}
            </option>
          </select>
        </SettingsItem>
      </template>
    </div>
    <div
      v-if="!hiddenSettingsItems[`${SETTINGS_MENU_KEY.connections}.sourceIPLabels`]"
      class="border-base-200/50 mt-4 border-t pt-4"
    >
      <SourceIPLabels />
    </div>
  </SettingsCard>
</template>

<script setup lang="ts">
import SettingsCard from '@/components/settings/SettingsCard.vue'
import SettingsItem from '@/components/settings/SettingsItem.vue'
import SourceIPLabels from '@/components/settings/SourceIPLabels.vue'
import { PROXY_CHAIN_DIRECTION, SETTINGS_MENU_KEY, TABLE_SIZE, TABLE_WIDTH_MODE } from '@/constant'
import {
  hiddenSettingsItems,
  proxyChainDirection,
  tableSize,
  tableWidthMode,
  useConnectionCard,
} from '@/store/settings'
import { ArrowsRightLeftIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const hasVisibleItems = computed(() => {
  const keys = [
    `${SETTINGS_MENU_KEY.connections}.connectionStyle`,
    `${SETTINGS_MENU_KEY.connections}.proxyChainDirection`,
    `${SETTINGS_MENU_KEY.connections}.tableWidthMode`,
    `${SETTINGS_MENU_KEY.connections}.tableSize`,
    `${SETTINGS_MENU_KEY.connections}.sourceIPLabels`,
  ]
  return keys.some((key) => !hiddenSettingsItems.value[key])
})
</script>
