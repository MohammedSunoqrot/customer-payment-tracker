import { CheckCircle2, MessageCircle, Phone } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { resolveCurrencySymbol } from "../lib/currency"
import { daysOverdue, formatTime, isOverdue } from "../lib/date"
import { formatAmount } from "../lib/format"
import { telHref } from "../lib/phone"
import { buildWhatsAppReminderMessage, whatsappHref } from "../lib/whatsapp"
import type { DayViewItem } from "../hooks/useDayView"
import { isPendingItem } from "../hooks/useDayView"
import { Badge } from "./Badge"
import { ContactStatusButtons } from "./ContactStatusButtons"

export function CustomerCallCard({ item, isToday }: { item: DayViewItem; isToday: boolean }) {
  const navigate = useNavigate()
  const { lang, t } = useLanguage()
  const { customer, entry } = item
  const pending = isPendingItem(item)
  const overdue = pending && customer.nextContactDate ? isOverdue(customer.nextContactDate) : false

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/customers/${customer.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/customers/${customer.id}`)}
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 shadow-sm active:bg-stone-50 dark:active:bg-stone-800 ${
        pending
          ? "border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
          : "border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-900/50"
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className={`truncate font-medium ${pending ? "text-stone-800 dark:text-stone-100" : "text-stone-500 dark:text-stone-500"}`}
          >
            {customer.name}
          </span>
          {pending ? (
            overdue && customer.nextContactDate ? (
              <Badge color="red">
                {t("card.overdueBy")} {daysOverdue(customer.nextContactDate)} {t("card.day")}
              </Badge>
            ) : (
              customer.nextContactDate && <Badge color="stone">{formatTime(customer.nextContactDate, lang)}</Badge>
            )
          ) : (
            <span className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
              <CheckCircle2 size={13} />
              {entry?.action && t(`action.${entry.action}` as const)}
              {entry?.actionAt && ` · ${formatTime(entry.actionAt, lang)}`}
            </span>
          )}
        </div>
        <span className="ltr-nums text-left text-sm text-stone-500 dark:text-stone-400">{customer.phone}</span>
        <span
          className={`ltr-nums text-left text-sm font-medium ${pending ? "text-teal-700 dark:text-teal-400" : "text-stone-400 dark:text-stone-600"}`}
        >
          {formatAmount(customer.remainingBalance)} {resolveCurrencySymbol(customer.currency, customer.customCurrencySymbol)}{" "}
          {t("card.remaining")}
        </span>
      </div>
      {pending && isToday && <ContactStatusButtons customer={customer} compact />}
      {pending && (
        <a
          href={whatsappHref(
            customer.phone,
            buildWhatsAppReminderMessage(
              customer.name,
              customer.remainingBalance,
              resolveCurrencySymbol(customer.currency, customer.customCurrencySymbol),
              lang,
            ),
          )}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white dark:bg-emerald-500"
          aria-label={t("card.whatsappAria")}
        >
          <MessageCircle size={20} />
        </a>
      )}
      <a
        href={telHref(customer.phone)}
        onClick={(e) => e.stopPropagation()}
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white ${
          pending ? "bg-teal-700 dark:bg-teal-600" : "bg-stone-300 dark:bg-stone-700"
        }`}
        aria-label={t("card.callAria")}
      >
        <Phone size={20} />
      </a>
    </div>
  )
}
