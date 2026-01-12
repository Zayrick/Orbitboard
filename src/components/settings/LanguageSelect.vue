<template>
  <component
    :is="withLabel ? 'div' : 'span'"
    :class="withLabel ? 'setting-item' : ''"
  >
    <div
      v-if="withLabel"
      class="setting-item-label"
    >
      {{ $t('language') }}
    </div>
    <select
      class="select select-sm w-48"
      v-model="language"
      @change="handleChange"
    >
      <option
        v-for="opt in Object.values(LANG)"
        :key="opt"
        :value="opt"
      >
        {{ langLabelMap[opt] || opt }}
      </option>
    </select>
  </component>
</template>

<script setup lang="ts">
import { LANG } from '@/constant'
import { language } from '@/store/settings'
import { useI18n } from 'vue-i18n'

withDefaults(
  defineProps<{
    /** Whether to render an inline label + select layout. */
    withLabel?: boolean
  }>(),
  { withLabel: true },
)

const { locale } = useI18n()

const handleChange = () => {
  locale.value = language.value
}

const langLabelMap: Record<string, string> = {
  [LANG.EN_US]: 'English',
  [LANG.ZH_CN]: '简体中文',
  [LANG.ZH_TW]: '繁體中文',
  [LANG.RU_RU]: 'Русский',
}
</script>
