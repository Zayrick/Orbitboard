import { isMiddleScreen } from '@/helper/utils'
import { computed, ref } from 'vue'

export const ctrlsHeight = ref(64)
export const dockTop = ref(0)
export const usePaddingForViews = (config?: { offsetTop?: number; offsetBottom?: number }) => {
  const { offsetTop = 0, offsetBottom = 0 } = config ?? {}
  const baseOffset = 8
  const paddingTop = computed(() => {
    if (ctrlsHeight.value === 0) {
      return offsetTop + baseOffset
    }
    return offsetTop + ctrlsHeight.value + baseOffset
  })

  const paddingBottom = computed(() => {
    if (isMiddleScreen.value) {
      return offsetBottom + dockTop.value + baseOffset
    }
    return offsetBottom + baseOffset
  })

  const padding = computed(() => {
    return {
      paddingTop: `${paddingTop.value}px`,
      paddingBottom: `${paddingBottom.value}px`,
    }
  })

  return {
    padding,
    paddingTop,
    paddingBottom,
  }
}
