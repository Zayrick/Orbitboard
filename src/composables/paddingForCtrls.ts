import { computed, ref } from 'vue'

export const ctrlsHeight = ref(64)
export const usePaddingForCtrls = (offset = 0) => {
  const padding = computed(() => {
    return {
      paddingTop: `${offset + ctrlsHeight.value + 16}px`,
    }
  })
  return {
    padding,
  }
}
