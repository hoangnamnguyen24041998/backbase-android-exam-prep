<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  BookOpen,
  Zap,
  ShieldAlert,
  Search,
  Layers,
  Eye,
  EyeOff,
  CheckCircle2,
  HelpCircle
} from 'lucide-vue-next'
import { EXAM_SECTIONS, type Question, type SectionId } from '@/models/exam.types'
import {
  ALL_QUESTIONS,
  ANCHOR_KEYWORDS,
  GOLDEN_EXAM_RULES
} from '@/models/question-bank'
import { ExamGeneratorService } from '@/services/exam-generator.service'

type StudyTab = 'cheatsheet' | 'bank'
type BankSourceFilter = 'all' | 'gdoc120' | 'original116'

const activeTab = ref<StudyTab>('bank')
const sourceFilter = ref<BankSourceFilter>('all')
const sectionFilter = ref<'all' | SectionId>('all')
const typeFilter = ref<'all' | 'single' | 'multi'>('all')
const searchQuery = ref('')
const revealAllAnswers = ref(true)
const expandedQuestionIds = ref<Record<number, boolean>>({})

const bankStats = ExamGeneratorService.getQuestionBankStats()
const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F']

// Newly added 120 questions from Google Doc have IDs:
// fundamentals: 123..144, architecture: 225..248, setup: 317..334, adopt: 419..438, extend: 537..572
function isFromGoogleDoc(q: Question): boolean {
  if (q.section === 'fundamentals') return q.id >= 123
  if (q.section === 'architecture') return q.id >= 225
  if (q.section === 'setup') return q.id >= 317
  if (q.section === 'adopt') return q.id >= 419
  if (q.section === 'extend') return q.id >= 537
  return false
}

const filteredQuestions = computed(() => {
  const qLower = searchQuery.value.trim().toLowerCase()

  return ALL_QUESTIONS.filter((q) => {
    if (sourceFilter.value === 'gdoc120' && !isFromGoogleDoc(q)) return false
    if (sourceFilter.value === 'original116' && isFromGoogleDoc(q)) return false
    if (sectionFilter.value !== 'all' && q.section !== sectionFilter.value) return false
    if (typeFilter.value !== 'all' && q.type !== typeFilter.value) return false

    if (qLower) {
      const inQuestion = q.question.toLowerCase().includes(qLower)
      const inOptions = q.options.some((o) => o.toLowerCase().includes(qLower))
      const inExp = q.explanation.toLowerCase().includes(qLower)
      const inId = String(q.id).includes(qLower)
      return inQuestion || inOptions || inExp || inId
    }

    return true
  })
})

const filteredAnchorKeywords = computed(() => {
  const qLower = searchQuery.value.trim().toLowerCase()
  return ANCHOR_KEYWORDS.filter((item) => {
    if (sectionFilter.value !== 'all' && item.category !== sectionFilter.value) return false
    if (qLower) {
      return (
        item.trigger.toLowerCase().includes(qLower) ||
        item.reflexAnswer.toLowerCase().includes(qLower)
      )
    }
    return true
  })
})

function isAnswerVisible(id: number): boolean {
  if (revealAllAnswers.value) return true
  return !!expandedQuestionIds.value[id]
}

function toggleSingleQuestionAnswer(id: number) {
  expandedQuestionIds.value[id] = !expandedQuestionIds.value[id]
}

function getSectionBadgeClass(section: SectionId): string {
  switch (section) {
    case 'fundamentals':
      return 'bg-slate-100 text-slate-700 border-slate-200'
    case 'architecture':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
    case 'setup':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
    case 'adopt':
      return 'bg-amber-50 text-amber-800 border-amber-200/80'
    case 'extend':
      return 'bg-sky-50 text-sky-800 border-sky-200/80'
  }
}
</script>

<template>
  <div class="study-view space-y-6">
    <!-- Top Header & Mode Switcher -->
    <section class="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
      <div class="study-header-top">
        <div>
          <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            <BookOpen class="w-4 h-4" />
            <span>Tài liệu Ôn thi & Ngân hàng Câu hỏi Chuẩn hóa</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Ngân hàng {{ bankStats.totalPoolCount }} Câu hỏi & Nguyên lý Phản xạ 1-1
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1">
            Đã tích hợp đầy đủ <strong>120 câu hỏi nâng cao</strong> cùng Ma trận phản xạ từ khóa và 10 quy tắc vàng nhận diện bẫy phòng thi.
          </p>
        </div>

        <!-- Sub-view Switcher -->
        <div class="study-tab-switcher">
          <button
            type="button"
            class="study-tab-btn cursor-pointer"
            :class="activeTab === 'bank' ? 'is-active' : ''"
            @click="activeTab = 'bank'"
          >
            <Layers class="w-4 h-4 shrink-0" />
            <span>Ngân hàng câu hỏi ({{ bankStats.totalPoolCount }})</span>
          </button>
          <button
            type="button"
            class="study-tab-btn cursor-pointer"
            :class="activeTab === 'cheatsheet' ? 'is-active' : ''"
            @click="activeTab = 'cheatsheet'"
          >
            <Zap class="w-4 h-4 shrink-0" />
            <span>Nguyên lý Phản xạ & 10 Quy tắc</span>
          </button>
        </div>
      </div>

      <!-- Section Pool Summary Pills -->
      <div class="study-section-pills">
        <button
          type="button"
          class="study-section-pill cursor-pointer"
          :class="sectionFilter === 'all' ? 'is-active' : ''"
          @click="sectionFilter = 'all'"
        >
          <span>Tất cả 5 Section</span>
          <span class="font-mono font-bold">{{ bankStats.totalPoolCount }}</span>
        </button>
        <button
          v-for="sec in bankStats.sections"
          :key="sec.id"
          type="button"
          class="study-section-pill cursor-pointer"
          :class="sectionFilter === sec.id ? 'is-active' : ''"
          @click="sectionFilter = sec.id"
        >
          <span>{{ sec.shortName }}</span>
          <span class="font-mono font-bold">{{ sec.poolCount }} câu</span>
        </button>
      </div>
    </section>

    <!-- Filter & Search Controls -->
    <section class="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
      <div class="study-filter-bar">
        <!-- Left Filters -->
        <div v-if="activeTab === 'bank'" class="study-filter-group">
          <div class="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/70 flex-wrap gap-1">
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              :class="sourceFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
              @click="sourceFilter = 'all'"
            >
              Tất cả ({{ bankStats.totalPoolCount }})
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              :class="sourceFilter === 'gdoc120' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
              @click="sourceFilter = 'gdoc120'"
            >
              Bộ 120 câu mới (Google Doc)
            </button>
            <button
              type="button"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              :class="sourceFilter === 'original116' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
              @click="sourceFilter = 'original116'"
            >
              Bộ 116 câu chuyên sâu
            </button>
          </div>

          <select
            v-model="typeFilter"
            class="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-slate-900"
          >
            <option value="all">Mọi loại câu hỏi</option>
            <option value="single">Single Choice (1 đáp án)</option>
            <option value="multi">Multiple Response (Nhiều đáp án)</option>
          </select>
        </div>

        <div v-else class="text-xs font-medium text-slate-600">
          Hiển thị <strong>{{ filteredAnchorKeywords.length }}</strong> từ khóa phản xạ 1-1 & <strong>10</strong> quy tắc vàng phòng thi
        </div>

        <!-- Right Search & Reveal Toggle -->
        <div class="study-search-group">
          <div class="relative flex-1 sm:w-64">
            <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Tìm từ khóa (Hilt, BOM, 401, Slot API...)"
              class="w-full pl-8 pr-3 py-2 rounded-xl text-xs border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
            />
          </div>

          <button
            v-if="activeTab === 'bank'"
            type="button"
            class="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer shrink-0"
            :class="
              revealAllAnswers
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            "
            @click="revealAllAnswers = !revealAllAnswers"
          >
            <Eye v-if="revealAllAnswers" class="w-3.5 h-3.5" />
            <EyeOff v-else class="w-3.5 h-3.5" />
            <span>{{ revealAllAnswers ? 'Đang hiện đáp án' : 'Ẩn đáp án để tự nhẩm' }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- TAB 1: CHEAT SHEET (ANCHOR KEYWORDS & 10 GOLDEN RULES) -->
    <div v-if="activeTab === 'cheatsheet'" class="space-y-6">
      <!-- 10 Golden Exam Rules -->
      <section class="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
        <div class="flex items-center gap-2.5 mb-5">
          <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <ShieldAlert class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900">
              10 Quy Tắc Vàng Nhận Diện Bẫy Phòng Thi
            </h2>
            <p class="text-xs text-slate-500">
              Áp dụng ngay để loại trừ phương án nhiễu trong 5 giây đầu đọc câu hỏi
            </p>
          </div>
        </div>

        <div class="golden-rules-grid">
          <div
            v-for="item in GOLDEN_EXAM_RULES"
            :key="item.id"
            class="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 space-y-1.5"
          >
            <div class="flex items-center gap-2">
              <span class="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500 text-white">
                #{{ item.id }}
              </span>
              <h3 class="text-xs sm:text-sm font-bold text-slate-900">{{ item.title }}</h3>
            </div>
            <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">{{ item.rule }}</p>
          </div>
        </div>
      </section>

      <!-- 24 Anchor Keywords Matrix -->
      <section class="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs">
        <div class="flex items-center gap-2.5 mb-5">
          <div class="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Zap class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900">
              Ma Trận Phản Xạ Từ Khóa 1 - 1 (Đọc Đề → Khoanh Ngay)
            </h2>
            <p class="text-xs text-slate-500">
              24 cặp từ khóa neo (Anchor Keywords) cốt lõi xuất hiện xuyên suốt đề thi chứng chỉ
            </p>
          </div>
        </div>

        <div class="anchor-keywords-grid">
          <article
            v-for="kw in filteredAnchorKeywords"
            :key="kw.id"
            class="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:border-slate-300 transition-colors flex flex-col justify-between gap-2.5"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                  Phản xạ #{{ kw.id }}
                </span>
                <span
                  class="text-[11px] font-medium px-2 py-0.5 rounded border"
                  :class="getSectionBadgeClass(kw.category)"
                >
                  {{ EXAM_SECTIONS[kw.category].shortName }}
                </span>
              </div>
              <h3 class="text-sm font-bold text-slate-900 leading-snug">
                {{ kw.trigger }}
              </h3>
            </div>

            <div class="pt-2.5 border-t border-slate-200/70 text-xs sm:text-sm text-emerald-950 bg-emerald-50/60 p-3 rounded-lg border border-emerald-200/70 leading-relaxed">
              <strong class="text-emerald-800">→ Khoanh ngay:</strong> {{ kw.reflexAnswer }}
            </div>
          </article>
        </div>
      </section>
    </div>

    <!-- TAB 2: FULL QUESTION BANK -->
    <div v-else class="space-y-4">
      <div class="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Tìm thấy <strong class="text-slate-900 font-mono">{{ filteredQuestions.length }}</strong> câu hỏi khớp bộ lọc
        </span>
      </div>

      <article
        v-for="(q, index) in filteredQuestions"
        :key="q.id"
        class="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs"
      >
        <div class="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-900 text-white">
              #{{ index + 1 }} (ID: {{ q.id }})
            </span>

            <span
              class="text-xs font-medium px-2.5 py-1 rounded border"
              :class="getSectionBadgeClass(q.section)"
            >
              {{ EXAM_SECTIONS[q.section].shortName }}
            </span>

            <span
              class="text-xs font-medium px-2 py-0.5 rounded border"
              :class="
                q.type === 'multi'
                  ? 'bg-violet-50 text-violet-700 border-violet-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              "
            >
              {{ q.type === 'multi' ? `Chọn ${q.correctAnswers.length} đáp án` : 'Single Choice' }}
            </span>

            <span
              v-if="isFromGoogleDoc(q)"
              class="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200"
            >
              Mới cập nhật (Google Doc)
            </span>
          </div>

          <button
            v-if="!revealAllAnswers"
            type="button"
            class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            @click="toggleSingleQuestionAnswer(q.id)"
          >
            {{ isAnswerVisible(q.id) ? 'Ẩn đáp án' : 'Xem đáp án & giải thích' }}
          </button>
        </div>

        <div class="p-5 sm:p-6 space-y-4">
          <h3 class="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
            {{ q.question }}
          </h3>

          <div class="space-y-2">
            <div
              v-for="(optText, optIdx) in q.options"
              :key="optIdx"
              class="p-3.5 rounded-xl border text-xs sm:text-sm flex items-start justify-between gap-3 transition-colors"
              :class="
                isAnswerVisible(q.id) && q.correctAnswers.includes(optIdx)
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-medium'
                  : 'bg-white border-slate-200/80 text-slate-700'
              "
            >
              <div class="leading-relaxed whitespace-pre-wrap break-words flex-1">
                <span class="font-mono font-semibold mr-2">{{ optionLetters[optIdx] }}.</span>
                <span>{{ optText }}</span>
              </div>

              <span
                v-if="isAnswerVisible(q.id) && q.correctAnswers.includes(optIdx)"
                class="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-semibold"
              >
                <CheckCircle2 class="w-3 h-3" />
                <span>Đúng</span>
              </span>
            </div>
          </div>

          <div
            v-if="isAnswerVisible(q.id)"
            class="p-4 rounded-xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-700 leading-relaxed"
          >
            <div class="flex items-center gap-1.5 font-semibold text-slate-900 mb-1">
              <HelpCircle class="w-4 h-4 text-slate-700 shrink-0" />
              <span>Giải thích:</span>
            </div>
            <p>{{ q.explanation }}</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
