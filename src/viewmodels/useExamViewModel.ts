import { computed, ref } from 'vue'
import type { AnswerState, ExamResult, ExamSession, Question } from '@/models/exam.types'
import { ExamGeneratorService } from '@/services/exam-generator.service'
import { ScoringService } from '@/services/scoring.service'
import { StorageService } from '@/services/storage.service'

export type AppScreen = 'exam' | 'study' | 'result' | 'history'

// Singleton reactive state shared across views
const activeScreen = ref<AppScreen>('exam')
const currentSession = ref<ExamSession | null>(null)
const latestResult = ref<ExamResult | null>(null)
const examHistory = ref<ExamResult[]>(StorageService.getExamHistory())
const bookmarkedIds = ref<number[]>(StorageService.getBookmarkedQuestionIds())
const showInstantExplanation = ref<Record<number, boolean>>({})

let timerInterval: ReturnType<typeof setInterval> | null = null

export function useExamViewModel() {
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

  const answeredCount = computed(() => {
    if (!currentSession.value) return 0
    return Object.values(currentSession.value.answers).filter(
      (a) => a.selectedIndices.length > 0
    ).length
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
   * Restores an active session from LocalStorage if present, or starts a new one
   */
  function initializeOrRestoreSession() {
    const saved = StorageService.loadActiveSession()
    if (saved && saved.questions.length > 0 && saved.remainingSeconds > 0) {
      currentSession.value = saved
      activeScreen.value = 'exam'
      startTimer()
    } else {
      startNewExam(false, false)
    }
  }

  /**
   * Starts a brand new 70-question exam session
   */
  function startNewExam(isPracticeMode = false, shuffleSectionOrder = false) {
    stopTimer()
    showInstantExplanation.value = {}
    const session = ExamGeneratorService.createNewSession(isPracticeMode, shuffleSectionOrder)
    currentSession.value = session
    StorageService.saveActiveSession(session)
    activeScreen.value = 'exam'
    startTimer()
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
      existing.selectedIndices = [optionIndex]
    } else {
      const idx = existing.selectedIndices.indexOf(optionIndex)
      if (idx > -1) {
        existing.selectedIndices = existing.selectedIndices.filter((i) => i !== optionIndex)
      } else {
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
      currentSession.value.currentQuestionIndex = index
      StorageService.saveActiveSession(currentSession.value)
    }
  }

  function nextQuestion() {
    if (!currentSession.value) return
    if (currentSession.value.currentQuestionIndex < currentSession.value.questions.length - 1) {
      currentSession.value.currentQuestionIndex++
      StorageService.saveActiveSession(currentSession.value)
    }
  }

  function prevQuestion() {
    if (!currentSession.value) return
    if (currentSession.value.currentQuestionIndex > 0) {
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
   * Submits the current exam, calculates score, saves to history, and navigates to ResultView
   */
  function submitExam(): ExamResult | null {
    if (!currentSession.value) return null
    stopTimer()
    const result = ScoringService.evaluateSession(currentSession.value)
    latestResult.value = result
    examHistory.value = StorageService.saveExamResult(result)
    StorageService.clearActiveSession()
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
    isExamActive,
    currentQuestionIndex,
    currentQuestion,
    currentAnswerState,
    totalQuestions,
    answeredCount,
    flaggedCount,
    unansweredCount,
    progressPercentage,
    remainingSeconds,

    // Actions
    initializeOrRestoreSession,
    startNewExam,
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
