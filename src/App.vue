<script setup lang="ts">
import { onMounted } from 'vue'
import {
  ShieldCheck,
  Sparkles,
  Award,
  History,
  BookOpen,
  ExternalLink,
  LogOut
} from 'lucide-vue-next'
import { useExamViewModel } from '@/viewmodels/useExamViewModel'
import { useBrowserProctoring } from '@/viewmodels/useBrowserProctoring'
import { ExamGeneratorService } from '@/services/exam-generator.service'
import ExamView from '@/views/ExamView.vue'
import StudyBankView from '@/views/StudyBankView.vue'
import ResultView from '@/views/ResultView.vue'
import HistoryView from '@/views/HistoryView.vue'

const {
  activeScreen,
  currentSession,
  latestResult,
  examHistory,
  isDedicatedExamTab,
  isExamTabOpenInBackground,
  initializeOrRestoreSession,
  openDedicatedExamTab,
  closeDedicatedExamTab,
  togglePracticeMode,
  navigateTo
} = useExamViewModel()

const { stopAllProctoringStreams } = useBrowserProctoring()

const bankStats = ExamGeneratorService.getQuestionBankStats()

function handleLaunchExamInNewTab() {
  openDedicatedExamTab(false)
}

function handleOpenPracticeMode() {
  if (isDedicatedExamTab.value) {
    closeDedicatedExamTab()
    return
  }
  stopAllProctoringStreams()
  navigateTo('exam')
  if (currentSession.value && !currentSession.value.isPracticeMode) {
    togglePracticeMode()
  }
}

onMounted(() => {
  initializeOrRestoreSession()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900">
    <!-- ======================================================================
         HEADER A: DEDICATED EXAM TAB HEADER (?examTab=1)
         ====================================================================== -->
    <header
      v-if="isDedicatedExamTab"
      class="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800 shadow-md"
    >
      <div class="app-container app-header-inner">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
            <ShieldCheck class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-bold text-sm sm:text-base tracking-tight text-white truncate">
                Backbase Certification — Dedicated Exam Tab
              </span>
              <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500 text-slate-950 shrink-0">
                PROCTORED TAB
              </span>
            </div>
            <p class="text-[11px] text-slate-400 hidden sm:block truncate">
              Khi nộp bài thi xong: Hệ thống tự động tắt Camera, tắt Share màn hình, xóa Warning và đóng Tab thi này.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2.5">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs"
            title="Tắt Camera, tắt Share màn hình và đóng Tab thi này"
            @click="closeDedicatedExamTab"
          >
            <LogOut class="w-3.5 h-3.5 shrink-0" />
            <span>Đóng Tab Thi & Tắt Camera</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ======================================================================
         HEADER B: MAIN PORTAL TAB HEADER
         ====================================================================== -->
    <header
      v-else
      class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80"
    >
      <div class="app-container app-header-inner">
        <!-- Brand Identity -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs shrink-0">
              <Sparkles class="w-5 h-5" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-sm sm:text-base tracking-tight text-slate-900 truncate">
                  Backbase Android Exam
                </span>
                <span class="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  {{ bankStats.totalPoolCount }} Qs Pool (EN/VI)
                </span>
              </div>
              <p class="text-[11px] text-slate-500 hidden sm:block truncate">
                70 Questions • 90 Minutes • Pass Threshold 70% (49/70)
              </p>
            </div>
          </div>
        </div>

        <!-- View & Mode Switcher Tabs -->
        <nav class="app-nav" aria-label="Main Navigation">
          <!-- Tab 1: Launch Exam Simulation in a New Tab -->
          <button
            type="button"
            class="app-nav-btn cursor-pointer bg-slate-900 text-white hover:bg-slate-800 shadow-2xs"
            title="Mở phòng Thi thử chuẩn sang một Tab trình duyệt mới độc lập"
            @click="handleLaunchExamInNewTab"
          >
            <ExternalLink class="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>Thi thử chuẩn (Mở Tab mới)</span>
            <span
              v-if="isExamTabOpenInBackground"
              class="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500 text-slate-950 font-bold"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
              Đang thi
            </span>
          </button>

          <!-- Tab 2: Interactive Practice Mode -->
          <button
            type="button"
            class="app-nav-btn cursor-pointer"
            :class="
              activeScreen === 'exam'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-indigo-700'
            "
            @click="handleOpenPracticeMode"
          >
            <Sparkles class="w-3.5 h-3.5 shrink-0" />
            <span>Chế độ Luyện tập</span>
          </button>

          <!-- Tab 3: Study Bank & Cheat Sheet -->
          <button
            type="button"
            class="app-nav-btn cursor-pointer"
            :class="
              activeScreen === 'study'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            "
            @click="navigateTo('study')"
          >
            <BookOpen class="w-3.5 h-3.5 shrink-0" />
            <span>Ngân hàng & Cheat Sheet</span>
            <span class="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800">
              {{ bankStats.totalPoolCount }}
            </span>
          </button>

          <!-- Tab 4: Latest Result -->
          <button
            v-if="latestResult"
            type="button"
            class="app-nav-btn cursor-pointer"
            :class="
              activeScreen === 'result'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            "
            @click="navigateTo('result')"
          >
            <Award class="w-3.5 h-3.5 shrink-0" />
            <span>Kết quả vừa thi</span>
          </button>

          <!-- Tab 5: History -->
          <button
            type="button"
            class="app-nav-btn cursor-pointer"
            :class="
              activeScreen === 'history'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            "
            @click="navigateTo('history')"
          >
            <History class="w-3.5 h-3.5 shrink-0" />
            <span>Lịch sử</span>
            <span
              v-if="examHistory.length > 0"
              class="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/90 text-slate-800"
            >
              {{ examHistory.length }}
            </span>
          </button>
        </nav>
      </div>
    </header>

    <!-- Main View Container -->
    <main class="flex-1 app-container app-main">
      <!-- Banner on Main Tab when Exam Tab is running -->
      <div
        v-if="!isDedicatedExamTab && isExamTabOpenInBackground"
        class="mb-4 p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
      >
        <div class="flex items-center gap-3">
          <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <div class="text-xs sm:text-sm">
            <strong>Ca Thi thử chuẩn đang diễn ra ở Tab mới!</strong> Khi nộp bài bên Tab thi, Tab đó sẽ tự động tắt (kèm tắt Camera/Share màn hình) và hiển thị bảng điểm ngay tại đây.
          </div>
        </div>
        <button
          type="button"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer shrink-0 inline-flex items-center gap-1.5"
          @click="handleLaunchExamInNewTab"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>Chuyển tới Tab Thi</span>
        </button>
      </div>

      <ExamView v-if="activeScreen === 'exam'" />
      <StudyBankView v-else-if="activeScreen === 'study'" />
      <ResultView v-else-if="activeScreen === 'result'" />
      <HistoryView v-else-if="activeScreen === 'history'" />
    </main>

    <!-- Minimal Footer -->
    <footer class="border-t border-slate-200/80 bg-white py-4 mt-8">
      <div class="app-container flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 text-center sm:text-left">
        <span>Backbase Engagement Banking Platform (EBP) — Android Certification Prep</span>
        <span class="font-mono">Pool: {{ bankStats.totalPoolCount }} Questions • Desktop / Tablet / Mobile Ready</span>
      </div>
    </footer>
  </div>
</template>
