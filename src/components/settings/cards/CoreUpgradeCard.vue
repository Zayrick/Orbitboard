<template>
  <SettingsCard
    v-if="!isSingBox && !activeBackend?.disableUpgradeCore"
    :title="$t('coreUpgrade')"
    :icon="ArrowPathIcon"
    :hidden="!hasVisibleItems"
  >
    <div class="flex flex-col">
      <SettingsItem
        :label="$t('checkUpgrade')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.backend}.checkUpgrade`]"
      >
        <input
          class="toggle toggle-primary"
          type="checkbox"
          v-model="checkUpgradeCore"
          @change="handleCheckUpgradeCoreChange"
        />
      </SettingsItem>
      <SettingsItem
        v-if="checkUpgradeCore"
        :label="$t('autoUpgrade')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.backend}.autoUpgrade`]"
      >
        <input
          class="toggle toggle-primary"
          type="checkbox"
          v-model="autoUpgradeCore"
        />
      </SettingsItem>
    </div>
  </SettingsCard>
</template>

<script setup lang="ts">
import { isCoreUpdateAvailable, isSingBox } from '@/api'
import SettingsCard from '@/components/settings/SettingsCard.vue'
import SettingsItem from '@/components/settings/SettingsItem.vue'
import { SETTINGS_MENU_KEY } from '@/constant'
import { autoUpgradeCore, checkUpgradeCore, hiddenSettingsItems } from '@/store/settings'
import { activeBackend } from '@/store/setup'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const hasVisibleItems = computed(() => {
  const keys = [
    `${SETTINGS_MENU_KEY.backend}.checkUpgrade`,
    `${SETTINGS_MENU_KEY.backend}.autoUpgrade`,
  ]
  return keys.some((key) => !hiddenSettingsItems.value[key])
})

const handleCheckUpgradeCoreChange = () => {
  if (!checkUpgradeCore.value) {
    autoUpgradeCore.value = false
    isCoreUpdateAvailable.value = false
  }
}
</script>
