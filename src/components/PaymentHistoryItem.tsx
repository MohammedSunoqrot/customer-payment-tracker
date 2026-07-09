import { useState } from "react"
import { currencySymbols, type CurrencyCode } from "../lib/currency"
import { formatArabicDateTime } from "../lib/date"
import { formatAmount, paymentMethodLabels } from "../lib/format"
import { setCheckBounced } from "../lib/actions"
import type { Payment } from "../types"
import { Badge } from "./Badge"

const checkTypeLabels = { personal: "شخصي", endorsed: "جيرو" }

export function PaymentHistoryItem({
  payment,
  customerId,
  customerCurrency,
}: {
  payment: Payment
  customerId: string
  customerCurrency: CurrencyCode
}) {
  const [updating, setUpdating] = useState(false)
  const methodLabel = payment.method === "other" ? payment.methodOther || "أخرى" : paymentMethodLabels[payment.method]
  const isCheck = payment.method === "check"
  const isDifferentCurrency = payment.currency !== customerCurrency

  async function toggleBounced() {
    setUpdating(true)
    await setCheckBounced(customerId, payment.id, !payment.bounced)
    setUpdating(false)
  }

  return (
    <div className="flex items-center justify-between gap-2 border-b border-stone-100 py-3 last:border-0">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className={`ltr-nums text-left font-medium text-stone-800 ${payment.bounced ? "line-through" : ""}`}>
            {formatAmount(payment.amount)} {currencySymbols[payment.currency]}
          </span>
          {payment.bounced && <Badge color="red">مرجع</Badge>}
        </div>
        {isDifferentCurrency && (
          <span className="ltr-nums text-left text-xs text-stone-500">
            = {formatAmount(payment.convertedAmount)} {currencySymbols[customerCurrency]} (سعر الصرف {payment.exchangeRate})
          </span>
        )}
        <span className="text-xs text-stone-500">
          {methodLabel}
          {isCheck && payment.checkType ? ` · ${checkTypeLabels[payment.checkType]}` : ""} ·{" "}
          {formatArabicDateTime(payment.date)}
        </span>
        {isCheck && payment.dueDate && (
          <span className="text-xs text-stone-500">تاريخ الاستحقاق: {formatArabicDateTime(payment.dueDate)}</span>
        )}
        {payment.note && <span className="text-xs text-stone-400">{payment.note}</span>}
      </div>

      {isCheck && (
        <button
          onClick={toggleBounced}
          disabled={updating}
          className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-xs disabled:opacity-50 ${
            payment.bounced ? "border-stone-300 text-stone-600" : "border-red-200 text-red-600"
          }`}
        >
          {payment.bounced ? "إلغاء الإرجاع" : "تحديد كمرجع"}
        </button>
      )}
    </div>
  )
}
