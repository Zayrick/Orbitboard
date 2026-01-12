<template>
  <div
    class="sidebar bg-base-200 text-base-content scrollbar-hidden h-full w-64 overflow-x-hidden p-2"
  >
    <div class="flex h-full w-60 flex-col gap-2">
      <ul class="menu w-full flex-1">
        <li
          v-for="r in renderRoutes"
          :key="r"
        >
          <a
            :class="[r === route.name ? 'menu-active' : '', 'py-2']"
            @click.passive="() => router.push({ name: r })"
          >
            <component
              :is="ROUTE_ICON_MAP[r]"
              class="h-5 w-5"
            />
            {{ $t(r) }}
          </a>
        </li>
      </ul>
      <OverviewCarousel v-if="route.name !== ROUTE_NAME.overview" />
      <div class="card">
        <CommonSidebar />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommonSidebar from '@/components/sidebar/CommonCtrl.vue'
import { ROUTE_ICON_MAP, ROUTE_NAME } from '@/constant'
import { renderRoutes } from '@/helper'
import router from '@/router'
import { useRoute } from 'vue-router'
import OverviewCarousel from './OverviewCarousel.vue'

const route = useRoute()
</script>
