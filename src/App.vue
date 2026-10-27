<script setup lang="ts">
import { onMounted } from 'vue'
import { ShieldCheck, FileText, Award, History, BookOpen } from 'lucide-vue-next'
import { useExamViewModel } from '@/viewmodels/useExamViewModel'
import { ExamGeneratorService } from '@/services/exam-generator.service'
import ExamView from '@/views/ExamView.vue'
import StudyBankView from '@/views/StudyBankView.vue'
import ResultView from '@/views/ResultView.vue'
import HistoryView from '@/views/HistoryView.vue'

const {
  activeScreen,
  latestResult,
  examHistory,
  initializeOrRestoreSession,
  navigateTo
} = useExamViewModel()

const bankStats = ExamGeneratorService.getQuestionBankStats()

onMounted(() => {
  initializeOrRestoreSession()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900">
    <!-- Minimalist Sticky Top Navbar (Desktop-First Responsive) -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div class="app-container app-header-inner">
        <!-- Brand Identity -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-2xs shrink-0">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-sm sm:text-base tracking-tight text-slate-900 truncate">
                  Backbase Android Exam
                </span>
                <span class="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  {{ bankStats.totalPoolCount }} Qs Pool
                </span>
              </div>
              <p class="text-[11px] text-slate-500 hidden sm:block truncate">
                70 Questions • 90 Minutes • Pass Threshold 70% (49/70)
              </p>
            </div>
          </div>
        </div>

        <!-- View Switcher Tabs -->
        <nav class="app-nav" aria-label="Main Navigation">
          <button
            type="button"
            class="app-nav-btn cursor-pointer"
            :class="
              activeScreen === 'exam'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            "
            @click="navigateTo('exam')"
          >
            <FileText class="w-3.5 h-3.5 shrink-0" />
            <span>Làm bài thi</span>
          </button>

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
            <span>Ôn tập & Ngân hàng</span>
            <span class="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800">
              {{ bankStats.totalPoolCount }}
            </span>
          </button>

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
