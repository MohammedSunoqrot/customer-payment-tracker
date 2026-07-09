import { CheckCircle2, Phone } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { currencySymbols } from "../lib/currency"
import { daysOverdue, formatArabicTime, isOverdue } from "../lib/date"
import { formatAmount } from "../lib/format"
import { telHref } from "../lib/phone"
import type { DayViewItem } from "../hooks/useDayView"
import { isPendingItem } from "../hooks/useDayView"
import type { DayEntryAction } from "../types"
import { Badge } from "./Badge"
import { ContactStatusButtons } from "./ContactStatusButtons"

const actionLabels: Record<DayEntryAction, string> = {
  contacted: "تم الاتصال",
  not_contacted: "لم يتم الرد",
  rescheduled: "تمت إعادة الجدولة",
  closed: "أُغلق الملف",
}

export function CustomerCallCard({ item, isToday }: { item: DayViewItem; isToday: boolean }) {
  const navigate = useNavigate()
  const { customer, entry } = item
  const pending = isPendingItem(item)
  const overdue = pending && customer.nextContactDate ? isOverdue(customer.nextContactDate) : false

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/customers/${customer.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/customers/${customer.id}`)}
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 shadow-sm active:bg-stone-50 ${
        pending ? "border-stone-200 bg-white" : "border-stone-200 bg-stone-100"
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className={`truncate font-medium ${pending ? "text-stone-800" : "text-stone-500"}`}>{customer.name}</span>
          {pending ? (
            overdue && customer.nextContactDate ? (
              <Badge color="red">متأخر {daysOverdue(customer.nextContactDate)} يوم</Badge>
            ) : (
              customer.nextContactDate && <Badge color="stone">{formatArabicTime(customer.nextContactDate)}</Badge>
            )
          ) : (
            <span className="flex items-center gap-1 text-xs text-green-700">
              <CheckCircle2 size={13} />
              {entry?.action && actionLabels[entry.action]}
              {entry?.actionAt && ` · ${formatArabicTime(entry.actionAt)}`}
            </span>
          )}
        </div>
        <span className="ltr-nums text-left text-sm text-stone-500">{customer.phone}</span>
        <span className={`ltr-nums text-left text-sm font-medium ${pending ? "text-teal-700" : "text-stone-400"}`}>
          {formatAmount(customer.remainingBalance)} {currencySymbols[customer.currency]} متبقي
        </span>
      </div>
      {pending && isToday && <ContactStatusButtons customer={customer} compact />}
      <a
        href={telHref(customer.phone)}
        onClick={(e) => e.stopPropagation()}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${
          pending ? "bg-teal-700" : "bg-stone-300"
        }`}
        aria-label="اتصال"
      >
        <Phone size={20} />
      </a>
    </div>
  )
}
