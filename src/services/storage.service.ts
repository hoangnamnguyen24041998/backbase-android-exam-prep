import type { ExamResult, ExamSession } from '@/models/exam.types'

const STORAGE_KEYS = {
  ACTIVE_SESSION: 'bb_android_exam_active_session_v1',
  EXAM_HISTORY: 'bb_android_exam_history_v1',
  BOOKMARKED_QUESTION_IDS: 'bb_android_exam_bookmarks_v1'
} as const

export class StorageService {
  /**
   * Saves the active in-progress exam session so reloading the page doesn't lose progress
   */
  static saveActiveSession(session: ExamSession | null): void {
    try {
      if (!session) {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION)
        return
      }
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session))
    } catch (err) {
      console.error('Failed to save active exam session:', err)
    }
  }

  /**
   * Loads the active in-progress exam session if present
   */
  static loadActiveSession(): ExamSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION)
      if (!raw) return null
      return JSON.parse(raw) as ExamSession
    } catch (err) {
      console.error('Failed to load active exam session:', err)
      return null
    }
  }

  /**
   * Clears the active session
   */
  static clearActiveSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION)
    } catch (err) {
      console.error('Failed to clear active session:', err)
    }
  }

  /**
   * Saves a completed exam result to history (newest first, capped at 30 attempts)
   */
  static saveExamResult(result: ExamResult): ExamResult[] {
    try {
      const history = this.getExamHistory()
      const filtered = history.filter((item) => item.id !== result.id)
      const updated = [result, ...filtered].slice(0, 30)
      localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(updated))
      return updated
    } catch (err) {
      console.error('Failed to save exam result:', err)
      return []
    }
  }

  /**
   * Retrieves all past exam results from LocalStorage
   */
  static getExamHistory(): ExamResult[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EXAM_HISTORY)
      if (!raw) return []
      return JSON.parse(raw) as ExamResult[]
    } catch (err) {
      console.error('Failed to read exam history:', err)
      return []
    }
  }

  /**
   * Deletes a single exam result by ID
   */
  static deleteExamResult(id: string): ExamResult[] {
    try {
      const history = this.getExamHistory().filter((item) => item.id !== id)
      localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(history))
      return history
    } catch (err) {
      console.error('Failed to delete exam result:', err)
      return []
    }
  }

  /**
   * Clears all exam history
   */
  static clearExamHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.EXAM_HISTORY)
    } catch (err) {
      console.error('Failed to clear exam history:', err)
    }
  }

  /**
   * Bookmarked/flagged question IDs across sessions
   */
  static getBookmarkedQuestionIds(): number[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKED_QUESTION_IDS)
      if (!raw) return []
      return JSON.parse(raw) as number[]
    } catch {
      return []
    }
  }

  static toggleBookmarkedQuestionId(questionId: number): number[] {
    try {
      const current = new Set(this.getBookmarkedQuestionIds())
      if (current.has(questionId)) {
        current.delete(questionId)
      } else {
        current.add(questionId)
      }
      const arr = Array.from(current)
      localStorage.setItem(STORAGE_KEYS.BOOKMARKED_QUESTION_IDS, JSON.stringify(arr))
      return arr
    } catch {
      return []
    }
  }
}
