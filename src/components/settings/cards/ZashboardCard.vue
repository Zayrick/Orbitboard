<template>
  <SettingsCard
    title="Zashboard"
    :icon="InformationCircleIcon"
  >
    <template #header-extra>
      <a
        href="https://github.com/Zephyruso/zashboard"
        target="_blank"
        class="text-base-content/60 hover:text-primary text-xs"
      >
        {{ zashboardVersion }}
        <span
          v-if="commitId"
          class="text-xs"
        >
          {{ commitId }}
        </span>
      </a>
    </template>
    <div class="flex flex-col">
      <SettingsItem
        :label="$t('autoUpgrade')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.zashboardSettings.autoUpgrade`]"
      >
        <input
          class="toggle toggle-primary"
          type="checkbox"
          v-model="autoUpgradeUI"
        />
      </SettingsItem>
    </div>
    <div class="border-base-200/50 mt-4 flex flex-wrap gap-2 border-t pt-4">
      <button
        v-if="isPWA"
        class="btn btn-sm btn-outline"
        @click="refreshPages"
      >
        <ArrowPathIcon class="h-4 w-4" />
        {{ $t('refresh') }}
      </button>
      <button
        v-if="!hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.zashboardSettings.upgradeUI`]"
        :class="twMerge('btn btn-sm btn-primary', isUIUpgrading ? 'animate-pulse' : '')"
        @click="handleUpgradeUI"
      >
        {{ $t('upgradeUI') }}
      </button>
      <button
        v-if="!hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.zashboardSettings.exportSettings`]"
        class="btn btn-sm btn-outline"
        @click="exportSettings"
      >
        {{ $t('exportSettings') }}
      </button>
      <ImportSettings
        v-if="!hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.zashboardSettings.importSettings`]"
      />
    </div>
  </SettingsCard>
</template>

<script setup lang="ts">
import { upgradeUIAPI, zashboardVersion } from '@/api'
import ImportSettings from '@/components/common/ImportSettings.vue'
import SettingsCard from '@/components/settings/SettingsCard.vue'
import SettingsItem from '@/components/settings/SettingsItem.vue'
import { SETTINGS_MENU_KEY } from '@/constant'
import { handlerUpgradeSuccess } from '@/helper'
import { exportSettings, isPWA } from '@/helper/utils'
import { autoUpgrade as autoUpgradeUI, hiddenSettingsItems } from '@/store/settings'
import { ArrowPathIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { twMerge } from 'tailwind-merge'
import { ref } from 'vue'

const commitId = __COMMIT_ID__

const isUIUpgrading = ref(false)
const handleUpgradeUI = async () => {
  if (isUIUpgrading.value) return
  isUIUpgrading.value = true
  try {
    await upgradeUIAPI()
    handlerUpgradeSuccess()
    setTimeout(() => window.location.reload(), 1000)
  } finally {
    isUIUpgrading.value = false
  }
}

const refreshPages = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations()
  for (const registration of registrations) {
    registration.unregister()
  }
  window.location.reload()
}
</script>
