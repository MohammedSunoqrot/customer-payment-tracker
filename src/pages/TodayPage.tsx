import { CalendarCheck2 } from "lucide-react"
import { useState } from "react"
import { CustomerCallCard } from "../components/CustomerCallCard"
import { DayNav } from "../components/DayNav"
import { EmptyState } from "../components/EmptyState"
import { useLanguage } from "../context/LanguageContext"
import { isPendingItem, useDayView } from "../hooks/useDayView"
import { formatWeekdayDate, todayISO } from "../lib/date"

export function TodayPage() {
  const { lang, t } = useLanguage()
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const items = useDayView(selectedDate)
  const isToday = selectedDate === todayISO()
  const pendingCount = items.filter(isPendingItem).length

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 flex flex-col gap-2 bg-stone-50 px-4 pb-2 pt-5 dark:bg-stone-950">
        <h1 className="text-xl font-semibold text-stone-800 dark:text-stone-100">
          {isToday ? t("today.title") : t("today.titleOtherDay")}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {formatWeekdayDate(selectedDate, lang)} · {pendingCount} {t("today.pendingSuffix")}
          {items.length > pendingCount ? ` · ${items.length - pendingCount} ${t("today.doneSuffix")}` : ""}
        </p>
        <DayNav selectedDate={selectedDate} onChange={setSelectedDate} />
      </header>

      {items.length === 0 ? (
        <EmptyState icon={CalendarCheck2} text={t("today.empty")} />
      ) : (
        <div className="flex flex-col gap-3 p-4">
          {items.map((item) => (
            <CustomerCallCard key={item.customer.id} item={item} isToday={isToday} />
          ))}
        </div>
      )}
    </div>
  )
}
