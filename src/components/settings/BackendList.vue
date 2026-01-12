<template>
  <div class="flex flex-col gap-2">
    <!-- 后端列表 -->
    <div
      v-for="backend in backendList"
      :key="backend.uuid"
      class="flex items-center gap-2 rounded-lg p-2 transition-colors"
      :class="[
        backend.uuid === activeUuid
          ? 'bg-primary/10 border-primary/30 border'
          : 'bg-base-200/50 hover:bg-base-200',
      ]"
    >
      <!-- 后端地址 -->
      <button
        class="hover:text-primary flex-1 cursor-pointer truncate text-left text-sm transition-colors"
        @click="switchBackend(backend.uuid)"
        :title="getLabelFromBackend(backend)"
      >
        {{ getLabelFromBackend(backend) }}
      </button>

      <!-- 版本号 -->
      <div class="text-base-content/60 flex min-w-fit items-center gap-1 text-xs">
        <template v-if="backend.uuid === activeUuid">
          <BackendVersion />
          <div
            v-if="isCoreUpdateAvailable"
            class="tooltip tooltip-left"
            :data-tip="$t('updateAvailable')"
          >
            <ArrowUpCircleIcon class="h-4 w-4" />
          </div>
        </template>
        <span
          v-else
          class="text-base-content/40"
          >-</span
        >
      </div>

      <!-- 编辑按钮 -->
      <button
        class="btn btn-ghost btn-xs btn-square"
        @click="openEditModal(backend.uuid)"
        :title="$t('editBackend')"
      >
        <PencilIcon class="h-4 w-4" />
      </button>
    </div>

    <!-- 编辑后端 Modal -->
    <EditBackendModal
      v-model="showEditModal"
      :defaultBackendUuid="editingBackendUuid"
    />
  </div>
</template>

<script setup lang="ts">
import { isCoreUpdateAvailable } from '@/api'
import BackendVersion from '@/components/common/BackendVersion.vue'
import { getLabelFromBackend } from '@/helper/utils'
import { activeUuid, backendList } from '@/store/setup'
import { ArrowUpCircleIcon, PencilIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import EditBackendModal from './EditBackendModal.vue'

const showEditModal = ref(false)
const editingBackendUuid = ref<string | undefined>(undefined)

const switchBackend = (uuid: string) => {
  activeUuid.value = uuid
}

const openEditModal = (uuid: string) => {
  editingBackendUuid.value = uuid
  showEditModal.value = true
}
</script>
