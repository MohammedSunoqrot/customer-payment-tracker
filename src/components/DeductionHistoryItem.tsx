import { currencySymbols, type CurrencyCode } from "../lib/currency"
import { formatArabicDateTime } from "../lib/date"
import { formatAmount } from "../lib/format"
import type { Deduction } from "../types"

export function DeductionHistoryItem({ deduction, currency }: { deduction: Deduction; currency: CurrencyCode }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-stone-100 py-3 last:border-0">
      <div className="flex flex-col gap-0.5">
        <span className="ltr-nums text-left font-medium text-purple-700">
          - {formatAmount(deduction.amount)} {currencySymbols[currency]}
        </span>
        <span className="text-xs text-stone-500">خصم · {formatArabicDateTime(deduction.date)}</span>
        {deduction.note && <span className="text-xs text-stone-400">{deduction.note}</span>}
      </div>
    </div>
  )
}
