<template>
  <ZashboardSettings />
  <div class="divider my-4" />
  <!-- dashboard -->
  <div class="p-4 text-sm">
    <div class="settings-title">
      {{ $t('general') }}
    </div>
    <div class="settings-grid">
      <div
        v-if="!hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.autoDisconnectIdleUDP`]"
        class="setting-item"
      >
        <div class="setting-item-label">
          {{ $t('autoDisconnectIdleUDP') }}
          <QuestionMarkCircleIcon
            class="h-4 w-4 cursor-pointer"
            @mouseenter="showTip($event, $t('autoDisconnectIdleUDPTip'))"
          />
        </div>
        <input
          type="checkbox"
          v-model="autoDisconnectIdleUDP"
          class="toggle"
        />
      </div>
      <div
        v-if="
          autoDisconnectIdleUDP &&
          !hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.autoDisconnectIdleUDPTime`]
        "
        class="setting-item"
      >
        <div class="setting-item-label">
          {{ $t('autoDisconnectIdleUDPTime') }}
        </div>
        <input
          type="number"
          class="input input-sm w-20"
          v-model="autoDisconnectIdleUDPTime"
        />
        mins
      </div>
      <div
        v-if="!hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.IPInfoAPI`]"
        class="setting-item"
      >
        <div class="setting-item-label">
          {{ $t('IPInfoAPI') }}
          <QuestionMarkCircleIcon
            class="h-4 w-4 cursor-pointer"
            @mouseenter="showTip($event, $t('IPInfoAPITip'))"
          />
        </div>
        <select
          class="select select-sm min-w-24"
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
      </div>

      <div
        v-if="!hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.scrollAnimationEffect`]"
        class="setting-item md:hidden!"
      >
        <div class="setting-item-label">
          {{ $t('scrollAnimationEffect') }}
        </div>
        <input
          type="checkbox"
          v-model="scrollAnimationEffect"
          class="toggle"
        />
      </div>
      <div
        v-if="!hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.swipeInPages`]"
        class="setting-item md:hidden!"
      >
        <div class="setting-item-label">
          {{ $t('swipeInPages') }}
        </div>
        <input
          type="checkbox"
          v-model="swipeInPages"
          class="toggle"
        />
      </div>
      <div
        v-if="swipeInPages && !hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.swipeInTabs`]"
        class="setting-item md:hidden!"
      >
        <div class="setting-item-label">
          {{ $t('swipeInTabs') }}
        </div>
        <input
          type="checkbox"
          v-model="swipeInTabs"
          class="toggle"
        />
      </div>
      <div
        v-if="!hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.disablePullToRefresh`]"
        class="setting-item md:hidden!"
      >
        <div class="setting-item-label">
          {{ $t('disablePullToRefresh') }}
          <QuestionMarkCircleIcon
            class="h-4 w-4 cursor-pointer"
            @mouseenter="showTip($event, $t('disablePullToRefreshTip'))"
          />
        </div>
        <input
          type="checkbox"
          v-model="disablePullToRefresh"
          class="toggle"
        />
      </div>
      <div
        v-if="isSingBox && !hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.displayAllFeatures`]"
        class="setting-item"
      >
        <div class="setting-item-label">
          {{ $t('displayAllFeatures') }}
          <QuestionMarkCircleIcon
            class="h-4 w-4 cursor-pointer"
            @mouseenter="showTip($event, $t('displayAllFeaturesTip'))"
          />
        </div>
        <input
          type="checkbox"
          v-model="displayAllFeatures"
          class="toggle"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isSingBox } from '@/api'
import { IP_INFO_API, SETTINGS_MENU_KEY } from '@/constant'
import { useTooltip } from '@/helper/tooltip'
import {
  autoDisconnectIdleUDP,
  autoDisconnectIdleUDPTime,
  disablePullToRefresh,
  displayAllFeatures,
  hiddenSettingsItems,
  IPInfoAPI,
  scrollAnimationEffect,
  swipeInPages,
  swipeInTabs,
} from '@/store/settings'
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline'
import ZashboardSettings from './ZashboardSettings.vue'

const { showTip } = useTooltip()
</script>
