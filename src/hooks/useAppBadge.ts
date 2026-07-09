import { useEffect } from "react"

/** Shows the given count on the installed PWA's home-screen icon (Android + iOS 16.4+). */
export function useAppBadge(count: number) {
  useEffect(() => {
    if (!navigator.setAppBadge) return
    if (count > 0) {
      navigator.setAppBadge(count).catch(() => {})
    } else {
      navigator.clearAppBadge?.().catch(() => {})
    }
  }, [count])
}
