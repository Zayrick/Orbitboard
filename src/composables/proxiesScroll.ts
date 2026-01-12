import { PROXY_NODE_CARD_MIN_WIDTH, PROXY_NODE_CARD_PAGE_ROWS } from '@/constant'
import { findScrollableParent } from '@/helper/utils'
import { useCurrentElement, useElementSize, useInfiniteScroll } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, watch } from 'vue'

export const useCalculateMaxProxies = (totalProxies: number, activeIndex: number) => {
  const el = useCurrentElement()
  const { width } = useElementSize(el)
  const initMaxProxies = computed(() => {
    return (
      Math.max(Math.floor(width.value / PROXY_NODE_CARD_MIN_WIDTH), 2) * PROXY_NODE_CARD_PAGE_ROWS
    )
  })
  const maxProxies = ref(Math.max(24, activeIndex + 12))

  onMounted(() => {
    watch(
      initMaxProxies,
      () => {
        maxProxies.value = Math.max(maxProxies.value, initMaxProxies.value)
      },
      { immediate: true },
    )

    nextTick(() => {
      const scrollEl = findScrollableParent(el.value as HTMLElement)

      useInfiniteScroll(
        scrollEl,
        () => {
          maxProxies.value = Math.min((maxProxies.value += initMaxProxies.value), totalProxies)
        },
        {
          distance: 100,
          canLoadMore: () => {
            return maxProxies.value < totalProxies
          },
        },
      )
    })
  })

  return {
    maxProxies,
  }
}
