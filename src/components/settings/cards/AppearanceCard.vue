<template>
  <SettingsCard
    :title="$t('appearance')"
    :icon="SwatchIcon"
    :hidden="!hasVisibleItems"
  >
    <template #header-extra>
      <span
        v-if="isUIUpdateAvailable"
        class="badge badge-sm badge-secondary animate-pulse"
      >
        {{ $t('updateAvailable') }}
      </span>
    </template>
    <div class="flex flex-col">
      <SettingsItem
        :label="$t('language')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.zashboardSettings.language`]"
      >
        <LanguageSelect :withLabel="false" />
      </SettingsItem>
      <SettingsItem
        :label="$t('fonts')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.zashboardSettings.fonts`]"
      >
        <select
          class="select select-sm w-40"
          v-model="font"
        >
          <option
            v-for="opt in fontOptions"
            :key="opt"
            :value="opt"
          >
            {{ opt }}
          </option>
        </select>
      </SettingsItem>
      <SettingsItem
        label="Emoji"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.zashboardSettings.emoji`]"
      >
        <select
          class="select select-sm w-40"
          v-model="emoji"
        >
          <option
            v-for="opt in Object.values(EMOJIS)"
            :key="opt"
            :value="opt"
          >
            {{ opt }}
          </option>
        </select>
      </SettingsItem>
      <SettingsItem
        :label="$t('defaultTheme')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.zashboardSettings.defaultTheme`]"
      >
        <div class="join">
          <ThemeSelector
            class="w-32!"
            v-model:value="defaultTheme"
          />
          <button
            class="btn btn-sm join-item"
            @click="customThemeModal = true"
          >
            <PlusIcon class="h-4 w-4" />
          </button>
        </div>
      </SettingsItem>
      <SettingsItem
        v-if="autoTheme"
        :label="$t('darkTheme')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.zashboardSettings.darkTheme`]"
      >
        <ThemeSelector v-model:value="darkTheme" />
      </SettingsItem>
      <SettingsItem
        :label="$t('autoSwitchTheme')"
        :hidden="
          hiddenSettingsItems[`${SETTINGS_MENU_KEY.general}.zashboardSettings.autoSwitchTheme`]
        "
      >
        <input
          type="checkbox"
          v-model="autoTheme"
          class="toggle toggle-primary"
        />
      </SettingsItem>
    </div>
    <CustomTheme v-model:value="customThemeModal" />
  </SettingsCard>
</template>

<script setup lang="ts">
import CustomTheme from '@/components/settings/CustomTheme.vue'
import LanguageSelect from '@/components/settings/LanguageSelect.vue'
import SettingsCard from '@/components/settings/SettingsCard.vue'
import SettingsItem from '@/components/settings/SettingsItem.vue'
import ThemeSelector from '@/components/settings/ThemeSelector.vue'
import { useSettings } from '@/composables/settings'
import { EMOJIS, FONTS, SETTINGS_MENU_KEY } from '@/constant'
import {
  autoTheme,
  darkTheme,
  defaultTheme,
  emoji,
  font,
  hiddenSettingsItems,
} from '@/store/settings'
import { PlusIcon, SwatchIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'

const { isUIUpdateAvailable } = useSettings()
const customThemeModal = ref(false)

const fontOptions = computed(() => {
  const mode = import.meta.env.MODE
  if (Object.values(FONTS).includes(mode as FONTS)) {
    return [mode]
  }
  return Object.values(FONTS)
})

const hasVisibleItems = computed(() => {
  const keys = [
    `${SETTINGS_MENU_KEY.general}.zashboardSettings.language`,
    `${SETTINGS_MENU_KEY.general}.zashboardSettings.fonts`,
    `${SETTINGS_MENU_KEY.general}.zashboardSettings.emoji`,
    `${SETTINGS_MENU_KEY.general}.zashboardSettings.defaultTheme`,
    `${SETTINGS_MENU_KEY.general}.zashboardSettings.autoSwitchTheme`,
  ]
  return keys.some((key) => !hiddenSettingsItems.value[key])
})
</script>
