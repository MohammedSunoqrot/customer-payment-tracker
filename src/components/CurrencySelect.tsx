import { useLanguage } from "../context/LanguageContext"
import { currencySymbols, type CurrencyCode } from "../lib/currency"

const currencies: CurrencyCode[] = ["ILS", "USD", "JOD", "OTHER"]

export function CurrencySelect({
  value,
  customSymbol,
  onChange,
  onCustomSymbolChange,
}: {
  value: CurrencyCode
  customSymbol: string
  onChange: (value: CurrencyCode) => void
  onCustomSymbolChange: (value: string) => void
}) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        {currencies.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            className={`rounded-lg border py-2 text-sm ${
              value === code
                ? "border-teal-700 bg-teal-50 text-teal-700 dark:border-teal-500 dark:bg-teal-950 dark:text-teal-400"
                : "border-stone-300 text-stone-600 dark:border-stone-700 dark:text-stone-300"
            }`}
          >
            {code === "OTHER" ? t("currency.OTHER") : `${t(`currency.${code}` as const)} (${currencySymbols[code]})`}
          </button>
        ))}
      </div>
      {value === "OTHER" && (
        <input
          type="text"
          value={customSymbol}
          onChange={(e) => onCustomSymbolChange(e.target.value)}
          placeholder={t("currency.customPlaceholder")}
          className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500"
        />
      )}
    </div>
  )
}
