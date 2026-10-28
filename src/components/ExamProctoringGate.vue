<script setup lang="ts">
import { ref } from 'vue'
import {
  Camera,
  MonitorUp,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Play,
  Eye,
  X,
  ScanFace,
  EyeOff
} from 'lucide-vue-next'
import { useBrowserProctoring } from '@/viewmodels/useBrowserProctoring'

const props = defineProps<{
  mode: 'modal' | 'sidebar-widget'
}>()

const emit = defineEmits<{
  (e: 'switchToPractice'): void
  (e: 'openLogs'): void
}>()

const {
  isCameraActive,
  isCameraStarting,
  isCameraSimulated,
  cameraError,
  portraitDataUrl,
  portraitCapturedAt,
  isScreenShareActive,
  isScreenShareSimulated,
  screenShareError,
  noTabSwitchAccepted,
  isAllRulesSatisfied,
  satisfiedRulesCount,
  showCheckInModal,
  isInsideExamScreen,
  showOutZoneWarning,
  totalWarnings,
  // Biometric 5-Landmark (Ngũ quan) state
  isPersonInFrame,
  isFaceClearlyVisible,
  showFaceMissingWarning,
  faceMissingWarningCount,
  isSimulatingFaceMissing,
  faceStatusMessage,
  portraitWarningMessage,
  autoCaptureProgress,
  facialLandmarks,
  detectedLandmarkCount,
  // Actions
  bindCameraVideoElement,
  toggleSimulateFaceMissing,
  startCamera,
  capturePortrait,
  clearPortrait,
  startScreenShare,
  completeCheckIn,
  simulateAllProctoringRules,
  openCheckInModal,
  closeCheckInModal
} = useBrowserProctoring()

const isCapturing = ref(false)

async function handleEnableCamera() {
  await startCamera()
}

async function handleCaptureOrRetakePortrait() {
  if (portraitDataUrl.value) {
    // Clear existing portrait so auto-capture scanner re-verifies 5/5 ngũ quan and auto-captures
    clearPortrait()
    return
  }

  isCapturing.value = true
  try {
    if (!isCameraActive.value) {
      await startCamera()
      await new Promise((r) => setTimeout(r, 500))
    }
    capturePortrait(false)
  } finally {
    isCapturing.value = false
  }
}

async function handleEnableScreenShare() {
  await startScreenShare()
}
</script>

<template>
  <!-- ========================================================================
       MODE 1: PRE-EXAM CHECK-IN & 4 MANDATORY RULES MODAL
       ======================================================================== -->
  <div
    v-if="props.mode === 'modal' && showCheckInModal"
    class="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
  >
    <div class="bg-white rounded-2xl border border-slate-200 max-w-4xl w-full max-h-[94vh] overflow-y-auto shadow-2xl">
      <!-- Top Header -->
      <div class="bg-slate-900 text-white px-5 py-4 sm:px-6 sm:py-5 flex items-start sm:items-center justify-between gap-4 border-b border-slate-800">
        <div class="flex items-start sm:items-center gap-3.5">
          <div class="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
            <ShieldAlert class="w-6 h-6" />
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                PROCTORED EXAM CHECK-IN
              </span>
              <span class="text-xs font-mono text-slate-300">
                Hoàn thành {{ satisfiedRulesCount }}/4 quy tắc bắt buộc
              </span>
            </div>
            <h2 class="text-base sm:text-lg font-bold text-white mt-1">
              Quy tắc Phòng Thi Thử Chuẩn & Nhận diện Ngũ quan (Auto Capture)
            </h2>
          </div>
        </div>

        <button
          v-if="isAllRulesSatisfied"
          type="button"
          class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          title="Đóng cửa sổ"
          @click="closeCheckInModal"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Body: 4 Mandatory Rules Grid -->
      <div class="p-5 sm:p-6 space-y-5">
        <!-- Live Red Alert Banner if Camera is ON but Person Left Frame or Ngũ quan is incomplete -->
        <div
          v-if="isCameraActive && (!isPersonInFrame || !isFaceClearlyVisible)"
          role="alert"
          class="p-4 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-950 flex items-start justify-between gap-3"
        >
          <div class="flex items-start gap-3">
            <AlertTriangle class="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div class="space-y-1 text-xs">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-rose-600 text-white">
                  {{
                    !isPersonInFrame
                      ? 'WARNING RED — NGƯỜI TRONG HÌNH ĐÃ BIẾN MẤT / RA KHỎI CAMERA!'
                      : `WARNING RED — CHƯA ĐỦ 5 NGŨ QUAN (${detectedLandmarkCount}/5)`
                  }}
                </span>
                <span
                  v-if="faceMissingWarningCount > 0"
                  class="font-mono font-bold text-rose-700"
                >
                  Cảnh báo mất mặt #{{ faceMissingWarningCount }}
                </span>
              </div>
              <p class="font-semibold">
                {{ faceStatusMessage }}
              </p>
              <p class="text-rose-700">
                {{
                  !isPersonInFrame
                    ? 'Không phát hiện người dự thi trong khung hình Camera! Vui lòng quay trở lại trước ống kính ngay.'
                    : 'Hãy giữ khuôn mặt nằm trong khung Oval và đủ ánh sáng. Ngay khi nhận diện đủ 5/5 ngũ quan (Chân mày, Mắt trái, Mắt phải, Mũi, Miệng), hệ thống sẽ tự động chụp ảnh chân dung (Auto Capture)!'
                }}
              </p>
            </div>
          </div>

          <button
            v-if="isSimulatingFaceMissing"
            type="button"
            class="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
            @click="toggleSimulateFaceMissing"
          >
            Tắt giả lập mất mặt
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- RULE 1: BẬT CAMERA & GIÁM SÁT NGƯỜI TRONG HÌNH -->
          <div
            class="p-4 rounded-xl border-2 transition-colors flex flex-col justify-between gap-3"
            :class="
              !isCameraActive
                ? 'bg-slate-50/70 border-slate-200'
                : isFaceClearlyVisible
                  ? 'bg-emerald-50/40 border-emerald-500'
                  : 'bg-rose-50/60 border-rose-500'
            "
          >
            <div class="space-y-2.5">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                    :class="
                      !isCameraActive
                        ? 'bg-slate-900 text-white'
                        : isFaceClearlyVisible
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                    "
                  >
                    1
                  </span>
                  <h3 class="text-sm font-bold text-slate-900">Bật Camera & Nhận diện Ngũ quan</h3>
                </div>
                <span
                  class="text-[11px] font-bold px-2 py-0.5 rounded-md"
                  :class="
                    !isCameraActive
                      ? 'bg-slate-200 text-slate-700'
                      : isFaceClearlyVisible
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                  "
                >
                  {{
                    !isCameraActive
                      ? 'Chưa bật'
                      : isFaceClearlyVisible
                        ? `Đủ ${detectedLandmarkCount}/5 ngũ quan`
                        : `WARNING: ${detectedLandmarkCount}/5 ngũ quan`
                  }}
                </span>
              </div>

              <!-- Live Camera Preview Box (SINGLE active <video> instance) -->
              <div
                class="relative w-full h-48 rounded-xl bg-slate-900 overflow-hidden border-2 flex items-center justify-center"
                :class="
                  !isCameraActive
                    ? 'border-slate-800'
                    : isFaceClearlyVisible
                      ? 'border-emerald-500'
                      : 'border-rose-500'
                "
              >
                <video
                  v-if="isCameraActive && !isCameraSimulated"
                  :ref="bindCameraVideoElement"
                  autoplay
                  muted
                  playsinline
                  class="w-full h-full object-cover -scale-x-100"
                />

                <!-- Lightweight Face Alignment Oval Guide Overlay -->
                <div
                  v-if="isCameraActive && !isCameraSimulated"
                  class="absolute inset-0 pointer-events-none flex items-center justify-center"
                >
                  <div
                    class="w-32 h-40 rounded-full border-2 border-dashed transition-colors"
                    :class="isFaceClearlyVisible ? 'border-emerald-400' : 'border-rose-500'"
                  />
                </div>

                <div
                  v-if="isCameraActive && isCameraSimulated"
                  class="text-center px-3 space-y-1 text-emerald-400"
                >
                  <ScanFace class="w-8 h-8 mx-auto" />
                  <div class="text-xs font-semibold">Camera & 5/5 Ngũ quan (Mô phỏng)</div>
                </div>
                <div
                  v-else-if="!isCameraActive"
                  class="text-center px-3 space-y-1 text-slate-400"
                >
                  <Camera class="w-7 h-7 mx-auto opacity-60" />
                  <div class="text-[11px]">
                    {{ isCameraStarting ? 'Đang kết nối phần cứng Camera...' : 'Bấm "Bật Camera" bên dưới để quét 5 ngũ quan' }}
                  </div>
                </div>

                <span
                  v-if="isCameraActive"
                  class="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold border"
                  :class="
                    isFaceClearlyVisible
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60'
                      : 'bg-rose-950/90 text-rose-200 border-rose-500'
                  "
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="isFaceClearlyVisible ? 'bg-emerald-400' : 'bg-rose-500'"
                  />
                  {{ isFaceClearlyVisible ? 'FACE OK (5/5)' : `WARNING RED (${detectedLandmarkCount}/5)` }}
                </span>

                <!-- Button to test "Person Missing / Face Covered" directly -->
                <button
                  v-if="isCameraActive"
                  type="button"
                  class="absolute bottom-2 right-2 px-2 py-1 rounded-md text-[10px] font-bold border transition-colors cursor-pointer inline-flex items-center gap-1"
                  :class="
                    isSimulatingFaceMissing
                      ? 'bg-rose-600 text-white border-rose-400'
                      : 'bg-slate-900/85 text-slate-200 border-slate-700 hover:bg-slate-800'
                  "
                  title="Bấm để test cảnh báo Đỏ khi mất người trong hình hoặc thiếu ngũ quan"
                  @click="toggleSimulateFaceMissing"
                >
                  <EyeOff class="w-3 h-3" />
                  <span>{{ isSimulatingFaceMissing ? 'Khôi phục mặt' : 'Test Mất Mặt' }}</span>
                </button>
              </div>

              <!-- 5 Facial Landmarks (Ngũ quan) Real-time Checklist Badges -->
              <div class="grid grid-cols-5 gap-1 pt-0.5">
                <div
                  v-for="item in [
                    { key: 'eyebrows', label: 'Chân mày', ok: facialLandmarks.eyebrows },
                    { key: 'leftEye', label: 'Mắt trái', ok: facialLandmarks.leftEye },
                    { key: 'rightEye', label: 'Mắt phải', ok: facialLandmarks.rightEye },
                    { key: 'nose', label: 'Mũi', ok: facialLandmarks.nose },
                    { key: 'mouth', label: 'Miệng', ok: facialLandmarks.mouth }
                  ]"
                  :key="item.key"
                  class="px-1.5 py-1 rounded-lg border text-center text-[10px] font-bold flex flex-col items-center gap-0.5 transition-colors"
                  :class="
                    !isCameraActive
                      ? 'bg-white border-slate-200 text-slate-400'
                      : item.ok
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                        : 'bg-rose-100 border-rose-500 text-rose-800'
                  "
                >
                  <CheckCircle2 v-if="isCameraActive && item.ok" class="w-3 h-3 text-emerald-600" />
                  <XCircle v-else-if="isCameraActive && !item.ok" class="w-3 h-3 text-rose-600" />
                  <span>{{ item.label }}</span>
                </div>
              </div>

              <p v-if="cameraError" class="text-[11px] text-rose-600 font-medium">
                {{ cameraError }}
              </p>
            </div>

            <button
              type="button"
              :disabled="isCameraStarting"
              class="w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
              :class="
                isCameraActive
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              "
              @click="handleEnableCamera"
            >
              <Camera class="w-3.5 h-3.5" />
              <span>
                {{
                  isCameraStarting
                    ? 'Đang mở Camera...'
                    : isCameraActive
                      ? 'Kết nối lại Camera'
                      : 'Bật Camera & Auto Chụp Chân Dung'
                }}
              </span>
            </button>
          </div>

          <!-- RULE 2: AUTO CHỤP CHÂN DUNG KHI ĐỦ 5 NGŨ QUAN -->
          <div
            class="p-4 rounded-xl border-2 transition-colors flex flex-col justify-between gap-3"
            :class="
              portraitDataUrl && !isSimulatingFaceMissing
                ? 'bg-emerald-50/40 border-emerald-500'
                : isCameraActive && !isFaceClearlyVisible
                  ? 'bg-rose-50/60 border-rose-500'
                  : 'bg-slate-50/70 border-slate-200'
            "
          >
            <div class="space-y-2.5">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                    :class="
                      portraitDataUrl && !isSimulatingFaceMissing
                        ? 'bg-emerald-600 text-white'
                        : isCameraActive && !isFaceClearlyVisible
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-900 text-white'
                    "
                  >
                    2
                  </span>
                  <h3 class="text-sm font-bold text-slate-900">Auto Chụp chân dung (Đủ 5 Ngũ quan)</h3>
                </div>
                <span
                  class="text-[11px] font-bold px-2 py-0.5 rounded-md"
                  :class="
                    portraitDataUrl && !isSimulatingFaceMissing
                      ? 'bg-emerald-600 text-white'
                      : isCameraActive && !isFaceClearlyVisible
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                  "
                >
                  {{
                    portraitDataUrl && !isSimulatingFaceMissing
                      ? `Đã Auto chụp (${portraitCapturedAt})`
                      : isCameraActive && !isFaceClearlyVisible
                        ? 'WARNING RED: Thiếu ngũ quan'
                        : 'Đang chờ đủ 5 ngũ quan'
                  }}
                </span>
              </div>

              <p class="text-xs text-slate-600">
                Khi thấy đủ <strong>5/5 ngũ quan</strong>, hệ thống <strong>tự động chụp (Auto Capture)</strong> trong ~0.9 giây. Nếu không thấy rõ mặt sẽ hiện <strong>Warning Red</strong> liên tục cho đến khi thấy đủ.
              </p>

              <!-- Captured Portrait Preview Box -->
              <div
                class="relative w-full h-48 rounded-xl bg-slate-900 overflow-hidden border-2 flex items-center justify-center"
                :class="
                  portraitDataUrl && !isSimulatingFaceMissing
                    ? 'border-emerald-500'
                    : isCameraActive && !isFaceClearlyVisible
                      ? 'border-rose-500'
                      : 'border-slate-800'
                "
              >
                <img
                  v-if="portraitDataUrl && !isSimulatingFaceMissing"
                  :src="portraitDataUrl"
                  alt="Candidate Portrait"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else-if="isCameraActive && !isFaceClearlyVisible"
                  class="text-center px-4 space-y-2 text-rose-400"
                >
                  <AlertTriangle class="w-8 h-8 mx-auto text-rose-500" />
                  <div class="text-xs font-bold uppercase text-rose-300">
                    WARNING RED: Chưa đủ 5 ngũ quan ({{ detectedLandmarkCount }}/5)
                  </div>
                  <div class="text-[11px] text-rose-200">
                    {{ portraitWarningMessage || faceStatusMessage }}
                  </div>
                </div>
                <div
                  v-else-if="isCameraActive && isFaceClearlyVisible"
                  class="text-center px-4 space-y-2 text-emerald-400"
                >
                  <ScanFace class="w-8 h-8 mx-auto" />
                  <div class="text-xs font-bold">
                    Đã thấy đủ 5/5 ngũ quan — Đang Auto chụp ({{ autoCaptureProgress }}%)...
                  </div>
                  <div class="w-40 h-2 bg-slate-800 rounded-full mx-auto overflow-hidden">
                    <div
                      class="h-full bg-emerald-500 transition-all duration-200"
                      :style="{ width: `${autoCaptureProgress}%` }"
                    />
                  </div>
                </div>
                <div v-else class="text-center px-3 space-y-1 text-slate-400">
                  <UserCheck class="w-7 h-7 mx-auto opacity-60" />
                  <div class="text-[11px]">Hãy bật Camera ở bước 1 để hệ thống Auto chụp chân dung</div>
                </div>
              </div>
            </div>

            <button
              type="button"
              :disabled="isCapturing"
              class="w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
              :class="
                portraitDataUrl && !isSimulatingFaceMissing
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : isCameraActive && !isFaceClearlyVisible
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
              "
              @click="handleCaptureOrRetakePortrait"
            >
              <UserCheck class="w-3.5 h-3.5" />
              <span>
                {{
                  portraitDataUrl && !isSimulatingFaceMissing
                    ? 'Xóa ảnh & Test Auto chụp lại từ đầu'
                    : isCameraActive && !isFaceClearlyVisible
                      ? 'Đang báo Đỏ: Hãy nhìn rõ mặt để Auto chụp'
                      : 'Quét & Auto Chụp Chân Dung'
                }}
              </span>
            </button>
          </div>

          <!-- RULE 3: SHARE MÀN HÌNH -->
          <div
            class="p-4 rounded-xl border-2 transition-colors flex flex-col justify-between gap-3"
            :class="
              isScreenShareActive
                ? 'bg-emerald-50/40 border-emerald-500'
                : 'bg-slate-50/70 border-slate-200'
            "
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                    :class="isScreenShareActive ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'"
                  >
                    3
                  </span>
                  <h3 class="text-sm font-bold text-slate-900">Share màn hình (Screen Share)</h3>
                </div>
                <span
                  class="text-[11px] font-bold px-2 py-0.5 rounded-md"
                  :class="
                    isScreenShareActive
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  "
                >
                  {{ isScreenShareActive ? (isScreenShareSimulated ? 'Đang Share (Mô phỏng)' : 'Đang Share Live') : 'Chưa Share' }}
                </span>
              </div>

              <p class="text-xs text-slate-600">
                Chia sẻ toàn màn hình làm bài. Khi nộp bài thi xong hệ thống sẽ tự động ngắt Share màn hình, tắt Camera và đóng Tab thi.
              </p>

              <p v-if="screenShareError" class="text-[11px] text-rose-600 font-medium">
                {{ screenShareError }}
              </p>
            </div>

            <button
              type="button"
              class="w-full py-2 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
              :class="
                isScreenShareActive
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              "
              @click="handleEnableScreenShare"
            >
              <MonitorUp class="w-3.5 h-3.5" />
              <span>{{ isScreenShareActive ? 'Chọn lại màn hình Share' : 'Bật Share màn hình' }}</span>
            </button>
          </div>

          <!-- RULE 4: KHÔNG CHUYỂN TAB -->
          <div
            class="p-4 rounded-xl border-2 transition-colors flex flex-col justify-between gap-3"
            :class="
              noTabSwitchAccepted
                ? 'bg-emerald-50/40 border-emerald-500'
                : 'bg-slate-50/70 border-slate-200'
            "
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                    :class="noTabSwitchAccepted ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'"
                  >
                    4
                  </span>
                  <h3 class="text-sm font-bold text-slate-900">Không chuyển Tab & Rời khỏi Camera</h3>
                </div>
                <span
                  class="text-[11px] font-bold px-2 py-0.5 rounded-md"
                  :class="
                    noTabSwitchAccepted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  "
                >
                  {{ noTabSwitchAccepted ? 'Đã cam kết' : 'Chưa xác nhận' }}
                </span>
              </div>

              <p class="text-xs text-slate-600">
                Trong suốt giờ thi: nếu bạn rời khỏi khung hình Camera, chuyển Tab hoặc không cử động chuột 2 phút, hệ thống sẽ báo đỏ. Khi thi xong toàn bộ Warning sẽ được xóa sạch.
              </p>
            </div>

            <label class="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer select-none">
              <input
                v-model="noTabSwitchAccepted"
                type="checkbox"
                class="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
              <span class="text-xs font-semibold text-slate-800">
                Tôi đồng ý quy tắc Không chuyển Tab & giữ mặt trong Camera
              </span>
            </label>
          </div>
        </div>

        <!-- Bottom Action Bar -->
        <div class="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="px-3.5 py-2 rounded-xl text-xs font-semibold border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
              @click="emit('switchToPractice')"
            >
              <Sparkles class="w-3.5 h-3.5 text-indigo-600" />
              <span>Quay về Luyện tập (Đóng Tab Thi & Tắt Camera)</span>
            </button>

            <button
              type="button"
              class="px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
              title="Kích hoạt mô phỏng nhanh cả 4 bước nếu máy không có sẵn Webcam"
              @click="simulateAllProctoringRules"
            >
              <RefreshCw class="w-3.5 h-3.5" />
              <span>Giả lập đủ 4 bước (Vào thi nhanh)</span>
            </button>
          </div>

          <button
            type="button"
            :disabled="!isAllRulesSatisfied"
            class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-sm disabled:opacity-45 disabled:pointer-events-none"
            :class="
              isAllRulesSatisfied
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-900 text-white'
            "
            @click="completeCheckIn"
          >
            <Play class="w-4 h-4 fill-current" />
            <span>Bắt đầu làm bài Thi thử ({{ satisfiedRulesCount }}/4)</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ========================================================================
       MODE 2: LIVE PROCTORING MONITOR WIDGET IN EXAM ROOM SIDEBAR
       (Only mounts <video> when Check-in Modal is closed so there is NEVER more than 1 <video>)
       ======================================================================== -->
  <div
    v-else-if="props.mode === 'sidebar-widget'"
    class="bg-white rounded-xl border-2 p-4 shadow-2xs space-y-3 transition-colors"
    :class="
      isCameraActive && (!isPersonInFrame || showFaceMissingWarning)
        ? 'border-rose-500 bg-rose-50/40'
        : 'border-slate-200/90'
    "
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <ShieldAlert
          class="w-4 h-4 shrink-0"
          :class="isCameraActive && !isPersonInFrame ? 'text-rose-600' : 'text-slate-800'"
        />
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800">
          4 Quy tắc Giám sát Phòng thi
        </h3>
      </div>
      <button
        type="button"
        class="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
        @click="openCheckInModal"
      >
        Cấu hình ({{ satisfiedRulesCount }}/4)
      </button>
    </div>

    <!-- Red Warning inside Sidebar Widget if person leaves camera frame -->
    <div
      v-if="isCameraActive && !isPersonInFrame"
      class="p-2.5 rounded-lg bg-rose-600 text-white text-[11px] font-bold flex items-center justify-between gap-2"
    >
      <div class="flex items-center gap-1.5">
        <AlertTriangle class="w-4 h-4 shrink-0" />
        <span>WARNING RED: Mất người trong Camera!</span>
      </div>
      <button
        v-if="isSimulatingFaceMissing"
        type="button"
        class="px-2 py-0.5 rounded bg-white text-rose-700 text-[10px] font-bold cursor-pointer shrink-0"
        @click="toggleSimulateFaceMissing"
      >
        Khôi phục
      </button>
    </div>

    <!-- Live Camera + Captured Portrait Dual Preview -->
    <div class="grid grid-cols-2 gap-2.5">
      <!-- Live Camera Box (Mounts <video> ONLY when showCheckInModal is false) -->
      <div
        class="relative h-24 rounded-lg bg-slate-900 overflow-hidden border-2 flex items-center justify-center"
        :class="
          !isCameraActive
            ? 'border-slate-800'
            : isPersonInFrame
              ? 'border-emerald-500'
              : 'border-rose-500'
        "
      >
        <video
          v-if="!showCheckInModal && isCameraActive && !isCameraSimulated"
          :ref="bindCameraVideoElement"
          autoplay
          muted
          playsinline
          class="w-full h-full object-cover -scale-x-100"
        />
        <div
          v-else-if="showCheckInModal && isCameraActive && !isCameraSimulated"
          class="text-center p-2 text-emerald-400 text-[10px]"
        >
          Đang mở ở cửa sổ Check-in
        </div>
        <div
          v-else-if="isCameraActive && isCameraSimulated"
          class="text-center p-2 text-emerald-400"
        >
          <Camera class="w-5 h-5 mx-auto" />
          <div class="text-[10px] font-semibold mt-0.5">Cam (Mô phỏng)</div>
        </div>
        <button
          v-else
          type="button"
          class="text-center p-2 text-rose-300 hover:text-white cursor-pointer"
          @click="handleEnableCamera"
        >
          <Camera class="w-5 h-5 mx-auto" />
          <div class="text-[10px] font-semibold mt-0.5 underline">Bật Camera</div>
        </button>

        <button
          v-if="isCameraActive && !showCheckInModal"
          type="button"
          class="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer"
          :class="
            isSimulatingFaceMissing
              ? 'bg-rose-600 text-white'
              : 'bg-slate-900/80 text-slate-200 hover:bg-slate-800'
          "
          title="Test cảnh báo khi người biến mất khỏi Camera"
          @click="toggleSimulateFaceMissing"
        >
          {{ isSimulatingFaceMissing ? 'Bật lại mặt' : 'Test mất mặt' }}
        </button>

        <span
          class="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold text-white"
          :class="
            !isCameraActive
              ? 'bg-slate-950/80'
              : isPersonInFrame
                ? 'bg-emerald-700/90'
                : 'bg-rose-600'
          "
        >
          {{ !isCameraActive ? '1. Cam OFF' : isPersonInFrame ? `1. Mặt (${detectedLandmarkCount}/5)` : '1. MẤT HÌNH!' }}
        </span>
      </div>

      <!-- Portrait Snapshot Box -->
      <div
        class="relative h-24 rounded-lg bg-slate-900 overflow-hidden border-2 flex items-center justify-center group"
        :class="portraitDataUrl ? 'border-emerald-500' : 'border-rose-500'"
      >
        <img
          v-if="portraitDataUrl"
          :src="portraitDataUrl"
          alt="Portrait"
          class="w-full h-full object-cover"
        />
        <button
          v-else
          type="button"
          class="text-center p-2 text-rose-300 hover:text-white cursor-pointer"
          @click="openCheckInModal"
        >
          <UserCheck class="w-5 h-5 mx-auto" />
          <div class="text-[10px] font-semibold mt-0.5 underline">Quét 5 ngũ quan</div>
        </button>

        <button
          v-if="portraitDataUrl"
          type="button"
          class="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-slate-900/80 text-[9px] text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          @click="openCheckInModal"
        >
          Chụp lại
        </button>

        <span
          class="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-slate-950/80 text-[9px] font-mono text-white"
        >
          2. Chân dung
        </span>
      </div>
    </div>

    <!-- 4 Mandatory Rules Checklist Status -->
    <ul class="space-y-1.5 text-xs pt-1">
      <li class="flex items-center justify-between gap-2">
        <span class="text-slate-600 flex items-center gap-1.5">
          <Camera class="w-3.5 h-3.5 text-slate-400" />
          <span>1. Người trong Cam:</span>
        </span>
        <span
          v-if="isCameraActive && isPersonInFrame"
          class="font-semibold text-emerald-700 inline-flex items-center gap-1"
        >
          <CheckCircle2 class="w-3.5 h-3.5" />
          <span>Có mặt ({{ detectedLandmarkCount }}/5 ngũ quan)</span>
        </span>
        <span
          v-else-if="isCameraActive && !isPersonInFrame"
          class="font-bold text-rose-600 inline-flex items-center gap-1"
        >
          <XCircle class="w-3.5 h-3.5" />
          <span>Mất người trong hình! (#{{ faceMissingWarningCount }})</span>
        </span>
        <button
          v-else
          type="button"
          class="font-semibold text-rose-600 underline cursor-pointer"
          @click="handleEnableCamera"
        >
          Chưa bật Camera
        </button>
      </li>

      <li class="flex items-center justify-between gap-2">
        <span class="text-slate-600 flex items-center gap-1.5">
          <UserCheck class="w-3.5 h-3.5 text-slate-400" />
          <span>2. Chụp chân dung:</span>
        </span>
        <span
          v-if="portraitDataUrl"
          class="font-semibold text-emerald-700 inline-flex items-center gap-1"
        >
          <CheckCircle2 class="w-3.5 h-3.5" />
          <span>Đủ 5/5 ({{ portraitCapturedAt }})</span>
        </span>
        <button
          v-else
          type="button"
          class="font-semibold text-rose-600 underline cursor-pointer"
          @click="openCheckInModal"
        >
          Chưa đủ 5 ngũ quan
        </button>
      </li>

      <li class="flex items-center justify-between gap-2">
        <span class="text-slate-600 flex items-center gap-1.5">
          <MonitorUp class="w-3.5 h-3.5 text-slate-400" />
          <span>3. Share màn hình:</span>
        </span>
        <span
          v-if="isScreenShareActive"
          class="font-semibold text-emerald-700 inline-flex items-center gap-1"
        >
          <CheckCircle2 class="w-3.5 h-3.5" />
          <span>Đang chia sẻ</span>
        </span>
        <button
          v-else
          type="button"
          class="font-semibold text-rose-600 underline cursor-pointer"
          @click="handleEnableScreenShare"
        >
          Chưa Share (Bật ngay)
        </button>
      </li>

      <li class="flex items-center justify-between gap-2">
        <span class="text-slate-600 flex items-center gap-1.5">
          <Eye class="w-3.5 h-3.5 text-slate-400" />
          <span>4. Không chuyển Tab:</span>
        </span>
        <button
          type="button"
          class="font-semibold inline-flex items-center gap-1 cursor-pointer hover:underline"
          :class="
            isInsideExamScreen && !showOutZoneWarning && totalWarnings === 0
              ? 'text-emerald-700'
              : 'text-rose-600 font-bold'
          "
          @click="emit('openLogs')"
        >
          <span>{{ totalWarnings > 0 ? `${totalWarnings} cảnh báo` : 'Đang giám sát' }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>
