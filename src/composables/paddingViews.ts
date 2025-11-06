import { isMiddleScreen } from '@/helper/utils'
import { computed, ref } from 'vue'

export const ctrlsHeight = ref(64)
export const dockTop = ref(0)
export const usePaddingForViews = (offset = 0) => {
  const paddingTop = computed(() => {
    if (ctrlsHeight.value === 0) {
      return 8
    }
    return offset + ctrlsHeight.value + 16
  })

  const paddingBottom = computed(() => {
    if (isMiddleScreen.value) {
      return offset + dockTop.value + 8
    }
    return 8
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
