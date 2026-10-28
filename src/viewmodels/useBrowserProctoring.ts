import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

export type OutZoneReason =
  | 'browser-viewport'
  | 'tab-hidden'
  | 'window-blur'
  | 'camera-stopped'
  | 'screen-stopped'
  | 'face-missing'

export interface ProctoringLogItem {
  id: number
  type:
    | 'leave-screen'
    | 'idle-2m'
    | 'tab-switch'
    | 'camera'
    | 'screen-share'
    | 'portrait'
    | 'face-missing'
  message: string
  time: string
}

export interface FacialLandmarksState {
  eyebrows: boolean // Chân mày
  leftEye: boolean // Mắt trái
  rightEye: boolean // Mắt phải
  nose: boolean // Mũi
  mouth: boolean // Miệng
}

interface ZoneMetrics {
  meanLuma: number
  stdDev: number
  horizEdge: number
  edgeEnergy: number
  skinRatio: number
  meanSkinR: number
  meanSkinG: number
  meanSkinB: number
}

interface FrameAnalysisResult {
  landmarks: FacialLandmarksState
  landmarkCount: number
  personDetected: boolean
  allFiveClear: boolean
  isCoveredOrBlank: boolean
}

// Experimental Chromium Shape Detection API typing (macOS CoreImage/Vision hardware face detector when available)
interface BrowserDetectedLandmark {
  type?: string
  locations?: Array<{ x: number; y: number }>
}
interface BrowserDetectedFace {
  boundingBox: DOMRectReadOnly
  landmarks?: BrowserDetectedLandmark[]
}
interface BrowserFaceDetectorInstance {
  detect(image: CanvasImageSource): Promise<BrowserDetectedFace[]>
}

const IDLE_TIMEOUT_SECONDS = 120 // 2 minutes
const BIOMETRIC_POLL_MS = 420 // ~2.4 checks/sec: fast ~0.8s response when leaving camera, zero video jank
const SAMPLE_W = 64
const SAMPLE_H = 48

// Keep raw MediaStream instances & CV buffers completely outside Vue reactivity
let rawCameraStream: MediaStream | null = null
let rawScreenStream: MediaStream | null = null
let activeVideoEl: HTMLVideoElement | null = null
let analysisCanvas: HTMLCanvasElement | null = null
let analysisCtx: CanvasRenderingContext2D | null = null
let calibratedSkinRgb: { r: number; g: number; b: number } | null = null
let prevFrameLumaGrid: Float32Array | null = null
let rollingMotionHistory: number[] = []
let nativeFaceDetector: BrowserFaceDetectorInstance | null = null
let nativeFaceDetectorChecked = false
let nativeFaceDetectorVerifiedWorking = false
let nativeFaceResultCache: { hasFace: boolean; count: number; updatedAt: number } | null = null
let isNativeDetectRunning = false
let isCaptureInProgress = false
let hasLoggedCurrentAbsenceEpisode = false

// Singleton reactive state shared across views
const isProctoringEnabled = ref(true)
const isInsideExamScreen = ref(true)
const showOutZoneWarning = ref(false)
const outZoneReason = ref<OutZoneReason>('browser-viewport')
const outZoneWarningCount = ref(0)

const idleSeconds = ref(0)
const showIdleWarning = ref(false)
const idleWarningCount = ref(0)

// Face & 5-Landmark (Ngũ quan) Biometric state
const isPersonInFrame = ref(false)
const isFaceClearlyVisible = ref(false)
const showFaceMissingWarning = ref(false)
const faceMissingWarningCount = ref(0)
const isSimulatingFaceMissing = ref(false)
const faceStatusMessage = ref<string>(
  'Vui lòng bật Camera và nhìn thẳng vào khung hình để nhận diện 5 ngũ quan.'
)
const portraitWarningMessage = ref<string | null>(null)
const autoCaptureProgress = ref(0)

const facialLandmarks = ref<FacialLandmarksState>({
  eyebrows: false,
  leftEye: false,
  rightEye: false,
  nose: false,
  mouth: false
})

const warningLogs = ref<ProctoringLogItem[]>([])

// 4 Mandatory Rules State
const isCameraActive = ref(false)
const isCameraStarting = ref(false)
const isCameraSimulated = ref(false)
const cameraError = ref<string | null>(null)

const portraitDataUrl = ref<string | null>(null)
const portraitCapturedAt = ref<string | null>(null)

const isScreenShareActive = ref(false)
const isScreenShareSimulated = ref(false)
const screenShareError = ref<string | null>(null)

const noTabSwitchAccepted = ref(true)
const isCheckInCompleted = ref(false)
const showCheckInModal = ref(true)

let isRequestingMediaPermission = false
let idleCheckInterval: ReturnType<typeof setInterval> | null = null
let faceMonitorInterval: ReturnType<typeof setInterval> | null = null
let missingFaceConsecutiveTicks = 0
let clearFaceConsecutiveTicks = 0
let lastMouseMoveAt = Date.now()
let lastOutTriggerAt = 0
let logSeq = 1
let mountedCount = 0

function nowTimeStr(): string {
  return new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

function pushWarningLog(type: ProctoringLogItem['type'], message: string) {
  warningLogs.value = [
    {
      id: logSeq++,
      type,
      message,
      time: nowTimeStr()
    },
    ...warningLogs.value.slice(0, 29)
  ]
}

function updateLandmarksIfChanged(next: FacialLandmarksState) {
  const cur = facialLandmarks.value
  if (
    cur.eyebrows !== next.eyebrows ||
    cur.leftEye !== next.leftEye ||
    cur.rightEye !== next.rightEye ||
    cur.nose !== next.nose ||
    cur.mouth !== next.mouth
  ) {
    facialLandmarks.value = { ...next }
  }
}

function getNativeFaceDetector(): BrowserFaceDetectorInstance | null {
  if (nativeFaceDetectorChecked) return nativeFaceDetector
  nativeFaceDetectorChecked = true
  try {
    const win = window as unknown as {
      FaceDetector?: new (opts?: { fastMode?: boolean; maxDetectedFaces?: number }) => BrowserFaceDetectorInstance
    }
    if (typeof win.FaceDetector === 'function') {
      nativeFaceDetector = new win.FaceDetector({ fastMode: true, maxDetectedFaces: 1 })
    }
  } catch {
    nativeFaceDetector = null
  }
  return nativeFaceDetector
}

function pollNativeFaceDetectorAsync(videoEl: HTMLVideoElement) {
  const detector = getNativeFaceDetector()
  if (!detector || isNativeDetectRunning) return
  isNativeDetectRunning = true
  detector
    .detect(videoEl)
    .then((faces) => {
      const f = faces[0]
      if (!f) {
        // Only trust 0-face result if OS Vision FaceDetector has already proven active on a real face
        if (nativeFaceDetectorVerifiedWorking) {
          nativeFaceResultCache = { hasFace: false, count: 0, updatedAt: Date.now() }
        }
        return
      }
      const vw = videoEl.videoWidth || 480
      const vh = videoEl.videoHeight || 360
      const box = f.boundingBox
      const cx = (box.x + box.width / 2) / vw
      const cy = (box.y + box.height / 2) / vh
      const sizeRatio = box.width / vw
      const validFace = cx > 0.08 && cx < 0.92 && cy > 0.08 && cy < 0.92 && sizeRatio >= 0.11
      if (validFace) {
        nativeFaceDetectorVerifiedWorking = true
      }
      if (nativeFaceDetectorVerifiedWorking) {
        nativeFaceResultCache = {
          hasFace: validFace,
          count: validFace ? 1 : 0,
          updatedAt: Date.now()
        }
      }
    })
    .catch(() => {
      nativeFaceDetector = null
      nativeFaceDetectorVerifiedWorking = false
      nativeFaceResultCache = null
    })
    .finally(() => {
      isNativeDetectRunning = false
    })
}

/**
 * Human Skin Pixel Classifier:
 * Combines Peer-Kovac-Solina RGB + Hemoglobin (R-G vs G-B) + ITU-R YCbCr Chroma cluster,
 * plus optional calibrated skin tone from the candidate's captured Check-in portrait.
 * Rejects white/grey/cream/yellow walls, oak cabinets, chairs, monitors, clothes, and plants.
 */
function isHumanSkinPixel(r: number, g: number, b: number, luma: number): boolean {
  if (luma < 28 || luma > 242) return false

  // Fast match against calibrated candidate skin tone (helps under cool blue monitor glow)
  if (calibratedSkinRgb) {
    const dist =
      Math.abs(r - calibratedSkinRgb.r) +
      Math.abs(g - calibratedSkinRgb.g) +
      Math.abs(b - calibratedSkinRgb.b)
    if (dist <= 54 && r > g + 2 && r > b + 2) {
      return true
    }
  }

  // Hemoglobin rule: skin has R > G and R > B, and R-G is substantial relative to G-B (rejects yellow/cream walls & light wood)
  if (r <= g + 4 || r <= b + 5) return false
  if (g > b && r - g < (g - b) * 0.4) return false

  const maxC = Math.max(r, g, b)
  const minC = Math.min(r, g, b)
  if (maxC - minC < 9) return false

  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b

  return cr >= 130 && cr <= 182 && cb >= 74 && cb <= 136
}

function computeZoneMetrics(
  data: Uint8ClampedArray,
  width: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number
): ZoneMetrics {
  let sumLuma = 0
  let sumSqLuma = 0
  let horizEdgeSum = 0
  let edgeSum = 0
  let skinPixels = 0
  let sumSkinR = 0
  let sumSkinG = 0
  let sumSkinB = 0
  let count = 0

  for (let y = y0; y < y1; y++) {
    const rowOffset = y * width
    for (let x = x0; x < x1; x++) {
      const idx = (rowOffset + x) * 4
      const r = data[idx] ?? 0
      const g = data[idx + 1] ?? 0
      const b = data[idx + 2] ?? 0

      const luma = 0.299 * r + 0.587 * g + 0.114 * b
      sumLuma += luma
      sumSqLuma += luma * luma
      count++

      if (isHumanSkinPixel(r, g, b, luma)) {
        skinPixels++
        sumSkinR += r
        sumSkinG += g
        sumSkinB += b
      }

      if (x + 1 < x1 && y + 1 < y1) {
        const rightIdx = (rowOffset + x + 1) * 4
        const downIdx = ((y + 1) * width + x) * 4
        const lumaRight =
          0.299 * (data[rightIdx] ?? 0) +
          0.587 * (data[rightIdx + 1] ?? 0) +
          0.114 * (data[rightIdx + 2] ?? 0)
        const lumaDown =
          0.299 * (data[downIdx] ?? 0) +
          0.587 * (data[downIdx + 1] ?? 0) +
          0.114 * (data[downIdx + 2] ?? 0)
        const dh = Math.abs(luma - lumaDown) // Horizontal feature edges (eyebrows, eyes, mouth)
        const dv = Math.abs(luma - lumaRight)
        horizEdgeSum += dh
        edgeSum += dh + dv
      }
    }
  }

  if (count === 0) {
    return {
      meanLuma: 0,
      stdDev: 0,
      horizEdge: 0,
      edgeEnergy: 0,
      skinRatio: 0,
      meanSkinR: 0,
      meanSkinG: 0,
      meanSkinB: 0
    }
  }

  const meanLuma = sumLuma / count
  const variance = Math.max(0, sumSqLuma / count - meanLuma * meanLuma)
  return {
    meanLuma,
    stdDev: Math.sqrt(variance),
    horizEdge: horizEdgeSum / count,
    edgeEnergy: edgeSum / count,
    skinRatio: skinPixels / count,
    meanSkinR: skinPixels > 0 ? sumSkinR / skinPixels : 0,
    meanSkinG: skinPixels > 0 ? sumSkinG / skinPixels : 0,
    meanSkinB: skinPixels > 0 ? sumSkinB / skinPixels : 0
  }
}

const SLIDE_X_POSITIONS = [4, 11, 18, 25, 32] as const
const SLIDE_Y_POSITIONS = [2, 5, 8, 11, 15] as const
const FACE_WIN_W = 28
const FACE_WIN_H = 32

/**
 * Pure, side-effect-free inspection of a single video frame on a 64x48 offscreen canvas.
 * Scans across the camera frame for a real human face and immediately detects when the
 * candidate disappears / steps out of the camera!
 */
function inspectVideoFramePure(videoEl: HTMLVideoElement): {
  analysis: FrameAnalysisResult
  calibratedSkinCandidate: { r: number; g: number; b: number } | null
} | null {
  if (videoEl.readyState < 2 || videoEl.videoWidth === 0 || videoEl.videoHeight === 0) {
    return null
  }

  // Trigger non-blocking OS hardware FaceDetector when available
  pollNativeFaceDetectorAsync(videoEl)

  if (!analysisCanvas) {
    analysisCanvas = document.createElement('canvas')
    analysisCanvas.width = SAMPLE_W
    analysisCanvas.height = SAMPLE_H
    analysisCtx = analysisCanvas.getContext('2d', { willReadFrequently: true })
  }
  if (!analysisCtx) return null

  try {
    analysisCtx.drawImage(videoEl, 0, 0, SAMPLE_W, SAMPLE_H)
  } catch {
    return null
  }

  const imgData = analysisCtx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data

  // If verified OS Vision FaceDetector confirmed 0 faces in frame -> immediate person missing!
  if (
    nativeFaceDetectorVerifiedWorking &&
    nativeFaceResultCache &&
    Date.now() - nativeFaceResultCache.updatedAt < 1400 &&
    !nativeFaceResultCache.hasFace
  ) {
    return {
      calibratedSkinCandidate: null,
      analysis: {
        landmarks: {
          eyebrows: false,
          leftEye: false,
          rightEye: false,
          nose: false,
          mouth: false
        },
        landmarkCount: 0,
        personDetected: false,
        allFiveClear: false,
        isCoveredOrBlank: false
      }
    }
  }

  // Track frame-to-frame micro-motion across central viewing area (8..56 x 4..44)
  const gridLen = 24 * 20
  if (!prevFrameLumaGrid || prevFrameLumaGrid.length !== gridLen) {
    prevFrameLumaGrid = new Float32Array(gridLen)
  }
  let frameDeltaSum = 0
  let gPtr = 0
  for (let y = 4; y < 44; y += 2) {
    for (let x = 8; x < 56; x += 2) {
      const idx = (y * SAMPLE_W + x) * 4
      const luma =
        0.299 * (imgData[idx] ?? 0) +
        0.587 * (imgData[idx + 1] ?? 0) +
        0.114 * (imgData[idx + 2] ?? 0)
      const prev = prevFrameLumaGrid[gPtr] ?? luma
      frameDeltaSum += Math.abs(luma - prev)
      prevFrameLumaGrid[gPtr] = luma
      gPtr++
    }
  }
  const currentMotion = frameDeltaSum / gridLen
  rollingMotionHistory.push(currentMotion)
  if (rollingMotionHistory.length > 5) {
    rollingMotionHistory.shift()
  }
  const avgRecentMotion =
    rollingMotionHistory.reduce((acc, v) => acc + v, 0) / rollingMotionHistory.length

  // Whole-frame check for covered camera / pitch dark / blown out white / flat empty wall
  const fullFrame = computeZoneMetrics(imgData, SAMPLE_W, 4, 4, 60, 44)
  const isCoveredOrBlank =
    fullFrame.meanLuma < 20 ||
    fullFrame.meanLuma > 246 ||
    fullFrame.stdDev < 9.5 ||
    fullFrame.edgeEnergy < 1.5

  if (isCoveredOrBlank) {
    return {
      calibratedSkinCandidate: null,
      analysis: {
        landmarks: {
          eyebrows: false,
          leftEye: false,
          rightEye: false,
          nose: false,
          mouth: false
        },
        landmarkCount: 0,
        personDetected: false,
        allFiveClear: false,
        isCoveredOrBlank: true
      }
    }
  }

  // Outer frame border skin density (top corners & top strip) to reject uniform warm walls/doors
  const topLeftBorder = computeZoneMetrics(imgData, SAMPLE_W, 0, 0, 10, 14)
  const topRightBorder = computeZoneMetrics(imgData, SAMPLE_W, 54, 0, 64, 14)
  const topStripBorder = computeZoneMetrics(imgData, SAMPLE_W, 14, 0, 50, 4)
  const borderSkinRatio =
    (topLeftBorder.skinRatio + topRightBorder.skinRatio + topStripBorder.skinRatio) / 3

  // Sliding-window search for the strongest genuine human face candidate (allows natural posture shifts)
  let bestWx = 18
  let bestWy = 8
  let bestScore = -1
  let bestCoreMetrics: ZoneMetrics | null = null
  let bestWinMetrics: ZoneMetrics | null = null

  for (const wy of SLIDE_Y_POSITIONS) {
    for (const wx of SLIDE_X_POSITIONS) {
      const winMetrics = computeZoneMetrics(
        imgData,
        SAMPLE_W,
        wx,
        wy,
        wx + FACE_WIN_W,
        wy + FACE_WIN_H
      )
      const coreMetrics = computeZoneMetrics(
        imgData,
        SAMPLE_W,
        wx + 3,
        wy + 4,
        wx + FACE_WIN_W - 3,
        wy + FACE_WIN_H - 4
      )

      if (
        coreMetrics.skinRatio < 0.17 ||
        winMetrics.stdDev < 10.5 ||
        winMetrics.horizEdge < 0.85
      ) {
        continue
      }

      // If we calibrated the candidate's skin at Check-in, reject static background objects (e.g. mahogany doors) whose color diverges wildly
      if (calibratedSkinRgb && coreMetrics.meanSkinR > 0) {
        const meanColorDist =
          Math.abs(coreMetrics.meanSkinR - calibratedSkinRgb.r) +
          Math.abs(coreMetrics.meanSkinG - calibratedSkinRgb.g) +
          Math.abs(coreMetrics.meanSkinB - calibratedSkinRgb.b)
        if (meanColorDist > 105 && avgRecentMotion < 0.55) {
          continue
        }
      }

      // Reject uniform warm walls/curtains that fill both outer borders and face window without live motion
      const isUniformWarmWall =
        borderSkinRatio > 0.34 &&
        coreMetrics.skinRatio - borderSkinRatio < 0.11 &&
        avgRecentMotion < 0.52
      if (isUniformWarmWall) {
        continue
      }

      // Slight center bias so centered face wins ties cleanly
      const centerBias = 1 - (Math.abs(wx - 18) / 40 + Math.abs(wy - 8) / 30) * 0.15
      const score =
        coreMetrics.skinRatio * 2.2 +
        Math.min(0.8, winMetrics.horizEdge * 0.25) +
        centerBias * 0.25

      if (score > bestScore) {
        bestScore = score
        bestWx = wx
        bestWy = wy
        bestCoreMetrics = coreMetrics
        bestWinMetrics = winMetrics
      }
    }
  }

  if (!bestCoreMetrics || !bestWinMetrics || bestScore < 0) {
    return {
      calibratedSkinCandidate: null,
      analysis: {
        landmarks: {
          eyebrows: false,
          leftEye: false,
          rightEye: false,
          nose: false,
          mouth: false
        },
        landmarkCount: 0,
        personDetected: false,
        allFiveClear: false,
        isCoveredOrBlank: false
      }
    }
  }

  // Evaluate the 5 Anatomical Facial Feature Zones (Ngũ quan) inside the detected face window
  const browZone = computeZoneMetrics(
    imgData,
    SAMPLE_W,
    bestWx + 2,
    bestWy + 2,
    bestWx + 26,
    bestWy + 10
  )
  const eyeZoneA = computeZoneMetrics(
    imgData,
    SAMPLE_W,
    bestWx + 2,
    bestWy + 6,
    bestWx + 13,
    bestWy + 16
  )
  const eyeZoneB = computeZoneMetrics(
    imgData,
    SAMPLE_W,
    bestWx + 15,
    bestWy + 6,
    bestWx + 26,
    bestWy + 16
  )
  const noseZone = computeZoneMetrics(
    imgData,
    SAMPLE_W,
    bestWx + 7,
    bestWy + 11,
    bestWx + 21,
    bestWy + 22
  )
  const mouthZone = computeZoneMetrics(
    imgData,
    SAMPLE_W,
    bestWx + 5,
    bestWy + 20,
    bestWx + 23,
    bestWy + 30
  )

  const minStd = Math.max(2.8, Math.min(5.8, bestWinMetrics.stdDev * 0.17))
  const minHoriz = Math.max(0.65, Math.min(1.4, bestWinMetrics.horizEdge * 0.45))
  const eyeSymDiff = Math.abs(eyeZoneA.meanLuma - eyeZoneB.meanLuma)

  const eyebrows =
    browZone.skinRatio >= 0.07 &&
    (browZone.stdDev >= minStd || browZone.horizEdge >= minHoriz)

  const leftEye =
    eyeZoneB.skinRatio >= 0.05 &&
    (eyeZoneB.stdDev >= minStd || eyeZoneB.horizEdge >= minHoriz) &&
    eyeSymDiff < 68

  const rightEye =
    eyeZoneA.skinRatio >= 0.05 &&
    (eyeZoneA.stdDev >= minStd || eyeZoneA.horizEdge >= minHoriz) &&
    eyeSymDiff < 68

  const nose =
    noseZone.skinRatio >= 0.20 &&
    (noseZone.stdDev >= minStd * 0.72 || noseZone.edgeEnergy >= minHoriz * 1.1)

  const mouth =
    mouthZone.skinRatio >= 0.10 &&
    (mouthZone.stdDev >= minStd || mouthZone.horizEdge >= minHoriz)

  const landmarkCount =
    (eyebrows ? 1 : 0) +
    (leftEye ? 1 : 0) +
    (rightEye ? 1 : 0) +
    (nose ? 1 : 0) +
    (mouth ? 1 : 0)

  const isCenteredForPortrait =
    bestWx >= 11 && bestWx <= 25 && bestWy >= 4 && bestWy <= 12

  return {
    calibratedSkinCandidate:
      bestCoreMetrics.meanSkinR > 0
        ? {
            r: bestCoreMetrics.meanSkinR,
            g: bestCoreMetrics.meanSkinG,
            b: bestCoreMetrics.meanSkinB
          }
        : null,
    analysis: {
      landmarks: { eyebrows, leftEye, rightEye, nose, mouth },
      landmarkCount,
      personDetected: landmarkCount >= 3,
      allFiveClear: landmarkCount === 5 && isCenteredForPortrait,
      isCoveredOrBlank: false
    }
  }
}

function renderVideoPortraitDataUrl(videoEl: HTMLVideoElement | null, timestamp: string): string | null {
  if (videoEl && videoEl.readyState >= 2 && videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
    const canvas = document.createElement('canvas')
    canvas.width = videoEl.videoWidth
    canvas.height = videoEl.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.save()
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
      ctx.restore()

      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)'
      ctx.fillRect(0, canvas.height - 34, canvas.width, 34)
      ctx.fillStyle = '#10b981'
      ctx.font = 'bold 12px monospace'
      ctx.fillText(`AUTO CAPTURED • 5/5 NGŨ QUAN • ${timestamp}`, 12, canvas.height - 12)

      return canvas.toDataURL('image/jpeg', 0.88)
    }
  }
  return null
}

function renderSimulatedPortraitDataUrl(timestamp: string): string | null {
  const canvas = document.createElement('canvas')
  canvas.width = 480
  canvas.height = 360
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const grad = ctx.createLinearGradient(0, 0, 480, 360)
  grad.addColorStop(0, '#0f172a')
  grad.addColorStop(1, '#1e293b')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 480, 360)

  ctx.fillStyle = '#334155'
  ctx.beginPath()
  ctx.arc(240, 130, 52, 0, Math.PI * 2)
  ctx.fill()

  ctx.beginPath()
  ctx.arc(240, 290, 95, Math.PI, 0, false)
  ctx.fill()

  ctx.strokeStyle = '#10b981'
  ctx.lineWidth = 3
  ctx.strokeRect(110, 45, 260, 235)

  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)'
  ctx.fillRect(0, 320, 480, 40)
  ctx.fillStyle = '#10b981'
  ctx.font = 'bold 13px monospace'
  ctx.fillText(`AUTO CAPTURED • 5/5 NGŨ QUAN • ${timestamp}`, 16, 345)

  return canvas.toDataURL('image/png')
}

export function useBrowserProctoring() {
  const totalWarnings = computed(
    () => outZoneWarningCount.value + idleWarningCount.value + faceMissingWarningCount.value
  )

  const idleRemainingSeconds = computed(() =>
    Math.max(0, IDLE_TIMEOUT_SECONDS - idleSeconds.value)
  )

  const detectedLandmarkCount = computed(() => {
    const f = facialLandmarks.value
    let c = 0
    if (f.eyebrows) c++
    if (f.leftEye) c++
    if (f.rightEye) c++
    if (f.nose) c++
    if (f.mouth) c++
    return c
  })

  const missingLandmarkNames = computed(() => {
    const f = facialLandmarks.value
    const missing: string[] = []
    if (!f.eyebrows) missing.push('Chân mày')
    if (!f.leftEye) missing.push('Mắt trái')
    if (!f.rightEye) missing.push('Mắt phải')
    if (!f.nose) missing.push('Mũi')
    if (!f.mouth) missing.push('Miệng')
    return missing
  })

  // Require person to ACTUALLY be in the camera frame right now to enter Exam Mode
  const isAllRulesSatisfied = computed(
    () =>
      isCameraActive.value &&
      isPersonInFrame.value &&
      !!portraitDataUrl.value &&
      isScreenShareActive.value &&
      noTabSwitchAccepted.value
  )

  const satisfiedRulesCount = computed(() => {
    let count = 0
    if (isCameraActive.value && isPersonInFrame.value) count++
    if (portraitDataUrl.value) count++
    if (isScreenShareActive.value) count++
    if (noTabSwitchAccepted.value) count++
    return count
  })

  const outZoneWarningMessage = computed(() => {
    switch (outZoneReason.value) {
      case 'tab-hidden':
        return 'Vi phạm quy tắc Không chuyển Tab: Bạn vừa chuyển sang Tab khác hoặc ẩn trình duyệt khi đang thi!'
      case 'window-blur':
        return 'Vi phạm quy tắc Không chuyển Tab / Cửa sổ: Bạn vừa rời khỏi cửa sổ bài thi!'
      case 'camera-stopped':
        return 'Cảnh báo Camera: Tín hiệu Camera giám sát đã bị ngắt trong lúc thi! Vui lòng bật lại Camera.'
      case 'screen-stopped':
        return 'Cảnh báo Share màn hình: Bạn vừa dừng chia sẻ màn hình trong lúc thi! Vui lòng bật lại Share màn hình.'
      case 'face-missing':
        return 'CẢNH BÁO ĐỎ (CAMERA): Người dự thi đã biến mất / ra khỏi vùng quan sát của Camera!'
      case 'browser-viewport':
      default:
        return 'Cảnh báo giám sát: Con trỏ chuột vừa di chuyển ra khỏi phạm vi màn hình bài thi!'
    }
  })

  function attachStreamSafely(video: HTMLVideoElement, stream: MediaStream) {
    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.autoplay = true
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    if (video.srcObject !== stream) {
      video.srcObject = stream
    }
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        video.onloadedmetadata = () => {
          video.play().catch(() => {})
        }
      })
    }
  }

  function bindCameraVideoElement(el: Element | ComponentPublicInstance | null) {
    if (el instanceof HTMLVideoElement) {
      activeVideoEl = el
      if (rawCameraStream) {
        attachStreamSafely(el, rawCameraStream)
      }
      return
    }
    if (activeVideoEl && !activeVideoEl.isConnected) {
      activeVideoEl = null
    }
  }

  function triggerScreenLeaveWarning(
    reason: OutZoneReason,
    logType: ProctoringLogItem['type'],
    logMessage: string
  ) {
    if (!isProctoringEnabled.value || isRequestingMediaPermission || showCheckInModal.value) return
    isInsideExamScreen.value = false
    outZoneReason.value = reason
    showOutZoneWarning.value = true

    const now = Date.now()
    if (now - lastOutTriggerAt > 600) {
      lastOutTriggerAt = now
      outZoneWarningCount.value++
      pushWarningLog(logType, logMessage)
    }
  }

  function triggerFaceMissingWarning() {
    if (!isProctoringEnabled.value || isRequestingMediaPermission) return
    showFaceMissingWarning.value = true

    if (!hasLoggedCurrentAbsenceEpisode) {
      hasLoggedCurrentAbsenceEpisode = true
      faceMissingWarningCount.value++
      pushWarningLog(
        'face-missing',
        'Cảnh báo Đỏ: Người dự thi biến mất / ra khỏi khung hình Camera!'
      )
    }
  }

  function dismissFaceMissingWarning() {
    showFaceMissingWarning.value = false
    if (isSimulatingFaceMissing.value) {
      isSimulatingFaceMissing.value = false
      hasLoggedCurrentAbsenceEpisode = false
      missingFaceConsecutiveTicks = 0
      runBiometricMonitorTick()
    }
  }

  function toggleSimulateFaceMissing() {
    isSimulatingFaceMissing.value = !isSimulatingFaceMissing.value
    if (isSimulatingFaceMissing.value) {
      hasLoggedCurrentAbsenceEpisode = false
      updateLandmarksIfChanged({
        eyebrows: false,
        leftEye: false,
        rightEye: false,
        nose: false,
        mouth: false
      })
      isPersonInFrame.value = false
      isFaceClearlyVisible.value = false
      clearFaceConsecutiveTicks = 0
      autoCaptureProgress.value = 0
      faceStatusMessage.value =
        'CẢNH BÁO ĐỎ: Người trong hình đã biến mất / ra khỏi Camera!'
      portraitWarningMessage.value = faceStatusMessage.value
      triggerFaceMissingWarning()
    } else {
      hasLoggedCurrentAbsenceEpisode = false
      missingFaceConsecutiveTicks = 0
      showFaceMissingWarning.value = false
      runBiometricMonitorTick()
    }
  }

  /**
   * Periodic non-recursive biometric tick (~420ms)
   */
  function runBiometricMonitorTick() {
    if (!isCameraActive.value) return

    if (isSimulatingFaceMissing.value) {
      updateLandmarksIfChanged({
        eyebrows: false,
        leftEye: false,
        rightEye: false,
        nose: false,
        mouth: false
      })
      isPersonInFrame.value = false
      isFaceClearlyVisible.value = false
      autoCaptureProgress.value = 0
      triggerFaceMissingWarning()
      return
    }

    if (isCameraSimulated.value) {
      updateLandmarksIfChanged({
        eyebrows: true,
        leftEye: true,
        rightEye: true,
        nose: true,
        mouth: true
      })
      isPersonInFrame.value = true
      isFaceClearlyVisible.value = true
      hasLoggedCurrentAbsenceEpisode = false
      showFaceMissingWarning.value = false
      portraitWarningMessage.value = null
      if (!portraitDataUrl.value && !isCaptureInProgress) {
        autoCaptureProgress.value = Math.min(100, autoCaptureProgress.value + 50)
        if (autoCaptureProgress.value >= 100) {
          performPortraitCaptureInternal(true, null)
        }
      }
      return
    }

    if (!activeVideoEl || activeVideoEl.readyState < 2 || activeVideoEl.videoWidth === 0) {
      return
    }

    const inspected = inspectVideoFramePure(activeVideoEl)
    if (!inspected) return

    const { analysis: result, calibratedSkinCandidate } = inspected

    updateLandmarksIfChanged(result.landmarks)
    isPersonInFrame.value = result.personDetected
    isFaceClearlyVisible.value = result.allFiveClear

    if (!result.personDetected) {
      clearFaceConsecutiveTicks = 0
      autoCaptureProgress.value = 0
      missingFaceConsecutiveTicks++

      const msg = result.isCoveredOrBlank
        ? 'CẢNH BÁO ĐỎ: Camera bị che khuất, quá tối hoặc người đã ra khỏi khung hình!'
        : 'CẢNH BÁO ĐỎ: Người dự thi đã biến mất / ra khỏi khung hình Camera!'
      if (faceStatusMessage.value !== msg) {
        faceStatusMessage.value = msg
      }
      portraitWarningMessage.value = msg

      // Trigger warning after 2 consecutive ticks (~0.84 seconds) of person leaving frame
      if (missingFaceConsecutiveTicks >= 2) {
        triggerFaceMissingWarning()
      }
      return
    }

    // Person returned to camera frame -> auto-dismiss live missing banner (keeping warning count logged)
    missingFaceConsecutiveTicks = 0
    hasLoggedCurrentAbsenceEpisode = false
    if (showFaceMissingWarning.value) {
      showFaceMissingWarning.value = false
    }

    if (!result.allFiveClear) {
      clearFaceConsecutiveTicks = Math.max(0, clearFaceConsecutiveTicks - 1)
      autoCaptureProgress.value = clearFaceConsecutiveTicks * 50
      const missingList = missingLandmarkNames.value.join(', ')
      const msg =
        missingList.length > 0
          ? `CẢNH BÁO ĐỎ: Chưa thấy rõ đủ ngũ quan (Thiếu: ${missingList}). Vui lòng nhìn thẳng vào giữa Camera!`
          : 'CẢNH BÁO ĐỎ: Khuôn mặt đang lệch khỏi khung Oval giữa Camera. Hãy chỉnh mặt vào giữa để Auto chụp!'
      if (faceStatusMessage.value !== msg) {
        faceStatusMessage.value = msg
      }
      portraitWarningMessage.value = msg
      return
    }

    // All 5/5 Ngũ Quan are clearly visible!
    portraitWarningMessage.value = null
    clearFaceConsecutiveTicks++
    autoCaptureProgress.value = Math.min(100, clearFaceConsecutiveTicks * 50)

    if (!portraitDataUrl.value && !isCaptureInProgress) {
      faceStatusMessage.value = `Đã nhận diện rõ 5/5 ngũ quan (${autoCaptureProgress.value}%) — Đang Auto chụp chân dung...`
      if (clearFaceConsecutiveTicks >= 2) {
        performPortraitCaptureInternal(false, calibratedSkinCandidate)
      }
    } else if (portraitDataUrl.value) {
      const okMsg = 'Khuôn mặt rõ nét (Đủ 5/5 ngũ quan) • Đang giám sát người trong Camera.'
      if (faceStatusMessage.value !== okMsg) {
        faceStatusMessage.value = okMsg
      }
    }
  }

  function performPortraitCaptureInternal(
    allowSimulated: boolean,
    skinCandidate: { r: number; g: number; b: number } | null
  ): boolean {
    if (isCaptureInProgress) return false
    isCaptureInProgress = true
    try {
      const timestamp = nowTimeStr()
      let dataUrl: string | null = null

      if (!isCameraSimulated.value && activeVideoEl) {
        dataUrl = renderVideoPortraitDataUrl(activeVideoEl, timestamp)
        if (skinCandidate) {
          calibratedSkinRgb = { ...skinCandidate }
        }
      }
      if (!dataUrl && (allowSimulated || isCameraSimulated.value)) {
        dataUrl = renderSimulatedPortraitDataUrl(timestamp)
      }

      if (dataUrl) {
        portraitDataUrl.value = dataUrl
        portraitCapturedAt.value = timestamp
        portraitWarningMessage.value = null
        autoCaptureProgress.value = 100
        faceStatusMessage.value = 'Đã Auto chụp ảnh chân dung thành công (Đủ 5/5 ngũ quan)!'
        pushWarningLog('portrait', `Đã Auto chụp ảnh chân dung (Đủ 5/5 ngũ quan) lúc ${timestamp}`)
        return true
      }
      return false
    } finally {
      isCaptureInProgress = false
    }
  }

  function startFaceMonitorLoop() {
    stopFaceMonitorLoop()
    missingFaceConsecutiveTicks = 0
    clearFaceConsecutiveTicks = 0
    hasLoggedCurrentAbsenceEpisode = false
    prevFrameLumaGrid = null
    rollingMotionHistory = []
    faceMonitorInterval = setInterval(runBiometricMonitorTick, BIOMETRIC_POLL_MS)
  }

  function stopFaceMonitorLoop() {
    if (faceMonitorInterval) {
      clearInterval(faceMonitorInterval)
      faceMonitorInterval = null
    }
    prevFrameLumaGrid = null
    rollingMotionHistory = []
    nativeFaceResultCache = null
    hasLoggedCurrentAbsenceEpisode = false
  }

  /**
   * 1. BẬT CAMERA (WebRTC getUserMedia)
   */
  async function startCamera(): Promise<boolean> {
    if (isCameraStarting.value) return false
    isCameraStarting.value = true
    cameraError.value = null
    portraitWarningMessage.value = null
    isSimulatingFaceMissing.value = false
    calibratedSkinRgb = null

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      cameraError.value = 'Trình duyệt không hỗ trợ WebRTC Camera API.'
      isCameraStarting.value = false
      return false
    }

    try {
      isRequestingMediaPermission = true
      if (rawCameraStream) {
        rawCameraStream.getTracks().forEach((t) => {
          t.onended = null
          t.stop()
        })
        rawCameraStream = null
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 480 },
          height: { ideal: 360 },
          frameRate: { ideal: 24, max: 30 },
          facingMode: 'user'
        },
        audio: false
      })

      rawCameraStream = stream
      isCameraSimulated.value = false
      isCameraActive.value = true

      if (activeVideoEl) {
        attachStreamSafely(activeVideoEl, stream)
      }

      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.onended = () => {
          rawCameraStream = null
          isCameraActive.value = false
          isPersonInFrame.value = false
          isFaceClearlyVisible.value = false
          stopFaceMonitorLoop()
          triggerScreenLeaveWarning(
            'camera-stopped',
            'camera',
            'Camera giám sát bị tắt hoặc ngắt kết nối khi đang làm bài'
          )
        }
      }

      startFaceMonitorLoop()
      pushWarningLog('camera', 'Đã bật Camera giám sát & theo dõi người trong khung hình')
      return true
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể truy cập Camera'
      cameraError.value = `Không thể mở Camera (${msg}). Hãy cấp quyền Camera trên trình duyệt hoặc dùng nút Giả lập.`
      return false
    } finally {
      isCameraStarting.value = false
      setTimeout(() => {
        isRequestingMediaPermission = false
      }, 800)
    }
  }

  function stopCamera() {
    stopFaceMonitorLoop()
    if (activeVideoEl) {
      activeVideoEl.srcObject = null
    }
    if (rawCameraStream) {
      rawCameraStream.getTracks().forEach((t) => {
        t.onended = null
        t.stop()
      })
      rawCameraStream = null
    }
    calibratedSkinRgb = null
    isCameraActive.value = false
    isCameraStarting.value = false
    isCameraSimulated.value = false
    isPersonInFrame.value = false
    isFaceClearlyVisible.value = false
    isSimulatingFaceMissing.value = false
    showFaceMissingWarning.value = false
    autoCaptureProgress.value = 0
    updateLandmarksIfChanged({
      eyebrows: false,
      leftEye: false,
      rightEye: false,
      nose: false,
      mouth: false
    })
  }

  /**
   * 2. CHỤP ẢNH CHÂN DUNG (Manual trigger)
   */
  function capturePortrait(allowSimulated = false): boolean {
    if (!allowSimulated && !isCameraSimulated.value) {
      if (!activeVideoEl) {
        portraitWarningMessage.value = 'Camera chưa sẵn sàng. Vui lòng bật Camera trước!'
        return false
      }
      const inspected = inspectVideoFramePure(activeVideoEl)
      if (!inspected || !inspected.analysis.allFiveClear) {
        if (inspected) {
          updateLandmarksIfChanged(inspected.analysis.landmarks)
          isPersonInFrame.value = inspected.analysis.personDetected
          isFaceClearlyVisible.value = inspected.analysis.allFiveClear
        }
        const missingList = missingLandmarkNames.value.join(', ')
        portraitWarningMessage.value =
          missingList.length > 0
            ? `CẢNH BÁO ĐỎ: Chưa thấy rõ mặt! Còn thiếu ngũ quan: ${missingList}. Hãy nhìn thẳng vào Camera để Auto chụp.`
            : 'CẢNH BÁO ĐỎ: Không phát hiện người / khuôn mặt rõ ràng ở giữa khung hình Camera!'
        return false
      }
      return performPortraitCaptureInternal(false, inspected.calibratedSkinCandidate)
    }

    return performPortraitCaptureInternal(allowSimulated, null)
  }

  function clearPortrait() {
    portraitDataUrl.value = null
    portraitCapturedAt.value = null
    calibratedSkinRgb = null
    clearFaceConsecutiveTicks = 0
    autoCaptureProgress.value = 0
    faceStatusMessage.value = 'Đang quét lại 5/5 ngũ quan để Auto chụp chân dung...'
  }

  /**
   * 3. SHARE MÀN HÌNH (WebRTC getDisplayMedia)
   */
  async function startScreenShare(): Promise<boolean> {
    screenShareError.value = null
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      screenShareError.value = 'Trình duyệt không hỗ trợ WebRTC Screen Share API.'
      return false
    }

    try {
      isRequestingMediaPermission = true
      if (rawScreenStream) {
        rawScreenStream.getTracks().forEach((t) => {
          t.onended = null
          t.stop()
        })
        rawScreenStream = null
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor'
        },
        audio: false
      })

      rawScreenStream = stream
      isScreenShareActive.value = true
      isScreenShareSimulated.value = false

      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.onended = () => {
          rawScreenStream = null
          isScreenShareActive.value = false
          triggerScreenLeaveWarning(
            'screen-stopped',
            'screen-share',
            'Thí sinh đã dừng chia sẻ màn hình (Stop Sharing) khi đang làm bài'
          )
        }
      }

      pushWarningLog('screen-share', 'Đã bật Chia sẻ màn hình (Screen Share) giám sát')
      return true
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Đã hủy chọn màn hình'
      screenShareError.value = `Chưa chia sẻ màn hình (${msg}). Vui lòng chọn màn hình cần share hoặc bật chế độ Giả lập.`
      return false
    } finally {
      setTimeout(() => {
        isRequestingMediaPermission = false
      }, 800)
    }
  }

  function stopScreenShare() {
    if (rawScreenStream) {
      rawScreenStream.getTracks().forEach((t) => {
        t.onended = null
        t.stop()
      })
      rawScreenStream = null
    }
    isScreenShareActive.value = false
    isScreenShareSimulated.value = false
  }

  function stopAllProctoringStreams() {
    stopCamera()
    stopScreenShare()
    clearPortrait()
    resetProctoringStats()
    showCheckInModal.value = false
    isCheckInCompleted.value = false
  }

  function completeCheckIn(): boolean {
    if (!isAllRulesSatisfied.value) return false
    isCheckInCompleted.value = true
    showCheckInModal.value = false
    lastMouseMoveAt = Date.now()
    idleSeconds.value = 0
    return true
  }

  function simulateAllProctoringRules() {
    isSimulatingFaceMissing.value = false
    if (!isCameraActive.value) {
      isCameraActive.value = true
      isCameraSimulated.value = true
      cameraError.value = null
    }
    isPersonInFrame.value = true
    isFaceClearlyVisible.value = true
    updateLandmarksIfChanged({
      eyebrows: true,
      leftEye: true,
      rightEye: true,
      nose: true,
      mouth: true
    })
    portraitWarningMessage.value = null
    if (!portraitDataUrl.value) {
      performPortraitCaptureInternal(true, null)
    }
    if (!isScreenShareActive.value) {
      isScreenShareActive.value = true
      isScreenShareSimulated.value = true
      screenShareError.value = null
    }
    noTabSwitchAccepted.value = true
    isCheckInCompleted.value = true
    showCheckInModal.value = false
    lastMouseMoveAt = Date.now()
    idleSeconds.value = 0
  }

  function openCheckInModal() {
    showCheckInModal.value = true
  }

  function closeCheckInModal() {
    showCheckInModal.value = false
  }

  function handleWindowMouseMove() {
    lastMouseMoveAt = Date.now()
    isInsideExamScreen.value = true
    if (idleSeconds.value > 0) {
      idleSeconds.value = 0
    }
  }

  function handleDocumentMouseLeave(e: MouseEvent) {
    if (!isProctoringEnabled.value || isRequestingMediaPermission || showCheckInModal.value) return
    if (
      e.relatedTarget === null &&
      (e.clientY <= 0 ||
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY >= window.innerHeight)
    ) {
      triggerScreenLeaveWarning(
        'browser-viewport',
        'leave-screen',
        'Di chuyển chuột ra ngoài phạm vi màn hình bài thi'
      )
    }
  }

  function handleDocumentMouseEnter() {
    isInsideExamScreen.value = true
  }

  function handleVisibilityChange() {
    if (!isProctoringEnabled.value || isRequestingMediaPermission || showCheckInModal.value) return
    if (document.hidden) {
      triggerScreenLeaveWarning(
        'tab-hidden',
        'tab-switch',
        'Vi phạm quy tắc Không chuyển Tab: Chuyển sang Tab khác hoặc ẩn trình duyệt'
      )
    } else {
      isInsideExamScreen.value = true
    }
  }

  function handleWindowBlur() {
    if (!isProctoringEnabled.value || isRequestingMediaPermission || showCheckInModal.value) return
    triggerScreenLeaveWarning(
      'window-blur',
      'tab-switch',
      'Vi phạm quy tắc Không chuyển Tab: Rời khỏi cửa sổ màn hình làm bài'
    )
  }

  function handleWindowFocus() {
    isInsideExamScreen.value = true
  }

  function dismissOutZoneWarning() {
    showOutZoneWarning.value = false
    showFaceMissingWarning.value = false
    isSimulatingFaceMissing.value = false
    isInsideExamScreen.value = true
  }

  function dismissIdleWarning() {
    lastMouseMoveAt = Date.now()
    idleSeconds.value = 0
    showIdleWarning.value = false
  }

  function toggleProctoring() {
    isProctoringEnabled.value = !isProctoringEnabled.value
    if (!isProctoringEnabled.value) {
      showOutZoneWarning.value = false
      showFaceMissingWarning.value = false
      showIdleWarning.value = false
      idleSeconds.value = 0
    } else {
      lastMouseMoveAt = Date.now()
      idleSeconds.value = 0
    }
  }

  function resetProctoringStats() {
    outZoneWarningCount.value = 0
    idleWarningCount.value = 0
    faceMissingWarningCount.value = 0
    hasLoggedCurrentAbsenceEpisode = false
    missingFaceConsecutiveTicks = 0
    idleSeconds.value = 0
    showOutZoneWarning.value = false
    showFaceMissingWarning.value = false
    isSimulatingFaceMissing.value = false
    showIdleWarning.value = false
    isInsideExamScreen.value = true
    portraitWarningMessage.value = null
    warningLogs.value = []
    lastMouseMoveAt = Date.now()
  }

  function startIdleMonitor() {
    stopIdleMonitor()
    lastMouseMoveAt = Date.now()
    idleCheckInterval = setInterval(() => {
      if (!isProctoringEnabled.value || showCheckInModal.value) return

      const elapsed = Math.floor((Date.now() - lastMouseMoveAt) / 1000)
      idleSeconds.value = elapsed

      if (elapsed >= IDLE_TIMEOUT_SECONDS && !showIdleWarning.value) {
        showIdleWarning.value = true
        idleWarningCount.value++
        pushWarningLog(
          'idle-2m',
          'Không cử động chuột trong 2 phút (120 giây) liên tiếp'
        )
      }
    }, 1000)
  }

  function stopIdleMonitor() {
    if (idleCheckInterval) {
      clearInterval(idleCheckInterval)
      idleCheckInterval = null
    }
  }

  onMounted(() => {
    mountedCount++
    if (mountedCount === 1) {
      window.addEventListener('mousemove', handleWindowMouseMove, { passive: true })
      document.documentElement.addEventListener('mouseleave', handleDocumentMouseLeave)
      document.documentElement.addEventListener('mouseenter', handleDocumentMouseEnter)
      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('blur', handleWindowBlur)
      window.addEventListener('focus', handleWindowFocus)
      startIdleMonitor()
    }
  })

  onUnmounted(() => {
    mountedCount = Math.max(0, mountedCount - 1)
    if (mountedCount === 0) {
      window.removeEventListener('mousemove', handleWindowMouseMove)
      document.removeEventListener('mouseleave', handleDocumentMouseLeave)
      document.removeEventListener('mouseenter', handleDocumentMouseEnter)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleWindowBlur)
      window.removeEventListener('focus', handleWindowFocus)
      stopIdleMonitor()
    }
  })

  return {
    IDLE_TIMEOUT_SECONDS,
    isProctoringEnabled,
    isInsideExamScreen,
    showOutZoneWarning,
    outZoneReason,
    outZoneWarningMessage,
    outZoneWarningCount,
    idleSeconds,
    idleRemainingSeconds,
    showIdleWarning,
    idleWarningCount,
    totalWarnings,
    warningLogs,

    // Face & 5-Landmark Biometric state
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
    missingLandmarkNames,

    // 4 Mandatory Exam Rules state
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
    isCheckInCompleted,
    showCheckInModal,

    // Actions
    bindCameraVideoElement,
    toggleSimulateFaceMissing,
    dismissFaceMissingWarning,
    startCamera,
    stopCamera,
    capturePortrait,
    clearPortrait,
    startScreenShare,
    stopScreenShare,
    stopAllProctoringStreams,
    completeCheckIn,
    simulateAllProctoringRules,
    openCheckInModal,
    closeCheckInModal,
    dismissOutZoneWarning,
    dismissIdleWarning,
    toggleProctoring,
    resetProctoringStats
  }
}
