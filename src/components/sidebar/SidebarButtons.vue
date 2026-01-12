<template>
  <div :class="wrapperClass">
    <button
      class="btn btn-circle btn-sm bg-base-300"
      @click="showBackendSelectorDialog = true"
      @mouseenter="handlerMouseenterBackendSelector"
    >
      <ServerIcon class="h-5 w-5" />
    </button>
  </div>

  <DialogWrapper
    v-model="showBackendSelectorDialog"
    box-class="max-w-173"
    no-padding
  >
    <BackendSettings class="w-full" />
  </DialogWrapper>
</template>

<script setup lang="ts">
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import BackendSettings from '@/components/settings/BackendSettings.vue'
import { useTooltip } from '@/helper/tooltip'
import { getLabelFromBackend } from '@/helper/utils'
import { activeBackend } from '@/store/setup'
import { ServerIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'

const { showTip } = useTooltip()

const showBackendSelectorDialog = ref(false)
const wrapperClass = computed(() => 'flex flex-row-reverse items-center justify-center gap-2')

const handlerMouseenterBackendSelector = (e: MouseEvent) => {
  showTip(e, getLabelFromBackend(activeBackend.value!), { placement: 'right' })
}
</script>
