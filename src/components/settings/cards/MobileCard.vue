<template>
  <SettingsCard
    :title="$t('mobileSettings')"
    :icon="DevicePhoneMobileIcon"
    class="md:hidden"
    :hidden="!hasVisibleItems"
  >
    <div class="flex flex-col">
      <SettingsItem
        :label="$t('scrollAnimationEffect')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.scrollAnimationEffect`]"
      >
        <input
          type="checkbox"
          v-model="scrollAnimationEffect"
          class="toggle toggle-primary"
        />
      </SettingsItem>
      <SettingsItem
        :label="$t('swipeInPages')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.swipeInPages`]"
      >
        <input
          type="checkbox"
          v-model="swipeInPages"
          class="toggle toggle-primary"
        />
      </SettingsItem>
      <SettingsItem
        v-if="swipeInPages"
        :label="$t('swipeInTabs')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.swipeInTabs`]"
      >
        <input
          type="checkbox"
          v-model="swipeInTabs"
          class="toggle toggle-primary"
        />
      </SettingsItem>
      <SettingsItem
        :label="$t('disablePullToRefresh')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.disablePullToRefresh`]"
      >
        <template #tooltip>
          <QuestionMarkCircleIcon
            class="text-base-content/50 h-4 w-4 cursor-pointer"
            @mouseenter="showTip($event, $t('disablePullToRefreshTip'))"
          />
        </template>
        <input
          type="checkbox"
          v-model="disablePullToRefresh"
          class="toggle toggle-primary"
        />
      </SettingsItem>
    </div>
  </SettingsCard>
</template>

<script setup lang="ts">
import SettingsCard from '@/components/settings/SettingsCard.vue'
import SettingsItem from '@/components/settings/SettingsItem.vue'
import { SETTINGS_MENU_KEY } from '@/constant'
import { useTooltip } from '@/helper/tooltip'
import {
  disablePullToRefresh,
  hiddenSettingsItems,
  scrollAnimationEffect,
  swipeInPages,
  swipeInTabs,
} from '@/store/settings'
import { DevicePhoneMobileIcon, QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const { showTip } = useTooltip()

const hasVisibleItems = computed(() => {
  const keys = [
    `${SETTINGS_MENU_KEY.general}.scrollAnimationEffect`,
    `${SETTINGS_MENU_KEY.general}.swipeInPages`,
    `${SETTINGS_MENU_KEY.general}.disablePullToRefresh`,
  ]
  return keys.some((key) => !hiddenSettingsItems.value[key])
})
</script>
