<template>
  <SettingsCard
    :title="$t('actions')"
    :icon="BoltIcon"
    :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.backend}.actions`]"
  >
    <div class="flex flex-wrap gap-2">
      <template v-if="!isSingBox || displayAllFeatures">
        <button
          v-if="!activeBackend?.disableUpgradeCore"
          class="btn btn-sm btn-primary"
          @click="showUpgradeCoreModal = true"
        >
          {{ $t('upgradeCore') }}
        </button>
        <button
          class="btn btn-sm btn-outline"
          @click="handleRestartCore"
        >
          <span
            v-if="isCoreRestarting"
            class="loading loading-spinner loading-sm"
          ></span>
          {{ $t('restartCore') }}
        </button>
        <button
          class="btn btn-sm btn-outline"
          @click="handleReloadConfigs"
        >
          <span
            v-if="isConfigReloading"
            class="loading loading-spinner loading-sm"
          ></span>
          {{ $t('reloadConfigs') }}
        </button>
        <button
          class="btn btn-sm btn-outline"
          @click="handleUpdateGeo"
        >
          <span
            v-if="isGeoUpdating"
            class="loading loading-spinner loading-sm"
          ></span>
          {{ $t('updateGeoDatabase') }}
        </button>
      </template>
      <button
        class="btn btn-sm btn-outline"
        @click="handleFlushDNSCache"
      >
        {{ $t('flushDNSCache') }}
      </button>
      <button
        class="btn btn-sm btn-outline"
        @click="handleFlushFakeIP"
      >
        {{ $t('flushFakeIP') }}
      </button>
      <button
        v-if="hasSmartGroup"
        class="btn btn-sm btn-outline"
        @click="flushSmartGroupWeightsAPI"
      >
        {{ $t('flushSmartWeights') }}
      </button>
    </div>
    <UpgradeCoreModal v-model="showUpgradeCoreModal" />
  </SettingsCard>
</template>

<script setup lang="ts">
import {
  flushDNSCacheAPI,
  flushFakeIPAPI,
  flushSmartGroupWeightsAPI,
  isSingBox,
  reloadConfigsAPI,
  restartCoreAPI,
  updateGeoDataAPI,
} from '@/api'
import SettingsCard from '@/components/settings/SettingsCard.vue'
import UpgradeCoreModal from '@/components/settings/UpgradeCoreModal.vue'
import { SETTINGS_MENU_KEY } from '@/constant'
import { showNotification } from '@/helper/notification'
import { fetchConfigs } from '@/store/config'
import { fetchProxies, hasSmartGroup } from '@/store/proxies'
import { fetchRules } from '@/store/rules'
import { displayAllFeatures, hiddenSettingsItems } from '@/store/settings'
import { activeBackend } from '@/store/setup'
import { BoltIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const showUpgradeCoreModal = ref(false)

const reloadAll = () => {
  fetchConfigs()
  fetchRules()
  fetchProxies()
}

const isCoreRestarting = ref(false)
const handleRestartCore = async () => {
  if (isCoreRestarting.value) return
  isCoreRestarting.value = true
  try {
    await restartCoreAPI()
    setTimeout(reloadAll, 500)
    showNotification({ content: 'restartCoreSuccess', type: 'alert-success' })
  } finally {
    isCoreRestarting.value = false
  }
}

const isConfigReloading = ref(false)
const handleReloadConfigs = async () => {
  if (isConfigReloading.value) return
  isConfigReloading.value = true
  try {
    await reloadConfigsAPI()
    reloadAll()
    showNotification({ content: 'reloadConfigsSuccess', type: 'alert-success' })
  } finally {
    isConfigReloading.value = false
  }
}

const isGeoUpdating = ref(false)
const handleUpdateGeo = async () => {
  if (isGeoUpdating.value) return
  isGeoUpdating.value = true
  try {
    await updateGeoDataAPI()
    reloadAll()
    showNotification({ content: 'updateGeoSuccess', type: 'alert-success' })
  } finally {
    isGeoUpdating.value = false
  }
}

const handleFlushDNSCache = async () => {
  await flushDNSCacheAPI()
  showNotification({ content: 'flushDNSCacheSuccess', type: 'alert-success' })
}

const handleFlushFakeIP = async () => {
  await flushFakeIPAPI()
  showNotification({ content: 'flushFakeIPSuccess', type: 'alert-success' })
}
</script>
