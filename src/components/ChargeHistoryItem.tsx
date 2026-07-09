import { useLanguage } from "../context/LanguageContext"
import { resolveCurrencySymbol, type CurrencyCode } from "../lib/currency"
import { formatDateTime } from "../lib/date"
import { formatAmount } from "../lib/format"
import type { Charge } from "../types"

export function ChargeHistoryItem({
  charge,
  currency,
  customCurrencySymbol,
}: {
  charge: Charge
  currency: CurrencyCode
  customCurrencySymbol?: string | null
}) {
  const { lang, t } = useLanguage()

  return (
    <div className="flex items-center justify-between gap-2 border-b border-stone-100 py-3 last:border-0 dark:border-stone-800">
      <div className="flex flex-col gap-0.5">
        <span className="ltr-nums text-left font-medium text-amber-700 dark:text-amber-500">
          + {formatAmount(charge.amount)} {resolveCurrencySymbol(currency, customCurrencySymbol)}
        </span>
        <span className="text-xs text-stone-500 dark:text-stone-400">
          {t("activity.chargeLabel")} · {formatDateTime(charge.date, lang)}
        </span>
        {charge.note && <span className="text-xs text-stone-400 dark:text-stone-500">{charge.note}</span>}
      </div>
    </div>
  )
}
