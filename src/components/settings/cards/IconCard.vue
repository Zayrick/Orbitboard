<template>
  <SettingsCard
    :title="$t('icon')"
    :icon="FaceSmileIcon"
    :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.proxies}.iconSettings`]"
  >
    <IconSettings />
  </SettingsCard>
</template>

<script setup lang="ts">
import IconSettings from '@/components/settings/IconSettings.vue'
import SettingsCard from '@/components/settings/SettingsCard.vue'
import { SETTINGS_MENU_KEY } from '@/constant'
import { hiddenSettingsItems } from '@/store/settings'
import { FaceSmileIcon } from '@heroicons/vue/24/outline'
</script>
