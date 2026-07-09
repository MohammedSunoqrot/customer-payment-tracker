import { PhoneMissed, PhoneOutgoing } from "lucide-react"
import { isToday } from "../lib/date"
import { markContactStatus } from "../lib/actions"
import type { Customer, ContactStatus } from "../types"

export function ContactStatusButtons({ customer, compact }: { customer: Customer; compact?: boolean }) {
  function mark(e: React.MouseEvent, status: ContactStatus) {
    e.stopPropagation()
    void markContactStatus(customer.id, status)
  }

  if (compact) {
    // The card that hosts these unmounts them the instant a status is marked
    // (the day entry flips to "done" and the parent renders its done state),
    // so there's no need to track/highlight an "active" selection here.
    return (
      <div className="flex shrink-0 flex-col gap-1.5">
        <button
          onClick={(e) => mark(e, "contacted")}
          aria-label="تم الاتصال"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-400"
        >
          <PhoneOutgoing size={14} />
        </button>
        <button
          onClick={(e) => mark(e, "not_contacted")}
          aria-label="لم يتم الرد"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-400"
        >
          <PhoneMissed size={14} />
        </button>
      </div>
    )
  }

  const statusIsToday = customer.lastContactAt ? isToday(customer.lastContactAt) : false
  const activeStatus = statusIsToday ? customer.lastContactStatus : null

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={(e) => mark(e, "contacted")}
        className={`flex flex-col items-center gap-1 rounded-2xl border py-4 ${
          activeStatus === "contacted" ? "border-green-600 bg-green-50 text-green-700" : "border-stone-300 bg-white text-stone-700"
        }`}
      >
        <PhoneOutgoing size={20} />
        <span className="text-sm font-medium">تم الاتصال</span>
      </button>
      <button
        onClick={(e) => mark(e, "not_contacted")}
        className={`flex flex-col items-center gap-1 rounded-2xl border py-4 ${
          activeStatus === "not_contacted" ? "border-amber-500 bg-amber-50 text-amber-700" : "border-stone-300 bg-white text-stone-700"
        }`}
      >
        <PhoneMissed size={20} />
        <span className="text-sm font-medium">لم يتم الرد</span>
      </button>
    </div>
  )
}
