/**
 * [MODEL] Core Data Schemas, Entities & Exam Constants
 * Backbase Certified Android Developer Exam Simulator
 */

export type SectionId = 'fundamentals' | 'architecture' | 'setup' | 'adopt' | 'extend'

export type QuestionType = 'single' | 'multi'

export interface Question {
  id: number
  section: SectionId
  sectionName: string
  type: QuestionType
  question: string
  options: string[]
  correctAnswers: number[]
  explanation: string
}

export interface SectionMetadata {
  id: SectionId
  name: string
  shortName: string
  quota: number
  description: string
}

export const EXAM_SECTIONS: Record<SectionId, SectionMetadata> = {
  fundamentals: {
    id: 'fundamentals',
    name: 'Section 1: Backbase Fundamentals',
    shortName: 'Fundamentals',
    quota: 13,
    description: 'Triết lý Adopt before Adapt, EBP Architecture, DBS/BBS, Way of Working, White-labeling'
  },
  architecture: {
    id: 'architecture',
    name: 'Section 2: Mobile Essentials Android Architecture',
    shortName: 'Architecture',
    quota: 14,
    description: 'Clean Architecture 3 tầng (Pure Kotlin Domain, Data, Presentation UDF), IoC, module-api/impl'
  },
  setup: {
    id: 'setup',
    name: 'Section 3: Setup Development Environment',
    shortName: 'Setup Env',
    quota: 10,
    description: 'gradle.properties, Backbase BOM, Backbase.initialize, Authenticator 401, Certificate Pinning'
  },
  adopt: {
    id: 'adopt',
    name: 'Section 4: Android Essentials for Journeys (Adopt)',
    shortName: 'Journeys (Adopt)',
    quota: 11,
    description: 'Configuration Provider, Feature Flags, MDS Design Tokens, BackbaseTheme, View Slotting/Slot API'
  },
  extend: {
    id: 'extend',
    name: 'Section 5: Android Essentials for Journeys (Extend and Build)',
    shortName: 'Extend & Build',
    quota: 22,
    description: 'Decorator Pattern UseCase + Hilt @Binds, Screen Factory, Router Interface, OkHttp Interceptor, Turbine'
  }
}

export const EXAM_CONFIG = {
  TOTAL_QUESTIONS: 70,
  DURATION_SECONDS: 90 * 60, // 90 minutes = 5400 seconds
  PASSING_SCORE: 49,         // 49/70 = 70%
  PASSING_PERCENTAGE: 70
} as const

export interface AnswerState {
  questionId: number
  selectedIndices: number[]
  isFlagged: boolean
}

export interface ExamSession {
  id: string
  startedAt: string
  durationSeconds: number
  remainingSeconds: number
  questions: Question[]
  answers: Record<number, AnswerState>
  currentQuestionIndex: number
  isPracticeMode: boolean // Cho phép bật chế độ xem giải thích ngay khi luyện tập (tuỳ chọn)
}

export interface SectionScoreBreakdown {
  sectionId: SectionId
  sectionName: string
  shortName: string
  correctCount: number
  totalCount: number
  percentage: number
}

export interface QuestionReviewItem {
  question: Question
  selectedIndices: number[]
  isCorrect: boolean
  isAnswered: boolean
  isFlagged: boolean
}

export interface ExamResult {
  id: string
  completedAt: string
  timeSpentSeconds: number
  totalQuestions: number
  correctCount: number
  answeredCount: number
  unansweredCount: number
  flaggedCount: number
  scorePercentage: number
  passed: boolean
  sectionBreakdown: SectionScoreBreakdown[]
  reviewItems: QuestionReviewItem[]
}
