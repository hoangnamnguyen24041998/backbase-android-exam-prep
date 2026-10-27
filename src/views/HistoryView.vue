<script setup lang="ts">
import { computed } from 'vue'
import {
  History,
  Award,
  XCircle,
  Clock,
  Trash2,
  Eye,
  Play,
  TrendingUp,
  CheckCircle2
} from 'lucide-vue-next'
import { useExamViewModel } from '@/viewmodels/useExamViewModel'

const {
  examHistory,
  isExamActive,
  viewHistoricalResult,
  deleteHistoryItem,
  clearAllHistory,
  startNewExam,
  navigateTo
} = useExamViewModel()

const totalAttempts = computed(() => examHistory.value.length)
const passedAttempts = computed(() => examHistory.value.filter((h) => h.passed).length)
const bestScore = computed(() => {
  if (examHistory.value.length === 0) return 0
  return Math.max(...examHistory.value.map((h) => h.scorePercentage))
})
const averageScore = computed(() => {
  if (examHistory.value.length === 0) return 0
  const sum = examHistory.value.reduce((acc, h) => acc + h.scorePercentage, 0)
  return Math.round((sum / examHistory.value.length) * 10) / 10
})

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  } catch {
    return iso
  }
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs.toString().padStart(2, '0')}s`
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header & Summary Stats (Desktop-First Responsive) -->
    <section class="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 shadow-2xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <History class="w-4 h-4 shrink-0" />
            <span>LocalStorage Persistence</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Lịch sử các lần thi thử
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
            Theo dõi tiến độ luyện đề Backbase Certified Android Developer của bạn qua từng lần làm bài
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <button
            v-if="isExamActive"
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer"
            @click="navigateTo('exam')"
          >
            <Play class="w-3.5 h-3.5 shrink-0" />
            <span>Tiếp tục bài đang thi</span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
            @click="startNewExam(false, false)"
          >
            <span>Tạo đề thi mới (70 câu)</span>
          </button>

          <button
            v-if="examHistory.length > 0"
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 cursor-pointer transition-colors"
            @click="clearAllHistory"
          >
            <Trash2 class="w-3.5 h-3.5 shrink-0" />
            <span>Xóa tất cả</span>
          </button>
        </div>
      </div>

      <!-- KPI Cards (Desktop: 4 cols -> Tablet/Mobile: 2 cols) -->
      <div class="history-kpi-grid">
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div class="text-xs text-slate-500 font-medium">Tổng số lần thi</div>
          <div class="text-xl sm:text-2xl font-mono font-bold text-slate-900 mt-1">{{ totalAttempts }}</div>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div class="text-xs text-slate-500 font-medium flex items-center gap-1">
            <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span class="truncate">Số lần Đạt (≥ 70%)</span>
          </div>
          <div class="text-xl sm:text-2xl font-mono font-bold text-emerald-600 mt-1">
            {{ passedAttempts }} <span class="text-sm text-slate-400 font-normal">/ {{ totalAttempts }}</span>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div class="text-xs text-slate-500 font-medium flex items-center gap-1">
            <TrendingUp class="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <span>Điểm cao nhất</span>
          </div>
          <div class="text-xl sm:text-2xl font-mono font-bold text-slate-900 mt-1">{{ bestScore }}%</div>
        </div>

        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div class="text-xs text-slate-500 font-medium">Điểm trung bình</div>
          <div class="text-xl sm:text-2xl font-mono font-bold text-slate-900 mt-1">{{ averageScore }}%</div>
        </div>
      </div>
    </section>

    <!-- History List -->
    <section v-if="examHistory.length > 0" class="space-y-3">
      <article
        v-for="(item, index) in examHistory"
        :key="item.id"
        class="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition-all history-item-card"
      >
        <div class="flex items-start sm:items-center gap-3.5">
          <div
            class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
            :class="
              item.passed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700'
            "
          >
            <Award v-if="item.passed" class="w-5 h-5" />
            <XCircle v-else class="w-5 h-5" />
          </div>

          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-mono text-xs font-bold text-slate-900">
                Lần thi #{{ examHistory.length - index }}
              </span>
              <span
                class="text-[11px] font-bold px-2 py-0.5 rounded"
                :class="
                  item.passed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                "
              >
                {{ item.passed ? 'PASSED' : 'FAILED' }}
              </span>
              <span class="text-xs text-slate-400 font-mono">
                {{ formatDateTime(item.completedAt) }}
              </span>
            </div>

            <!-- Section mini pills -->
            <div class="flex flex-wrap items-center gap-1.5 mt-2">
              <span
                v-for="sec in item.sectionBreakdown"
                :key="sec.sectionId"
                class="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono"
              >
                {{ sec.shortName }}: <strong class="text-slate-900">{{ sec.correctCount }}/{{ sec.totalCount }}</strong>
              </span>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <div class="text-left lg:text-right">
            <div class="font-mono text-base sm:text-lg font-bold text-slate-900">
              {{ item.correctCount }}/{{ item.totalQuestions }}
              <span
                class="text-sm ml-1"
                :class="item.passed ? 'text-emerald-600' : 'text-rose-600'"
              >
                ({{ item.scorePercentage }}%)
              </span>
            </div>
            <div class="flex items-center gap-1 text-xs text-slate-400">
              <Clock class="w-3 h-3 shrink-0" />
              <span>{{ formatDuration(item.timeSpentSeconds) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
              @click="viewHistoricalResult(item)"
            >
              <Eye class="w-3.5 h-3.5 shrink-0" />
              <span>Xem chi tiết</span>
            </button>

            <button
              type="button"
              class="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Xóa kết quả này"
              @click="deleteHistoryItem(item.id)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </article>
    </section>

    <!-- Empty History State -->
    <section
      v-else
      class="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3"
    >
      <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
        <History class="w-6 h-6" />
      </div>
      <h3 class="text-base font-semibold text-slate-900">Chưa có lịch sử làm bài</h3>
      <p class="text-xs text-slate-500 max-w-md mx-auto">
        Hoàn thành và nộp bài thi thử đầu tiên của bạn để hệ thống lưu trữ thống kê điểm số theo từng Section tại đây.
      </p>
    </section>
  </div>
</template>
