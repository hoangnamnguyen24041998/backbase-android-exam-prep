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
  Lightbulb
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
}>()

const emit = defineEmits<{
  (e: 'selectOption', index: number): void
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

const isCurrentAnswerCorrect = computed(() =>
  ScoringService.isAnswerCorrect(props.question, props.selectedIndices)
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

  if (props.showExplanation) {
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

  // Normal selection state while taking the exam
  if (selected) {
    return 'bg-slate-900/[0.04] border-2 border-slate-900 ring-1 ring-slate-900/20 text-slate-900'
  }

  return 'bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-50/60 text-slate-700'
}
</script>

<template>
  <article class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all">
    <!-- Top Meta Bar -->
    <div class="question-card-header">
      <div class="flex flex-wrap items-center gap-2">
        <span class="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 text-white">
          Câu {{ questionNumber }} / {{ totalQuestions }}
        </span>

        <span
          class="text-xs font-medium px-2.5 py-1 rounded-md border"
          :class="sectionBadgeClass"
        >
          {{ sectionMeta.name }}
        </span>

        <span
          class="text-xs font-medium px-2.5 py-1 rounded-md border"
          :class="
            question.type === 'multi'
              ? 'bg-violet-50 text-violet-700 border-violet-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          "
        >
          {{
            question.type === 'multi'
              ? `Multiple Response (Chọn ${question.correctAnswers.length} đáp án — Đã chọn ${selectedIndices.length})`
              : 'Single Choice (Chọn 1 đáp án)'
          }}
        </span>
      </div>

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
        <span>{{ isFlagged ? 'Đã cắm cờ xem lại' : 'Cắm cờ (Flag)' }}</span>
      </button>
    </div>

    <!-- Question Body -->
    <div class="question-card-body">
      <h2 class="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed mb-5 break-words">
        {{ question.question }}
      </h2>

      <!-- Options List (Normal selection while taking exam) -->
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
              <template v-if="showExplanation">
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
                  class="w-5 h-5 text-slate-900"
                />
                <Circle
                  v-else
                  class="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors"
                />
              </template>
              <template v-else>
                <CheckSquare
                  v-if="isSelected(idx)"
                  class="w-5 h-5 text-slate-900"
                />
                <Square
                  v-else
                  class="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors"
                />
              </template>
            </div>

            <!-- Option Letter & Text -->
            <div class="question-option-text">
              <span class="font-mono font-bold mr-2 text-slate-500">
                {{ optionLetters[idx] }}.
              </span>
              <span
                :class="
                  showExplanation && isSelected(idx) && !isOptionCorrect(idx)
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

          <!-- Badge when selected or when checking explanation -->
          <div class="shrink-0 flex items-center gap-1.5 self-end sm:self-center">
            <span
              v-if="!showExplanation && isSelected(idx)"
              class="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-900 text-white"
            >
              Đã chọn
            </span>

            <template v-if="showExplanation">
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

      <!-- Practice Mode Instant Check Toggle -->
      <div v-if="isPracticeMode" class="mt-6 pt-5 border-t border-slate-100">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            @click="emit('toggleExplanation')"
          >
            <Lightbulb class="w-4 h-4 text-amber-600 shrink-0" />
            <span>{{ showExplanation ? 'Ẩn giải thích kỹ thuật' : 'Kiểm tra đáp án & Xem giải thích ngay' }}</span>
          </button>

          <span
            v-if="showExplanation && selectedIndices.length > 0"
            class="text-xs font-semibold px-2.5 py-1 rounded-md"
            :class="
              isCurrentAnswerCorrect
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            "
          >
            {{ isCurrentAnswerCorrect ? 'Chính xác!' : 'Chưa chính xác' }}
          </span>
        </div>

        <div
          v-if="showExplanation"
          class="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-sm text-slate-700 leading-relaxed"
        >
          <div class="flex items-center gap-2 font-semibold text-slate-900 mb-1.5">
            <HelpCircle class="w-4 h-4 text-slate-700 shrink-0" />
            <span>Giải thích chuẩn kiến trúc Backbase:</span>
          </div>
          <p>{{ question.explanation }}</p>
        </div>
      </div>
    </div>
  </article>
</template>
