<template>
  <SettingsCard
    :title="$t('dnsQuery')"
    :icon="MagnifyingGlassIcon"
    :hidden="hiddenSettingsItems[`${SETTINGS_MENU_KEY.backend}.dnsQuery`]"
  >
    <DnsQuery />
  </SettingsCard>
</template>

<script setup lang="ts">
import DnsQuery from '@/components/settings/DnsQuery.vue'
import SettingsCard from '@/components/settings/SettingsCard.vue'
import { SETTINGS_MENU_KEY } from '@/constant'
import { hiddenSettingsItems } from '@/store/settings'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
</script>
