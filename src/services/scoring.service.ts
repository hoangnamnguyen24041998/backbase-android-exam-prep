import {
  EXAM_CONFIG,
  EXAM_SECTIONS,
  type ExamResult,
  type ExamSession,
  type Question,
  type QuestionReviewItem,
  type SectionId,
  type SectionScoreBreakdown
} from '@/models/exam.types'

export class ScoringService {
  /**
   * Checks if the user's selected answer indices exactly match the question's correctAnswers.
   * For multi-choice questions, all correct options (and no incorrect options) must be selected.
   */
  static isAnswerCorrect(question: Question, selectedIndices: number[]): boolean {
    if (!selectedIndices || selectedIndices.length === 0) {
      return false
    }
    if (selectedIndices.length !== question.correctAnswers.length) {
      return false
    }
    const sortedSelected = [...selectedIndices].sort((a, b) => a - b)
    const sortedCorrect = [...question.correctAnswers].sort((a, b) => a - b)

    return sortedSelected.every((val, index) => val === sortedCorrect[index])
  }

  /**
   * Evaluates a completed ExamSession and produces a comprehensive ExamResult
   */
  static evaluateSession(session: ExamSession): ExamResult {
    const reviewItems: QuestionReviewItem[] = []
    let correctCount = 0
    let answeredCount = 0
    let flaggedCount = 0

    const sectionStats: Record<SectionId, { correct: number; total: number }> = {
      fundamentals: { correct: 0, total: 0 },
      architecture: { correct: 0, total: 0 },
      setup: { correct: 0, total: 0 },
      adopt: { correct: 0, total: 0 },
      extend: { correct: 0, total: 0 }
    }

    for (const question of session.questions) {
      const answerState = session.answers[question.id]
      const selectedIndices = answerState ? [...answerState.selectedIndices].sort((a, b) => a - b) : []
      const isFlagged = answerState?.isFlagged ?? false
      const isAnswered = selectedIndices.length > 0
      const isCorrect = this.isAnswerCorrect(question, selectedIndices)

      if (isAnswered) answeredCount++
      if (isFlagged) flaggedCount++
      if (isCorrect) correctCount++

      sectionStats[question.section].total++
      if (isCorrect) {
        sectionStats[question.section].correct++
      }

      reviewItems.push({
        question,
        selectedIndices,
        isCorrect,
        isAnswered,
        isFlagged
      })
    }

    const totalQuestions = session.questions.length
    const scorePercentage =
      totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 1000) / 10 : 0
    const passed = correctCount >= EXAM_CONFIG.PASSING_SCORE

    const sectionOrder: SectionId[] = ['fundamentals', 'architecture', 'setup', 'adopt', 'extend']
    const sectionBreakdown: SectionScoreBreakdown[] = sectionOrder.map((sectionId) => {
      const meta = EXAM_SECTIONS[sectionId]
      const stat = sectionStats[sectionId]
      const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0
      return {
        sectionId,
        sectionName: meta.name,
        shortName: meta.shortName,
        correctCount: stat.correct,
        totalCount: stat.total,
        percentage: pct
      }
    })

    const timeSpentSeconds = Math.max(0, session.durationSeconds - session.remainingSeconds)

    return {
      id: session.id,
      completedAt: new Date().toISOString(),
      timeSpentSeconds,
      totalQuestions,
      correctCount,
      answeredCount,
      unansweredCount: totalQuestions - answeredCount,
      flaggedCount,
      scorePercentage,
      passed,
      sectionBreakdown,
      reviewItems
    }
  }
}
