// src/lib/pwa.ts
import { registerSW } from 'virtual:pwa-register'

export function setupPWA(
  onNeedRefresh?: () => void,
  onOfflineReady?: () => void
) {
  // immediate: registra el SW de una vez
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      onNeedRefresh?.()
    },
    onOfflineReady() {
      onOfflineReady?.()
    },
  })

  return updateSW
}
