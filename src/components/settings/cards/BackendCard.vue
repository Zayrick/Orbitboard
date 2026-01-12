<template>
  <SettingsCard
    :title="$t('backend')"
    :icon="ServerIcon"
  >
    <template #header-extra>
      <button
        class="btn btn-ghost btn-xs btn-square"
        @click="addBackend"
        :title="$t('setup')"
      >
        <PlusIcon class="h-4 w-4" />
      </button>
    </template>
    <div class="flex flex-col">
      <BackendList v-if="!hiddenSettingsItems[`${SETTINGS_MENU_KEY.backend}.backendSwitch`]" />
    </div>
  </SettingsCard>
</template>

<script setup lang="ts">
import BackendList from '@/components/settings/BackendList.vue'
import SettingsCard from '@/components/settings/SettingsCard.vue'
import { ROUTE_NAME, SETTINGS_MENU_KEY } from '@/constant'
import router from '@/router'
import { hiddenSettingsItems } from '@/store/settings'
import { activeUuid } from '@/store/setup'
import { PlusIcon, ServerIcon } from '@heroicons/vue/24/outline'

const addBackend = () => {
  activeUuid.value = null
  router.push({ name: ROUTE_NAME.setup })
}
</script>
