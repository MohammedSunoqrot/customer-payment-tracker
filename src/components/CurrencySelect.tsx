import { currencyLabels, currencySymbols, type CurrencyCode } from "../lib/currency"

const currencies: CurrencyCode[] = ["ILS", "USD", "JOD"]

export function CurrencySelect({ value, onChange }: { value: CurrencyCode; onChange: (value: CurrencyCode) => void }) {
  return (
    <div className="flex gap-2">
      {currencies.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          className={`flex-1 rounded-lg border py-2 text-sm ${
            value === code ? "border-teal-700 bg-teal-50 text-teal-700" : "border-stone-300 text-stone-600"
          }`}
        >
          {currencyLabels[code]} ({currencySymbols[code]})
        </button>
      ))}
    </div>
  )
}
