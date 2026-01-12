<template>
  <SettingsCard
    :title="$t('proxyStyle')"
    :icon="Squares2X2Icon"
    :hidden="!hasVisibleItems"
  >
    <div class="flex flex-col">
      <SettingsItem
        :label="$t('proxyGroupLayout')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.proxies}.proxyGroupLayout`]"
      >
        <select
          class="select select-sm w-36"
          v-model="proxyGroupLayout"
        >
          <option
            v-for="opt in Object.values(PROXY_GROUP_LAYOUT)"
            :key="opt"
            :value="opt"
          >
            {{ $t(opt) }}
          </option>
        </select>
      </SettingsItem>
      <SettingsItem
        :label="$t('truncateProxyName')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.proxies}.truncateProxyName`]"
      >
        <input
          class="toggle toggle-primary"
          type="checkbox"
          v-model="truncateProxyName"
        />
      </SettingsItem>
      <SettingsItem
        :label="$t('displayGlobalByMode')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.proxies}.displayGlobalByMode`]"
      >
        <input
          class="toggle toggle-primary"
          type="checkbox"
          v-model="displayGlobalByMode"
        />
      </SettingsItem>
      <SettingsItem
        v-if="displayGlobalByMode && isSingBox"
        :label="$t('customGlobalNode')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.proxies}.customGlobalNode`]"
      >
        <select
          class="select select-sm w-28"
          v-model="customGlobalNode"
        >
          <option
            v-for="opt in Object.keys(proxyMap)"
            :key="opt"
            :value="opt"
          >
            {{ opt }}
          </option>
        </select>
      </SettingsItem>
      <SettingsItem
        :label="$t('proxyPreviewType')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.proxies}.proxyPreviewType`]"
      >
        <select
          class="select select-sm w-28"
          v-model="proxyPreviewType"
        >
          <option
            v-for="opt in Object.values(PROXY_PREVIEW_TYPE)"
            :key="opt"
            :value="opt"
          >
            {{ $t(opt) }}
          </option>
        </select>
      </SettingsItem>
      <SettingsItem
        :label="$t('proxyGroupIconSize')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.proxies}.proxyGroupIconSize`]"
      >
        <input
          type="number"
          class="input input-sm w-20"
          v-model="proxyGroupIconSize"
        />
      </SettingsItem>
      <SettingsItem
        :label="$t('proxyGroupIconMargin')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.proxies}.proxyGroupIconMargin`]"
      >
        <input
          type="number"
          class="input input-sm w-20"
          v-model="proxyGroupIconMargin"
        />
      </SettingsItem>
    </div>
  </SettingsCard>
</template>

<script setup lang="ts">
import { isSingBox } from '@/api'
import SettingsCard from '@/components/settings/SettingsCard.vue'
import SettingsItem from '@/components/settings/SettingsItem.vue'
import { PROXY_GROUP_LAYOUT, PROXY_PREVIEW_TYPE, SETTINGS_MENU_KEY } from '@/constant'
import { proxyMap } from '@/store/proxies'
import {
  customGlobalNode,
  displayGlobalByMode,
  hiddenSettingsItems,
  proxyGroupIconMargin,
  proxyGroupIconSize,
  proxyGroupLayout,
  proxyPreviewType,
  truncateProxyName,
} from '@/store/settings'
import { Squares2X2Icon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const hasVisibleItems = computed(() => {
  const keys = [
    `${SETTINGS_MENU_KEY.proxies}.proxyGroupLayout`,
    `${SETTINGS_MENU_KEY.proxies}.truncateProxyName`,
    `${SETTINGS_MENU_KEY.proxies}.displayGlobalByMode`,
    `${SETTINGS_MENU_KEY.proxies}.customGlobalNode`,
    `${SETTINGS_MENU_KEY.proxies}.proxyPreviewType`,
    `${SETTINGS_MENU_KEY.proxies}.proxyGroupIconSize`,
    `${SETTINGS_MENU_KEY.proxies}.proxyGroupIconMargin`,
  ]
  return keys.some((key) => !hiddenSettingsItems.value[key])
})
</script>
