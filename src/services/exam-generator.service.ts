import {
  EXAM_CONFIG,
  EXAM_SECTIONS,
  type AnswerState,
  type ExamSession,
  type Question,
  type SectionId
} from '@/models/exam.types'
import { QUESTION_BANK_BY_SECTION } from '@/models/question-bank'

/**
 * Fisher-Yates unbiased shuffle algorithm
 */
function shuffleArray<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = copy[i]!
    copy[i] = copy[j]!
    copy[j] = temp
  }
  return copy
}

/**
 * Shuffles options inside a question and remaps `correctAnswers` indices accordingly
 */
function shuffleQuestionOptions(question: Question): Question {
  const indexedOptions = question.options.map((text, originalIndex) => ({
    text,
    isCorrect: question.correctAnswers.includes(originalIndex)
  }))

  const shuffled = shuffleArray(indexedOptions)

  const newOptions: string[] = []
  const newCorrectAnswers: number[] = []

  shuffled.forEach((item, newIndex) => {
    newOptions.push(item.text)
    if (item.isCorrect) {
      newCorrectAnswers.push(newIndex)
    }
  })

  return {
    ...question,
    options: newOptions,
    correctAnswers: newCorrectAnswers.sort((a, b) => a - b)
  }
}

export class ExamGeneratorService {
  /**
   * Generates a complete 70-question exam adhering strictly to the 5 Section quotas:
   * - Section 1 (fundamentals): 13 questions
   * - Section 2 (architecture): 14 questions
   * - Section 3 (setup): 10 questions
   * - Section 4 (adopt): 11 questions
   * - Section 5 (extend): 22 questions
   * Total = 70 questions
   */
  static generateExamQuestions(shuffleSectionOrder = false): Question[] {
    const sectionOrder: SectionId[] = ['fundamentals', 'architecture', 'setup', 'adopt', 'extend']
    const selectedQuestions: Question[] = []

    for (const sectionId of sectionOrder) {
      const pool = QUESTION_BANK_BY_SECTION[sectionId]
      const quota = EXAM_SECTIONS[sectionId].quota

      if (pool.length < quota) {
        throw new Error(
          `Insufficient questions in section "${sectionId}": required ${quota}, found ${pool.length}`
        )
      }

      const picked = shuffleArray(pool)
        .slice(0, quota)
        .map((q) => shuffleQuestionOptions(q))

      selectedQuestions.push(...picked)
    }

    return shuffleSectionOrder ? shuffleArray(selectedQuestions) : selectedQuestions
  }

  /**
   * Creates a fresh ExamSession ready for taking the test
   */
  static createNewSession(isPracticeMode = false, shuffleAll = false): ExamSession {
    const questions = this.generateExamQuestions(shuffleAll)
    const answers: Record<number, AnswerState> = {}

    for (const q of questions) {
      answers[q.id] = {
        questionId: q.id,
        selectedIndices: [],
        isFlagged: false
      }
    }

    return {
      id: `exam-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      startedAt: new Date().toISOString(),
      durationSeconds: EXAM_CONFIG.DURATION_SECONDS,
      remainingSeconds: EXAM_CONFIG.DURATION_SECONDS,
      questions,
      answers,
      currentQuestionIndex: 0,
      isPracticeMode
    }
  }

  /**
   * Returns statistics about the full Question Bank
   */
  static getQuestionBankStats() {
    const sections = (Object.keys(EXAM_SECTIONS) as SectionId[]).map((id) => ({
      ...EXAM_SECTIONS[id],
      poolCount: QUESTION_BANK_BY_SECTION[id].length,
      singleChoiceCount: QUESTION_BANK_BY_SECTION[id].filter((q) => q.type === 'single').length,
      multiChoiceCount: QUESTION_BANK_BY_SECTION[id].filter((q) => q.type === 'multi').length
    }))

    const totalPoolCount = sections.reduce((sum, s) => sum + s.poolCount, 0)

    return {
      totalPoolCount,
      totalExamQuota: EXAM_CONFIG.TOTAL_QUESTIONS,
      sections
    }
  }
}
