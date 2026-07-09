import { currencySymbols, type CurrencyCode } from "../lib/currency"
import { formatArabicDateTime } from "../lib/date"
import { formatAmount } from "../lib/format"
import type { Charge } from "../types"

export function ChargeHistoryItem({ charge, currency }: { charge: Charge; currency: CurrencyCode }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-stone-100 py-3 last:border-0">
      <div className="flex flex-col gap-0.5">
        <span className="ltr-nums text-left font-medium text-amber-700">
          + {formatAmount(charge.amount)} {currencySymbols[currency]}
        </span>
        <span className="text-xs text-stone-500">زيادة على المبلغ المستحق · {formatArabicDateTime(charge.date)}</span>
        {charge.note && <span className="text-xs text-stone-400">{charge.note}</span>}
      </div>
    </div>
  )
}
