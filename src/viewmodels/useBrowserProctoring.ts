import { computed, onMounted, onUnmounted, ref } from 'vue'

export type OutZoneReason = 'browser-viewport' | 'tab-hidden' | 'window-blur'

export interface ProctoringLogItem {
  id: number
  type: 'leave-screen' | 'idle-2m' | 'tab-switch'
  message: string
  time: string
}

const IDLE_TIMEOUT_SECONDS = 120 // 2 minutes (120 seconds)

export function useBrowserProctoring() {
  const isProctoringEnabled = ref(true)
  const isInsideExamScreen = ref(true)
  const showOutZoneWarning = ref(false)
  const outZoneReason = ref<OutZoneReason>('browser-viewport')
  const outZoneWarningCount = ref(0)

  const idleSeconds = ref(0)
  const showIdleWarning = ref(false)
  const idleWarningCount = ref(0)

  const warningLogs = ref<ProctoringLogItem[]>([])

  let idleCheckInterval: ReturnType<typeof setInterval> | null = null
  let lastMouseMoveAt = Date.now()
  let lastOutTriggerAt = 0
  let logSeq = 1

  const totalWarnings = computed(() => outZoneWarningCount.value + idleWarningCount.value)

  const idleRemainingSeconds = computed(() =>
    Math.max(0, IDLE_TIMEOUT_SECONDS - idleSeconds.value)
  )

  const outZoneWarningMessage = computed(() => {
    switch (outZoneReason.value) {
      case 'tab-hidden':
        return 'Cảnh báo giám sát: Bạn vừa chuyển sang Tab khác hoặc ẩn trình duyệt khi đang làm bài thi!'
      case 'window-blur':
        return 'Cảnh báo giám sát: Bạn vừa rời khỏi cửa sổ màn hình bài thi (chuyển ứng dụng hoặc mở cửa sổ khác)!'
      case 'browser-viewport':
      default:
        return 'Cảnh báo giám sát: Con trỏ chuột vừa di chuyển ra khỏi phạm vi màn hình bài thi!'
    }
  })

  function pushWarningLog(type: ProctoringLogItem['type'], message: string) {
    const nowStr = new Date().toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    warningLogs.value = [
      {
        id: logSeq++,
        type,
        message,
        time: nowStr
      },
      ...warningLogs.value.slice(0, 19)
    ]
  }

  function triggerScreenLeaveWarning(
    reason: OutZoneReason,
    logType: ProctoringLogItem['type'],
    logMessage: string
  ) {
    if (!isProctoringEnabled.value) return
    isInsideExamScreen.value = false
    outZoneReason.value = reason
    showOutZoneWarning.value = true

    // Debounce duplicate events firing together (e.g. mouseleave + blur + visibilitychange within 600ms)
    const now = Date.now()
    if (now - lastOutTriggerAt > 600) {
      lastOutTriggerAt = now
      outZoneWarningCount.value++
      pushWarningLog(logType, logMessage)
    }
  }

  /**
   * Resets the 2-minute mouse inactivity timer whenever the mouse moves inside the window
   */
  function handleWindowMouseMove() {
    lastMouseMoveAt = Date.now()
    isInsideExamScreen.value = true
    if (idleSeconds.value > 0) {
      idleSeconds.value = 0
    }
  }

  /**
   * Fires when mouse cursor leaves the entire browser viewport (e.g. up to tab bar / address bar / outside window)
   */
  function handleDocumentMouseLeave(e: MouseEvent) {
    if (!isProctoringEnabled.value) return
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

  /**
   * Fires when user switches browser tabs or minimizes the browser
   */
  function handleVisibilityChange() {
    if (!isProctoringEnabled.value) return
    if (document.hidden) {
      triggerScreenLeaveWarning(
        'tab-hidden',
        'tab-switch',
        'Chuyển sang Tab khác hoặc thu nhỏ cửa sổ trình duyệt'
      )
    } else {
      isInsideExamScreen.value = true
    }
  }

  /**
   * Fires when user switches focus away from the browser window (Alt+Tab, clicking another screen/app)
   */
  function handleWindowBlur() {
    if (!isProctoringEnabled.value) return
    triggerScreenLeaveWarning(
      'window-blur',
      'tab-switch',
      'Rời khỏi màn hình làm bài (chuyển cửa sổ / mất tiêu điểm)'
    )
  }

  function handleWindowFocus() {
    isInsideExamScreen.value = true
  }

  function dismissOutZoneWarning() {
    showOutZoneWarning.value = false
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
    idleSeconds.value = 0
    showOutZoneWarning.value = false
    showIdleWarning.value = false
    isInsideExamScreen.value = true
    warningLogs.value = []
    lastMouseMoveAt = Date.now()
  }

  function startIdleMonitor() {
    stopIdleMonitor()
    lastMouseMoveAt = Date.now()
    idleCheckInterval = setInterval(() => {
      if (!isProctoringEnabled.value) return

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
    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleDocumentMouseLeave)
    document.documentElement.addEventListener('mouseenter', handleDocumentMouseEnter)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('focus', handleWindowFocus)
    startIdleMonitor()
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleWindowMouseMove)
    document.documentElement.removeEventListener('mouseleave', handleDocumentMouseLeave)
    document.documentElement.removeEventListener('mouseenter', handleDocumentMouseEnter)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('blur', handleWindowBlur)
    window.removeEventListener('focus', handleWindowFocus)
    stopIdleMonitor()
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
    dismissOutZoneWarning,
    dismissIdleWarning,
    toggleProctoring,
    resetProctoringStats
  }
}
