import { computed, ref } from 'vue'
import type { AnswerState, ExamResult, ExamSession, Question } from '@/models/exam.types'
import { ExamGeneratorService } from '@/services/exam-generator.service'
import { ScoringService } from '@/services/scoring.service'
import { StorageService } from '@/services/storage.service'
import { useBrowserProctoring } from '@/viewmodels/useBrowserProctoring'

export type AppScreen = 'exam' | 'study' | 'result' | 'history'

export interface IncompleteMultiItem {
  index: number
  questionNumber: number
  questionId: number
  selectedCount: number
  requiredCount: number
  missingCount: number
}

const EXAM_SYNC_CHANNEL_NAME = 'bb_android_exam_sync_channel_v1'
const EXAM_SYNC_STORAGE_KEY = 'bb_android_exam_last_sync_event_v1'

// Check if this browser tab was opened as the Dedicated Proctored Exam Tab (?examTab=1)
const initialUrlParams =
  typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
const isDedicatedExamTab = ref<boolean>(initialUrlParams?.get('examTab') === '1')
const isExamTabOpenInBackground = ref<boolean>(false)

// Singleton reactive state shared across views
const activeScreen = ref<AppScreen>('exam')
const currentSession = ref<ExamSession | null>(null)
const latestResult = ref<ExamResult | null>(StorageService.getExamHistory()[0] ?? null)
const examHistory = ref<ExamResult[]>(StorageService.getExamHistory())
const bookmarkedIds = ref<number[]>(StorageService.getBookmarkedQuestionIds())
const showInstantExplanation = ref<Record<number, boolean>>({})
const multiChoiceMaxLimitAlert = ref<string | null>(null)

let timerInterval: ReturnType<typeof setInterval> | null = null
let broadcastChannel: BroadcastChannel | null = null
let syncInitialized = false
let openedExamWindowRef: Window | null = null

function notifyOtherTabs(type: 'EXAM_COMPLETED' | 'EXAM_TAB_CLOSED' | 'EXAM_TAB_OPENED', resultId?: string) {
  const payload = { type, resultId, timestamp: Date.now() }
  try {
    if (broadcastChannel) {
      broadcastChannel.postMessage(payload)
    }
  } catch {
    // Ignore BroadcastChannel errors
  }
  try {
    localStorage.setItem(EXAM_SYNC_STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Ignore storage quota errors
  }
}

function handleIncomingSyncPayload(payload: {
  type?: string
  resultId?: string
  timestamp?: number
}) {
  if (!payload || !payload.type) return

  if (payload.type === 'EXAM_TAB_OPENED' && !isDedicatedExamTab.value) {
    isExamTabOpenInBackground.value = true
  } else if (payload.type === 'EXAM_TAB_CLOSED' && !isDedicatedExamTab.value) {
    isExamTabOpenInBackground.value = false
  } else if (payload.type === 'EXAM_COMPLETED' && !isDedicatedExamTab.value) {
    isExamTabOpenInBackground.value = false
    const updatedHistory = StorageService.getExamHistory()
    examHistory.value = updatedHistory
    latestResult.value =
      (payload.resultId
        ? updatedHistory.find((r) => r.id === payload.resultId)
        : updatedHistory[0]) ??
      updatedHistory[0] ??
      null
    activeScreen.value = 'result'
  }
}

function initCrossTabSync() {
  if (syncInitialized || typeof window === 'undefined') return
  syncInitialized = true

  try {
    if ('BroadcastChannel' in window) {
      broadcastChannel = new BroadcastChannel(EXAM_SYNC_CHANNEL_NAME)
      broadcastChannel.onmessage = (event) => {
        handleIncomingSyncPayload(event.data)
      }
    }
  } catch {
    // Fallback to storage event only
  }

  window.addEventListener('storage', (event) => {
    if (event.key === EXAM_SYNC_STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue)
        handleIncomingSyncPayload(parsed)
      } catch {
        // Ignore parse errors
      }
    }
  })

  if (isDedicatedExamTab.value) {
    notifyOtherTabs('EXAM_TAB_OPENED')
    window.addEventListener('beforeunload', () => {
      const { stopAllProctoringStreams } = useBrowserProctoring()
      stopAllProctoringStreams()
      notifyOtherTabs('EXAM_TAB_CLOSED')
    })
  }
}

export function useExamViewModel() {
  initCrossTabSync()

  const isExamActive = computed(() => currentSession.value !== null)

  const currentQuestionIndex = computed(() => currentSession.value?.currentQuestionIndex ?? 0)

  const currentQuestion = computed<Question | null>(() => {
    if (!currentSession.value) return null
    return currentSession.value.questions[currentSession.value.currentQuestionIndex] ?? null
  })

  const currentAnswerState = computed<AnswerState | null>(() => {
    if (!currentSession.value || !currentQuestion.value) return null
    return (
      currentSession.value.answers[currentQuestion.value.id] ?? {
        questionId: currentQuestion.value.id,
        selectedIndices: [],
        isFlagged: false
      }
    )
  })

  const totalQuestions = computed(() => currentSession.value?.questions.length ?? 70)

  // Only count a question as fully answered when it has selected ALL required choices
  const answeredCount = computed(() => {
    if (!currentSession.value) return 0
    const ans = currentSession.value.answers
    return currentSession.value.questions.filter((q) => {
      const selCount = ans[q.id]?.selectedIndices.length ?? 0
      return selCount >= q.correctAnswers.length
    }).length
  })

  // Multiple-choice questions where candidate started selecting (selected > 0) but hasn't picked enough answers yet
  const incompleteMultiQuestions = computed<IncompleteMultiItem[]>(() => {
    if (!currentSession.value) return []
    const ans = currentSession.value.answers
    const items: IncompleteMultiItem[] = []
    currentSession.value.questions.forEach((q, idx) => {
      if (q.type !== 'multi') return
      const selectedCount = ans[q.id]?.selectedIndices.length ?? 0
      const requiredCount = q.correctAnswers.length
      if (selectedCount > 0 && selectedCount < requiredCount) {
        items.push({
          index: idx,
          questionNumber: idx + 1,
          questionId: q.id,
          selectedCount,
          requiredCount,
          missingCount: requiredCount - selectedCount
        })
      }
    })
    return items
  })

  // Unanswered (0 selected) multiple-choice questions
  const unansweredMultiQuestions = computed<IncompleteMultiItem[]>(() => {
    if (!currentSession.value) return []
    const ans = currentSession.value.answers
    const items: IncompleteMultiItem[] = []
    currentSession.value.questions.forEach((q, idx) => {
      if (q.type !== 'multi') return
      const selectedCount = ans[q.id]?.selectedIndices.length ?? 0
      const requiredCount = q.correctAnswers.length
      if (selectedCount === 0) {
        items.push({
          index: idx,
          questionNumber: idx + 1,
          questionId: q.id,
          selectedCount: 0,
          requiredCount,
          missingCount: requiredCount
        })
      }
    })
    return items
  })

  const flaggedCount = computed(() => {
    if (!currentSession.value) return 0
    return Object.values(currentSession.value.answers).filter((a) => a.isFlagged).length
  })

  const unansweredCount = computed(() => totalQuestions.value - answeredCount.value)

  const progressPercentage = computed(() => {
    if (totalQuestions.value === 0) return 0
    return Math.round((answeredCount.value / totalQuestions.value) * 100)
  })

  const remainingSeconds = computed(() => currentSession.value?.remainingSeconds ?? 5400)

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  function startTimer() {
    stopTimer()
    timerInterval = setInterval(() => {
      if (!currentSession.value) {
        stopTimer()
        return
      }
      if (currentSession.value.remainingSeconds > 0) {
        currentSession.value.remainingSeconds--
        if (currentSession.value.remainingSeconds % 5 === 0) {
          StorageService.saveActiveSession(currentSession.value)
        }
      } else {
        submitExam()
      }
    }, 1000)
  }

  /**
   * Restores an active session from LocalStorage if present, or starts a new one.
   * - If in Dedicated Exam Tab (?examTab=1): forces Strict Exam Simulation Mode (isPracticeMode = false) and opens Proctoring Check-in.
   * - If in Main Tab: defaults to Practice Mode (isPracticeMode = true) so clicking "Thi thử chuẩn" always launches a new Exam Tab.
   */
  function initializeOrRestoreSession() {
    const { openCheckInModal, stopAllProctoringStreams } = useBrowserProctoring()
    const saved = StorageService.loadActiveSession()

    if (isDedicatedExamTab.value) {
      if (saved && saved.questions.length > 0 && saved.remainingSeconds > 0) {
        saved.isPracticeMode = false
        currentSession.value = saved
        StorageService.saveActiveSession(saved)
        activeScreen.value = 'exam'
        startTimer()
      } else {
        startNewExam(false, false)
      }
      openCheckInModal()
      return
    }

    // Main Portal Tab: keep in Practice Studio Mode by default
    stopAllProctoringStreams()
    if (saved && saved.questions.length > 0 && saved.remainingSeconds > 0) {
      currentSession.value = { ...saved, isPracticeMode: true }
      activeScreen.value = 'exam'
    } else {
      startNewExam(true, false)
    }
  }

  /**
   * Starts a brand new 70-question exam session
   */
  function startNewExam(isPracticeMode = false, shuffleSectionOrder = false) {
    stopTimer()
    const { resetProctoringStats } = useBrowserProctoring()
    resetProctoringStats()
    showInstantExplanation.value = {}
    multiChoiceMaxLimitAlert.value = null
    const session = ExamGeneratorService.createNewSession(isPracticeMode, shuffleSectionOrder)
    currentSession.value = session
    StorageService.saveActiveSession(session)
    activeScreen.value = 'exam'
    if (!isPracticeMode || isDedicatedExamTab.value) {
      startTimer()
    }
  }

  /**
   * Launches the Strict Exam Simulation Mode in a brand new browser tab (?examTab=1).
   * When the exam is submitted in that new tab, the new tab turns off Camera/Screen Share and closes itself automatically.
   */
  function openDedicatedExamTab(forceFreshExam = false) {
    if (isDedicatedExamTab.value) {
      const { isAllRulesSatisfied, openCheckInModal } = useBrowserProctoring()
      if (forceFreshExam) {
        startNewExam(false, false)
      } else if (currentSession.value) {
        currentSession.value.isPracticeMode = false
      }
      if (!isAllRulesSatisfied.value) {
        openCheckInModal()
      }
      return
    }

    // Prepare a fresh or active 90m session in localStorage for the new Exam Tab
    if (forceFreshExam || !currentSession.value || currentSession.value.remainingSeconds <= 0) {
      const freshSession = ExamGeneratorService.createNewSession(false, false)
      StorageService.saveActiveSession(freshSession)
    } else {
      StorageService.saveActiveSession({
        ...currentSession.value,
        isPracticeMode: false
      })
    }

    // If an exam tab was already opened and is still alive, focus it
    if (openedExamWindowRef && !openedExamWindowRef.closed) {
      openedExamWindowRef.focus()
      isExamTabOpenInBackground.value = true
      return
    }

    const examUrl = `${window.location.origin}${window.location.pathname}?examTab=1`
    const newWin = window.open(examUrl, '_blank')
    if (newWin) {
      openedExamWindowRef = newWin
      isExamTabOpenInBackground.value = true
      newWin.focus()
    } else {
      // Fallback if browser popup blocker prevented window.open
      isDedicatedExamTab.value = true
      initializeOrRestoreSession()
    }
  }

  /**
   * Closes the Dedicated Exam Tab, stopping Camera & Screen Share immediately
   */
  function closeDedicatedExamTab() {
    stopTimer()
    const { stopAllProctoringStreams } = useBrowserProctoring()
    stopAllProctoringStreams()
    notifyOtherTabs('EXAM_TAB_CLOSED')

    if (typeof window !== 'undefined') {
      if (window.opener && !window.opener.closed) {
        try {
          window.opener.focus()
        } catch {
          // Ignore cross-origin focus errors
        }
      }
      window.close()

      // Fallback if window.close() was blocked (e.g. tab was not opened via script)
      setTimeout(() => {
        if (!window.closed) {
          isDedicatedExamTab.value = false
          const cleanUrl = `${window.location.origin}${window.location.pathname}`
          window.history.replaceState({}, '', cleanUrl)
          if (latestResult.value) {
            activeScreen.value = 'result'
          } else {
            initializeOrRestoreSession()
          }
        }
      }, 250)
    }
  }

  /**
   * Toggles or selects an option normally for the current question
   */
  function selectOption(optionIndex: number) {
    if (!currentSession.value || !currentQuestion.value) return
    const q = currentQuestion.value
    const existing = currentSession.value.answers[q.id] ?? {
      questionId: q.id,
      selectedIndices: [],
      isFlagged: false
    }

    if (q.type === 'single') {
      multiChoiceMaxLimitAlert.value = null
      existing.selectedIndices = [optionIndex]
    } else {
      const idx = existing.selectedIndices.indexOf(optionIndex)
      if (idx > -1) {
        multiChoiceMaxLimitAlert.value = null
        existing.selectedIndices = existing.selectedIndices.filter((i) => i !== optionIndex)
      } else {
        const requiredCount = q.correctAnswers.length
        if (existing.selectedIndices.length >= requiredCount) {
          multiChoiceMaxLimitAlert.value = `Câu này yêu cầu chọn đúng ${requiredCount} đáp án. Bạn đã chọn đủ ${requiredCount}/${requiredCount} — hãy bỏ chọn 1 đáp án nếu muốn đổi sang phương án khác!`
          return
        }
        multiChoiceMaxLimitAlert.value = null
        existing.selectedIndices = [...existing.selectedIndices, optionIndex].sort(
          (a, b) => a - b
        )
      }
    }

    currentSession.value.answers[q.id] = { ...existing }
    StorageService.saveActiveSession(currentSession.value)
  }

  /**
   * Immediately sets the current question's selection to all correct answers
   */
  function applyCorrectAnswer(questionId?: number) {
    if (!currentSession.value) return
    multiChoiceMaxLimitAlert.value = null
    const q =
      questionId !== undefined
        ? currentSession.value.questions.find((item) => item.id === questionId)
        : currentQuestion.value
    if (!q) return

    const existing = currentSession.value.answers[q.id] ?? {
      questionId: q.id,
      selectedIndices: [],
      isFlagged: false
    }

    existing.selectedIndices = [...q.correctAnswers].sort((a, b) => a - b)
    currentSession.value.answers[q.id] = { ...existing }
    StorageService.saveActiveSession(currentSession.value)
  }

  /**
   * Resets selection on the current question so user can re-pick from scratch
   */
  function resetQuestionSelection(questionId?: number) {
    if (!currentSession.value) return
    multiChoiceMaxLimitAlert.value = null
    const targetId = questionId ?? currentQuestion.value?.id
    if (targetId === undefined) return

    const existing = currentSession.value.answers[targetId]
    if (existing) {
      existing.selectedIndices = []
      currentSession.value.answers[targetId] = { ...existing }
      StorageService.saveActiveSession(currentSession.value)
    }
    showInstantExplanation.value[targetId] = false
  }

  /**
   * Toggles flag / bookmark on the current question
   */
  function toggleFlagQuestion(questionId?: number) {
    if (!currentSession.value) return
    const targetId = questionId ?? currentQuestion.value?.id
    if (targetId === undefined) return

    const existing = currentSession.value.answers[targetId]
    if (existing) {
      existing.isFlagged = !existing.isFlagged
      currentSession.value.answers[targetId] = { ...existing }
      StorageService.saveActiveSession(currentSession.value)
    }
    bookmarkedIds.value = StorageService.toggleBookmarkedQuestionId(targetId)
  }

  /**
   * Navigation between questions
   */
  function goToQuestion(index: number) {
    if (!currentSession.value) return
    if (index >= 0 && index < currentSession.value.questions.length) {
      multiChoiceMaxLimitAlert.value = null
      currentSession.value.currentQuestionIndex = index
      StorageService.saveActiveSession(currentSession.value)
    }
  }

  function nextQuestion() {
    if (!currentSession.value) return
    if (currentSession.value.currentQuestionIndex < currentSession.value.questions.length - 1) {
      multiChoiceMaxLimitAlert.value = null
      currentSession.value.currentQuestionIndex++
      StorageService.saveActiveSession(currentSession.value)
    }
  }

  function prevQuestion() {
    if (!currentSession.value) return
    if (currentSession.value.currentQuestionIndex > 0) {
      multiChoiceMaxLimitAlert.value = null
      currentSession.value.currentQuestionIndex--
      StorageService.saveActiveSession(currentSession.value)
    }
  }

  function togglePracticeMode() {
    if (!currentSession.value) return
    currentSession.value.isPracticeMode = !currentSession.value.isPracticeMode
    StorageService.saveActiveSession(currentSession.value)
  }

  function toggleInstantExplanation(questionId: number) {
    showInstantExplanation.value[questionId] = !showInstantExplanation.value[questionId]
  }

  /**
   * Submits the current exam:
   * 1. Stops active Camera & Screen Share streams and clears all warning counts
   * 2. Evaluates score and saves to LocalStorage history
   * 3. If running inside the Dedicated Exam Tab (?examTab=1), broadcasts result to Main Tab and closes this Exam Tab!
   */
  function submitExam(): ExamResult | null {
    if (!currentSession.value) return null
    stopTimer()
    const { stopAllProctoringStreams } = useBrowserProctoring()
    stopAllProctoringStreams()

    const result = ScoringService.evaluateSession(currentSession.value)
    latestResult.value = result
    examHistory.value = StorageService.saveExamResult(result)
    StorageService.clearActiveSession()

    if (isDedicatedExamTab.value) {
      notifyOtherTabs('EXAM_COMPLETED', result.id)
      currentSession.value = null
      activeScreen.value = 'result'

      if (typeof window !== 'undefined') {
        if (window.opener && !window.opener.closed) {
          try {
            window.opener.focus()
          } catch {
            // Ignore focus error
          }
        }
        // Automatically close the dedicated exam tab now that Camera is off & result is saved
        window.close()
      }
      return result
    }

    currentSession.value = null
    activeScreen.value = 'result'
    return result
  }

  /**
   * Opens a past ExamResult from HistoryView into ResultView
   */
  function viewHistoricalResult(result: ExamResult) {
    latestResult.value = result
    activeScreen.value = 'result'
  }

  function deleteHistoryItem(id: string) {
    examHistory.value = StorageService.deleteExamResult(id)
    if (latestResult.value?.id === id) {
      latestResult.value = examHistory.value[0] ?? null
    }
  }

  function clearAllHistory() {
    StorageService.clearExamHistory()
    examHistory.value = []
  }

  function navigateTo(screen: AppScreen) {
    activeScreen.value = screen
  }

  return {
    // State & Getters
    activeScreen,
    currentSession,
    latestResult,
    examHistory,
    bookmarkedIds,
    showInstantExplanation,
    multiChoiceMaxLimitAlert,
    isDedicatedExamTab,
    isExamTabOpenInBackground,
    isExamActive,
    currentQuestionIndex,
    currentQuestion,
    currentAnswerState,
    totalQuestions,
    answeredCount,
    incompleteMultiQuestions,
    unansweredMultiQuestions,
    flaggedCount,
    unansweredCount,
    progressPercentage,
    remainingSeconds,

    // Actions
    initializeOrRestoreSession,
    startNewExam,
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
    submitExam,
    viewHistoricalResult,
    deleteHistoryItem,
    clearAllHistory,
    navigateTo
  }
}
