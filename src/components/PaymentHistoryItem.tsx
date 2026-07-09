import { useState } from "react"
import { useLanguage } from "../context/LanguageContext"
import { resolveCurrencySymbol, type CurrencyCode } from "../lib/currency"
import { formatDateTime } from "../lib/date"
import { formatAmount } from "../lib/format"
import { setCheckBounced } from "../lib/actions"
import type { Payment } from "../types"
import { Badge } from "./Badge"

export function PaymentHistoryItem({
  payment,
  customerId,
  customerCurrency,
  customerCustomCurrencySymbol,
}: {
  payment: Payment
  customerId: string
  customerCurrency: CurrencyCode
  customerCustomCurrencySymbol?: string | null
}) {
  const { lang, t } = useLanguage()
  const [updating, setUpdating] = useState(false)
  const methodLabel = payment.method === "other" ? payment.methodOther || t("method.other") : t(`method.${payment.method}` as const)
  const isCheck = payment.method === "check"
  const isDifferentCurrency = payment.currency !== customerCurrency
  const paymentSymbol = resolveCurrencySymbol(payment.currency, payment.customCurrencySymbol)
  const customerSymbol = resolveCurrencySymbol(customerCurrency, customerCustomCurrencySymbol)

  async function toggleBounced() {
    setUpdating(true)
    await setCheckBounced(customerId, payment.id, !payment.bounced)
    setUpdating(false)
  }

  return (
    <div className="flex items-center justify-between gap-2 border-b border-stone-100 py-3 last:border-0 dark:border-stone-800">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span
            className={`ltr-nums text-left font-medium text-stone-800 dark:text-stone-100 ${payment.bounced ? "line-through" : ""}`}
          >
            {formatAmount(payment.amount)} {paymentSymbol}
          </span>
          {payment.bounced && <Badge color="red">{t("payment.bounced")}</Badge>}
        </div>
        {isDifferentCurrency && (
          <span className="ltr-nums text-left text-xs text-stone-500 dark:text-stone-400">
            = {formatAmount(payment.convertedAmount)} {customerSymbol} ({t("payment.exchangeRatePrefix")} {payment.exchangeRate})
          </span>
        )}
        <span className="text-xs text-stone-500 dark:text-stone-400">
          {methodLabel}
          {isCheck && payment.checkType ? ` · ${t(`checkType.${payment.checkType}` as const)}` : ""} ·{" "}
          {formatDateTime(payment.date, lang)}
        </span>
        {isCheck && payment.dueDate && (
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {t("payment.dueDate")}: {formatDateTime(payment.dueDate, lang)}
          </span>
        )}
        {payment.note && <span className="text-xs text-stone-400 dark:text-stone-500">{payment.note}</span>}
      </div>

      {isCheck && (
        <button
          onClick={toggleBounced}
          disabled={updating}
          className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-xs disabled:opacity-50 ${
            payment.bounced
              ? "border-stone-300 text-stone-600 dark:border-stone-700 dark:text-stone-300"
              : "border-red-200 text-red-600 dark:border-red-900 dark:text-red-400"
          }`}
        >
          {payment.bounced ? t("payment.cancelBounce") : t("payment.markBounced")}
        </button>
      )}
    </div>
  )
}
