<template>
  <SettingsCard
    v-if="!isSingBox && configs"
    :title="$t('portSettings')"
    :icon="GlobeAltIcon"
    :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.backend}.ports`]"
  >
    <div class="flex flex-col">
      <SettingsItem
        v-for="portConfig in portList"
        :key="portConfig.key"
        :label="$t(portConfig.label)"
      >
        <input
          class="input input-sm w-20"
          type="number"
          v-model="configs[portConfig.key]"
          @change="updateConfigs({ [portConfig.key]: Number(configs[portConfig.key]) })"
        />
      </SettingsItem>
      <SettingsItem
        v-if="configs?.tun"
        :label="$t('tunMode')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.backend}.tunMode`]"
      >
        <input
          class="toggle toggle-primary"
          type="checkbox"
          v-model="configs.tun.enable"
          @change="handleTunModeChange"
        />
      </SettingsItem>
      <SettingsItem
        :label="$t('allowLan')"
        :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.backend}.allowLan`]"
      >
        <input
          class="toggle toggle-primary"
          type="checkbox"
          v-model="configs['allow-lan']"
          @change="handleAllowLanChange"
        />
      </SettingsItem>
    </div>
  </SettingsCard>
</template>

<script setup lang="ts">
import { isSingBox } from '@/api'
import SettingsCard from '@/components/settings/SettingsCard.vue'
import SettingsItem from '@/components/settings/SettingsItem.vue'
import { SETTINGS_MENU_KEY } from '@/constant'
import { configs, updateConfigs } from '@/store/config'
import { hiddenSettingsItems } from '@/store/settings'
import { GlobeAltIcon } from '@heroicons/vue/24/outline'

/** Port configuration key type for type safety */
type PortConfigKey = 'mixed-port' | 'port' | 'socks-port' | 'redir-port' | 'tproxy-port'

interface PortConfig {
  label: string
  key: PortConfigKey
}

const portList: PortConfig[] = [
  { label: 'mixedPort', key: 'mixed-port' },
  { label: 'httpPort', key: 'port' },
  { label: 'socksPort', key: 'socks-port' },
  { label: 'redirPort', key: 'redir-port' },
  { label: 'tproxyPort', key: 'tproxy-port' },
]

const handleTunModeChange = async () => {
  await updateConfigs({ tun: { enable: configs.value?.tun.enable } })
}

const handleAllowLanChange = async () => {
  await updateConfigs({ ['allow-lan']: configs.value?.['allow-lan'] })
}
</script>
