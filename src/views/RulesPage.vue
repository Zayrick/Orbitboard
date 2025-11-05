<template>
  <div
    class="flex flex-col gap-1 overflow-x-hidden"
    :class="dontNeedVirtualScroller && 'p-2'"
    :style="dontNeedVirtualScroller && padding"
  >
    <template v-if="rulesTabShow === RULE_TAB_TYPE.PROVIDER">
      <RuleProvider
        v-for="(ruleProvider, index) in renderRulesProvider"
        :key="ruleProvider.name"
        :ruleProvider="ruleProvider"
        :index="index + 1"
      />
    </template>
    <template v-else-if="dontNeedVirtualScroller">
      <RuleCard
        v-for="rule in renderRules"
        :key="rule.payload"
        :rule="rule"
        :index="rules.indexOf(rule) + 1"
      />
    </template>
    <VirtualScroller
      v-else
      :data="renderRules"
      :size="64"
    >
      <template v-slot="{ item: rule }: { item: Rule }">
        <RuleCard
          :key="rule.payload"
          :rule="rule"
          :index="rules.indexOf(rule) + 1"
        />
      </template>
    </VirtualScroller>
  </div>
</template>

<script setup lang="ts">
import VirtualScroller from '@/components/common/VirtualScroller.vue'
import RuleCard from '@/components/rules/RuleCard.vue'
import RuleProvider from '@/components/rules/RuleProvider.vue'
import { usePaddingForCtrls } from '@/composables/paddingForCtrls'
import { RULE_TAB_TYPE } from '@/constant'
import { fetchRules, renderRules, renderRulesProvider, rules, rulesTabShow } from '@/store/rules'
import type { Rule } from '@/types'
import { computed } from 'vue'

fetchRules()

const { padding } = usePaddingForCtrls()
const dontNeedVirtualScroller = computed(() => {
  return renderRules.value.length < 200
})
</script>
