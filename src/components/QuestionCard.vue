<script setup lang="ts">
import { computed } from 'vue'
import {
  Flag,
  CheckCircle2,
  XCircle,
  Circle,
  Square,
  CheckSquare,
  HelpCircle,
  Lightbulb,
  CheckCheck,
  RotateCcw,
  Sparkles,
  Lock,
  AlertTriangle
} from 'lucide-vue-next'
import { EXAM_SECTIONS, type Question } from '@/models/exam.types'
import { ScoringService } from '@/services/scoring.service'

const props = defineProps<{
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedIndices: number[]
  isFlagged: boolean
  isPracticeMode?: boolean
  showExplanation?: boolean
  maxLimitWarning?: string | null
}>()

const emit = defineEmits<{
  (e: 'selectOption', index: number): void
  (e: 'applyCorrect'): void
  (e: 'resetSelection'): void
  (e: 'toggleFlag'): void
  (e: 'toggleExplanation'): void
}>()

const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F']

const sectionBadgeClass = computed(() => {
  switch (props.question.section) {
    case 'fundamentals':
      return 'bg-slate-100 text-slate-700 border-slate-200'
    case 'architecture':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
    case 'setup':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
    case 'adopt':
      return 'bg-amber-50 text-amber-800 border-amber-200/80'
    case 'extend':
      return 'bg-sky-50 text-sky-800 border-sky-200/80'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
})

const sectionMeta = computed(() => EXAM_SECTIONS[props.question.section])

const isMultiQuestion = computed(() => props.question.type === 'multi')
const requiredCount = computed(() => props.question.correctAnswers.length)
const selectedCount = computed(() => props.selectedIndices.length)
const missingCount = computed(() => Math.max(0, requiredCount.value - selectedCount.value))
const isMultiMissingAnswers = computed(
  () => isMultiQuestion.value && selectedCount.value > 0 && selectedCount.value < requiredCount.value
)
const isMultiNotStarted = computed(
  () => isMultiQuestion.value && selectedCount.value === 0
)

const isCurrentAnswerCorrect = computed(() =>
  ScoringService.isAnswerCorrect(props.question, props.selectedIndices)
)

/**
 * In Practice Mode: automatically evaluate and highlight as soon as user selects
 * the required number of answers (or manually clicks "Xem đáp án").
 * In Exam Mode: NEVER evaluate on the card (only evaluate after submitting the exam).
 */
const isPracticeEvaluated = computed(() => {
  if (!props.isPracticeMode) return false
  if (props.showExplanation) return true
  return props.selectedIndices.length >= props.question.correctAnswers.length
})

const correctLettersText = computed(() =>
  props.question.correctAnswers.map((idx) => optionLetters[idx]).join(', ')
)

const selectedLettersText = computed(() =>
  props.selectedIndices.map((idx) => optionLetters[idx]).join(', ')
)

function isSelected(idx: number): boolean {
  return props.selectedIndices.includes(idx)
}

function isOptionCorrect(idx: number): boolean {
  return props.question.correctAnswers.includes(idx)
}

function getOptionCardClass(idx: number): string {
  const selected = isSelected(idx)
  const correct = isOptionCorrect(idx)

  if (isPracticeEvaluated.value) {
    if (selected && correct) {
      return 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/30 shadow-2xs'
    }
    if (selected && !correct) {
      return 'bg-rose-50 border-2 border-rose-500 text-rose-950 ring-1 ring-rose-500/30 shadow-2xs'
    }
    if (!selected && correct) {
      return 'bg-emerald-50/75 border-2 border-dashed border-emerald-500 text-emerald-950 ring-2 ring-emerald-400/40'
    }
    return 'bg-white border border-slate-200 text-slate-500 opacity-80'
  }

  // Normal Exam Mode selection (or before finishing selection in Practice Mode)
  if (selected) {
    return props.isPracticeMode
      ? 'bg-indigo-50/60 border-2 border-indigo-600 ring-1 ring-indigo-600/20 text-slate-900'
      : 'bg-slate-900/[0.04] border-2 border-slate-900 ring-1 ring-slate-900/20 text-slate-900'
  }

  return 'bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-50/60 text-slate-700'
}
</script>

<template>
  <article
    class="bg-white rounded-2xl border shadow-2xs overflow-hidden transition-all"
    :class="
      isPracticeMode
        ? 'border-indigo-200/90 ring-1 ring-indigo-500/10'
        : 'border-slate-200/90'
    "
  >
    <!-- Top Meta Bar (Distinct visual styling between Exam Mode vs Practice Mode) -->
    <div
      class="question-card-header"
      :class="isPracticeMode ? 'bg-indigo-50/60 border-b border-indigo-100' : ''"
    >
      <div class="flex flex-wrap items-center gap-2">
        <span
          class="font-mono text-xs font-bold px-2.5 py-1 rounded-md text-white"
          :class="isPracticeMode ? 'bg-indigo-600' : 'bg-slate-900'"
        >
          Question {{ questionNumber }} / {{ totalQuestions }}
        </span>

        <span
          class="text-xs font-medium px-2.5 py-1 rounded-md border"
          :class="sectionBadgeClass"
        >
          {{ sectionMeta.name }}
        </span>

        <span
          class="text-xs px-2.5 py-1 rounded-md border inline-flex items-center gap-1.5"
          :class="
            question.type !== 'multi'
              ? 'font-medium bg-slate-100 text-slate-600 border-slate-200'
              : isMultiMissingAnswers
                ? 'font-bold bg-rose-600 text-white border-rose-700'
                : isMultiNotStarted
                  ? 'font-semibold bg-amber-50 text-amber-900 border-amber-300'
                  : 'font-semibold bg-emerald-50 text-emerald-800 border-emerald-300'
          "
        >
          <AlertTriangle
            v-if="question.type === 'multi' && selectedCount < requiredCount"
            class="w-3.5 h-3.5 shrink-0"
          />
          <CheckCircle2
            v-else-if="question.type === 'multi' && selectedCount >= requiredCount"
            class="w-3.5 h-3.5 shrink-0"
          />
          <span>
            {{
              question.type !== 'multi'
                ? 'Single Choice (Select 1)'
                : isMultiMissingAnswers
                  ? `WARNING: Chọn thiếu (${selectedCount}/${requiredCount} — Thiếu ${missingCount})`
                  : isMultiNotStarted
                    ? `Multiple Choice (Chọn đủ ${requiredCount} câu — 0/${requiredCount})`
                    : `Multiple Choice (Đã chọn đủ ${selectedCount}/${requiredCount})`
            }}
          </span>
        </span>
      </div>

      <div class="flex items-center gap-2">
        <!-- Mode Badge -->
        <span
          v-if="isPracticeMode"
          class="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200"
        >
          <Sparkles class="w-3 h-3" />
          <span>Chấm tự động</span>
        </span>
        <span
          v-else
          class="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
        >
          <Lock class="w-3 h-3" />
          <span>Exam Mode</span>
        </span>

        <!-- Flag Button -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer shrink-0"
          :class="
            isFlagged
              ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
          "
          @click="emit('toggleFlag')"
        >
          <Flag class="w-3.5 h-3.5" :class="isFlagged ? 'fill-amber-500 text-amber-600' : ''" />
          <span>
            {{
              isPracticeMode
                ? isFlagged
                  ? 'Đã cắm cờ'
                  : 'Cắm cờ (Flag)'
                : isFlagged
                  ? 'Flagged'
                  : 'Flag for Review'
            }}
          </span>
        </button>
      </div>
    </div>

    <!-- Question Body -->
    <div class="question-card-body">
      <h2 class="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed mb-4 break-words">
        {{ question.question }}
      </h2>

      <!-- MULTIPLE CHOICE SELECTION REQUIREMENT & MISSING-ANSWER WARNING BANNER -->
      <div
        v-if="isMultiQuestion && !isPracticeEvaluated"
        role="alert"
        class="mb-4 p-3.5 rounded-xl border-2 flex items-start gap-3 transition-colors"
        :class="
          isMultiMissingAnswers
            ? 'bg-rose-50 border-rose-500 text-rose-950'
            : isMultiNotStarted
              ? 'bg-amber-50/90 border-amber-400 text-amber-950'
              : 'bg-emerald-50/80 border-emerald-400 text-emerald-950'
        "
      >
        <AlertTriangle
          v-if="selectedCount < requiredCount"
          class="w-5 h-5 shrink-0 mt-0.5"
          :class="isMultiMissingAnswers ? 'text-rose-600' : 'text-amber-600'"
        />
        <CheckCircle2 v-else class="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />

        <div class="space-y-1 text-xs flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="font-bold uppercase tracking-wide px-2 py-0.5 rounded text-[11px]"
              :class="
                isMultiMissingAnswers
                  ? 'bg-rose-600 text-white'
                  : isMultiNotStarted
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 text-white'
              "
            >
              {{
                isMultiMissingAnswers
                  ? 'WARNING — CHỌN THIẾU ĐÁP ÁN!'
                  : isMultiNotStarted
                    ? `CẢNH BÁO MULTIPLE CHOICE — PHẢI CHỌN ĐỦ ${requiredCount} CÂU`
                    : `ĐÃ CHỌN ĐỦ ${selectedCount}/${requiredCount} ĐÁP ÁN`
              }}
            </span>
            <span class="font-mono font-bold">
              Đã chọn: {{ selectedCount }}/{{ requiredCount }}
            </span>
          </div>

          <p v-if="isMultiMissingAnswers" class="font-semibold text-rose-900">
            Câu này bắt buộc chọn đủ <strong>{{ requiredCount }}</strong> phương án. Bạn mới chọn
            <strong>{{ selectedCount }}/{{ requiredCount }}</strong> — còn thiếu
            <strong>{{ missingCount }}</strong> đáp án nữa! Nếu để thiếu câu này sẽ không được tính điểm.
          </p>
          <p v-else-if="isMultiNotStarted" class="font-medium text-amber-900">
            Đây là câu hỏi nhiều lựa chọn (Multiple Choice): Bạn phải chọn đủ
            <strong>{{ requiredCount }}</strong> đáp án (hiện đang chọn <strong>0/{{ requiredCount }}</strong>).
          </p>
          <p v-else class="font-medium text-emerald-900">
            Bạn đã chọn đủ <strong>{{ selectedCount }}/{{ requiredCount }}</strong> phương án cần thiết cho câu hỏi này.
          </p>

          <p
            v-if="maxLimitWarning"
            class="mt-1 pt-1 border-t border-emerald-300/70 font-semibold text-amber-800"
          >
            {{ maxLimitWarning }}
          </p>
        </div>
      </div>

      <!-- Options List -->
      <div class="space-y-3">
        <button
          v-for="(optionText, idx) in question.options"
          :key="idx"
          type="button"
          class="question-option-btn cursor-pointer group"
          :class="getOptionCardClass(idx)"
          @click="emit('selectOption', idx)"
        >
          <div class="flex items-start gap-3 flex-1 min-w-0">
            <!-- Radio / Checkbox Icon -->
            <div class="mt-0.5 shrink-0">
              <template v-if="isPracticeEvaluated">
                <CheckCircle2
                  v-if="isSelected(idx) && isOptionCorrect(idx)"
                  class="w-5 h-5 text-emerald-600"
                />
                <XCircle
                  v-else-if="isSelected(idx) && !isOptionCorrect(idx)"
                  class="w-5 h-5 text-rose-600"
                />
                <CheckCircle2
                  v-else-if="!isSelected(idx) && isOptionCorrect(idx)"
                  class="w-5 h-5 text-emerald-600 animate-bounce"
                />
                <Circle
                  v-else-if="question.type === 'single'"
                  class="w-5 h-5 text-slate-300"
                />
                <Square
                  v-else
                  class="w-5 h-5 text-slate-300"
                />
              </template>
              <template v-else-if="question.type === 'single'">
                <CheckCircle2
                  v-if="isSelected(idx)"
                  class="w-5 h-5"
                  :class="isPracticeMode ? 'text-indigo-600' : 'text-slate-900'"
                />
                <Circle
                  v-else
                  class="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors"
                />
              </template>
              <template v-else>
                <CheckSquare
                  v-if="isSelected(idx)"
                  class="w-5 h-5"
                  :class="isPracticeMode ? 'text-indigo-600' : 'text-slate-900'"
                />
                <Square
                  v-else
                  class="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors"
                />
              </template>
            </div>

            <!-- Option Letter & Text -->
            <div class="question-option-text">
              <span
                class="font-mono font-bold mr-2"
                :class="
                  isPracticeEvaluated && isOptionCorrect(idx)
                    ? 'text-emerald-700'
                    : isPracticeEvaluated && isSelected(idx) && !isOptionCorrect(idx)
                      ? 'text-rose-700'
                      : 'text-slate-500'
                "
              >
                {{ optionLetters[idx] }}.
              </span>
              <span
                :class="
                  isPracticeEvaluated && isOptionCorrect(idx)
                    ? 'font-semibold text-emerald-950'
                    : isPracticeEvaluated && isSelected(idx) && !isOptionCorrect(idx)
                      ? 'font-medium text-rose-900 line-through decoration-rose-400/70'
                      : isSelected(idx)
                        ? 'font-semibold text-slate-900'
                        : ''
                "
              >
                {{ optionText }}
              </span>
            </div>
          </div>

          <!-- Right Status Badge -->
          <div class="shrink-0 flex items-center gap-1.5 self-end sm:self-center">
            <span
              v-if="!isPracticeEvaluated && isSelected(idx)"
              class="px-2 py-0.5 rounded text-[11px] font-semibold text-white"
              :class="isPracticeMode ? 'bg-indigo-600' : 'bg-slate-900'"
            >
              {{ isPracticeMode ? 'Đã chọn' : 'Selected' }}
            </span>

            <template v-if="isPracticeEvaluated">
              <span
                v-if="isSelected(idx) && isOptionCorrect(idx)"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600 text-white shadow-2xs"
              >
                <CheckCircle2 class="w-3.5 h-3.5" />
                <span>Bạn chọn đúng</span>
              </span>

              <span
                v-else-if="isSelected(idx) && !isOptionCorrect(idx)"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-600 text-white shadow-2xs"
              >
                <XCircle class="w-3.5 h-3.5" />
                <span>Đáp án sai</span>
              </span>

              <span
                v-else-if="!isSelected(idx) && isOptionCorrect(idx)"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-400 shadow-2xs"
              >
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-700" />
                <span>Đáp án đúng (Cần chọn)</span>
              </span>
            </template>
          </div>
        </button>
      </div>

      <!-- PRACTICE MODE ONLY: Instant Feedback Bar + Vietnamese Explanation -->
      <div v-if="isPracticeMode" class="mt-6 pt-5 border-t border-indigo-100 space-y-4">
        <!-- Instant Correction Banner when evaluated -->
        <div
          v-if="isPracticeEvaluated"
          class="p-3.5 sm:p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          :class="
            isCurrentAnswerCorrect
              ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
              : 'bg-rose-50/90 border-rose-300 text-rose-950'
          "
        >
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded"
                :class="
                  isCurrentAnswerCorrect
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                "
              >
                <CheckCircle2 v-if="isCurrentAnswerCorrect" class="w-3.5 h-3.5" />
                <XCircle v-else class="w-3.5 h-3.5" />
                <span>
                  {{ isCurrentAnswerCorrect ? 'CHÍNH XÁC!' : 'CHƯA CHÍNH XÁC' }}
                </span>
              </span>

              <span class="text-xs font-mono font-semibold">
                Bạn chọn: <strong>{{ selectedLettersText || 'Chưa chọn' }}</strong> • Đáp án đúng: <strong class="text-emerald-700 underline">{{ correctLettersText }}</strong>
              </span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <button
              v-if="!isCurrentAnswerCorrect"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer shadow-2xs"
              @click="emit('applyCorrect')"
            >
              <CheckCheck class="w-3.5 h-3.5 shrink-0" />
              <span>Chọn lại đáp án đúng ({{ correctLettersText }})</span>
            </button>

            <button
              v-if="selectedIndices.length > 0"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              @click="emit('resetSelection')"
            >
              <RotateCcw class="w-3.5 h-3.5 shrink-0" />
              <span>Làm lại câu này</span>
            </button>
          </div>
        </div>

        <!-- Manual Peek Button if user hasn't picked all options yet -->
        <div v-else class="flex items-center justify-between">
          <span class="text-xs text-indigo-700 font-medium">
            💡 Chế độ Luyện tập: Chọn đủ số đáp án để tự động chấm Đúng/Sai và mở giải thích Tiếng Việt.
          </span>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition-colors cursor-pointer shrink-0"
            @click="emit('toggleExplanation')"
          >
            <Lightbulb class="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Xem đáp án trước</span>
          </button>
        </div>

        <!-- Vietnamese Technical Explanation Box -->
        <div
          v-if="isPracticeEvaluated"
          class="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/80 text-sm text-slate-800 leading-relaxed"
        >
          <div class="flex items-center gap-2 font-bold text-indigo-950 mb-1.5">
            <HelpCircle class="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Giải thích kỹ thuật (Tiếng Việt):</span>
          </div>
          <p>{{ question.explanation }}</p>
        </div>
      </div>
    </div>
  </article>
</template>
