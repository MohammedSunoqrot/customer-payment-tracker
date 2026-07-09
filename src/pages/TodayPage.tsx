import { CalendarCheck2 } from "lucide-react"
import { useState } from "react"
import { CustomerCallCard } from "../components/CustomerCallCard"
import { DayNav } from "../components/DayNav"
import { EmptyState } from "../components/EmptyState"
import { isPendingItem, useDayView } from "../hooks/useDayView"
import { formatArabicWeekdayDate, todayISO } from "../lib/date"

export function TodayPage() {
  const [selectedDate, setSelectedDate] = useState(todayISO())
  const items = useDayView(selectedDate)
  const isToday = selectedDate === todayISO()
  const pendingCount = items.filter(isPendingItem).length

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 flex flex-col gap-2 bg-stone-50 px-4 pb-2 pt-5">
        <h1 className="text-xl font-semibold text-stone-800">{isToday ? "مكالمات اليوم" : "جدول المكالمات"}</h1>
        <p className="text-sm text-stone-500">
          {formatArabicWeekdayDate(selectedDate)} · {pendingCount} بحاجة للمتابعة
          {items.length > pendingCount ? ` · ${items.length - pendingCount} تم إنجازه` : ""}
        </p>
        <DayNav selectedDate={selectedDate} onChange={setSelectedDate} />
      </header>

      {items.length === 0 ? (
        <EmptyState icon={CalendarCheck2} text="لا توجد اتصالات مجدولة في هذا اليوم" />
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
