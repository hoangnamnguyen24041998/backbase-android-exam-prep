<script setup lang="ts">
import type { AnswerState, Question } from '@/models/exam.types'
import { ScoringService } from '@/services/scoring.service'

const props = defineProps<{
  questions: Question[]
  answers: Record<number, AnswerState>
  currentIndex: number
  isPracticeMode?: boolean
}>()

const emit = defineEmits<{
  (e: 'select', index: number): void
}>()

function isQuestionEvaluatedInPractice(q: Question): boolean {
  if (!props.isPracticeMode) return false
  const selected = props.answers[q.id]?.selectedIndices ?? []
  return selected.length >= q.correctAnswers.length
}

function isQuestionCorrect(q: Question): boolean {
  const selected = props.answers[q.id]?.selectedIndices ?? []
  return ScoringService.isAnswerCorrect(q, selected)
}

function isIncompleteMulti(q: Question): boolean {
  if (q.type !== 'multi') return false
  const selectedCount = props.answers[q.id]?.selectedIndices.length ?? 0
  return selectedCount > 0 && selectedCount < q.correctAnswers.length
}

function getCellTitle(q: Question, idx: number): string {
  const selectedCount = props.answers[q.id]?.selectedIndices.length ?? 0
  if (q.type === 'multi') {
    if (selectedCount > 0 && selectedCount < q.correctAnswers.length) {
      return `WARNING — Câu ${idx + 1} (Multiple Choice): Mới chọn ${selectedCount}/${q.correctAnswers.length} đáp án (còn thiếu ${q.correctAnswers.length - selectedCount})!`
    }
    return `Question ${idx + 1}: ${q.sectionName} (Multiple Choice: ${selectedCount}/${q.correctAnswers.length})`
  }
  return `Question ${idx + 1}: ${q.sectionName}`
}

function getCellClass(q: Question, index: number): string {
  const isCurrent = index === props.currentIndex
  const state = props.answers[q.id]
  const selectedCount = state?.selectedIndices.length ?? 0
  const isFullyAnswered = selectedCount >= q.correctAnswers.length
  const incompleteMulti = isIncompleteMulti(q)
  const isFlagged = state?.isFlagged ?? false

  const base =
    'relative h-9 w-full rounded-lg font-mono text-xs font-medium transition-all duration-150 flex items-center justify-center cursor-pointer select-none border'

  // In Practice Mode, color-code evaluated questions into Green (Correct) / Red (Incorrect)
  if (props.isPracticeMode && isQuestionEvaluatedInPractice(q)) {
    const correct = isQuestionCorrect(q)
    if (isCurrent) {
      return correct
        ? `${base} bg-emerald-600 text-white border-emerald-700 ring-2 ring-slate-900 ring-offset-1 font-bold`
        : `${base} bg-rose-600 text-white border-rose-700 ring-2 ring-slate-900 ring-offset-1 font-bold`
    }
    return correct
      ? `${base} bg-emerald-50 text-emerald-800 border-emerald-400 hover:bg-emerald-100 font-semibold`
      : `${base} bg-rose-50 text-rose-800 border-rose-400 hover:bg-rose-100 font-semibold`
  }

  // Highlight Multiple-Choice questions missing required answers in Warning Orange/Rose
  if (incompleteMulti) {
    if (isCurrent) {
      return `${base} bg-rose-600 text-white border-rose-700 ring-2 ring-slate-900 ring-offset-1 font-bold`
    }
    return `${base} bg-rose-50 text-rose-800 border-2 border-rose-500 hover:bg-rose-100 font-bold`
  }

  if (isCurrent) {
    if (isFlagged) {
      return `${base} bg-amber-500 text-white border-amber-600 ring-2 ring-slate-900 ring-offset-1 font-bold`
    }
    return props.isPracticeMode
      ? `${base} bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-600/30 ring-offset-1 font-bold`
      : `${base} bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/30 ring-offset-1 font-bold`
  }

  if (isFlagged && isFullyAnswered) {
    return `${base} bg-amber-50 text-amber-900 border-amber-400 hover:bg-amber-100`
  }

  if (isFlagged) {
    return `${base} bg-amber-50/70 text-amber-800 border-amber-300 border-dashed hover:bg-amber-100/80`
  }

  if (isFullyAnswered) {
    return props.isPracticeMode
      ? `${base} bg-indigo-50 text-indigo-800 border-indigo-300 hover:bg-indigo-100`
      : `${base} bg-slate-800 text-white border-slate-800 hover:bg-slate-700`
  }

  return `${base} bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900`
}
</script>

<template>
  <div
    class="bg-white rounded-xl border p-4 shadow-2xs transition-colors"
    :class="isPracticeMode ? 'border-indigo-200/90' : 'border-slate-200/90'"
  >
    <div class="flex items-center justify-between mb-3">
      <h3
        class="text-xs font-semibold uppercase tracking-wider"
        :class="isPracticeMode ? 'text-indigo-700' : 'text-slate-500'"
      >
        {{ isPracticeMode ? 'Bản đồ Luyện tập (Chấm trực tiếp)' : 'Question Navigator (70 Qs)' }}
      </h3>
      <span class="text-xs font-mono text-slate-400">
        #{{ currentIndex + 1 }} / {{ questions.length }}
      </span>
    </div>

    <!-- Responsive Grid of 70 numbers -->
    <div class="question-grid-cells">
      <button
        v-for="(q, idx) in questions"
        :key="q.id"
        type="button"
        :class="getCellClass(q, idx)"
        :title="getCellTitle(q, idx)"
        @click="emit('select', idx)"
      >
        <span>{{ idx + 1 }}</span>
        <!-- Small dot indicator if flagged -->
        <span
          v-if="answers[q.id]?.isFlagged"
          class="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
          :class="idx === currentIndex ? 'bg-white' : 'bg-amber-500'"
        />
        <!-- Warning exclamation badge if multi-choice question is missing required selections -->
        <span
          v-if="isIncompleteMulti(q)"
          class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center leading-none border border-white"
        >
          !
        </span>
      </button>
    </div>

    <!-- Legend: Different between Practice Mode vs Exam Mode -->
    <div
      v-if="isPracticeMode"
      class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-y-2 gap-x-3 text-[11px] text-slate-600"
    >
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-xs bg-emerald-100 border border-emerald-500 inline-block shrink-0" />
        <span>Trả lời Đúng</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-xs bg-rose-100 border border-rose-500 inline-block shrink-0" />
        <span>Sai / Chọn thiếu</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-xs bg-amber-100 border border-amber-400 inline-block shrink-0" />
        <span>Đánh dấu (Flag)</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-xs bg-indigo-600 ring-2 ring-indigo-300 inline-block shrink-0" />
        <span>Câu đang mở</span>
      </div>
    </div>

    <div
      v-else
      class="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-y-2 gap-x-3 text-[11px] text-slate-600"
    >
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-xs bg-slate-800 inline-block shrink-0" />
        <span>Answered (Đủ)</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-xs bg-rose-50 border-2 border-rose-500 inline-block shrink-0" />
        <span class="text-rose-700 font-semibold">Chọn thiếu (Multi)</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-xs bg-white border border-slate-300 inline-block shrink-0" />
        <span>Unanswered</span>
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-xs bg-amber-100 border border-amber-400 inline-block shrink-0" />
        <span>Flagged</span>
      </div>
    </div>
  </div>
</template>
