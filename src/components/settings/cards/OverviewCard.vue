<template>
  <SettingsCard
    :title="$t('overviewSettings')"
    :icon="ChartBarIcon"
    :hidden="!hasVisibleItems"
  >
    <div class="flex flex-col">
      <SettingsItem
        :label="$t('autoIPCheckWhenStart')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.overview}.autoIPCheckWhenStart`]"
      >
        <input
          class="toggle toggle-primary"
          type="checkbox"
          v-model="autoIPCheck"
        />
      </SettingsItem>
      <SettingsItem
        :label="$t('autoConnectionCheckWhenStart')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.overview}.autoConnectionCheckWhenStart`]"
      >
        <input
          class="toggle toggle-primary"
          type="checkbox"
          v-model="autoConnectionCheck"
        />
      </SettingsItem>
    </div>
  </SettingsCard>
</template>

<script setup lang="ts">
import SettingsCard from '@/components/settings/SettingsCard.vue'
import SettingsItem from '@/components/settings/SettingsItem.vue'
import { SETTINGS_MENU_KEY } from '@/constant'
import { autoConnectionCheck, autoIPCheck, hiddenSettingsItems } from '@/store/settings'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const hasVisibleItems = computed(() => {
  const keys = [
    `${SETTINGS_MENU_KEY.overview}.autoIPCheckWhenStart`,
    `${SETTINGS_MENU_KEY.overview}.autoConnectionCheckWhenStart`,
  ]
  return keys.some((key) => !hiddenSettingsItems.value[key])
})
</script>
