<template>
  <SettingsCard
    :title="$t('background')"
    :icon="PhotoIcon"
    :hidden="
      hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.zashboardSettings.customBackgroundURL`]
    "
  >
    <div class="flex flex-col">
      <SettingsItem :label="$t('customBackgroundURL')">
        <div class="join">
          <TextInput
            class="join-item w-32"
            v-model="customBackgroundURL"
            :clearable="true"
            @update:modelValue="handlerBackgroundURLChange"
          />
          <button
            class="btn join-item btn-sm"
            @click="handlerClickUpload"
          >
            <ArrowUpTrayIcon class="h-4 w-4" />
          </button>
        </div>
      </SettingsItem>
      <template v-if="customBackgroundURL">
        <SettingsItem
          :label="$t('transparent')"
          :hidden="
            hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.zashboardSettings.transparent`]
          "
        >
          <input
            type="range"
            min="0"
            max="100"
            v-model="dashboardTransparent"
            class="range range-sm w-32"
            @touchstart.passive.stop
            @touchmove.passive.stop
            @touchend.passive.stop
          />
        </SettingsItem>
        <SettingsItem
          :label="$t('blurIntensity')"
          :hidden="
            hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.zashboardSettings.blurIntensity`]
          "
        >
          <input
            type="range"
            min="0"
            max="40"
            v-model="blurIntensity"
            class="range range-sm w-32"
            @touchstart.stop
            @touchmove.stop
            @touchend.stop
          />
        </SettingsItem>
      </template>
    </div>
    <input
      ref="inputFileRef"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handlerFileChange"
    />
  </SettingsCard>
</template>

<script setup lang="ts">
import TextInput from '@/components/common/TextInput.vue'
import SettingsCard from '@/components/settings/SettingsCard.vue'
import SettingsItem from '@/components/settings/SettingsItem.vue'
import { SETTINGS_MENU_KEY } from '@/constant'
import { deleteBase64FromIndexedDB, LOCAL_IMAGE, saveBase64ToIndexedDB } from '@/helper/indexeddb'
import {
  blurIntensity,
  customBackgroundURL,
  dashboardTransparent,
  hiddenSettingsItems,
} from '@/store/settings'
import { ArrowUpTrayIcon, PhotoIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const inputFileRef = ref<HTMLInputElement>()

const handlerClickUpload = () => {
  inputFileRef.value?.click()
}

const handlerBackgroundURLChange = () => {
  if (!customBackgroundURL.value.includes(LOCAL_IMAGE)) {
    deleteBase64FromIndexedDB()
  }
}

const handlerFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    customBackgroundURL.value = LOCAL_IMAGE + '-' + Date.now()
    saveBase64ToIndexedDB(reader.result as string)
  }
  reader.readAsDataURL(file)
}
</script>
