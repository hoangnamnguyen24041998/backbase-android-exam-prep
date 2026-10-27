<script setup lang="ts">
import { computed } from 'vue'
import { Clock, AlertTriangle } from 'lucide-vue-next'

const props = defineProps<{
  remainingSeconds: number
}>()

// Warning threshold: under 5 minutes (300 seconds)
const isCritical = computed(() => props.remainingSeconds <= 300)
const isWarning = computed(() => props.remainingSeconds > 300 && props.remainingSeconds <= 900)

const formattedTime = computed(() => {
  const safeSecs = Math.max(0, props.remainingSeconds)
  const minutes = Math.floor(safeSecs / 60)
  const seconds = safeSecs % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})
</script>

<template>
  <div
    class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono text-sm font-semibold transition-all duration-300"
    :class="[
      isCritical
        ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse shadow-xs'
        : isWarning
          ? 'bg-amber-50 border-amber-300 text-amber-800'
          : 'bg-slate-100/80 border-slate-200/80 text-slate-800'
    ]"
    title="Thời gian làm bài còn lại (90 phút)"
  >
    <AlertTriangle v-if="isCritical" class="w-4 h-4 text-rose-600 shrink-0" />
    <Clock v-else class="w-4 h-4 shrink-0" :class="isWarning ? 'text-amber-600' : 'text-slate-500'" />
    <span class="tracking-wider">{{ formattedTime }}</span>
  </div>
</template>
