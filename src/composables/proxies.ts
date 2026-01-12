import { isSingBox } from '@/api'
import { GLOBAL, PROXY_TAB_TYPE } from '@/constant'
import { isHiddenGroup } from '@/helper'
import { configs } from '@/store/config'
import { proxiesTabShow, proxyGroupList, proxyMap, proxyProviederList } from '@/store/proxies'
import {
  customGlobalNode,
  displayGlobalByMode,
  manageHiddenGroup,
  minProxyCardWidth,
} from '@/store/settings'
import { isEmpty } from 'lodash'
import { computed, ref } from 'vue'

/**
 * 根据容器宽度和 padding 计算代理卡片网格列数
 */
export const calculateGridColumns = (containerWidth: number, padding = 24): number => {
  const contentWidth = containerWidth - padding
  return Math.max(Math.floor(contentWidth / minProxyCardWidth.value), 2)
}

const filterGroups = (all: string[]) => {
  if (manageHiddenGroup.value) {
    return all
  }

  return all.filter((name) => !isHiddenGroup(name))
}

const getRenderGroups = () => {
  if (isEmpty(proxyMap.value)) {
    return []
  }

  if (proxiesTabShow.value === PROXY_TAB_TYPE.PROVIDER) {
    return proxyProviederList.value.map((group) => group.name)
  }

  if (displayGlobalByMode.value) {
    if (configs.value?.mode.toUpperCase() === GLOBAL) {
      return [
        isSingBox.value && proxyMap.value[customGlobalNode.value] ? customGlobalNode.value : GLOBAL,
      ]
    }

    return filterGroups(proxyGroupList.value)
  }

  return filterGroups([...proxyGroupList.value, GLOBAL])
}

export const disableProxiesPageScroll = ref(false)
export const isProxiesPageMounted = ref(false)
export const renderGroups = computed(() => {
  const groups = getRenderGroups()

  if (isProxiesPageMounted.value) {
    return groups
  }

  return groups.slice(0, 16)
})
