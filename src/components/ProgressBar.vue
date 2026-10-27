<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  answeredCount: number
  totalCount: number
  flaggedCount?: number
}>()

const percentage = computed(() => {
  if (props.totalCount <= 0) return 0
  return Math.min(100, Math.round((props.answeredCount / props.totalCount) * 100))
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
      <div class="flex items-center gap-2">
        <span>Tiến độ hoàn thành</span>
        <span class="font-mono font-semibold text-slate-900">
          {{ answeredCount }}/{{ totalCount }} câu
        </span>
      </div>
      <div class="flex items-center gap-3">
        <span v-if="flaggedCount && flaggedCount > 0" class="text-amber-600 font-medium">
          {{ flaggedCount }} đánh dấu
        </span>
        <span class="font-mono text-slate-700 font-semibold">{{ percentage }}%</span>
      </div>
    </div>

    <div class="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
      <div
        class="h-full bg-slate-900 rounded-full transition-all duration-300 ease-out"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>
