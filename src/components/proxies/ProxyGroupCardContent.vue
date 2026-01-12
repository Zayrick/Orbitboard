<template>
  <div class="relative p-3">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <ProxyInlineDots
        v-if="showInlineDots"
        :nodes="renderProxies"
        :active="proxyGroup.now"
        :group-name="proxyGroup.name"
      />
    </Transition>

    <div class="relative z-10 flex gap-2">
      <div
        v-if="proxyGroup.icon"
        class="flex shrink-0 items-center"
      >
        <ProxyIcon
          :icon="proxyGroup.icon"
          :size="proxyGroupIconSize"
          :margin="proxyGroupIconMargin"
        />
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-[2px]">
        <div class="relative flex items-center gap-2">
          <div class="flex min-w-0 flex-1 items-center gap-1">
            <ProxyName
              :name="name"
              :icon-size="proxyGroupIconSize"
              :icon-margin="proxyGroupIconMargin"
              :show-icon="false"
            />
            <span class="text-base-content/60 shrink-0 text-xs"> ({{ proxiesCount }}) </span>
            <button
              v-if="manageHiddenGroup"
              class="btn btn-circle btn-xs z-10 ml-1 shrink-0"
              @click.stop="emit('toggleHidden')"
            >
              <EyeIcon
                v-if="!hiddenGroup"
                class="h-3 w-3"
              />
              <EyeSlashIcon
                v-else
                class="h-3 w-3"
              />
            </button>
          </div>
          <LatencyTag
            :class="twMerge('bg-base-200/50 hover:bg-base-200 z-10')"
            :loading="isLatencyTesting"
            :name="proxyGroup.now"
            :group-name="proxyGroup.name"
            @click.stop="emit('latencyTest')"
          />
        </div>

        <div class="text-base-content/80 flex items-center gap-2">
          <div class="flex min-w-0 flex-1 items-center gap-1 truncate text-sm">
            <ProxyGroupNow :name="name" />
          </div>
          <div class="min-w-12 shrink-0 text-right text-xs">
            {{ prettyBytesHelper(downloadTotal) }}/s
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Preview -->
  <div
    v-if="showPreview"
    class="px-3 pb-3"
  >
    <ProxyPreview
      :nodes="renderProxies"
      :now="proxyGroup.now"
      :groupName="proxyGroup.name"
      @nodeclick="(node: string) => emit('nodeClick', node)"
    />
  </div>
</template>

<script setup lang="ts">
import { prettyBytesHelper } from '@/helper/utils'
import { manageHiddenGroup, proxyGroupIconMargin, proxyGroupIconSize } from '@/store/settings'
import type { Proxy } from '@/types'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { twMerge } from 'tailwind-merge'
import LatencyTag from './LatencyTag.vue'
import ProxyGroupNow from './ProxyGroupNow.vue'
import ProxyIcon from './ProxyIcon.vue'
import ProxyInlineDots from './ProxyInlineDots.vue'
import ProxyName from './ProxyName.vue'
import ProxyPreview from './ProxyPreview.vue'

defineProps<{
  name: string
  proxyGroup: Proxy
  proxiesCount: string
  renderProxies: string[]
  showInlineDots: boolean
  showPreview: boolean
  isLatencyTesting: boolean
  downloadTotal: number
  hiddenGroup: boolean
}>()

const emit = defineEmits<{
  latencyTest: []
  toggleHidden: []
  nodeClick: [node: string]
}>()
</script>
