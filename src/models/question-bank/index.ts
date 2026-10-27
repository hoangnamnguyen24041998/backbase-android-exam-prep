import type { Question, SectionId } from '../exam.types'
import { fundamentalsQuestions } from './fundamentals.data'
import { architectureQuestions } from './architecture.data'
import { setupQuestions } from './setup.data'
import { adoptQuestions } from './adopt.data'
import { extendBuildQuestions } from './extend-build.data'
export { ANCHOR_KEYWORDS, GOLDEN_EXAM_RULES } from './cheatsheet.data'
export type { AnchorKeywordItem, GoldenRuleItem } from './cheatsheet.data'

export const QUESTION_BANK_BY_SECTION: Record<SectionId, Question[]> = {
  fundamentals: fundamentalsQuestions,
  architecture: architectureQuestions,
  setup: setupQuestions,
  adopt: adoptQuestions,
  extend: extendBuildQuestions
}

export const ALL_QUESTIONS: Question[] = [
  ...fundamentalsQuestions,
  ...architectureQuestions,
  ...setupQuestions,
  ...adoptQuestions,
  ...extendBuildQuestions
]
