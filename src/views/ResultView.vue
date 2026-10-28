<script setup lang="ts">
import {
  Award,
  XCircle,
  CheckCircle2,
  Circle,
  Square,
  Clock,
  RotateCcw,
  Filter,
  Search,
  Flag,
  HelpCircle,
  History
} from 'lucide-vue-next'
import { EXAM_CONFIG, EXAM_SECTIONS, type SectionId } from '@/models/exam.types'
import { useExamViewModel } from '@/viewmodels/useExamViewModel'
import { useReviewViewModel, type ReviewStatusFilter } from '@/viewmodels/useReviewViewModel'

const { latestResult, openDedicatedExamTab, navigateTo } = useExamViewModel()

const {
  statusFilter,
  sectionFilter,
  searchQuery,
  filteredReviewItems,
  filterCounts,
  resetFilters,
  formatDuration
} = useReviewViewModel(latestResult)

const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F']

const statusTabs: Array<{ id: ReviewStatusFilter; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'incorrect', label: 'Câu làm sai' },
  { id: 'correct', label: 'Câu làm đúng' },
  { id: 'unanswered', label: 'Chưa trả lời' },
  { id: 'flagged', label: 'Đã cắm cờ' }
]

const sectionOptions = [
  { id: 'all' as const, label: 'Tất cả 5 Section' },
  ...(Object.keys(EXAM_SECTIONS) as SectionId[]).map((id) => ({
    id,
    label: EXAM_SECTIONS[id].name
  }))
]

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  } catch {
    return iso
  }
}

function getLettersList(indices: number[]): string {
  if (!indices || indices.length === 0) return 'Chưa chọn'
  return indices.map((i) => optionLetters[i]).join(', ')
}

function scrollToQuestionCard(questionId: number) {
  resetFilters()
  setTimeout(() => {
    const el = document.getElementById(`review-q-${questionId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 50)
}
</script>

<template>
  <div v-if="latestResult" class="space-y-6 sm:space-y-8">
    <!-- Top Summary Banner Card (Desktop-First Responsive) -->
    <section class="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-2xs">
      <div class="result-summary-top">
        <div class="flex items-start sm:items-center gap-4">
          <div
            class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border"
            :class="
              latestResult.passed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            "
          >
            <Award v-if="latestResult.passed" class="w-7 h-7 sm:w-8 sm:h-8" />
            <XCircle v-else class="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md"
                :class="
                  latestResult.passed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                "
              >
                {{ latestResult.passed ? 'PASSED — ĐẠT CHỨNG CHỈ' : 'FAILED — CHƯA ĐẠT NGƯỠNG 70%' }}
              </span>
              <span class="text-xs text-slate-400 font-mono">
                {{ formatDateTime(latestResult.completedAt) }}
              </span>
            </div>

            <h1 class="text-lg sm:text-2xl font-bold text-slate-900 mt-1.5">
              Kết quả bài thi Backbase Certified Android Developer
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
              Ngưỡng đỗ tiêu chuẩn: <strong>{{ EXAM_CONFIG.PASSING_SCORE }}/{{ EXAM_CONFIG.TOTAL_QUESTIONS }} câu ({{ EXAM_CONFIG.PASSING_PERCENTAGE }}%)</strong>
            </p>
          </div>
        </div>

        <!-- Score Circle & Quick Actions -->
        <div class="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto justify-between lg:justify-end">
          <div class="bg-slate-50 border border-slate-200/80 rounded-xl px-4 sm:px-5 py-3 text-left sm:text-right flex-1 sm:flex-initial">
            <div class="text-xl sm:text-3xl font-mono font-bold text-slate-900">
              {{ latestResult.correctCount }}<span class="text-slate-400 text-base sm:text-lg">/{{ latestResult.totalQuestions }}</span>
              <span
                class="ml-1.5 text-base sm:text-lg"
                :class="latestResult.passed ? 'text-emerald-600' : 'text-rose-600'"
              >
                ({{ latestResult.scorePercentage }}%)
              </span>
            </div>
            <div class="flex items-center sm:justify-end gap-1.5 text-xs text-slate-500 mt-0.5">
              <Clock class="w-3.5 h-3.5 shrink-0" />
              <span>Thời gian: {{ formatDuration(latestResult.timeSpentSeconds) }}</span>
            </div>
          </div>

          <div class="flex sm:flex-col gap-2 w-full sm:w-auto">
            <button
              type="button"
              class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
              @click="openDedicatedExamTab(true)"
            >
              <RotateCcw class="w-4 h-4 shrink-0" />
              <span>Thi thử đề mới (Mở Tab mới)</span>
            </button>
            <button
              type="button"
              class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              @click="navigateTo('history')"
            >
              <History class="w-3.5 h-3.5 shrink-0" />
              <span>Lịch sử thi</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 5 Section Score Breakdown Grid (Desktop: 5 cols -> Tablet: 3 cols -> Mobile: 2/1 cols) -->
      <div class="pt-6">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Phân tích điểm số theo 5 Section chuyên đề
        </h2>
        <div class="result-section-grid">
          <div
            v-for="sec in latestResult.sectionBreakdown"
            :key="sec.sectionId"
            class="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between"
          >
            <div>
              <div class="text-xs font-semibold text-slate-800 line-clamp-2 min-h-[2rem]">
                {{ sec.sectionName }}
              </div>
            </div>

            <div class="mt-3">
              <div class="flex items-baseline justify-between mb-1.5">
                <span class="font-mono text-base font-bold text-slate-900">
                  {{ sec.correctCount }}/{{ sec.totalCount }}
                </span>
                <span
                  class="font-mono text-xs font-semibold px-1.5 py-0.5 rounded"
                  :class="
                    sec.percentage >= 70
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  "
                >
                  {{ sec.percentage }}%
                </span>
              </div>

              <div class="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="sec.percentage >= 70 ? 'bg-emerald-600' : 'bg-rose-500'"
                  :style="{ width: `${sec.percentage}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 70-Question Result Map (Green = Correct, Red = Wrong, Amber = Unanswered) -->
      <div class="pt-6 mt-6 border-t border-slate-100">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Bản đồ kết quả 70 câu (Bấm vào số câu để xem chi tiết Đúng / Sai)
          </h2>
          <div class="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-600">
            <span class="inline-flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
              <span>Đúng ({{ filterCounts.correct }})</span>
            </span>
            <span class="inline-flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-xs bg-rose-600 inline-block" />
              <span>Sai ({{ filterCounts.incorrect }})</span>
            </span>
            <span class="inline-flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-xs bg-amber-100 border border-amber-400 inline-block" />
              <span>Bỏ trống ({{ filterCounts.unanswered }})</span>
            </span>
          </div>
        </div>

        <div class="grid grid-cols-7 sm:grid-cols-10 lg:grid-cols-14 gap-1.5">
          <button
            v-for="(rItem, rIdx) in latestResult.reviewItems"
            :key="rItem.question.id"
            type="button"
            class="h-8 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer flex items-center justify-center"
            :class="
              rItem.isCorrect
                ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                : !rItem.isAnswered
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                  : 'bg-rose-600 text-white border-rose-700 hover:bg-rose-700'
            "
            :title="`Câu ${rIdx + 1}: ${rItem.isCorrect ? 'Đúng' : !rItem.isAnswered ? 'Chưa làm' : 'Sai'}`"
            @click="scrollToQuestionCard(rItem.question.id)"
          >
            {{ rIdx + 1 }}
          </button>
        </div>
      </div>
    </section>

    <!-- Filter & Search Bar for Detailed Question Review -->
    <section class="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
      <div class="result-filter-bar">
        <!-- Status Filter Pills -->
        <div class="result-status-pills">
          <Filter class="w-4 h-4 text-slate-400 mr-1 hidden sm:inline shrink-0" />
          <button
            v-for="tab in statusTabs"
            :key="tab.id"
            type="button"
            class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer flex items-center gap-1.5"
            :class="
              statusFilter === tab.id
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            "
            @click="statusFilter = tab.id"
          >
            <span>{{ tab.label }}</span>
            <span
              class="font-mono text-[11px] px-1.5 py-0.2 rounded-full"
              :class="
                statusFilter === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              "
            >
              {{ filterCounts[tab.id] }}
            </span>
          </button>
        </div>

        <!-- Section Dropdown & Keyword Search -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <select
            v-model="sectionFilter"
            class="px-3 py-2 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-slate-900"
          >
            <option v-for="opt in sectionOptions" :key="opt.id" :value="opt.id">
              {{ opt.label }}
            </option>
          </select>

          <div class="relative">
            <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm từ khóa (Hilt, BOM, UDF...)"
              class="pl-8 pr-3 py-2 rounded-lg text-xs border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 w-full sm:w-56"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Question-by-Question Review List -->
    <section class="space-y-5">
      <div
        v-if="filteredReviewItems.length === 0"
        class="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3"
      >
        <p class="text-sm text-slate-500">Không tìm thấy câu hỏi nào khớp với bộ lọc hiện tại.</p>
        <button
          type="button"
          class="px-3.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
          @click="resetFilters"
        >
          Xóa bộ lọc
        </button>
      </div>

      <article
        v-for="item in filteredReviewItems"
        :id="`review-q-${item.question.id}`"
        :key="item.question.id"
        class="bg-white rounded-2xl border overflow-hidden shadow-2xs"
        :class="
          item.isCorrect
            ? 'border-emerald-200'
            : 'border-rose-200'
        "
      >
        <!-- Review Item Header -->
        <div class="px-4 sm:px-6 py-3.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-900 text-white">
              Câu #{{ item.originalNumber }}
            </span>

            <span
              class="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded border"
              :class="
                item.isCorrect
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : !item.isAnswered
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-rose-50 text-rose-800 border-rose-300'
              "
            >
              <CheckCircle2 v-if="item.isCorrect" class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <XCircle v-else class="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>
                {{
                  item.isCorrect
                    ? 'Trả lời Đúng'
                    : !item.isAnswered
                      ? 'Bỏ trống (Chưa trả lời)'
                      : 'Trả lời Sai'
                }}
              </span>
            </span>

            <span class="text-xs text-slate-600 font-medium px-2.5 py-0.5 bg-slate-100 rounded border border-slate-200">
              {{
                item.question.type === 'multi'
                  ? `Multiple Choice (Chọn ${item.question.correctAnswers.length} ý)`
                  : 'Single Choice (Chọn 1 ý)'
              }}
            </span>

            <span class="text-xs text-slate-500 font-medium px-2 py-0.5 bg-slate-100 rounded">
              {{ item.question.sectionName }}
            </span>

            <span
              v-if="item.isFlagged"
              class="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200"
            >
              <Flag class="w-3 h-3 fill-amber-500 shrink-0" />
              <span>Đã cắm cờ</span>
            </span>
          </div>

          <!-- Clear Comparison Summary of User's Pick vs Correct Answer -->
          <div class="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span
              class="px-2.5 py-1 rounded border font-semibold"
              :class="
                item.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              "
            >
              Bạn chọn: <strong>{{ getLettersList(item.selectedIndices) }}</strong>
            </span>
            <span class="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold">
              Đáp án đúng: {{ getLettersList(item.question.correctAnswers) }}
            </span>
          </div>
        </div>

        <!-- Question & Options with 3 Distinct Highlight States -->
        <div class="p-4 sm:p-6 space-y-4">
          <h3 class="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed break-words">
            {{ item.question.question }}
          </h3>

          <div class="space-y-2.5">
            <div
              v-for="(optText, optIdx) in item.question.options"
              :key="optIdx"
              class="review-option-row transition-all"
              :class="[
                item.selectedIndices.includes(optIdx) && item.question.correctAnswers.includes(optIdx)
                  ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 ring-1 ring-emerald-500/30 shadow-2xs'
                  : item.selectedIndices.includes(optIdx) && !item.question.correctAnswers.includes(optIdx)
                    ? 'bg-rose-50 border-2 border-rose-500 text-rose-950 ring-1 ring-rose-500/30 shadow-2xs'
                    : !item.selectedIndices.includes(optIdx) && item.question.correctAnswers.includes(optIdx)
                      ? 'bg-emerald-50/75 border-2 border-dashed border-emerald-500 text-emerald-950 ring-2 ring-emerald-400/40'
                      : 'bg-white border border-slate-200 text-slate-500 opacity-80'
              ]"
            >
              <!-- Left: Status Icon + Letter + Option Text -->
              <div class="flex items-start gap-3 flex-1 min-w-0">
                <div class="mt-0.5 shrink-0">
                  <!-- Case 1: User selected AND it is CORRECT (isSelected && isCorrect) -->
                  <CheckCircle2
                    v-if="item.selectedIndices.includes(optIdx) && item.question.correctAnswers.includes(optIdx)"
                    class="w-5 h-5 text-emerald-600"
                  />
                  <!-- Case 2: User selected AND it is WRONG (isSelected && !isCorrect) -->
                  <XCircle
                    v-else-if="item.selectedIndices.includes(optIdx) && !item.question.correctAnswers.includes(optIdx)"
                    class="w-5 h-5 text-rose-600"
                  />
                  <!-- Case 3: Correct Answer but User DID NOT SELECT (!isSelected && isCorrect) -->
                  <CheckCircle2
                    v-else-if="!item.selectedIndices.includes(optIdx) && item.question.correctAnswers.includes(optIdx)"
                    class="w-5 h-5 text-emerald-600 animate-bounce"
                  />
                  <!-- Case 4: Unselected and wrong -->
                  <Circle
                    v-else-if="item.question.type === 'single'"
                    class="w-5 h-5 text-slate-300"
                  />
                  <Square
                    v-else
                    class="w-5 h-5 text-slate-300"
                  />
                </div>

                <div class="leading-relaxed whitespace-pre-wrap break-words flex-1 min-w-0">
                  <span
                    class="font-mono font-bold mr-2"
                    :class="
                      item.question.correctAnswers.includes(optIdx)
                        ? 'text-emerald-700'
                        : item.selectedIndices.includes(optIdx)
                          ? 'text-rose-700'
                          : 'text-slate-500'
                    "
                  >
                    {{ optionLetters[optIdx] }}.
                  </span>
                  <span
                    :class="
                      item.selectedIndices.includes(optIdx) && item.question.correctAnswers.includes(optIdx)
                        ? 'font-semibold text-emerald-950'
                        : item.selectedIndices.includes(optIdx) && !item.question.correctAnswers.includes(optIdx)
                          ? 'font-medium text-rose-900 line-through decoration-rose-400/70'
                          : !item.selectedIndices.includes(optIdx) && item.question.correctAnswers.includes(optIdx)
                            ? 'font-semibold text-emerald-950'
                            : ''
                    "
                  >
                    {{ optText }}
                  </span>
                </div>
              </div>

              <!-- Right: Explicit User Selection Marker + Correct/Wrong Label -->
              <div class="shrink-0 flex flex-wrap items-center gap-1.5 text-xs font-bold self-end sm:self-center">
                <!-- Always mark clearly if the user selected this option -->
                <span
                  v-if="item.selectedIndices.includes(optIdx)"
                  class="px-2 py-0.5 rounded text-[11px] font-mono border"
                  :class="
                    item.question.correctAnswers.includes(optIdx)
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                      : 'bg-rose-100 text-rose-900 border-rose-400'
                  "
                >
                  ✓ Câu bạn đã chọn
                </span>

                <!-- State 1 Badge: isSelected && isCorrect -->
                <span
                  v-if="
                    item.selectedIndices.includes(optIdx) &&
                    item.question.correctAnswers.includes(optIdx)
                  "
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600 text-white shadow-2xs"
                >
                  <CheckCircle2 class="w-3.5 h-3.5" />
                  <span>Bạn chọn đúng</span>
                </span>

                <!-- State 2 Badge: isSelected && !isCorrect -->
                <span
                  v-else-if="
                    item.selectedIndices.includes(optIdx) &&
                    !item.question.correctAnswers.includes(optIdx)
                  "
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-600 text-white shadow-2xs"
                >
                  <XCircle class="w-3.5 h-3.5" />
                  <span>Đáp án sai</span>
                </span>

                <!-- State 3 Badge: !isSelected && isCorrect -->
                <span
                  v-else-if="
                    !item.selectedIndices.includes(optIdx) &&
                    item.question.correctAnswers.includes(optIdx)
                  "
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-400 shadow-2xs"
                >
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-700" />
                  <span>Đáp án đúng (Cần chọn)</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Technical Explanation Box -->
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div class="flex items-center gap-2 font-semibold text-slate-900 mb-1">
              <HelpCircle class="w-4 h-4 text-slate-700 shrink-0" />
              <span>Giải thích kỹ thuật chuyên sâu (Backbase Best Practices):</span>
            </div>
            <p>{{ item.question.explanation }}</p>
          </div>
        </div>
      </article>
    </section>
  </div>

  <!-- Fallback if no result is loaded -->
  <div v-else class="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
    <p class="text-slate-600 text-sm">Chưa có kết quả bài thi nào được chọn.</p>
    <button
      type="button"
      class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
      @click="navigateTo('exam')"
    >
      Quay về màn hình làm bài
    </button>
  </div>
</template>
