import { ChevronLeft, ChevronRight } from "lucide-react"
import { addDaysISO, todayISO } from "../lib/date"

export function DayNav({ selectedDate, onChange }: { selectedDate: string; onChange: (date: string) => void }) {
  const isToday = selectedDate === todayISO()

  return (
    <div className="flex items-center gap-2">
      {/* Chevron-right steps to the previous day: this is RTL, so "back in time" reads visually rightward. */}
      <button
        onClick={() => onChange(addDaysISO(selectedDate, -1))}
        aria-label="اليوم السابق"
        className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 active:bg-stone-200"
      >
        <ChevronRight size={20} />
      </button>

      <label className="flex-1">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => e.target.value && onChange(e.target.value)}
          className="w-full rounded-lg border-none bg-transparent text-center text-sm font-medium text-stone-700"
        />
      </label>

      <button
        onClick={() => onChange(addDaysISO(selectedDate, 1))}
        aria-label="اليوم التالي"
        className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 active:bg-stone-200"
      >
        <ChevronLeft size={20} />
      </button>

      {!isToday && (
        <button
          onClick={() => onChange(todayISO())}
          className="shrink-0 rounded-full bg-teal-700 px-3 py-1.5 text-xs font-medium text-white"
        >
          اليوم
        </button>
      )}
    </div>
  )
}
