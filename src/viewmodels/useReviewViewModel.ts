import { computed, ref, type Ref } from 'vue'
import type { ExamResult, QuestionReviewItem, SectionId } from '@/models/exam.types'

export type ReviewStatusFilter = 'all' | 'incorrect' | 'correct' | 'unanswered' | 'flagged'

export function useReviewViewModel(resultRef: Ref<ExamResult | null>) {
  const statusFilter = ref<ReviewStatusFilter>('all')
  const sectionFilter = ref<SectionId | 'all'>('all')
  const searchQuery = ref('')

  const filteredReviewItems = computed< Array<QuestionReviewItem & { originalNumber: number }> >(() => {
    const res = resultRef.value
    if (!res) return []

    return res.reviewItems
      .map((item, idx) => ({
        ...item,
        originalNumber: idx + 1
      }))
      .filter((item) => {
        // Status filter
        if (statusFilter.value === 'incorrect' && item.isCorrect) return false
        if (statusFilter.value === 'correct' && !item.isCorrect) return false
        if (statusFilter.value === 'unanswered' && item.isAnswered) return false
        if (statusFilter.value === 'flagged' && !item.isFlagged) return false

        // Section filter
        if (sectionFilter.value !== 'all' && item.question.section !== sectionFilter.value) {
          return false
        }

        // Search query filter
        const q = searchQuery.value.trim().toLowerCase()
        if (q) {
          const inQuestion = item.question.question.toLowerCase().includes(q)
          const inExplanation = item.question.explanation.toLowerCase().includes(q)
          const inOptions = item.question.options.some((opt) => opt.toLowerCase().includes(q))
          if (!inQuestion && !inExplanation && !inOptions) return false
        }

        return true
      })
  })

  const filterCounts = computed(() => {
    const res = resultRef.value
    if (!res) {
      return {
        all: 0,
        incorrect: 0,
        correct: 0,
        unanswered: 0,
        flagged: 0
      }
    }
    const items = res.reviewItems
    return {
      all: items.length,
      incorrect: items.filter((i) => !i.isCorrect).length,
      correct: items.filter((i) => i.isCorrect).length,
      unanswered: items.filter((i) => !i.isAnswered).length,
      flagged: items.filter((i) => i.isFlagged).length
    }
  })

  function resetFilters() {
    statusFilter.value = 'all'
    sectionFilter.value = 'all'
    searchQuery.value = ''
  }

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs.toString().padStart(2, '0')}s`
  }

  return {
    statusFilter,
    sectionFilter,
    searchQuery,
    filteredReviewItems,
    filterCounts,
    resetFilters,
    formatDuration
  }
}
