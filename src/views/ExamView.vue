<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import {
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  BookOpen,
  Layers,
  CheckCircle2,
  AlertCircle,
  Grid,
  X,
  AlertTriangle,
  ShieldAlert,
  MousePointer,
  Eye
} from 'lucide-vue-next'
import { useExamViewModel } from '@/viewmodels/useExamViewModel'
import { useBrowserProctoring } from '@/viewmodels/useBrowserProctoring'
import { ExamGeneratorService } from '@/services/exam-generator.service'
import QuestionCard from '@/components/QuestionCard.vue'
import QuestionNavGrid from '@/components/QuestionNavGrid.vue'
import CountdownTimer from '@/components/CountdownTimer.vue'
import ProgressBar from '@/components/ProgressBar.vue'

const {
  currentSession,
  currentQuestion,
  currentQuestionIndex,
  currentAnswerState,
  totalQuestions,
  answeredCount,
  unansweredCount,
  flaggedCount,
  remainingSeconds,
  showInstantExplanation,
  selectOption,
  toggleFlagQuestion,
  goToQuestion,
  nextQuestion,
  prevQuestion,
  togglePracticeMode,
  toggleInstantExplanation,
  startNewExam,
  submitExam
} = useExamViewModel()

const {
  IDLE_TIMEOUT_SECONDS,
  isProctoringEnabled,
  isInsideExamScreen,
  showOutZoneWarning,
  outZoneWarningMessage,
  outZoneWarningCount,
  idleSeconds,
  showIdleWarning,
  idleWarningCount,
  totalWarnings,
  warningLogs,
  dismissOutZoneWarning,
  dismissIdleWarning,
  toggleProctoring,
  resetProctoringStats
} = useBrowserProctoring()

const showSubmitModal = ref(false)
const showNewExamModal = ref(false)
const showMobileMapModal = ref(false)
const showProctoringLogModal = ref(false)
const bankStats = ExamGeneratorService.getQuestionBankStats()

function handleConfirmSubmit() {
  showSubmitModal.value = false
  submitExam()
}

function handleStartFreshExam(practiceMode: boolean) {
  showNewExamModal.value = false
  resetProctoringStats()
  startNewExam(practiceMode, false)
}

function handleSelectQuestionFromMobileMap(index: number) {
  goToQuestion(index)
  showMobileMapModal.value = false
}

function formatIdleTime(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return m > 0 ? `${m}p ${s.toString().padStart(2, '0')}s` : `${s}s`
}

function handleKeydown(e: KeyboardEvent) {
  if (
    showSubmitModal.value ||
    showNewExamModal.value ||
    showMobileMapModal.value ||
    showIdleWarning.value
  )
    return
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

  if (e.key === 'ArrowRight') {
    e.preventDefault()
    nextQuestion()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prevQuestion()
  } else if (e.key === 'f' || e.key === 'F') {
    e.preventDefault()
    toggleFlagQuestion()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div v-if="currentSession && currentQuestion" class="space-y-4 sm:space-y-5">
    <!-- Top Warning Banner 1: User Switched Tab / Left Entire Exam Screen -->
    <div
      v-if="isProctoringEnabled && showOutZoneWarning"
      role="alert"
      class="rounded-2xl border-2 border-rose-500 bg-rose-50 p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div class="flex items-start sm:items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
          <AlertTriangle class="w-5 h-5" />
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white">
              WARNING — RỜI MÀN HÌNH LÀM BÀI / CHUYỂN TAB
            </span>
            <span class="text-xs font-mono font-semibold text-rose-800">
              Cảnh báo lần #{{ outZoneWarningCount }}
            </span>
          </div>
          <p class="text-xs sm:text-sm font-semibold text-rose-950 mt-1">
            {{ outZoneWarningMessage }}
          </p>
          <p class="text-[11px] text-rose-700 mt-0.5">
            Vui lòng giữ con trỏ chuột và cửa sổ làm việc bên trong màn hình bài thi trong suốt thời gian làm bài.
          </p>
        </div>
      </div>

      <button
        type="button"
        class="self-end sm:self-center shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-700 text-white hover:bg-rose-800 transition-colors cursor-pointer"
        @click="dismissOutZoneWarning"
      >
        Đã hiểu & Tiếp tục
      </button>
    </div>

    <!-- Top Warning Banner 2: Mouse Inactive for 2 Minutes -->
    <div
      v-if="isProctoringEnabled && showIdleWarning"
      role="alert"
      class="rounded-2xl border-2 border-amber-500 bg-amber-50 p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <div class="flex items-start sm:items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
          <MousePointer class="w-5 h-5" />
        </div>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-600 text-white">
              WARNING — KHÔNG CỬ ĐỘNG CHUỘT 2 PHÚT
            </span>
            <span class="text-xs font-mono font-semibold text-amber-900">
              Cảnh báo Idle: #{{ idleWarningCount }}
            </span>
          </div>
          <p class="text-xs sm:text-sm font-semibold text-amber-950 mt-1">
            Hệ thống không ghi nhận chuyển động chuột của bạn trong hơn 2 phút ({{ formatIdleTime(idleSeconds) }})!
          </p>
        </div>
      </div>

      <button
        type="button"
        class="self-end sm:self-center shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-700 text-white hover:bg-amber-800 transition-colors cursor-pointer"
        @click="dismissIdleWarning"
      >
        Tiếp tục làm bài
      </button>
    </div>

    <!-- Exam Control Subheader (Desktop-First Responsive) -->
    <div class="exam-control-card shadow-2xs space-y-3">
      <div class="exam-control-inner">
        <!-- Left: Progress Bar -->
        <div class="exam-progress-wrap">
          <ProgressBar
            :answered-count="answeredCount"
            :total-count="totalQuestions"
            :flagged-count="flaggedCount"
          />
        </div>

        <!-- Right: Timer & Action Buttons -->
        <div class="exam-actions-wrap">
          <!-- Practice Mode Switch -->
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer"
            :class="
              currentSession.isPracticeMode
                ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            "
            title="Bật chế độ Luyện tập để xem giải thích ngay sau mỗi câu"
            @click="togglePracticeMode"
          >
            <BookOpen class="w-3.5 h-3.5 shrink-0" />
            <span>{{ currentSession.isPracticeMode ? 'Luyện tập' : 'Thi chuẩn' }}</span>
          </button>

          <CountdownTimer :remaining-seconds="remainingSeconds" />

          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            @click="showNewExamModal = true"
          >
            <RotateCcw class="w-3.5 h-3.5 shrink-0" />
            <span>Đề mới</span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
            @click="showSubmitModal = true"
          >
            <Send class="w-3.5 h-3.5 shrink-0" />
            <span>Nộp bài</span>
          </button>
        </div>
      </div>

      <!-- Browser Proctoring Check Bar (Entire Screen/Tab Check + 2m Mouse Idle Check) -->
      <div class="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1.5 font-semibold text-slate-700">
            <ShieldAlert class="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <span>Browser Check:</span>
          </span>

          <!-- Check 1: Full Screen / Tab Focus Status -->
          <span
            v-if="isProctoringEnabled"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-medium"
            :class="
              isInsideExamScreen && !showOutZoneWarning
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
            "
          >
            <span
              class="w-2 h-2 rounded-full"
              :class="isInsideExamScreen && !showOutZoneWarning ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'"
            />
            <span>
              {{
                isInsideExamScreen && !showOutZoneWarning
                  ? 'Đang trong màn hình thi'
                  : 'Cảnh báo: Rời màn hình / Chuyển Tab!'
              }}
            </span>
          </span>

          <!-- Check 2: 2-Minute Mouse Inactivity Status -->
          <span
            v-if="isProctoringEnabled"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono"
            :class="
              idleSeconds >= IDLE_TIMEOUT_SECONDS
                ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                : idleSeconds >= 90
                  ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
            "
            title="Cảnh báo nếu không cử động chuột trong 2 phút (120 giây)"
          >
            <MousePointer class="w-3 h-3 shrink-0" />
            <span>Idle: {{ formatIdleTime(idleSeconds) }} / 2p00s</span>
          </span>

          <!-- Warning Counter & Log Viewer -->
          <button
            v-if="isProctoringEnabled"
            type="button"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono transition-colors cursor-pointer"
            :class="
              totalWarnings > 0
                ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 font-semibold'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            "
            @click="showProctoringLogModal = true"
          >
            <Eye class="w-3 h-3 shrink-0" />
            <span>Warnings: {{ totalWarnings }}</span>
          </button>
        </div>

        <button
          type="button"
          class="text-[11px] font-medium px-2.5 py-1 rounded-md border transition-colors cursor-pointer"
          :class="
            isProctoringEnabled
              ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
          "
          @click="toggleProctoring"
        >
          {{ isProctoringEnabled ? 'Giám sát Browser: Đang BẬT' : 'Giám sát Browser: Đã TẮT' }}
        </button>
      </div>
    </div>

    <!-- Main 2-Column Exam Layout (Desktop 2-col -> Tablet/Mobile 1-col) -->
    <div class="exam-layout">
      <!-- Left/Main Column: Question Card & Prev/Next Controls -->
      <div class="exam-main-col">
        <QuestionCard
          :question="currentQuestion"
          :question-number="currentQuestionIndex + 1"
          :total-questions="totalQuestions"
          :selected-indices="currentAnswerState?.selectedIndices ?? []"
          :is-flagged="currentAnswerState?.isFlagged ?? false"
          :is-practice-mode="currentSession.isPracticeMode"
          :show-explanation="!!showInstantExplanation[currentQuestion.id]"
          @select-option="selectOption"
          @toggle-flag="toggleFlagQuestion()"
          @toggle-explanation="toggleInstantExplanation(currentQuestion.id)"
        />

        <!-- Bottom Navigation Bar (Sticky on Mobile) -->
        <div class="question-bottom-nav shadow-2xs">
          <button
            type="button"
            :disabled="currentQuestionIndex === 0"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            @click="prevQuestion"
          >
            <ChevronLeft class="w-4 h-4 shrink-0" />
            <span>Câu trước</span>
          </button>

          <!-- Desktop Keyboard Hint -->
          <div class="hidden lg:flex items-center gap-2 text-xs text-slate-400">
            <span>Phím tắt:</span>
            <kbd class="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">←</kbd>
            <kbd class="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">→</kbd>
            <span>chuyển câu,</span>
            <kbd class="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">F</kbd>
            <span>cắm cờ</span>
          </div>

          <!-- Tablet/Mobile Quick Map Trigger Button -->
          <button
            type="button"
            class="mobile-map-trigger items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-semibold border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 cursor-pointer"
            @click="showMobileMapModal = true"
          >
            <Grid class="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span>{{ currentQuestionIndex + 1 }}/{{ totalQuestions }}</span>
          </button>

          <button
            v-if="currentQuestionIndex < totalQuestions - 1"
            type="button"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
            @click="nextQuestion"
          >
            <span>Câu tiếp</span>
            <ChevronRight class="w-4 h-4 shrink-0" />
          </button>

          <button
            v-else
            type="button"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
            @click="showSubmitModal = true"
          >
            <Send class="w-4 h-4 shrink-0" />
            <span>Hoàn tất & Nộp</span>
          </button>
        </div>
      </div>

      <!-- Right Sidebar: 70-Question Grid & Section Quotas -->
      <aside class="exam-sidebar-col">
        <QuestionNavGrid
          :questions="currentSession.questions"
          :answers="currentSession.answers"
          :current-index="currentQuestionIndex"
          @select="goToQuestion"
        />

        <!-- Exam Quota Distribution Info Card -->
        <div class="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs">
          <div class="flex items-center gap-2 mb-3">
            <Layers class="w-4 h-4 text-slate-500 shrink-0" />
            <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Cấu trúc đề chuẩn (70 câu)
            </h3>
          </div>
          <ul class="space-y-2 text-xs">
            <li
              v-for="sec in bankStats.sections"
              :key="sec.id"
              class="flex items-center justify-between text-slate-600"
            >
              <span class="truncate pr-2">{{ sec.shortName }}</span>
              <span class="font-mono font-semibold text-slate-900 shrink-0">
                {{ sec.quota }} câu <span class="text-slate-400 font-normal">/ {{ sec.poolCount }} pool</span>
              </span>
            </li>
          </ul>
          <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-700">
            <span>Ngưỡng đỗ (Pass 70%):</span>
            <span class="font-mono font-bold text-emerald-700">49 / 70 câu</span>
          </div>
        </div>
      </aside>
    </div>

    <!-- Modal Warning: 2 Minutes Mouse Inactivity (Popup Alert) -->
    <div
      v-if="isProctoringEnabled && showIdleWarning"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl border-2 border-amber-500 max-w-md w-full p-6 shadow-2xl space-y-4">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle class="w-6 h-6" />
          </div>
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500 text-white">
              BROWSER CHECK WARNING
            </span>
            <h3 class="text-base font-bold text-slate-900 mt-1">
              Không phát hiện cử động chuột trong 2 phút!
            </h3>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed bg-amber-50/70 border border-amber-200 rounded-xl p-3.5">
          Con trỏ chuột của bạn đã đứng yên trong <strong>{{ formatIdleTime(idleSeconds) }}</strong> (vượt ngưỡng 2 phút). Hệ thống giám sát trình duyệt yêu cầu bạn duy trì tương tác trên màn hình trong suốt thời gian làm bài.
        </p>

        <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Số lần cảnh báo đứng yên: <strong class="text-slate-900 font-mono">{{ idleWarningCount }}</strong></span>
          <button
            type="button"
            class="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
            @click="dismissIdleWarning"
          >
            Tôi vẫn đang làm bài (Tiếp tục)
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Proctoring Warning History Log -->
    <div
      v-if="showProctoringLogModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showProctoringLogModal = false"
    >
      <div class="bg-white rounded-2xl border border-slate-200 max-w-md w-full max-h-[85vh] overflow-y-auto p-5 sm:p-6 shadow-xl space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base font-bold text-slate-900">Nhật ký Giám sát Trình duyệt</h3>
            <p class="text-xs text-slate-500">
              Rời màn hình / Chuyển tab: <strong>{{ outZoneWarningCount }}</strong> • Không cử động chuột 2p: <strong>{{ idleWarningCount }}</strong>
            </p>
          </div>
          <button
            type="button"
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            @click="showProctoringLogModal = false"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <div v-if="warningLogs.length === 0" class="py-8 text-center text-xs text-slate-500">
          Chưa có cảnh báo nào được ghi nhận trong phiên thi này.
        </div>

        <ul v-else class="space-y-2 max-h-64 overflow-y-auto pr-1">
          <li
            v-for="log in warningLogs"
            :key="log.id"
            class="p-3 rounded-xl border text-xs flex items-start justify-between gap-2"
            :class="
              log.type === 'idle-2m'
                ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                : 'bg-rose-50/70 border-rose-200 text-rose-950'
            "
          >
            <span class="font-medium">{{ log.message }}</span>
            <span class="font-mono text-[11px] text-slate-500 shrink-0">{{ log.time }}</span>
          </li>
        </ul>

        <div class="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            class="text-xs text-rose-600 hover:underline cursor-pointer"
            @click="resetProctoringStats"
          >
            Đặt lại bộ đếm cảnh báo
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
            @click="showProctoringLogModal = false"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile / Tablet Quick Question Map Drawer Modal -->
    <div
      v-if="showMobileMapModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
      @click.self="showMobileMapModal = false"
    >
      <div class="bg-white rounded-t-2xl sm:rounded-2xl border border-slate-200 max-w-lg w-full max-h-[85vh] overflow-y-auto p-4 sm:p-6 shadow-xl space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 class="text-sm font-bold text-slate-900">Chuyển nhanh câu hỏi (1 – 70)</h3>
            <p class="text-xs text-slate-500">
              Đã làm {{ answeredCount }}/{{ totalQuestions }} • Đánh dấu {{ flaggedCount }}
            </p>
          </div>
          <button
            type="button"
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            @click="showMobileMapModal = false"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <QuestionNavGrid
          :questions="currentSession.questions"
          :answers="currentSession.answers"
          :current-index="currentQuestionIndex"
          @select="handleSelectQuestionFromMobileMap"
        />
      </div>
    </div>

    <!-- Submit Confirmation Modal -->
    <div
      v-if="showSubmitModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showSubmitModal = false"
    >
      <div class="bg-white rounded-2xl border border-slate-200 max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-xl space-y-4">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            :class="unansweredCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'"
          >
            <AlertCircle v-if="unansweredCount > 0" class="w-5 h-5" />
            <CheckCircle2 v-else class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900">Xác nhận nộp bài thi</h3>
            <p class="text-xs text-slate-500">Hệ thống sẽ chấm điểm và lưu kết quả vào lịch sử</p>
          </div>
        </div>

        <div class="bg-slate-50 rounded-xl p-4 border border-slate-200/80 grid grid-cols-3 gap-2 text-center">
          <div>
            <div class="text-lg font-mono font-bold text-slate-900">{{ answeredCount }}</div>
            <div class="text-[11px] text-slate-500">Đã trả lời</div>
          </div>
          <div>
            <div
              class="text-lg font-mono font-bold"
              :class="unansweredCount > 0 ? 'text-rose-600' : 'text-slate-900'"
            >
              {{ unansweredCount }}
            </div>
            <div class="text-[11px] text-slate-500">Chưa làm</div>
          </div>
          <div>
            <div class="text-lg font-mono font-bold text-amber-600">{{ flaggedCount }}</div>
            <div class="text-[11px] text-slate-500">Cắm cờ</div>
          </div>
        </div>

        <p v-if="unansweredCount > 0" class="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Bạn vẫn còn <strong>{{ unansweredCount }} câu hỏi chưa chọn đáp án</strong>. Các câu bỏ trống sẽ bị tính là sai. Bạn có chắc chắn muốn nộp bài ngay?
        </p>

        <div class="flex flex-wrap items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            @click="showSubmitModal = false"
          >
            Quay lại làm tiếp
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
            @click="handleConfirmSubmit"
          >
            Nộp bài & Xem điểm
          </button>
        </div>
      </div>
    </div>

    <!-- Generate New Exam Modal -->
    <div
      v-if="showNewExamModal"
      class="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showNewExamModal = false"
    >
      <div class="bg-white rounded-2xl border border-slate-200 max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-xl space-y-4">
        <div>
          <h3 class="text-base font-bold text-slate-900">Tạo đề thi mới (70 câu ngẫu nhiên)</h3>
          <p class="text-xs text-slate-500 mt-1 leading-relaxed">
            Hệ thống sẽ xáo trộn và bốc ngẫu nhiên 70 câu hỏi mới từ ngân hàng {{ bankStats.totalPoolCount }} câu hỏi theo đúng tỷ trọng 5 Section (13 / 14 / 10 / 11 / 22). Tiến độ đang làm dở sẽ được đặt lại.
          </p>
        </div>

        <div class="space-y-2.5 pt-1">
          <button
            type="button"
            class="w-full p-3.5 rounded-xl border border-slate-900 bg-slate-900 text-white text-left hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-between gap-2"
            @click="handleStartFreshExam(false)"
          >
            <div>
              <div class="text-xs font-bold">Chế độ Thi thử tiêu chuẩn (Exam Simulation)</div>
              <div class="text-[11px] text-slate-300 mt-0.5">90 phút đếm ngược, chỉ hiện đáp án sau khi nộp bài</div>
            </div>
            <ChevronRight class="w-4 h-4 shrink-0" />
          </button>

          <button
            type="button"
            class="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-left hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between gap-2"
            @click="handleStartFreshExam(true)"
          >
            <div>
              <div class="text-xs font-bold">Chế độ Luyện tập (Practice Mode)</div>
              <div class="text-[11px] text-slate-500 mt-0.5">Cho phép bấm xem đáp án và giải thích kỹ thuật ngay ở từng câu</div>
            </div>
            <ChevronRight class="w-4 h-4 shrink-0 text-slate-500" />
          </button>
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
            @click="showNewExamModal = false"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
