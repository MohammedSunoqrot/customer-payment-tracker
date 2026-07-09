import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { addDaysISO, todayISO } from "../lib/date"

export function DayNav({ selectedDate, onChange }: { selectedDate: string; onChange: (date: string) => void }) {
  const { dir, t } = useLanguage()
  const isToday = selectedDate === todayISO()
  // "Previous" points toward the reading-start side: right in RTL, left in LTR.
  const PrevIcon = dir === "rtl" ? ChevronRight : ChevronLeft
  const NextIcon = dir === "rtl" ? ChevronLeft : ChevronRight

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(addDaysISO(selectedDate, -1))}
        aria-label={t("dayNav.prev")}
        className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 active:bg-stone-200 dark:text-stone-400 dark:active:bg-stone-800"
      >
        <PrevIcon size={20} />
      </button>

      <label className="flex-1">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className="w-full rounded-lg border-none bg-transparent text-center text-sm font-medium text-stone-700 dark:text-stone-200 dark:[color-scheme:dark]"
        />
      </label>

      <button
        onClick={() => onChange(addDaysISO(selectedDate, 1))}
        aria-label={t("dayNav.next")}
        className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 active:bg-stone-200 dark:text-stone-400 dark:active:bg-stone-800"
      >
        <NextIcon size={20} />
      </button>

      {!isToday && (
        <button
          onClick={() => onChange(todayISO())}
          className="shrink-0 rounded-full bg-teal-700 px-3 py-1.5 text-xs font-medium text-white dark:bg-teal-600"
        >
          {t("dayNav.today")}
        </button>
      )}
    </div>
  )
}
