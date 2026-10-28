<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  BookOpen,
  Layers,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Grid,
  X,
  AlertTriangle,
  ShieldAlert,
  MousePointer,
  Eye,
  ShieldCheck,
  Sparkles,
  CheckCheck,
  Filter,
  Camera,
  UserCheck,
  MonitorUp
} from 'lucide-vue-next'
import { EXAM_SECTIONS, type Question, type SectionId } from '@/models/exam.types'
import { useExamViewModel } from '@/viewmodels/useExamViewModel'
import { useBrowserProctoring } from '@/viewmodels/useBrowserProctoring'
import { ExamGeneratorService } from '@/services/exam-generator.service'
import { ScoringService } from '@/services/scoring.service'
import QuestionCard from '@/components/QuestionCard.vue'
import QuestionNavGrid from '@/components/QuestionNavGrid.vue'
import CountdownTimer from '@/components/CountdownTimer.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import ExamProctoringGate from '@/components/ExamProctoringGate.vue'

const {
  currentSession,
  currentQuestion,
  currentQuestionIndex,
  currentAnswerState,
  totalQuestions,
  answeredCount,
  incompleteMultiQuestions,
  unansweredMultiQuestions,
  unansweredCount,
  flaggedCount,
  remainingSeconds,
  showInstantExplanation,
  multiChoiceMaxLimitAlert,
  isDedicatedExamTab,
  openDedicatedExamTab,
  closeDedicatedExamTab,
  selectOption,
  applyCorrectAnswer,
  resetQuestionSelection,
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
  isCameraActive,
  isPersonInFrame,
  showFaceMissingWarning,
  showCheckInModal,
  faceStatusMessage,
  detectedLandmarkCount,
  faceMissingWarningCount,
  portraitDataUrl,
  isScreenShareActive,
  isAllRulesSatisfied,
  satisfiedRulesCount,
  openCheckInModal,
  stopAllProctoringStreams,
  dismissFaceMissingWarning,
  dismissOutZoneWarning,
  dismissIdleWarning,
  toggleProctoring,
  resetProctoringStats
} = useBrowserProctoring()

const showSubmitModal = ref(false)
const showNewExamModal = ref(false)
const showMobileMapModal = ref(false)
const showProctoringLogModal = ref(false)
const showIncompleteMultiModal = ref(false)
const pendingTargetIndex = ref<number | null>(null)
const practiceFilter = ref<'all' | 'wrong' | 'unanswered' | 'flagged'>('all')
const bankStats = ExamGeneratorService.getQuestionBankStats()

const isExamSimulationMode = computed(() => !currentSession.value?.isPracticeMode)

const currentMultiStatus = computed(() => {
  const q = currentQuestion.value
  if (!q || q.type !== 'multi') {
    return { isMulti: false, selectedCount: 0, requiredCount: 1, missingCount: 0, isIncomplete: false }
  }
  const selectedCount = currentAnswerState.value?.selectedIndices.length ?? 0
  const requiredCount = q.correctAnswers.length
  const missingCount = Math.max(0, requiredCount - selectedCount)
  return {
    isMulti: true,
    selectedCount,
    requiredCount,
    missingCount,
    isIncomplete: selectedCount > 0 && selectedCount < requiredCount
  }
})

function isQuestionIncompleteMulti(q: Question): boolean {
  if (!currentSession.value || q.type !== 'multi') return false
  const sel = currentSession.value.answers[q.id]?.selectedIndices ?? []
  return sel.length > 0 && sel.length < q.correctAnswers.length
}

function isQuestionEvaluated(q: Question): boolean {
  if (!currentSession.value) return false
  if (showInstantExplanation.value[q.id]) return true
  const sel = currentSession.value.answers[q.id]?.selectedIndices ?? []
  return sel.length >= q.correctAnswers.length
}

function isQuestionRight(q: Question): boolean {
  if (!currentSession.value) return false
  const sel = currentSession.value.answers[q.id]?.selectedIndices ?? []
  return ScoringService.isAnswerCorrect(q, sel)
}

// Live Practice Mode statistics
const practiceStats = computed(() => {
  if (!currentSession.value) {
    return { evaluatedCount: 0, correctCount: 0, wrongCount: 0, remainingCount: 70, accuracy: 0 }
  }
  let evaluatedCount = 0
  let correctCount = 0
  let wrongCount = 0

  for (const q of currentSession.value.questions) {
    if (isQuestionEvaluated(q)) {
      evaluatedCount++
      if (isQuestionRight(q)) {
        correctCount++
      } else {
        wrongCount++
      }
    }
  }

  const remainingCount = currentSession.value.questions.length - evaluatedCount
  const accuracy = evaluatedCount > 0 ? Math.round((correctCount / evaluatedCount) * 100) : 0
  return { evaluatedCount, correctCount, wrongCount, remainingCount, accuracy }
})

// Detailed 5-Section Curriculum Tree for Practice Mode Left Sidebar
const practiceCurriculumSections = computed(() => {
  if (!currentSession.value) return []
  const qs = currentSession.value.questions
  const ans = currentSession.value.answers
  const order: SectionId[] = ['fundamentals', 'architecture', 'setup', 'adopt', 'extend']

  return order.map((secId, secIdx) => {
    const items = qs
      .map((q, globalIdx) => ({
        question: q,
        globalIdx,
        evaluated: isQuestionEvaluated(q),
        incompleteMulti: isQuestionIncompleteMulti(q),
        correct: isQuestionRight(q),
        flagged: ans[q.id]?.isFlagged ?? false
      }))
      .filter((item) => {
        if (item.question.section !== secId) return false
        if (practiceFilter.value === 'wrong') return item.evaluated && !item.correct
        if (practiceFilter.value === 'unanswered') return !item.evaluated
        if (practiceFilter.value === 'flagged') return item.flagged
        return true
      })

    const allSecQuestions = qs.filter((q) => q.section === secId)
    let correctInSec = 0
    let wrongInSec = 0
    for (const q of allSecQuestions) {
      if (isQuestionEvaluated(q)) {
        if (isQuestionRight(q)) correctInSec++
        else wrongInSec++
      }
    }

    const firstGlobalIdx = qs.findIndex((q) => q.section === secId)

    return {
      id: secId,
      indexNumber: secIdx + 1,
      name: EXAM_SECTIONS[secId].name,
      shortName: EXAM_SECTIONS[secId].shortName,
      description: EXAM_SECTIONS[secId].description,
      total: allSecQuestions.length,
      correctInSec,
      wrongInSec,
      doneInSec: correctInSec + wrongInSec,
      firstGlobalIdx: firstGlobalIdx >= 0 ? firstGlobalIdx : 0,
      isActive: currentQuestion.value?.section === secId,
      items
    }
  })
})

function switchMode(practice: boolean) {
  if (!practice) {
    // Clicking "Thi thử chuẩn" opens a brand new Dedicated Exam Tab
    openDedicatedExamTab(false)
    return
  }

  // Switching to Practice Mode: if inside the Dedicated Exam Tab, close the Exam Tab & turn off Camera
  if (isDedicatedExamTab.value) {
    closeDedicatedExamTab()
    return
  }

  if (!currentSession.value) return
  if (currentSession.value.isPracticeMode !== true) {
    togglePracticeMode()
    dismissOutZoneWarning()
    dismissIdleWarning()
  }
  stopAllProctoringStreams()
}

function handleConfirmSubmit() {
  showSubmitModal.value = false
  stopAllProctoringStreams()
  submitExam()
}

function handleStartFreshExam(practiceMode: boolean) {
  showNewExamModal.value = false
  resetProctoringStats()
  if (!practiceMode) {
    openDedicatedExamTab(true)
    return
  }
  startNewExam(true, false)
}

function handleSelectQuestionFromMobileMap(index: number) {
  showMobileMapModal.value = false
  handleNavigateTo(index)
}

function handleNavigateTo(targetIdx: number) {
  if (targetIdx === currentQuestionIndex.value) return
  if (currentMultiStatus.value.isIncomplete) {
    pendingTargetIndex.value = targetIdx
    showIncompleteMultiModal.value = true
    return
  }
  goToQuestion(targetIdx)
}

function handleNextQuestion() {
  if (currentQuestionIndex.value >= totalQuestions.value - 1) return
  if (currentMultiStatus.value.isIncomplete) {
    pendingTargetIndex.value = currentQuestionIndex.value + 1
    showIncompleteMultiModal.value = true
    return
  }
  nextQuestion()
}

function handlePrevQuestion() {
  if (currentQuestionIndex.value <= 0) return
  if (currentMultiStatus.value.isIncomplete) {
    pendingTargetIndex.value = currentQuestionIndex.value - 1
    showIncompleteMultiModal.value = true
    return
  }
  prevQuestion()
}

function confirmLeaveIncompleteMulti() {
  const target = pendingTargetIndex.value
  showIncompleteMultiModal.value = false
  pendingTargetIndex.value = null
  if (target !== null) {
    goToQuestion(target)
  }
}

function jumpDirectlyFromModal(targetIdx: number) {
  showSubmitModal.value = false
  showIncompleteMultiModal.value = false
  pendingTargetIndex.value = null
  goToQuestion(targetIdx)
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
    showIncompleteMultiModal.value ||
    (isExamSimulationMode.value && showIdleWarning.value)
  )
    return
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

  if (e.key === 'ArrowRight') {
    e.preventDefault()
    handleNextQuestion()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    handlePrevQuestion()
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
  <div v-if="currentSession && currentQuestion" class="space-y-5">
    <!-- ======================================================================
         UI 1: STRICT EXAM SIMULATION MODE (Proctored Dark Header + 2-Col Exam Room)
         ====================================================================== -->
    <template v-if="isExamSimulationMode">
      <!-- Fixed Floating Red Warning: Person Disappeared / Left Active Camera Frame -->
      <div
        v-if="
          isProctoringEnabled &&
          !showCheckInModal &&
          isCameraActive &&
          (showFaceMissingWarning || !isPersonInFrame)
        "
        role="alert"
        class="fixed top-3 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-2xl rounded-2xl border-2 border-rose-500 bg-rose-950/95 text-white p-4 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div class="flex items-start sm:items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
            <Camera class="w-5 h-5" />
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white">
                WARNING RED — NGƯỜI TRONG CAMERA ĐÃ BIẾN MẤT!
              </span>
              <span
                v-if="faceMissingWarningCount > 0"
                class="text-xs font-mono font-bold text-rose-200"
              >
                Vi phạm Camera #{{ faceMissingWarningCount }}
              </span>
            </div>
            <p class="text-xs sm:text-sm font-semibold text-rose-50 mt-1">
              {{ faceStatusMessage }}
            </p>
            <p class="text-[11px] text-rose-300 mt-0.5">
              Vui lòng ngồi lại vào khung hình Camera ngay. Cảnh báo sẽ tự động tắt khi hệ thống thấy lại bạn trong Camera.
            </p>
          </div>
        </div>

        <button
          type="button"
          class="self-end sm:self-center shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-rose-900 hover:bg-rose-100 transition-colors cursor-pointer"
          @click="dismissFaceMissingWarning"
        >
          Đã hiểu
        </button>
      </div>

      <!-- Warning Banner 1: User Switched Tab / Left Entire Exam Screen -->
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
              Chế độ Thi chuẩn đang bật giám sát trình duyệt. Nếu muốn tra cứu tài liệu thoải mái, hãy bấm nút "Chế độ: Luyện tập".
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

      <!-- Warning Banner 2: Mouse Inactive for 2 Minutes -->
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

      <!-- Exam Room Top Control Bar -->
      <div class="exam-control-card shadow-2xs space-y-3 border-slate-200/90">
        <div class="exam-control-inner">
          <!-- Left: Progress Bar -->
          <div class="exam-progress-wrap">
            <ProgressBar
              :answered-count="answeredCount"
              :total-count="totalQuestions"
              :flagged-count="flaggedCount"
            />
          </div>

          <!-- Right: Mode Switch Button + 90m Countdown Timer + Actions -->
          <div class="exam-actions-wrap">
            <!-- Quick Warning Pill if any Multiple Choice question has incomplete selections -->
            <button
              v-if="incompleteMultiQuestions.length > 0 && incompleteMultiQuestions[0]"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 border-rose-500 bg-rose-50 text-rose-800 hover:bg-rose-100 transition-colors cursor-pointer"
              title="Bấm để nhảy tới câu Multiple Choice đang chọn thiếu đáp án"
              @click="jumpDirectlyFromModal(incompleteMultiQuestions[0].index)"
            >
              <AlertTriangle class="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>WARNING: {{ incompleteMultiQuestions.length }} câu Multi chọn thiếu!</span>
            </button>

            <!-- Explicit Switch Button (Always visible on right side too) -->
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 transition-colors cursor-pointer"
              title="Switch to Interactive Practice Studio with instant grading & Vietnamese explanations"
              @click="switchMode(true)"
            >
              <Sparkles class="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Practice Mode</span>
            </button>

            <CountdownTimer :remaining-seconds="remainingSeconds" />

            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              @click="showNewExamModal = true"
            >
              <RotateCcw class="w-3.5 h-3.5 shrink-0" />
              <span>New Exam</span>
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-2xs"
              @click="showSubmitModal = true"
            >
              <Send class="w-3.5 h-3.5 shrink-0" />
              <span>Submit Exam</span>
            </button>
          </div>
        </div>

        <!-- Browser Proctoring Check Bar (4 Mandatory Rules) -->
        <div class="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-semibold transition-colors cursor-pointer"
              :class="
                isAllRulesSatisfied
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              "
              @click="openCheckInModal"
            >
              <ShieldAlert class="w-3.5 h-3.5 shrink-0" />
              <span>Quy tắc thi ({{ satisfiedRulesCount }}/4):</span>
            </button>

            <!-- Rule 1: Camera & Face Presence -->
            <button
              type="button"
              class="inline-flex items-center gap-1 px-2 py-1 rounded-md border font-medium cursor-pointer"
              :class="
                isCameraActive && isPersonInFrame
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-500 font-bold animate-pulse'
              "
              @click="openCheckInModal"
            >
              <Camera class="w-3.5 h-3.5 shrink-0" />
              <span>
                {{
                  !isCameraActive
                    ? 'Camera: OFF'
                    : isPersonInFrame
                      ? `Camera: Có mặt (${detectedLandmarkCount}/5)`
                      : 'WARNING: Mất người trong Camera!'
                }}
              </span>
            </button>

            <!-- Rule 2: Portrait -->
            <button
              type="button"
              class="inline-flex items-center gap-1 px-2 py-1 rounded-md border font-medium cursor-pointer"
              :class="
                portraitDataUrl
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
              "
              @click="openCheckInModal"
            >
              <UserCheck class="w-3.5 h-3.5 shrink-0" />
              <span>{{ portraitDataUrl ? 'Chân dung: Đã chụp' : 'Chân dung: Chưa chụp' }}</span>
            </button>

            <!-- Rule 3: Screen Share -->
            <button
              type="button"
              class="inline-flex items-center gap-1 px-2 py-1 rounded-md border font-medium cursor-pointer"
              :class="
                isScreenShareActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
              "
              @click="openCheckInModal"
            >
              <MonitorUp class="w-3.5 h-3.5 shrink-0" />
              <span>{{ isScreenShareActive ? 'Share màn hình: ON' : 'Share màn hình: OFF' }}</span>
            </button>

            <!-- Rule 4: No Tab Switch -->
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
                    ? 'Không chuyển Tab: OK'
                    : 'Cảnh báo: Chuyển Tab / Rời màn hình!'
                }}
              </span>
            </span>

            <span
              v-if="isProctoringEnabled"
              class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border font-mono"
              :class="
                idleSeconds >= IDLE_TIMEOUT_SECONDS
                  ? 'bg-rose-50 text-rose-800 border-rose-300 font-bold'
                  : idleSeconds >= 90
                    ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
              "
            >
              <MousePointer class="w-3 h-3 shrink-0" />
              <span>Idle: {{ formatIdleTime(idleSeconds) }}/2m</span>
            </span>

            <button
              v-if="isProctoringEnabled"
              type="button"
              class="inline-flex items-center gap-1 px-2 py-1 rounded-md border font-mono transition-colors cursor-pointer"
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
            {{ isProctoringEnabled ? 'Giám sát: ON' : 'Giám sát: OFF' }}
          </button>
        </div>
      </div>

      <!-- Pre-Exam Proctoring Rules Check-in Modal -->
      <ExamProctoringGate
        mode="modal"
        @switch-to-practice="switchMode(true)"
        @open-logs="showProctoringLogModal = true"
      />

      <!-- Exam Room 2-Column Layout: Question Left (8/12) + 70-Question Map Right (4/12) -->
      <div class="exam-layout">
        <div class="exam-main-col">
          <QuestionCard
            :question="currentQuestion"
            :question-number="currentQuestionIndex + 1"
            :total-questions="totalQuestions"
            :selected-indices="currentAnswerState?.selectedIndices ?? []"
            :is-flagged="currentAnswerState?.isFlagged ?? false"
            :is-practice-mode="false"
            :show-explanation="false"
            :max-limit-warning="multiChoiceMaxLimitAlert"
            @select-option="selectOption"
            @toggle-flag="toggleFlagQuestion()"
          />

          <div class="question-bottom-nav shadow-2xs">
            <button
              type="button"
              :disabled="currentQuestionIndex === 0"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              @click="handlePrevQuestion"
            >
              <ChevronLeft class="w-4 h-4 shrink-0" />
              <span>Previous</span>
            </button>

            <div class="hidden lg:flex items-center gap-2 text-xs text-slate-400">
              <span>Shortcuts:</span>
              <kbd class="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">←</kbd>
              <kbd class="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">→</kbd>
              <span>navigate,</span>
              <kbd class="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono">F</kbd>
              <span>flag</span>
            </div>

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
              @click="handleNextQuestion"
            >
              <span>Next</span>
              <ChevronRight class="w-4 h-4 shrink-0" />
            </button>

            <button
              v-else
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
              @click="showSubmitModal = true"
            >
              <Send class="w-4 h-4 shrink-0" />
              <span>Finish & Submit</span>
            </button>
          </div>
        </div>

        <aside class="exam-sidebar-col">
          <!-- Live Proctoring Widget: Camera + Portrait + Screen Share + Anti-Tab-Switch -->
          <ExamProctoringGate
            mode="sidebar-widget"
            @switch-to-practice="switchMode(true)"
            @open-logs="showProctoringLogModal = true"
          />

          <QuestionNavGrid
            :questions="currentSession.questions"
            :answers="currentSession.answers"
            :current-index="currentQuestionIndex"
            :is-practice-mode="false"
            @select="handleNavigateTo"
          />

          <div class="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs">
            <div class="flex items-center gap-2 mb-3">
              <Layers class="w-4 h-4 text-slate-500 shrink-0" />
              <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Exam Blueprint (70 Qs)
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
                  {{ sec.quota }} Qs <span class="text-slate-400 font-normal">/ {{ sec.poolCount }} pool</span>
                </span>
              </li>
            </ul>
            <div class="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-700">
              <span>Pass Threshold (70%):</span>
              <span class="font-mono font-bold text-emerald-700">49 / 70 Qs</span>
            </div>
          </div>
        </aside>
      </div>
    </template>

    <!-- ======================================================================
         UI 2: DEDICATED INTERACTIVE PRACTICE STUDIO (Left Curriculum Tree + Center Study Workspace)
         ====================================================================== -->
    <template v-else>
      <!-- Top Indigo Practice Studio Header Banner -->
      <div class="rounded-2xl bg-indigo-950 text-white p-5 sm:p-6 shadow-md space-y-4">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex items-start sm:items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 flex items-center justify-center shrink-0">
              <Sparkles class="w-6 h-6" />
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-500 text-white">
                  PRACTICE STUDIO MODE
                </span>
                <span class="text-xs text-indigo-200 font-mono">
                  Không giới hạn giờ • Tự động chấm Đúng/Sai & mở Giải thích Tiếng Việt
                </span>
              </div>
              <h1 class="text-base sm:text-xl font-bold text-white mt-1">
                Phòng Luyện Tập Tương Tác Theo Chuyên Đề (5 Sections)
              </h1>
            </div>
          </div>

          <!-- Switch back to Exam Mode + Practice Actions -->
          <div class="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer"
              @click="switchMode(false)"
            >
              <ShieldCheck class="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Chuyển sang: Thi thử chuẩn</span>
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
              @click="showNewExamModal = true"
            >
              <RotateCcw class="w-3.5 h-3.5 shrink-0" />
              <span>Đổi bộ 70 câu khác</span>
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer shadow-2xs"
              @click="showSubmitModal = true"
            >
              <Send class="w-3.5 h-3.5 shrink-0" />
              <span>Tổng kết điểm</span>
            </button>
          </div>
        </div>

        <!-- 4 Live Practice Score KPI Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-indigo-800/80">
          <div class="p-3 rounded-xl bg-indigo-900/60 border border-indigo-800">
            <div class="text-[11px] text-indigo-300">Đã luyện tập</div>
            <div class="text-lg sm:text-xl font-mono font-bold text-white mt-0.5">
              {{ practiceStats.evaluatedCount }} <span class="text-xs text-indigo-300 font-normal">/ {{ totalQuestions }} câu</span>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-emerald-950/70 border border-emerald-700/60">
            <div class="text-[11px] text-emerald-300 flex items-center gap-1">
              <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" />
              <span>Trả lời Đúng</span>
            </div>
            <div class="text-lg sm:text-xl font-mono font-bold text-emerald-400 mt-0.5">
              {{ practiceStats.correctCount }} câu
            </div>
          </div>

          <div class="p-3 rounded-xl bg-rose-950/70 border border-rose-700/60">
            <div class="text-[11px] text-rose-300 flex items-center gap-1">
              <XCircle class="w-3.5 h-3.5 text-rose-400" />
              <span>Trả lời Sai</span>
            </div>
            <div class="text-lg sm:text-xl font-mono font-bold text-rose-400 mt-0.5">
              {{ practiceStats.wrongCount }} câu
            </div>
          </div>

          <div class="p-3 rounded-xl bg-indigo-900/60 border border-indigo-800">
            <div class="text-[11px] text-indigo-300">Độ chính xác hiện tại</div>
            <div
              class="text-lg sm:text-xl font-mono font-bold mt-0.5"
              :class="practiceStats.accuracy >= 70 ? 'text-emerald-400' : 'text-amber-300'"
            >
              {{ practiceStats.accuracy }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Practice Studio 2-Column Layout: Left Curriculum Sidebar (4/12) + Right Interactive Workspace (8/12) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- LEFT SIDEBAR: 5-Section Curriculum & Filter Tree -->
        <aside class="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
          <div class="bg-white rounded-2xl border border-indigo-200/90 p-4 shadow-2xs space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <BookOpen class="w-4 h-4 text-indigo-600" />
                <h2 class="text-xs font-bold uppercase tracking-wider text-indigo-950">
                  Lộ trình 5 Chuyên đề
                </h2>
              </div>
              <span class="text-xs font-mono text-slate-500">
                Câu #{{ currentQuestionIndex + 1 }}/{{ totalQuestions }}
              </span>
            </div>

            <!-- Filter Pills inside Practice Curriculum -->
            <div class="flex flex-wrap items-center gap-1.5 pt-1">
              <Filter class="w-3.5 h-3.5 text-slate-400 mr-0.5" />
              <button
                type="button"
                class="px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors"
                :class="
                  practiceFilter === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                "
                @click="practiceFilter = 'all'"
              >
                Tất cả ({{ totalQuestions }})
              </button>
              <button
                type="button"
                class="px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors"
                :class="
                  practiceFilter === 'wrong'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                "
                @click="practiceFilter = 'wrong'"
              >
                Câu sai ({{ practiceStats.wrongCount }})
              </button>
              <button
                type="button"
                class="px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors"
                :class="
                  practiceFilter === 'unanswered'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                "
                @click="practiceFilter = 'unanswered'"
              >
                Chưa làm ({{ practiceStats.remainingCount }})
              </button>
              <button
                type="button"
                class="px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors"
                :class="
                  practiceFilter === 'flagged'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                "
                @click="practiceFilter = 'flagged'"
              >
                Cắm cờ ({{ flaggedCount }})
              </button>
            </div>

            <!-- 5 Accordion-style Section Cards -->
            <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div
                v-for="sec in practiceCurriculumSections"
                :key="sec.id"
                class="p-3 rounded-xl border transition-all"
                :class="
                  sec.isActive
                    ? 'bg-indigo-50/50 border-indigo-300 ring-1 ring-indigo-300/50'
                    : 'bg-slate-50/60 border-slate-200/80'
                "
              >
                <div
                  class="flex items-center justify-between gap-2 cursor-pointer"
                  @click="goToQuestion(sec.firstGlobalIdx)"
                >
                  <div class="min-w-0">
                    <div class="text-xs font-bold text-slate-900 truncate">
                      {{ sec.indexNumber }}. {{ sec.shortName }}
                    </div>
                    <div class="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 font-mono">
                      <span>Đã làm {{ sec.doneInSec }}/{{ sec.total }}</span>
                      <span v-if="sec.correctInSec > 0" class="text-emerald-700 font-bold">
                        ✓{{ sec.correctInSec }}
                      </span>
                      <span v-if="sec.wrongInSec > 0" class="text-rose-600 font-bold">
                        ✗{{ sec.wrongInSec }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Question Number Pills inside this Section -->
                <div v-if="sec.items.length > 0" class="flex flex-wrap gap-1.5 mt-2.5">
                  <button
                    v-for="item in sec.items"
                    :key="item.question.id"
                    type="button"
                    class="w-7 h-7 rounded-lg font-mono text-[11px] font-bold border transition-all cursor-pointer flex items-center justify-center relative"
                    :class="[
                      item.globalIdx === currentQuestionIndex
                        ? 'ring-2 ring-indigo-600 ring-offset-1 scale-105'
                        : '',
                      item.evaluated && item.correct
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : item.evaluated && !item.correct
                          ? 'bg-rose-600 text-white border-rose-700'
                          : item.incompleteMulti
                            ? 'bg-rose-50 text-rose-800 border-2 border-rose-500'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400'
                    ]"
                    :title="
                      item.incompleteMulti
                        ? `WARNING: Câu ${item.globalIdx + 1} (Multiple Choice) chưa chọn đủ số đáp án!`
                        : `Câu ${item.globalIdx + 1}`
                    "
                    @click="handleNavigateTo(item.globalIdx)"
                  >
                    {{ item.globalIdx + 1 }}
                    <span
                      v-if="item.flagged"
                      class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 border border-white"
                    />
                    <span
                      v-if="item.incompleteMulti"
                      class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center leading-none border border-white"
                    >
                      !
                    </span>
                  </button>
                </div>
                <p v-else class="text-[11px] text-slate-400 italic mt-2">
                  Không có câu hỏi khớp bộ lọc ở phần này.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <!-- RIGHT WORKSPACE: Interactive Study Card + Quick Actions -->
        <div class="lg:col-span-8 space-y-4">
          <QuestionCard
            :question="currentQuestion"
            :question-number="currentQuestionIndex + 1"
            :total-questions="totalQuestions"
            :selected-indices="currentAnswerState?.selectedIndices ?? []"
            :is-flagged="currentAnswerState?.isFlagged ?? false"
            :is-practice-mode="true"
            :show-explanation="!!showInstantExplanation[currentQuestion.id]"
            :max-limit-warning="multiChoiceMaxLimitAlert"
            @select-option="selectOption"
            @apply-correct="applyCorrectAnswer()"
            @reset-selection="resetQuestionSelection()"
            @toggle-flag="toggleFlagQuestion()"
            @toggle-explanation="toggleInstantExplanation(currentQuestion.id)"
          />

          <!-- Practice Studio Bottom Navigation Bar -->
          <div class="question-bottom-nav shadow-2xs border-indigo-200/80">
            <button
              type="button"
              :disabled="currentQuestionIndex === 0"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              @click="handlePrevQuestion"
            >
              <ChevronLeft class="w-4 h-4 shrink-0" />
              <span>Câu trước</span>
            </button>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Tự động điền đáp án đúng và mở giải thích Tiếng Việt cho câu này"
                @click="applyCorrectAnswer()"
              >
                <CheckCheck class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Hiện & Chọn đáp án đúng</span>
              </button>

              <button
                type="button"
                class="mobile-map-trigger items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-semibold border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 cursor-pointer"
                @click="showMobileMapModal = true"
              >
                <Grid class="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{{ currentQuestionIndex + 1 }}/{{ totalQuestions }}</span>
              </button>
            </div>

            <button
              v-if="currentQuestionIndex < totalQuestions - 1"
              type="button"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
              @click="handleNextQuestion"
            >
              <span>Câu tiếp</span>
              <ChevronRight class="w-4 h-4 shrink-0" />
            </button>

            <button
              v-else
              type="button"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
              @click="showSubmitModal = true"
            >
              <Send class="w-4 h-4 shrink-0" />
              <span>Tổng kết điểm</span>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- EXAM MODE ONLY Modal Warning: 2 Minutes Mouse Inactivity -->
    <div
      v-if="isExamSimulationMode && isProctoringEnabled && showIdleWarning"
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
              Rời màn hình / Tab: <strong>{{ outZoneWarningCount }}</strong> • Mất mặt trong Camera: <strong>{{ faceMissingWarningCount }}</strong> • Chuột đứng yên 2p: <strong>{{ idleWarningCount }}</strong>
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
          :is-practice-mode="currentSession.isPracticeMode"
          @select="handleSelectQuestionFromMobileMap"
        />
      </div>
    </div>

    <!-- Modal Warning: Leaving a Multiple Choice Question with Incomplete Selection -->
    <div
      v-if="showIncompleteMultiModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="showIncompleteMultiModal = false"
    >
      <div class="bg-white rounded-2xl border-2 border-rose-500 max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle class="w-5 h-5" />
          </div>
          <div>
            <span class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-600 text-white">
              WARNING — MULTIPLE CHOICE THIẾU ĐÁP ÁN
            </span>
            <h3 class="text-base font-bold text-slate-900 mt-1">
              Câu #{{ currentQuestionIndex + 1 }} chưa chọn đủ số đáp án!
            </h3>
          </div>
        </div>

        <p class="text-xs sm:text-sm text-rose-950 bg-rose-50 border border-rose-200 rounded-xl p-3.5 leading-relaxed">
          Câu hỏi Multiple Choice này yêu cầu chọn đủ
          <strong>{{ currentMultiStatus.requiredCount }}</strong> đáp án, nhưng bạn mới chọn
          <strong>{{ currentMultiStatus.selectedCount }}/{{ currentMultiStatus.requiredCount }}</strong>
          (còn thiếu <strong>{{ currentMultiStatus.missingCount }}</strong> đáp án). Nếu để thiếu câu này sẽ không được tính điểm!
        </p>

        <div class="flex flex-wrap items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            class="px-3.5 py-2 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            @click="confirmLeaveIncompleteMulti"
          >
            Tạm bỏ qua & Chuyển câu
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
            @click="showIncompleteMultiModal = false"
          >
            Ở lại chọn đủ ({{ currentMultiStatus.selectedCount }}/{{ currentMultiStatus.requiredCount }})
          </button>
        </div>
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
            :class="
              incompleteMultiQuestions.length > 0
                ? 'bg-rose-100 text-rose-700'
                : unansweredCount > 0
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
            "
          >
            <AlertTriangle v-if="incompleteMultiQuestions.length > 0" class="w-5 h-5" />
            <AlertCircle v-else-if="unansweredCount > 0" class="w-5 h-5" />
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
            <div class="text-[11px] text-slate-500">Đã làm đủ</div>
          </div>
          <div>
            <div
              class="text-lg font-mono font-bold"
              :class="unansweredCount > 0 ? 'text-rose-600' : 'text-slate-900'"
            >
              {{ unansweredCount }}
            </div>
            <div class="text-[11px] text-slate-500">Chưa đủ / Bỏ trống</div>
          </div>
          <div>
            <div class="text-lg font-mono font-bold text-amber-600">{{ flaggedCount }}</div>
            <div class="text-[11px] text-slate-500">Cắm cờ</div>
          </div>
        </div>

        <!-- Dedicated Red Warning if any Multiple Choice question has missing selections -->
        <div
          v-if="incompleteMultiQuestions.length > 0"
          role="alert"
          class="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-950 space-y-2 text-xs"
        >
          <div class="flex items-center gap-1.5 font-bold text-rose-700 uppercase">
            <AlertTriangle class="w-4 h-4 shrink-0" />
            <span>WARNING: {{ incompleteMultiQuestions.length }} câu Multiple Choice chọn THIẾU đáp án!</span>
          </div>
          <p class="text-rose-900">
            Các câu dưới đây chưa chọn đủ số đáp án yêu cầu (bấm vào từng câu để quay lại chọn bổ sung):
          </p>
          <div class="flex flex-wrap gap-1.5 pt-0.5">
            <button
              v-for="item in incompleteMultiQuestions"
              :key="item.questionId"
              type="button"
              class="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-mono text-[11px] font-bold hover:bg-rose-700 cursor-pointer"
              @click="jumpDirectlyFromModal(item.index)"
            >
              Câu #{{ item.questionNumber }} ({{ item.selectedCount }}/{{ item.requiredCount }})
            </button>
          </div>
        </div>

        <p
          v-if="unansweredMultiQuestions.length > 0"
          class="text-xs text-amber-900 bg-amber-50 border border-amber-300 rounded-lg p-3"
        >
          Ngoài ra còn <strong>{{ unansweredMultiQuestions.length }} câu Multiple Choice</strong> chưa chọn phương án nào (0/N).
        </p>

        <p v-if="unansweredCount > 0" class="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Tổng cộng còn <strong>{{ unansweredCount }} câu chưa hoàn thành đủ đáp án</strong>. Các câu chọn thiếu hoặc bỏ trống sẽ bị tính 0 điểm. Bạn có chắc chắn muốn nộp bài ngay?
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
              <div class="text-[11px] text-slate-300 mt-0.5">90 phút đếm ngược, bật giám sát Browser, chỉ hiện đáp án sau khi nộp bài</div>
            </div>
            <ChevronRight class="w-4 h-4 shrink-0" />
          </button>

          <button
            type="button"
            class="w-full p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/70 text-indigo-950 text-left hover:bg-indigo-100/80 transition-colors cursor-pointer flex items-center justify-between gap-2"
            @click="handleStartFreshExam(true)"
          >
            <div>
              <div class="text-xs font-bold">Chế độ Luyện tập tương tác (Practice Studio)</div>
              <div class="text-[11px] text-indigo-700 mt-0.5">Tự động chấm Xanh/Đỏ và hiện giải thích Tiếng Việt ngay sau mỗi câu, tắt giám sát Browser</div>
            </div>
            <ChevronRight class="w-4 h-4 shrink-0 text-indigo-600" />
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
