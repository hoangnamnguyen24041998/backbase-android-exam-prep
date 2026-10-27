<script setup lang="ts">
import type { AnswerState, Question } from '@/models/exam.types'

const props = defineProps<{
  questions: Question[]
  answers: Record<number, AnswerState>
  currentIndex: number
}>()

const emit = defineEmits<{
  (e: 'select', index: number): void
}>()

function getCellClass(q: Question, index: number): string {
  const isCurrent = index === props.currentIndex
  const state = props.answers[q.id]
  const isAnswered = (state?.selectedIndices.length ?? 0) > 0
  const isFlagged = state?.isFlagged ?? false

  const base =
    'relative h-9 w-full rounded-lg font-mono text-xs font-medium transition-all duration-150 flex items-center justify-center cursor-pointer select-none border'

  if (isCurrent) {
    if (isFlagged) {
      return `${base} bg-amber-500 text-white border-amber-600 ring-2 ring-slate-900 ring-offset-1 font-bold`
    }
    return `${base} bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/30 ring-offset-1 font-bold`
  }

  if (isFlagged && isAnswered) {
    return `${base} bg-amber-50 text-amber-900 border-amber-400 hover:bg-amber-100`
  }

  if (isFlagged) {
    return `${base} bg-amber-50/70 text-amber-800 border-amber-300 border-dashed hover:bg-amber-100/80`
  }

  if (isAnswered) {
    return `${base} bg-slate-800 text-white border-slate-800 hover:bg-slate-700`
  }

  return `${base} bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900`
}
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Bản đồ 70 câu hỏi
      </h3>
      <span class="text-xs font-mono text-slate-400">
        #{{ currentIndex + 1 }} / {{ questions.length }}
      </span>
    </div>

    <!-- Responsive Grid of 70 numbers (Desktop: 7 cols, Tablet: 10 cols, Mobile: 7 / 5 cols) -->
    <div class="question-grid-cells">
      <button
        v-for="(q, idx) in questions"
        :key="q.id"
        type="button"
        :class="getCellClass(q, idx)"
        :title="`Câu ${idx + 1}: ${q.sectionName}`"
        @click="emit('select', idx)"
      >
        <span>{{ idx + 1 }}</span>
        <!-- Small dot indicator if flagged -->
        <span
          v-if="answers[q.id]?.isFlagged"
          class="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
          :class="idx === currentIndex ? 'bg-white' : 'bg-amber-500'"
        />
      </button>
    </div>

    <!-- Legend -->
    <div class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-y-2 gap-x-3 text-[11px] text-slate-600">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-xs bg-slate-800 inline-block shrink-0" />
        <span>Đã trả lời</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-xs bg-white border border-slate-300 inline-block shrink-0" />
        <span>Chưa làm</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-xs bg-amber-100 border border-amber-400 inline-block shrink-0" />
        <span>Đánh dấu (Flag)</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-xs bg-slate-900 ring-2 ring-slate-400 inline-block shrink-0" />
        <span>Đang chọn</span>
      </div>
    </div>
  </div>
</template>
