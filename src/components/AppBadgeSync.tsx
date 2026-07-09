import { useAppBadge } from "../hooks/useAppBadge"
import { isPendingItem, useDayView } from "../hooks/useDayView"
import { todayISO } from "../lib/date"

/** Keeps the installed app's home-screen badge in sync with today's still-pending customer count. */
export function AppBadgeSync() {
  const items = useDayView(todayISO())
  useAppBadge(items.filter(isPendingItem).length)
  return null
}
