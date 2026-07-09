import { PhoneMissed, PhoneOutgoing } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { isToday } from "../lib/date"
import { markContactStatus } from "../lib/actions"
import type { Customer, ContactStatus } from "../types"

export function ContactStatusButtons({ customer, compact }: { customer: Customer; compact?: boolean }) {
  const { t } = useLanguage()

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
          aria-label={t("contact.contacted")}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500"
        >
          <PhoneOutgoing size={14} />
        </button>
        <button
          onClick={(e) => mark(e, "not_contacted")}
          aria-label={t("contact.notContacted")}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500"
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
          activeStatus === "contacted"
            ? "border-green-600 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-950 dark:text-green-400"
            : "border-stone-300 bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
        }`}
      >
        <PhoneOutgoing size={20} />
        <span className="text-sm font-medium">{t("contact.contacted")}</span>
      </button>
      <button
        onClick={(e) => mark(e, "not_contacted")}
        className={`flex flex-col items-center gap-1 rounded-2xl border py-4 ${
          activeStatus === "not_contacted"
            ? "border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-400"
            : "border-stone-300 bg-white text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
        }`}
      >
        <PhoneMissed size={20} />
        <span className="text-sm font-medium">{t("contact.notContacted")}</span>
      </button>
    </div>
  )
}
