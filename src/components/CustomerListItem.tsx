import { Link } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { resolveCurrencySymbol } from "../lib/currency"
import { formatAmount } from "../lib/format"
import type { Customer } from "../types"
import { Badge } from "./Badge"

export function CustomerListItem({ customer }: { customer: Customer }) {
  const { t } = useLanguage()

  return (
    <Link
      to={`/customers/${customer.id}`}
      className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm active:bg-stone-50 dark:border-stone-800 dark:bg-stone-900 dark:active:bg-stone-800"
    >
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate font-medium text-stone-800 dark:text-stone-100">{customer.name}</span>
        <span className="ltr-nums text-left text-sm text-stone-500 dark:text-stone-400">{customer.phone}</span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="ltr-nums text-left text-sm font-medium text-stone-700 dark:text-stone-300">
          {formatAmount(customer.remainingBalance)} {resolveCurrencySymbol(customer.currency, customer.customCurrencySymbol)}
        </span>
        {customer.status === "closed" && <Badge color="stone">{t("status.closed")}</Badge>}
      </div>
    </Link>
  )
}
