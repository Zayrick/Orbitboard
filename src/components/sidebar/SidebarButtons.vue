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
    box-class="max-w-md"
  >
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2 text-lg font-semibold">
        <ServerIcon class="h-5 w-5" />
        {{ $t('selectBackend') }}
      </div>
      <BackendSwitch />
    </div>
  </DialogWrapper>
</template>

<script setup lang="ts">
import DialogWrapper from '@/components/common/DialogWrapper.vue'
import BackendSwitch from '@/components/settings/BackendSwitch.vue'
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
